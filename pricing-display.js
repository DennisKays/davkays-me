(() => {
  const root=document.querySelector("#pricing-catalog");
  const prices=window.DAVKAYS_PRICING;
  if(!root||!prices)return;
  const format=new Intl.NumberFormat("en-US",{style:"currency",currency:prices.currency,maximumFractionDigits:2});
  const groups=[["website","Websites and personal sites","websites"],["software","Custom software","software-pricing"],["automation","Digital automation","automation"]];
  const amount=item=>item.min==null?"Custom quotation":item.max==null?`From ${format.format(item.min)}`:item.min===item.max?format.format(item.min):`${format.format(item.min)}–${format.format(item.max)}`;
  const fragment=document.createDocumentFragment();
  for(const [category,title,id] of groups){
    const section=document.createElement("section");section.className="pricing-group";section.id=id;
    const heading=document.createElement("h3");heading.textContent=title;section.append(heading);
    const grid=document.createElement("div");grid.className="pricing-grid";
    prices.catalog.filter(item=>item.category===category).forEach(item=>{
      const card=document.createElement("article");card.className="price-card";
      const name=document.createElement("h4");name.textContent=item.name;
      const price=document.createElement("p");price.className="price-amount";price.textContent=amount(item);
      const summary=document.createElement("p");summary.textContent=item.summary;
      const list=document.createElement("ul");(item.includes||[]).forEach(text=>{const li=document.createElement("li");li.textContent=text;list.append(li)});
      const note=document.createElement("p");note.className="price-note";note.textContent=item.note||"One-time development price. Scope is confirmed before work begins.";
      const link=document.createElement("a");link.className="text-link";link.href=`/quote.html?service=${encodeURIComponent(item.id)}`;link.textContent="Get a quote ↗";
      card.append(name,price,summary,list,note,link);grid.append(card);
    });
    section.append(grid);fragment.append(section);
  }
  const maintenance=document.createElement("section");maintenance.className="pricing-group";maintenance.id="maintenance-pricing";
  const mh=document.createElement("h3");mh.textContent="Monthly maintenance";
  const intro=document.createElement("p");intro.textContent="Maintenance is discussed before it begins. Work limits, check frequency, response times, exclusions, billing, and cancellation terms must be agreed in writing.";
  const grid=document.createElement("div");grid.className="pricing-grid maintenance-grid";
  prices.maintenance.forEach(item=>{
    const card=document.createElement("article");card.className="price-card";
    const name=document.createElement("h4");name.textContent=item.name;
    const price=document.createElement("p");price.className="price-amount";price.textContent=item.monthly==null?"Price to be confirmed":`${format.format(item.monthly)} / month`;
    const summary=document.createElement("p");summary.textContent=item.summary;
    const note=document.createElement("p");note.className="price-note";note.textContent="No support response time, monitoring schedule, or work allowance is promised until included in a written agreement.";
    const link=document.createElement("a");link.className="text-link";link.href=`/quote.html?service=system-support&maintenance=${encodeURIComponent(item.id)}`;link.textContent="Discuss this plan ↗";
    card.append(name,price,summary,note,link);grid.append(card);
  });
  maintenance.append(mh,intro,grid);fragment.append(maintenance);root.replaceChildren(fragment);
})();
