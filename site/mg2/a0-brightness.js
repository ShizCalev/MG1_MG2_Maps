(()=>{
 const button=document.querySelector('#a0-brightness');
 const states=['dark','normal','bright'];
 let selected='normal';
 function apply(map){
  const images=map.querySelectorAll('image[data-a0-brightness]');
  button.hidden=images.length===0;
  button.textContent='Brightness: '+selected[0].toUpperCase()+selected.slice(1);
  for(const image of images){
   image.setAttribute('href',image.getAttribute('data-brightness-'+selected));
   image.removeAttributeNS('http://www.w3.org/1999/xlink','href');
  }
 }
 button.onclick=()=>{selected=states[(states.indexOf(selected)+1)%states.length];apply(document.querySelector('#view'))};
 window.MG2Brightness={apply};
 apply(document.querySelector('#view'));
})();
