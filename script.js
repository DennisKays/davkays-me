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
  const roomPage=document.body.classList.contains('room-page');
  if(roomPage){
    const revealTargets=document.querySelectorAll('.room-page .scroll-reveal');
    if(revealTargets.length){
      const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');entry.target.classList.remove('reveal-pending');revealObserver.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px 160px 0px'});
      revealTargets.forEach(element=>{element.classList.add('reveal-pending');revealObserver.observe(element)});
      setTimeout(()=>revealTargets.forEach(element=>{element.classList.add('is-visible');element.classList.remove('reveal-pending')}),1200);
    }
  }else{
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
    document.querySelectorAll('main section:not(.hero),.card,.project-card,.service-row,.contact-note,.portfolio-design-card,.process-line').forEach(element=>{element.classList.add('scroll-reveal');revealObserver.observe(element)});
  }
}
