(() => {
    const mg1 = !!document.querySelector('#map');
    const view = document.querySelector(mg1 ? '#map' : '#view');
    const panel = document.createElement('section');
    panel.id = 'individual-routes';
    panel.innerHTML = '<h2>Individual routes</h2><div id="route-actions"><button type="button" id="routes-all">All routes</button><button type="button" id="routes-none">No routes</button></div><div id="route-list"></div>';
    document.querySelector('#filters-routes').append(panel);
    const list = panel.querySelector('#route-list');
    const hidden = new Set();
    let routes = new Map();
    const isHidden = key => mg1 ? routeVisible[key] === false : hidden.has(key);
    function setHidden(key, hide) {
        if (mg1) routeVisible[key] = !hide;
        else if (hide) hidden.add(key);
        else hidden.delete(key);
    }
    function apply() {
        if (mg1) filter();
        else {
            for (const [key, route] of routes) for (const node of route.nodes) node.style.display = isHidden(key) ? 'none' : '';
            for (const line of view.querySelectorAll('[data-route-members]')) {
                const members = JSON.parse(line.dataset.routeMembers).filter(key => !isHidden(key));
                const rank = members.indexOf(line.dataset.routeOwner);
                if (rank < 0) continue;
                if (members.length > 1) {
                    const band = Math.min(6, Number(line.dataset.spanLength) / members.length);
                    line.setAttribute('stroke-dasharray', `${band} ${band * (members.length - 1)}`);
                    line.setAttribute('stroke-dashoffset', String(-band * rank));
                } else {
                    if (line.dataset.spawnOnly === '1') line.setAttribute('stroke-dasharray', '3 3');
                    else line.removeAttribute('stroke-dasharray');
                    line.removeAttribute('stroke-dashoffset');
                }
            }
        }
        for (const [key, route] of routes) route.input.checked = !isHidden(key);
    }
    function bind() {
        routes = new Map();
        list.replaceChildren();
        for (const node of view.querySelectorAll(mg1 ? '[data-route]' : '.guard-route')) {
            const key = mg1 ? node.dataset.route : `${node.dataset.area}:${node.dataset.guard}`;
            if (!routes.has(key)) {
                const match = mg1 ? /^a(\d+)r(\d+)(?:g(\d+))?/.exec(key) : null;
                const area = mg1 ? Number(match[1]) : Number(node.dataset.area);
                const room = mg1 ? Number(match[2]) : window.MAP_ROUTE_ROOMS[key];
                const guard = mg1 ? (match[3] !== undefined ? (/camera/i.test(node.dataset.routeName) ? 'C' : 'G') + String(Number(match[3])+1).padStart(2,'0') : /tank/i.test(node.dataset.routeName) ? 'Tank' : 'Bulldozer') : node.dataset.guard;
                routes.set(key, {area,room,guard,number:/^[GC]\d+$/.test(guard)?Number(guard.slice(1)):Number.MAX_SAFE_INTEGER,colour:node.dataset.color||node.dataset.colour,nodes:[]});
            }
            routes.get(key).nodes.push(node);
        }
        const areas = new Set([...routes.values()].map(route => route.area));
        for (const cell of view.querySelectorAll('[data-room]')) {
            for (const match of cell.dataset.room.matchAll(/A(\d+)\s*R/g)) areas.add(Number(match[1]));
        }
        const singleArea = areas.size === 1;
        const sorted = [...routes].sort((a,b) => a[1].area-b[1].area || a[1].room-b[1].room || a[1].number-b[1].number || a[1].guard.localeCompare(b[1].guard));
        const groups = new Map();
        for (const title of ['Guards', 'Cameras', 'Other routes']) {
            const group = document.createElement('section');
            group.className = 'route-subgroup';
            const heading = document.createElement('h3');
            heading.textContent = title;
            heading.style.cssText = 'font-size:12px;margin:12px 0 5px';
            group.append(heading);
            groups.set(title, group);
        }
        for (const [key, route] of sorted) {
            const name = `${singleArea ? '' : `A${route.area} `}R${route.room} ${route.guard}`;
            const row = document.createElement('div');
            row.className = 'route-choice';
            row.dataset.routeKey = key;
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.style.accentColor = route.colour;
            input.onchange = () => {setHidden(key, !input.checked); apply();};
            const swatch = document.createElement('span');
            swatch.className = 'route-colour';
            swatch.style.background = route.colour;
            label.append(input, swatch, name);
            const solo = document.createElement('button');
            solo.type = 'button';
            solo.textContent = 'Only';
            solo.setAttribute('aria-label', `Only route ${name}`);
            solo.onclick = () => {for (const k of routes.keys()) setHidden(k, k !== key); apply();};
            route.input = input;
            row.append(label, solo);
            groups.get(/^G\d+$/.test(route.guard) ? 'Guards' : /^C\d+$/.test(route.guard) ? 'Cameras' : 'Other routes').append(row);
        }
        for (const group of groups.values()) if (group.children.length > 1) list.append(group);
        if (!routes.size) list.textContent = 'No routes on this map.';
        panel.querySelector('#route-actions').hidden = !routes.size;
        apply();
    }
    document.querySelector(mg1 ? '#layers' : '#map-filters').addEventListener('reset-filters', () => {hidden.clear(); apply();});
    panel.querySelector('#routes-all').onclick = () => {for (const key of routes.keys()) setHidden(key, false); apply();};
    panel.querySelector('#routes-none').onclick = () => {for (const key of routes.keys()) setHidden(key, true); apply();};
    new MutationObserver(bind).observe(view, {childList:true});
    bind();
})();
