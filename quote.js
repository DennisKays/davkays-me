(() => {
  "use strict";
  const pricing = window.DAVKAYS_PRICING;
  const calculator = window.DAVKAYS_QUOTE_CALCULATOR?.createCalculator(pricing?.currency);
  const form = document.querySelector("#quote-form");
  if (!pricing || !form || !calculator) return;

  const byId = id => document.getElementById(id);
  const packageSelect = byId("service-package");
  const packageDescription = byId("package-description");
  const steps = [...document.querySelectorAll(".quote-step")];
  const nav = document.querySelector("[data-quote-navigation]");
  const result = byId("quote-result");
  const stepStatus = byId("quote-step-status");
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: pricing.currency, maximumFractionDigits: 2 });
  const categories = { website:"Website development", software:"Custom software", automation:"Digital automation" };
  let currentStep = 1;
  let quotation = null;

  function amountLabel(item) {
    if (item.min == null) return "Custom quotation";
    if (item.max == null) return `From ${currency.format(item.min)}`;
    if (item.min === item.max) return currency.format(item.min);
    return `${currency.format(item.min)}–${currency.format(item.max)}`;
  }
  function groupedPackages() {
    for (const groupName of ["website", "software", "automation"]) {
      const group = document.createElement("optgroup");
      group.label = categories[groupName];
      pricing.catalog.filter(p => p.category === groupName).forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name} · ${amountLabel(item)}`;
        group.append(option);
      });
      packageSelect.append(group);
    }
  }
  function fillMaintenance() {
    pricing.maintenance.forEach(plan => {
      const option = document.createElement("option");
      option.value = plan.id;
      option.textContent = `${plan.name} · ${plan.monthly==null?"Price to be confirmed":`${currency.format(plan.monthly)}/month`} · terms to be agreed`;
      byId("maintenance-plan").append(option);
    });
  }
  function fillOptionalServices() {
    const list = byId("optional-services");
    pricing.optionalServices.forEach(item => {
      const label = document.createElement("label");
      label.className = "quote-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "optional";
      input.value = item.id;
      input.dataset.price = item.price == null ? "unknown" : String(item.price);
      const title = document.createElement("span");
      title.textContent = `${item.name} · ${item.price == null ? "To be confirmed" : currency.format(item.price)}`;
      label.append(input, title);
      list.append(label);
    });
  }
  function selectedPackage() { return pricing.catalog.find(p => p.id === packageSelect.value); }
  function describePackage() {
    const item = selectedPackage();
    packageDescription.replaceChildren();
    if (!item) { packageDescription.textContent = "Choose a service to see what it includes."; return; }
    const summary = document.createElement("p");
    summary.textContent = `${item.summary} Current development price: ${amountLabel(item)}.`;
    packageDescription.append(summary);
    if (item.includes?.length) {
      const list = document.createElement("ul");
      item.includes.forEach(text => { const li=document.createElement("li");li.textContent=text;list.append(li); });
      packageDescription.append(list);
    }
    if (item.note) { const note=document.createElement("p");note.textContent=item.note;packageDescription.append(note); }
  }
  function toggleConditionalFields() {
    const isBusiness = byId("customer-type").value === "business";
    byId("business-name-field").hidden = !isBusiness;
    byId("business-name").required = isBusiness;
    const isWebsite = selectedPackage()?.category === "website";
    byId("website-provider-fields").hidden = !isWebsite;
    document.querySelectorAll(".domain-details").forEach(e => e.hidden = !isWebsite || byId("domain-choice").value !== "need");
    document.querySelectorAll(".hosting-details").forEach(e => e.hidden = !isWebsite || byId("hosting-choice").value !== "need");
    byId("mailbox-count").closest(".field").hidden = !isWebsite || byId("email-choice").value !== "hosted";
    byId("email-provider").closest(".field").hidden = !isWebsite || !["hosted","forwarding"].includes(byId("email-choice").value);
    byId("email-billing-period").closest(".field").hidden = !isWebsite || !["hosted","forwarding"].includes(byId("email-choice").value);
    byId("other-extension-field").hidden = !isWebsite || byId("domain-choice").value !== "need" || byId("domain-extension").value !== "other";
  }
  function describeMaintenance() {
    const plan = pricing.maintenance.find(item => item.id === byId("maintenance-plan").value);
    const area = byId("maintenance-includes");
    area.textContent = plan ? plan.summary : "Choose a plan to discuss maintenance. Scope and service terms must be approved in writing before service begins.";
  }
  function gotoStep(step) {
    currentStep = step;
    document.body.classList.toggle("quote-ready", step === 4);
    steps.forEach(fieldset => fieldset.hidden = Number(fieldset.dataset.step) !== step);
    result.hidden = step !== 4;
    form.hidden = step === 4;
    nav.hidden = step === 4;
    byId("quote-back").hidden = step === 1;
    byId("quote-next").textContent = step === 3 ? "Build my quotation ↗" : "Continue ↗";
    document.querySelectorAll("[data-progress]").forEach(el => {
      const n = Number(el.dataset.progress);
      if (n === step) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
      el.classList.toggle("is-complete", n < step);
    });
    stepStatus.textContent = step < 4 ? `Step ${step} of 4: ${["","Your details","Service","Requirements"][step]}` : "Your quotation is ready to review.";
    if (step === 4) result.focus();
    else steps.find(fieldset=>Number(fieldset.dataset.step)===step)?.querySelector("legend")?.focus();
  }
  function localToday() { return new Intl.DateTimeFormat("en-CA", { timeZone:"Africa/Harare", year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date()); }
  function addDays(date, days) { const [year,month,day]=date.split("-").map(Number);const d=new Date(Date.UTC(year,month-1,day+days,12));return new Intl.DateTimeFormat("en-GB", { timeZone:"Africa/Harare", day:"2-digit", month:"long", year:"numeric" }).format(d); }
  function makeReference() {
    const bytes = new Uint8Array(4);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes); else bytes.set([Math.random()*256,Math.random()*256,Math.random()*256,Math.random()*256].map(Math.floor));
    return `DKS-${localToday().replaceAll("-","")}-${[...bytes].map(n=>n.toString(16).padStart(2,"0")).join("").toUpperCase()}`;
  }
  function quoteRange(min, max) {
    if (min == null) return "To be confirmed";
    if (max == null) return `From ${currency.format(min)}`;
    return min === max ? currency.format(min) : `${currency.format(min)}–${currency.format(max)}`;
  }
  function halfRange(min, max) {
    if (min == null) return "To be confirmed after scope is agreed";
    const low = currency.format(min * pricing.depositPercent / 100);
    if (max == null) return `At least ${low} (based on the starting development price)`;
    const high = currency.format(max * pricing.depositPercent / 100);
    return min === max ? low : `${low}–${high}`;
  }
  function selectedOptionIds() { return [...document.querySelectorAll('input[name="optional"]:checked')].map(input => input.value); }
  function collect() {
    const pkg=selectedPackage();
    const plan=pricing.maintenance.find(x=>x.id===byId("maintenance-plan").value);
    const name=byId("customer-name").value.trim();
    const type=byId("customer-type").value;
    const business=type === "business" ? byId("business-name").value.trim() : "";
    return {
      ref:makeReference(), issued:localToday(), expires:addDays(localToday(),pricing.quoteValidityDays),
      name,email:byId("customer-email").value.trim(),whatsapp:byId("customer-whatsapp").value.trim(),type,business,
      package:pkg, size:Number(byId("project-size").value)||1, description:byId("project-description").value.trim(), functionality:byId("functionality").value.trim(),
      domainChoice:byId("domain-choice").value,domainName:byId("domain-name").value.trim(),domainExtension:byId("domain-extension").value,domainExtensionOther:byId("domain-extension-other").value.trim(),domainYears:Number(byId("domain-years").value),hostingPeriod:byId("hosting-billing-period").value,emailPeriod:byId("email-billing-period").value,
      hostingChoice:byId("hosting-choice").value,hostingPreference:byId("hosting-preference").value.trim(),emailChoice:byId("email-choice").value,mailboxes:Number(byId("mailbox-count").value)||1,emailProvider:byId("email-provider").value.trim(),
      optional: selectedOptionIds().map(id=>pricing.optionalServices.find(x=>x.id===id)).filter(Boolean),maintenance:plan
    };
  }
  function makeRow(tableBody, item, price, period, note="") {
    const tr=document.createElement("tr");
    for(const text of [item,price,period,note]){const td=document.createElement("td");td.textContent=text;tr.append(td);}
    tableBody.append(tr);
  }
  function appendHeading(parent, text) { const h=document.createElement("h4");h.textContent=text;parent.append(h); }
  function serviceScope(q) {
    const parent=byId("quote-scope");parent.replaceChildren();
    const intro=document.createElement("p");intro.textContent=`${q.package.name}: ${q.package.summary}`;parent.append(intro);
    if(q.package.includes?.length){const list=document.createElement("ul");q.package.includes.forEach(text=>{const li=document.createElement("li");li.textContent=text;list.append(li)});parent.append(list)}
    const details=document.createElement("p");details.textContent=`Requested size: ${q.size} page, screen, or workflow${q.size===1?"":"s"}.`;parent.append(details);
    const description=document.createElement("p");description.textContent=`Project request: ${q.description}`;parent.append(description);
    if(q.functionality){const f=document.createElement("p");f.textContent=`Additional functionality: ${q.functionality}`;parent.append(f)}
    if(q.optional.length){const o=document.createElement("p");o.textContent=`Additional services: ${q.optional.map(x=>x.name).join(", ")}.`;parent.append(o)}
    if(q.maintenance){const m=document.createElement("p");m.textContent=`Ongoing care: ${q.maintenance.name} · ${q.maintenance.monthly==null?"price to be confirmed":`${currency.format(q.maintenance.monthly)} per month`}. Service terms require written agreement.`;parent.append(m)}
  }
  function renderQuote() {
    const q=collect();quotation=q;const calc=calculator.calculate(q,pricing);
    byId("quote-meta").textContent=`Estimate reference ${q.ref} · Prepared ${q.issued} · Review by ${q.expires}. This date is informational; expiry is not enforced.`;
    const customer=byId("quote-customer");customer.replaceChildren();
    [q.name,q.type==="business"?q.business:"Individual customer",q.email,q.whatsapp].filter(Boolean).forEach(text=>{const p=document.createElement("p");p.textContent=text;customer.append(p)});
    serviceScope(q);
    const table=document.createElement("table");table.className="quote-table";const thead=document.createElement("thead");thead.innerHTML="<tr><th scope=\"col\">Item</th><th scope=\"col\">Price</th><th scope=\"col\">Billing</th><th scope=\"col\">Notes</th></tr>";table.append(thead);const tbody=document.createElement("tbody");calc.lines.forEach(line=>makeRow(tbody,line.item,line.price,line.period,line.note));table.append(tbody);byId("quote-breakdown").replaceChildren(table);
    const totals=byId("quote-totals");totals.replaceChildren();appendHeading(totals,"Payment summary");
    const summary=document.createElement("table");summary.className="quote-table quote-summary";
    const summaryHead=document.createElement("thead");summaryHead.innerHTML="<tr><th scope=\"col\">Item</th><th scope=\"col\">Amount or details</th></tr>";summary.append(summaryHead);
    const summaryBody=document.createElement("tbody");
    const monthlyInitialSelected=calc.currentMonthlyKnown>0||calc.unknownMonthly.some(x=>x.startsWith("initial "));
    const annualInitialSelected=calc.currentAnnualKnown>0||calc.unknownAnnual.some(x=>x.startsWith("initial "));
    const monthlyRenewalSelected=calc.renewalMonthlyKnown>0||calc.unknownMonthly.some(x=>x.includes("renewal"));
    const annualRenewalSelected=calc.renewalAnnualKnown>0||calc.unknownAnnual.some(x=>x.includes("renewal"));
    const monthlyInitial=!monthlyInitialSelected?"None selected":calc.unknownMonthly.some(x=>x.startsWith("initial "))?calc.currentMonthlyKnown?`${currency.format(calc.currentMonthlyKnown)} per month plus initial rates To be confirmed`:"To be confirmed":`${currency.format(calc.currentMonthlyKnown)} per month`;
    const annualInitial=!annualInitialSelected?"None selected":calc.unknownAnnual.some(x=>x.startsWith("initial "))?calc.currentAnnualKnown?`${currency.format(calc.currentAnnualKnown)} per year plus initial rates To be confirmed`:"To be confirmed":`${currency.format(calc.currentAnnualKnown)} per year`;
    const monthlyRenewal=!monthlyRenewalSelected?"None scheduled":calc.unknownMonthly.some(x=>x.includes("renewal"))?calc.renewalMonthlyKnown?`${currency.format(calc.renewalMonthlyKnown)} per month plus renewals To be confirmed`:"To be confirmed":`${currency.format(calc.renewalMonthlyKnown)} per month`;
    const annualRenewal=!annualRenewalSelected?"None scheduled":calc.unknownAnnual.some(x=>x.includes("renewal"))?calc.renewalAnnualKnown?`${currency.format(calc.renewalAnnualKnown)} per year plus renewals To be confirmed`:"To be confirmed":`${currency.format(calc.renewalAnnualKnown)} per year`;
    const totalRows=[
      ["Initial project and build",calc.developmentLabel],
      ["Known first-term portion",calc.knownFirstTerm>0?currency.format(calc.knownFirstTerm):"To be confirmed"],
      ["First-year total",calc.firstYearProvisional?"To be confirmed after the listed scope and supplier charges are confirmed":calc.firstYearLabel],
      ["Maintenance, shown separately",q.maintenance?(calc.maintenanceMonthly==null?"Price to be confirmed":`${currency.format(calc.maintenanceMonthly)} per month · ${currency.format(calc.maintenanceMonthly*12)} per 12 months`):"None selected"],
      ["Supplier charges billed monthly in the initial term",monthlyInitial],
      ["Supplier charges billed annually in the initial term",annualInitial],
      ["Other selected recurring services billed monthly",calc.optionalMonthly?`${currency.format(calc.optionalMonthly)} per month`:"None selected"],
      ["Other selected recurring services billed annually",calc.optionalAnnual?`${currency.format(calc.optionalAnnual)} per year`:"None selected"],
      ["Subsequent monthly supplier renewals",monthlyRenewal],
      ["Annualized subsequent monthly renewals",!monthlyRenewalSelected?"None scheduled":calc.unknownMonthly.some(x=>x.includes("renewal"))?"To be confirmed until renewal rates are known":`${currency.format(calc.renewalMonthlyKnown*12)} per year (renewal monthly charges × 12)`],
      ["Subsequent annual supplier renewals",annualRenewal],
      ["Annualized current monthly supplier charges",!monthlyInitialSelected?"None selected":calc.unknownMonthly.some(x=>x.startsWith("initial "))?"To be confirmed until initial monthly rates are confirmed":`${currency.format(calc.annualizedCurrentMonthly)} per year (monthly charges × 12)`],
      ["50% deposit on priced development only",calc.deposit],
      ["Remaining 50% on priced development only",calc.balance]
    ];
    totalRows.forEach(([label,value])=>{const row=document.createElement("tr");const heading=document.createElement("th");heading.scope="row";heading.textContent=label;const amount=document.createElement("td");amount.textContent=value;row.append(heading,amount);summaryBody.append(row)});summary.append(summaryBody);totals.append(summary);
    const pending=[...calc.unknownFirst,...calc.unknownMonthly,...calc.unknownAnnual];
    const note=document.createElement("p");note.className="quote-pending-note";note.textContent=pending.length?`Preliminary estimate only. To be confirmed: ${[...new Set(pending)].join(", ")}. Unknown charges are not treated as $0. The reference is for this browser-generated estimate and is not a registered quotation.`:"Preliminary estimate only. Final scope, availability, and supplier rates must be confirmed in writing. The reference is not a registered quotation.";totals.append(note);byId("quote-payment-terms").textContent=pricing.paymentTerms;
    const emailSubject=encodeURIComponent(`Quote request ${q.ref} · ${q.package.name}`);
    const emailBody=encodeURIComponent(`Hello DavKays,

Please review this project quotation request.
Reference: ${q.ref}
Name: ${q.name}${q.business?`
Business: ${q.business}`:""}
Email: ${q.email}
WhatsApp: ${q.whatsapp}
Service: ${q.package.name}
Development price shown: ${calc.developmentLabel}
First-year total: ${calc.firstYearProvisional?"To be confirmed":calc.firstYearLabel}

Project details:
${q.description}
${q.functionality?`
Requested features: ${q.functionality}
`:""}
Please confirm scope, supplier costs, availability, and the formal quotation.
`);
    byId("quote-email").href=`mailto:davidkanyurira6@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    const waText=encodeURIComponent(`Hello DavKays, please review estimate ${q.ref} for ${q.package.name}. Development price shown: ${calc.developmentLabel}. First-year total: ${calc.firstYearProvisional?"To be confirmed":calc.firstYearLabel}. Name: ${q.name}. Project: ${q.description.slice(0,500)}`);
    byId("quote-whatsapp").href=`https://wa.me/263711881780?text=${waText}`;
    gotoStep(4);
  }

  groupedPackages();fillMaintenance();fillOptionalServices();
  const quoteParams=new URLSearchParams(location.search);const requestedService=quoteParams.get("service");if(requestedService&&pricing.catalog.some(p=>p.id===requestedService))packageSelect.value=requestedService;const requestedMaintenance=quoteParams.get("maintenance");if(requestedMaintenance&&pricing.maintenance.some(p=>p.id===requestedMaintenance))byId("maintenance-plan").value=requestedMaintenance;
  packageSelect.addEventListener("change",()=>{describePackage();toggleConditionalFields()});
  byId("customer-type").addEventListener("change",toggleConditionalFields);
  ["domain-choice","domain-extension","hosting-choice","email-choice"].forEach(id=>byId(id).addEventListener("change",toggleConditionalFields));
  byId("maintenance-plan").addEventListener("change",describeMaintenance);
  byId("quote-next").addEventListener("click",()=>{
    const current=steps.find(x=>Number(x.dataset.step)===currentStep);
    const invalid=[...current.querySelectorAll("input,select,textarea")].find(control=>control.willValidate&&!control.checkValidity());if(invalid){invalid.reportValidity();return;}
    if(currentStep===3){renderQuote();return;}
    gotoStep(currentStep+1);
  });
  byId("quote-back").addEventListener("click",()=>gotoStep(Math.max(1,currentStep-1)));
  byId("quote-edit").addEventListener("click",()=>gotoStep(1));
  byId("quote-print").addEventListener("click",()=>window.print());
  byId("customer-type").dispatchEvent(new Event("change"));packageSelect.dispatchEvent(new Event("change"));describeMaintenance();
})();
