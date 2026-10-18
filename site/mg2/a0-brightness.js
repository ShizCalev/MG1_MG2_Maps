(()=>{
 const button=document.querySelector('#a0-brightness');
 if(!button)return;
 const states=['dark','normal','bright'];
 let selected='normal',restored=true;
 function apply(map){
  const images=map.querySelectorAll('image[data-a0-brightness]');
  button.hidden=images.length===0;
  button.textContent='Brightness: '+selected[0].toUpperCase()+selected.slice(1);
  const attribute='data-brightness-'+(restored?'artwork-restored-':'')+selected;
  for(const image of images){
   image.setAttribute('href',image.getAttribute(attribute)||image.getAttribute('data-brightness-'+selected));
   image.removeAttributeNS('http://www.w3.org/1999/xlink','href');
  }
  for(const image of map.querySelectorAll('image[data-a0-door-native]')){
   image.setAttribute('href',restored?image.getAttribute(attribute):image.getAttribute('data-a0-door-native'));
   image.removeAttributeNS('http://www.w3.org/1999/xlink','href');
  }
 }
 button.onclick=()=>{selected=states[(states.indexOf(selected)+1)%states.length];apply(document.querySelector('#view'))};
 window.MG2Brightness={apply,setVersion(version){restored=version==='restored';apply(document.querySelector('#view'))}};
 apply(document.querySelector('#view'));
})();
