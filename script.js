const menu=document.querySelector('.menu');
const links=document.querySelector('.navlinks');
if(menu&&links){
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');links.classList.remove('open');document.body.classList.remove('menu-open')};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));links.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
  links.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
}
const form=document.querySelector('#contact-form');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('Website enquiry to DavKays');const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nWhat you need: ${d.get('service')}\n\n${d.get('message')}`);window.location.href=`mailto:info@davkays.me?subject=${subject}&body=${body}`})}
const topbar=document.querySelector('.topbar');
if(topbar){const updateTopbar=()=>topbar.classList.toggle('is-scrolled',window.scrollY>8);updateTopbar();window.addEventListener('scroll',updateTopbar,{passive:true})}
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll('main section:not(.hero),.card,.project-card,.service-row,.contact-note,.portfolio-design-card').forEach(element=>{element.classList.add('scroll-reveal');revealObserver.observe(element)});
}
