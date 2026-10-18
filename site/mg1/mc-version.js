(()=>{
 const anchor=document.querySelector('#sheets');
 if(!anchor)return;
 const choice=document.createElement('button');choice.type='button';choice.id='mc-version';
 function updateButton(){choice.value=version;choice.textContent=version==='stock'?'Stock MC':'Restored MC';choice.setAttribute('aria-pressed',String(version==='restored'));choice.setAttribute('aria-label',`MC artwork: ${choice.textContent}`);}
 let version='restored';
 try{const saved=localStorage.getItem('mg1-mc-version');if(['stock','restored'].includes(saved))version=saved;}catch{}
 updateButton();anchor.after(choice);
 function apply(map){
  choice.hidden=!map?.querySelector('[data-mc-layer="restored"]');
  map?.querySelector('svg')?.setAttribute('data-mc-version',version);
  window.MG1RoomEditor?.setStock(version==='stock');
 }
 choice.onclick=()=>{
  version=version==='stock'?'restored':'stock';
  updateButton();
  try{localStorage.setItem('mg1-mc-version',version);}catch{}
  apply(document.querySelector('#map'));
 };
 window.MG1Version={apply,get current(){return version}};
 apply(document.querySelector('#map'));
})();
