(()=>{
 const anchor=document.querySelector('#a0-brightness');
 if(!anchor)return;
 const button=document.createElement('button');
 button.id='generator-gate';
 button.type='button';
 button.title='A15 R1: closed before the A15 R4 bridge cutscene, open afterward';
 anchor.after(button);
 let closed=true,restored=true;
 function apply(map){
  const images=map.querySelectorAll('image[data-generator-gate]');
  button.hidden=images.length===0 || !restored;
  button.textContent='Gate: '+(closed?'Closed':'Open');
  button.setAttribute('aria-pressed',String(closed));
  for(const image of images){
   image.setAttribute('href',image.getAttribute('data-gate-'+(restored&&closed?'closed':'open')));
   image.removeAttributeNS('http://www.w3.org/1999/xlink','href');
  }
 }
 button.onclick=()=>{closed=!closed;apply(document.querySelector('#view'))};
 window.MG2GeneratorGate={apply,setVersion(version){restored=version==='restored';apply(document.querySelector('#view'))}};
 apply(document.querySelector('#view'));
})();
