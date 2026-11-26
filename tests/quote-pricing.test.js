const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const calculatorFactory = require("../quote-pricing.js");

function configuredPricing() {
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","pricing-config.js"),"utf8"),sandbox);
  const pricing=structuredClone(sandbox.window.DAVKAYS_PRICING);
  pricing.providerCosts.domain={supplier:"Test registrar",registrationByTerm:{"1":14,"2":24,"3":33},renewalAnnual:18,renewalDueAfterTerm:true};
  pricing.providerCosts.hosting={supplier:"Test host",setupOneTime:0,initialMonthly:10,initialAnnual:100,initialTermMonths:12,renewalMonthly:12,renewalAnnual:120,renewalStartsAfterMonths:12};
  pricing.providerCosts.hostedEmail={supplier:"Test mail",setupPerMailbox:0,monthlyPerMailbox:3,annualPerMailbox:30,initialTermMonths:12,renewalMonthlyPerMailbox:3.5,renewalAnnualPerMailbox:36,renewalStartsAfterMonths:12};
  pricing.providerCosts.forwarding={supplier:"Test forwarding",setupOneTime:0,initialMonthly:2,initialAnnual:20,initialTermMonths:12,renewalMonthly:2.5,renewalAnnual:25,renewalStartsAfterMonths:12,isMailbox:false};
  return pricing;
}

function quoteFor(pricing) {
  return {
    package:pricing.catalog.find(item=>item.id==="starter-website"),
    size:5,description:"A sample five page business website",functionality:"",
    domainChoice:"need",domainName:"example.test",domainExtension:".com",domainYears:2,
    hostingChoice:"need",hostingPeriod:"monthly",hostingPreference:"Test plan",
    emailChoice:"hosted",emailPeriod:"annual",mailboxes:2,emailProvider:"Test mail",
    optional:[],maintenance:pricing.maintenance.find(item=>item.id==="business-care")
  };
}

const pricing= configuredPricing();
const calculate=calculatorFactory.createCalculator("USD").calculate;

test("exact multi-year domain registration is upfront; renewal starts after the selected term",()=>{
  const quote=quoteFor(pricing);const result=calculate(quote,pricing);
  assert.equal(result.domainInitial,24);
  assert.equal(result.domainRenewal,18);
  assert.equal(result.domainDueYear,3);
  assert.equal(result.firstMin,594);
  assert.equal(result.firstMax,644);
  assert.equal(result.renewalAnnualKnown,90);
  assert.equal(result.firstYearProvisional,false);
});

test("monthly hosting is annualized for the first year, while later monthly renewal remains separate",()=>{
  const quote=quoteFor(pricing);const result=calculate(quote,pricing);
  assert.equal(result.hostingInitial,120);
  assert.equal(result.currentMonthlyKnown,10);
  assert.equal(result.renewalMonthlyKnown,12);
  assert.equal(result.annualizedCurrentMonthly,120);
  assert.equal(result.firstMin,594);
});

test("annual hosting uses one initial annual fee and separate annual renewal",()=>{
  const quote=quoteFor(pricing);quote.hostingPeriod="annual";const result=calculate(quote,pricing);
  assert.equal(result.hostingInitial,100);
  assert.equal(result.currentAnnualKnown,160);
  assert.equal(result.renewalAnnualKnown,210);
  assert.equal(result.currentMonthlyKnown,0);
});

test("hosted email multiplies initial and renewal rates by mailbox count",()=>{
  const quote=quoteFor(pricing);const result=calculate(quote,pricing);
  assert.equal(result.emailInitial,60);
  assert.equal(result.emailRenewal,72);
  assert.ok(result.lines.some(line=>line.item.includes("2 mailboxes")&&line.amount===60));
});

test("unknown supplier prices stay provisional and are never silently counted as zero",()=>{
  const unknown=configuredPricing();unknown.providerCosts.domain.registrationByTerm["2"]=null;unknown.providerCosts.hosting.setupOneTime=null;unknown.providerCosts.hosting.initialMonthly=null;
  const result=calculate(quoteFor(unknown),unknown);
  assert.equal(result.firstYearProvisional,true);
  assert.equal(result.domainInitial,null);
  assert.equal(result.hostingInitial,null);
  assert.ok(result.unknownFirst.includes("Domain registration · example.test · 2 years"));
  assert.ok(result.unknownFirst.includes("hosting setup fee"));
  assert.ok(result.unknownFirst.includes("Website hosting · initial term"));
});

test("email forwarding monthly setup, first term, and renewal are distinct",()=>{
  const quote=quoteFor(pricing);quote.emailChoice="forwarding";quote.emailPeriod="monthly";
  const result=calculate(quote,pricing);
  assert.equal(result.forwardingInitial,24);
  assert.equal(result.forwardingRenewal,2.5);
  assert.equal(result.renewalMonthlyKnown,14.5);
});

test("maintenance is separately billed monthly and annualized for the first year",()=>{
  const quote=quoteFor(pricing);const result=calculate(quote,pricing);
  assert.equal(result.maintenanceMonthly,20);
  assert.equal(result.maintenanceYear,240);
  assert.equal(result.firstMin,594);
});

test("deposit and balance each cover half of the priced build only",()=>{
  const quote=quoteFor(pricing);const result=calculate(quote,pricing);
  assert.equal(result.deposit,"$75.00–$100.00");
  assert.equal(result.balance,"$75.00–$100.00");
});

test("custom management systems have no public or calculated starting amount",()=>{
  const custom=configuredPricing();const pkg=custom.catalog.find(item=>item.id==="management-system");
  assert.equal(pkg.min,null);assert.equal(pkg.max,null);
  const quote=quoteFor(custom);quote.package=pkg;quote.domainChoice="skip";quote.hostingChoice="skip";quote.emailChoice="none";quote.maintenance=null;
  const result=calculate(quote,custom);
  assert.equal(result.developmentLabel,"To be confirmed");
  assert.equal(result.deposit,"To be confirmed after scope is agreed");
  assert.equal(result.firstYearProvisional,true);
});

test("CTA, hover, form and focus colors meet their intended contrast targets",()=>{
  const css=fs.readFileSync(path.join(__dirname,"..","site-experience.css"),"utf8");
  assert.match(css,/--dk-brown:#21150f/);
  assert.match(css,/--dk-chrome:#a8a9ad/);
  assert.match(css,/--dk-ink:#080808/);
  assert.match(css,/--dk-white:#fff/);
  assert.match(css,/\.field :where\(input,textarea,select\).*background:#080808;color:#fff/);
  const ratio=(a,b)=>{
    const lum=hex=>hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
    const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  };
  assert.ok(ratio("#FFFFFF","#21150F")>=4.5);
  assert.ok(ratio("#FFFFFF","#080808")>=4.5);
  assert.ok(ratio("#A8A9AD","#080808")>=3);
});

test("wizard focus targets and live announcements are present in the static markup and script",()=>{
  const html=fs.readFileSync(path.join(__dirname,"..","quote.html"),"utf8");
  const js=fs.readFileSync(path.join(__dirname,"..","quote.js"),"utf8");
  assert.equal((html.match(/<legend tabindex="-1">/g)||[]).length,3);
  assert.match(html,/id="quote-result"[^>]*tabindex="-1"/);
  assert.match(html,/id="quote-step-status" aria-live="polite"/);
  assert.match(js,/invalid\.reportValidity\(\);return/);
  assert.match(js,/querySelector\("legend"\)\?\.focus\(\)/);
  assert.match(js,/if \(step === 4\) result\.focus\(\)/);
});
