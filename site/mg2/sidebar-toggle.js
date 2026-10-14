(()=>{
 const sidebar=document.querySelector('aside');
 if(!sidebar||document.querySelector('#sidebar-toggle'))return;
 const layout=document.querySelector('#viewport')?'map':'audit';
 document.body.dataset.sidebarLayout=layout;
 const style=document.createElement('style');
 style.textContent=`#sidebar-toggle{background:#242c38;color:#e7ebf0;border:1px solid #4c596b;border-radius:5px;padding:7px 10px;font:13px system-ui;cursor:pointer}.sidebar-toggle-row{display:flex;justify-content:center;margin-bottom:18px}.sidebar-toggle-row[data-floating]{position:fixed;right:12px;top:12px;z-index:30;margin:0}body[data-sidebar-layout="map"] .sidebar-toggle-row[data-floating]{top:68px}body.sidebar-collapsed[data-sidebar-layout="map"] main{grid-template-columns:minmax(0,1fr)}body.sidebar-collapsed[data-sidebar-layout="audit"]{margin-right:24px}body.sidebar-collapsed[data-sidebar-layout="audit"] header{padding-top:8px}body.sidebar-collapsed aside{display:none!important}@media(max-width:700px){body.sidebar-collapsed[data-sidebar-layout="audit"]{margin-right:12px}}`;

 document.head.append(style);
 const holder=document.createElement('div');holder.className='sidebar-toggle-row';
 const button=document.createElement('button');
 button.id='sidebar-toggle';button.type='button';
 button.setAttribute('aria-controls',sidebar.id);
 holder.append(button);
 function update(){const expanded=!sidebar.hidden;button.textContent=expanded?'Collapse sidebar':'Expand sidebar';button.setAttribute('aria-expanded',String(expanded));document.body.classList.toggle('sidebar-collapsed',!expanded);if(expanded){holder.removeAttribute('data-floating');sidebar.prepend(holder);}else{holder.setAttribute('data-floating','');document.body.append(holder);}}
 button.addEventListener('click',()=>{sidebar.hidden=!sidebar.hidden;update();button.focus({preventScroll:true});});
 update();

})();
