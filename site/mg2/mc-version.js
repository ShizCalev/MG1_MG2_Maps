(()=>{
 const anchor=document.querySelector('#a0-brightness');
 if(!anchor)return;
 const choice=document.createElement('button');choice.type='button';choice.id='mc-version';
 function updateButton(){choice.value=version;choice.textContent=version==='stock'?'Stock MC':'Restored MC';choice.setAttribute('aria-pressed',String(version==='restored'));choice.setAttribute('aria-label',`MC artwork: ${choice.textContent}`);}
 let version='restored';
 try{const saved=localStorage.getItem('mg2-mc-version');if(['stock','restored'].includes(saved))version=saved;}catch{}
 updateButton();anchor.before(choice);
 function apply(map){
  const changedLayers=!!map?.querySelector('[data-mc-layer="restored"]');
  const changedBackgrounds=[...(map?.querySelectorAll('image[data-a0-brightness],image[data-a0-door-native],image[data-generator-gate]')||[])].some(image=>{
   if(image.hasAttribute('data-generator-gate'))return image.getAttribute('data-gate-closed')!==image.getAttribute('data-gate-open');
   return ['dark','normal','bright'].some(state=>{
    const restored=image.getAttribute('data-brightness-artwork-restored-'+state);
    const stock=image.getAttribute('data-a0-door-native')||image.getAttribute('data-brightness-'+state);
    return restored&&stock&&restored!==stock;
   });
  });
  choice.hidden=!changedLayers&&!changedBackgrounds;
  if(!map)return;
  map.querySelector('svg')?.setAttribute('data-mc-version',version);
  window.MG2Brightness?.setVersion(version);
  window.MG2GeneratorGate?.setVersion(version);
  window.MG2RoomEditor?.setStock(version==='stock');
  const picker=document.querySelector('#sprite');
  if(picker && typeof canInspect==='function'){
   inspect(null);picker.innerHTML='<option value="">Select sprite</option>';
   for(const node of map.querySelectorAll('[data-inspector-id]'))node.removeAttribute('data-inspector-id');
   for(const node of map.querySelectorAll('[data-inspect]')){
    const layer=node.closest('[data-mc-layer]');
    if(!canInspect(node)||(layer&&layer.dataset.mcLayer!==version&&!layer.hasAttribute('data-editor-active')))continue;
    const option=document.createElement('option');
    node.dataset.inspectorId=option.value=String(picker.options.length);option.textContent=node.dataset.inspect;picker.append(option);
   }
  }
 }
 choice.onclick=()=>{
  version=version==='stock'?'restored':'stock';
  updateButton();
  try{localStorage.setItem('mg2-mc-version',version);}catch{}
  apply(document.querySelector('#view'));
 };
 window.MG2Version={apply,get current(){return version}};
 apply(document.querySelector('#view'));
})();
