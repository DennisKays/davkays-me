const menu=document.querySelector('.menu');
const links=document.querySelector('.navlinks');
if(menu&&links){
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation menu');links.classList.remove('open');document.body.classList.remove('menu-open')};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');links.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
  links.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
}
const form=document.querySelector('#contact-form');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('Website enquiry to DavKays');const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nWhat you need: ${d.get('service')}\n\n${d.get('message')}`);window.location.href=`mailto:info@davkays.me?subject=${subject}&body=${body}`})}
const topbar=document.querySelector('.topbar');
if(topbar){
  let previousY=window.scrollY;
  const updateTopbar=()=>{
    const currentY=window.scrollY;
    if(document.body.classList.contains('room-page')){
      if(document.body.classList.contains('menu-open')||currentY<100||currentY<previousY-2)topbar.classList.remove('is-hidden');
      else if(currentY>previousY+2)topbar.classList.add('is-hidden');
    }else topbar.classList.toggle('is-scrolled',currentY>8);
    previousY=currentY;
  };
  updateTopbar();window.addEventListener('scroll',updateTopbar,{passive:true});
}
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll('main section:not(.hero),.card,.project-card,.service-row,.contact-note,.portfolio-design-card,.process-line').forEach(element=>{element.classList.add('scroll-reveal');revealObserver.observe(element)});
}
if(document.body.classList.contains('room-page')){
  const hero=document.querySelector('.room-hero');
  const devices=document.querySelectorAll('.hero-device[data-parallax]');
  if(hero&&window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove',event=>{
      const bounds=hero.getBoundingClientRect();
      const x=(event.clientX-bounds.left)/bounds.width-.5;
      const y=(event.clientY-bounds.top)/bounds.height-.5;
      hero.style.setProperty('--glow-x',`${event.clientX-bounds.left}px`);
      hero.style.setProperty('--glow-y',`${event.clientY-bounds.top}px`);
      devices.forEach(device=>{const depth=Number(device.dataset.parallax)||1;device.style.setProperty('--px',`${x*depth*18}px`);device.style.setProperty('--py',`${y*depth*18}px`);device.style.setProperty('--tilt-x',`${-y*depth*4}deg`);device.style.setProperty('--tilt-y',`${x*depth*6}deg`)});
    });
    hero.addEventListener('pointerleave',()=>devices.forEach(device=>{device.style.setProperty('--px','0px');device.style.setProperty('--py','0px');device.style.setProperty('--tilt-x','0deg');device.style.setProperty('--tilt-y','0deg')}));
  }
  document.querySelectorAll('.magnetic').forEach(button=>{button.addEventListener('pointermove',event=>{if(!window.matchMedia('(pointer:fine)').matches)return;const rect=button.getBoundingClientRect();button.style.transform=`translate(${(event.clientX-rect.left-rect.width/2)*.08}px,${(event.clientY-rect.top-rect.height/2)*.12}px)`});button.addEventListener('pointerleave',()=>button.style.transform='')});
}
