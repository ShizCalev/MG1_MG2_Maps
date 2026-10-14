(() => {
    const histories = new WeakMap();
    const random = n => crypto.getRandomValues(new Uint32Array(1))[0] & (n - 1);
    function reset(root) {
        const emitters = [...root.querySelectorAll('[data-gas-cycle]')].map(node => {
            for (const animation of node.querySelectorAll(':scope > animate[attributeName="display"]')) animation.remove();
            node.style.display = 'none';
            return {node, spans: [{end: random(16) * 8 + 7, visible: false}]};
        });
        histories.set(root, emitters);
    }
    function seek(root, tick) {
        if (!histories.has(root)) reset(root);
        for (const {node, spans} of histories.get(root)) {
            while (spans[spans.length - 1].end <= tick) {
                const last = spans[spans.length - 1];
                spans.push({end: last.end + (last.visible ? random(32) * 6 + 16 : 32), visible: !last.visible});
            }
            let low = 0, high = spans.length - 1;
            while (low < high) {
                const mid = (low + high) >>> 1;
                if (spans[mid].end <= tick) low = mid + 1;
                else high = mid;
            }
            node.style.display = spans[low].visible ? 'inline' : 'none';
        }
    }
    window.MG1GasPlayback = {reset, seek};
    const svg = document.currentScript?.ownerSVGElement;
    if (svg) {
        reset(svg);
        const rate = 15 * (+svg.getAttribute('data-gas-speed') || 1);
        const update = () => {
            if (!svg.isConnected) return;
            seek(svg, svg.getCurrentTime() * rate);
            requestAnimationFrame(update);
        };
        update();
    }
})();
