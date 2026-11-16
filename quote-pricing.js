(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DAVKAYS_QUOTE_CALCULATOR = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function createCalculator(currencyCode = "USD") {
    const money = new Intl.NumberFormat("en-US", { style:"currency", currency:currencyCode, maximumFractionDigits:2 });
    const format = value => value == null ? "To be confirmed" : money.format(value);
    const range = (min,max) => min == null ? "To be confirmed" : max == null ? `From ${format(min)}` : min === max ? format(min) : `${format(min)}–${format(max)}`;
    const half = (min,max,pct) => min == null ? "To be confirmed after scope is agreed" : max == null ? `At least ${format(min*pct/100)} (priced development only)` : range(min*pct/100,max*pct/100);
    const add = (a,b) => a == null || b == null ? null : a+b;
    const multiply = (a,b) => a == null || b == null ? null : a*b;
    const sumKnown = values => values.reduce((sum,value)=>sum+(value||0),0);

    function calculate(quote, pricing) {
      const lines=[];
      const unknownFirst=[];
      const unknownMonthly=[];
      const unknownAnnual=[];
      const pkg=quote.package;
      let buildMin=pkg.min, buildMax=pkg.max;
      let optionalMonthly=0, optionalAnnual=0;
      const moneyLine=(item,amount,period,note="",unknownList=null)=>{
        lines.push({item,amount,price:format(amount),period,note});
        if(amount==null&&unknownList)unknownList.push(item);
      };

      moneyLine(`${pkg.name} development`,pkg.min,"One-time build",pkg.min==null?"Custom scope and price are confirmed before work begins.":pkg.max==null?"Starting amount only; final scope and price are agreed in writing.":"Development range; final scope is agreed in writing.");
      if(pkg.min==null)unknownFirst.push("development price and scope");
      else if(pkg.max==null)unknownFirst.push("final development scope and total");

      if(pkg.category==="website"&&Number.isInteger(pkg.includedPages)&&quote.size>pkg.includedPages){
        const extra=quote.size-pkg.includedPages;
        moneyLine(`${extra} additional page${extra===1?"":"s"}`,null,"One-time build","A per-page rate has not been set.",unknownFirst);
      }
      if(quote.functionality||quote.optional.some(item=>item.id==="custom-functionality")){
        moneyLine("Additional custom functionality",null,"One-time build","Scope and rate are agreed before work begins.",unknownFirst);
      }
      for(const item of quote.optional){
        if(item.id==="custom-functionality"&&quote.functionality)continue;
        moneyLine(item.name,item.price,item.billing,item.price==null?"No amount is assumed until confirmed.":"",item.price==null?unknownFirst:null);
        if(item.price==null)continue;
        if(item.billing==="one-time"){
          buildMin=add(buildMin,item.price);buildMax=add(buildMax,item.price);
        }else if(item.billing==="monthly")optionalMonthly+=item.price;
        else if(item.billing==="annual")optionalAnnual+=item.price;
        else if(item.billing==="provider dependent")unknownFirst.push(`${item.name} billing period`);
      }

      const domain=pricing.providerCosts.domain;
      let domainInitial=null,domainRenewal=null,domainDueYear=null;
      let hostingInitial=null,hostingRenewal=null,emailInitial=null,emailRenewal=null,forwardingInitial=null,forwardingRenewal=null;
      let setupCosts=0,hostMonthlyCurrent=0,hostAnnualCurrent=0,hostMonthlyRenewal=0,hostAnnualRenewal=0;
      let emailMonthlyCurrent=0,emailAnnualCurrent=0,emailMonthlyRenewal=0,emailAnnualRenewal=0;
      let forwardingMonthlyCurrent=0,forwardingAnnualCurrent=0,forwardingMonthlyRenewal=0,forwardingAnnualRenewal=0;

      if(pkg.category==="website"&&quote.domainChoice==="need"){
        const years=String(quote.domainYears);
        domainInitial=domain.registrationByTerm?.[years]??null;
        domainRenewal=domain.renewalAnnual;
        domainDueYear=quote.domainYears+1;
        moneyLine(`Domain registration · ${quote.domainName||"name to be selected"} · ${quote.domainYears} year${quote.domainYears===1?"":"s"}`,domainInitial,"Upfront for selected registration term",`Supplier: ${domain.supplier||"to be selected"}. Exact term rate is not configured.`,unknownFirst);
        moneyLine(`Domain renewal · expected in year ${domainDueYear}`,domainRenewal,"Annual after selected registration term","Renewal is not part of the initial payment.",unknownAnnual);
      }else if(pkg.category==="website"&&quote.domainChoice==="existing"){
        lines.push({item:"Existing domain",amount:0,price:"No new registration included",period:"Customer’s provider",note:"The registrar bills any renewal directly."});
      }

      if(pkg.category==="website"&&quote.hostingChoice==="need"){
        const provider=pricing.providerCosts.hosting;
        const isMonthly=quote.hostingPeriod==="monthly";
        const initialRate=isMonthly?provider.initialMonthly:quote.hostingPeriod==="annual"?provider.initialAnnual:null;
        const months=provider.initialTermMonths??12;
        hostingInitial=initialRate==null?null:isMonthly?initialRate*months:initialRate;
        hostingRenewal=isMonthly?provider.renewalMonthly:quote.hostingPeriod==="annual"?provider.renewalAnnual:null;
        if(provider.setupOneTime==null){unknownFirst.push("hosting setup fee");moneyLine("Hosting setup fee",null,"One-time","Supplier setup fee has not been confirmed.");}
        else {setupCosts+=provider.setupOneTime;moneyLine("Hosting setup fee",provider.setupOneTime,"One-time","Confirmed supplier setup fee.");}
        moneyLine("Website hosting · initial term",hostingInitial,isMonthly?`${format(initialRate)} per month × ${months} months`:quote.hostingPeriod==="annual"?"Annual initial term":"Billing period to be confirmed",`Supplier: ${provider.supplier||"to be selected"}.`,unknownFirst);
        if(isMonthly){if(initialRate==null)unknownMonthly.push("initial hosting monthly rate");else hostMonthlyCurrent=initialRate;}
        else if(quote.hostingPeriod==="annual"){if(initialRate==null)unknownAnnual.push("initial hosting annual rate");else hostAnnualCurrent=initialRate;}
        else {unknownFirst.push("hosting billing period");unknownMonthly.push("hosting monthly rate");unknownAnnual.push("hosting annual rate");}
        if(quote.hostingPeriod!=="undecided"){
          const dueMonth=provider.renewalStartsAfterMonths??months;
          const dueYear=Math.floor(dueMonth/12)+1;
          moneyLine(`Hosting renewal · expected in year ${dueYear}`,hostingRenewal,quote.hostingPeriod==="monthly"?"Monthly after initial term":"Annual after initial term","Renewal rate is separate from the initial term.",quote.hostingPeriod==="monthly"?unknownMonthly:unknownAnnual);
          if(quote.hostingPeriod==="monthly"){if(hostingRenewal==null)unknownMonthly.push("hosting monthly renewal rate");else hostMonthlyRenewal=hostingRenewal;}
          else {if(hostingRenewal==null)unknownAnnual.push("hosting annual renewal rate");else hostAnnualRenewal=hostingRenewal;}
        }
      }else if(pkg.category==="website"&&quote.hostingChoice==="existing"){
        lines.push({item:"Existing hosting",amount:0,price:"No new hosting included",period:"Customer’s provider",note:"The host bills service and renewals directly."});
      }

      if(pkg.category==="website"&&quote.emailChoice==="hosted"){
        const provider=pricing.providerCosts.hostedEmail;
        const count=quote.mailboxes;
        const isMonthly=quote.emailPeriod==="monthly";
        const initialRate=isMonthly?provider.monthlyPerMailbox:quote.emailPeriod==="annual"?provider.annualPerMailbox:null;
        const months=provider.initialTermMonths??12;
        emailInitial=initialRate==null?null:isMonthly?initialRate*count*months:initialRate*count;
        emailRenewal=isMonthly?(provider.renewalMonthlyPerMailbox==null?null:provider.renewalMonthlyPerMailbox*count):quote.emailPeriod==="annual"?(provider.renewalAnnualPerMailbox==null?null:provider.renewalAnnualPerMailbox*count):null;
        const setup=provider.setupPerMailbox==null?null:provider.setupPerMailbox*count;
        if(setup==null){unknownFirst.push("hosted email setup fee");moneyLine(`Hosted email setup · ${count} mailbox${count===1?"":"es"}`,null,"One-time","Supplier setup fee has not been confirmed.");}
        else {setupCosts+=setup;moneyLine(`Hosted email setup · ${count} mailbox${count===1?"":"es"}`,setup,"One-time","Confirmed supplier setup fee.");}
        moneyLine(`Hosted business email · ${count} mailbox${count===1?"":"es"} · initial term`,emailInitial,isMonthly?`${format(initialRate)} per mailbox per month × ${count} × ${months} months`:quote.emailPeriod==="annual"?"Annual initial term":"Billing period to be confirmed",`Supplier: ${provider.supplier||"to be selected"}.`,unknownFirst);
        if(isMonthly){if(initialRate==null)unknownMonthly.push("initial hosted email monthly rate");else emailMonthlyCurrent=initialRate*count;}
        else if(quote.emailPeriod==="annual"){if(initialRate==null)unknownAnnual.push("initial hosted email annual rate");else emailAnnualCurrent=initialRate*count;}
        else {unknownFirst.push("hosted email billing period");unknownMonthly.push("hosted email monthly rate");unknownAnnual.push("hosted email annual rate");}
        if(quote.emailPeriod!=="undecided"){
          const dueMonth=provider.renewalStartsAfterMonths??months;
          const dueYear=Math.floor(dueMonth/12)+1;
          moneyLine(`Hosted email renewal · expected in year ${dueYear}`,emailRenewal,quote.emailPeriod==="monthly"?"Monthly after initial term":"Annual after initial term","Renewal rate is separate from the initial term.",quote.emailPeriod==="monthly"?unknownMonthly:unknownAnnual);
          if(quote.emailPeriod==="monthly"){if(emailRenewal==null)unknownMonthly.push("hosted email monthly renewal rate");else emailMonthlyRenewal=emailRenewal;}
          else {if(emailRenewal==null)unknownAnnual.push("hosted email annual renewal rate");else emailAnnualRenewal=emailRenewal;}
        }
      }else if(pkg.category==="website"&&quote.emailChoice==="existing"){
        lines.push({item:"Existing business email",amount:0,price:"No new email included",period:"Customer’s provider",note:"The provider bills service and renewals directly."});
      }else if(pkg.category==="website"&&quote.emailChoice==="forwarding"){
        const provider=pricing.providerCosts.forwarding;
        const isMonthly=quote.emailPeriod==="monthly";
        const initialRate=isMonthly?provider.initialMonthly:quote.emailPeriod==="annual"?provider.initialAnnual:null;
        const months=provider.initialTermMonths??12;
        forwardingInitial=initialRate==null?null:isMonthly?initialRate*months:initialRate;
        forwardingRenewal=isMonthly?provider.renewalMonthly:quote.emailPeriod==="annual"?provider.renewalAnnual:null;
        if(provider.setupOneTime==null){unknownFirst.push("email forwarding setup fee");moneyLine("Email forwarding setup fee",null,"One-time","Supplier setup fee has not been confirmed.");}
        else {setupCosts+=provider.setupOneTime;moneyLine("Email forwarding setup fee",provider.setupOneTime,"One-time","Confirmed supplier setup fee.");}
        moneyLine("Email forwarding · initial term",forwardingInitial,isMonthly?`${format(initialRate)} per month × ${months} months`:quote.emailPeriod==="annual"?"Annual initial term":"Billing period to be confirmed",`Supplier: ${provider.supplier||"to be selected"}. Forwarding is not a hosted mailbox.`,unknownFirst);
        if(isMonthly){if(initialRate==null)unknownMonthly.push("initial forwarding monthly rate");else forwardingMonthlyCurrent=initialRate;}
        else if(quote.emailPeriod==="annual"){if(initialRate==null)unknownAnnual.push("initial forwarding annual rate");else forwardingAnnualCurrent=initialRate;}
        else {unknownFirst.push("email forwarding billing period");unknownMonthly.push("email forwarding monthly rate");unknownAnnual.push("email forwarding annual rate");}
        if(quote.emailPeriod!=="undecided"){
          const dueMonth=provider.renewalStartsAfterMonths??months;
          const dueYear=Math.floor(dueMonth/12)+1;
          moneyLine(`Email forwarding renewal · expected in year ${dueYear}`,forwardingRenewal,quote.emailPeriod==="monthly"?"Monthly after initial term":"Annual after initial term","Renewal rate is separate from the initial term.",quote.emailPeriod==="monthly"?unknownMonthly:unknownAnnual);
          if(quote.emailPeriod==="monthly"){if(forwardingRenewal==null)unknownMonthly.push("forwarding monthly renewal rate");else forwardingMonthlyRenewal=forwardingRenewal;}
          else {if(forwardingRenewal==null)unknownAnnual.push("forwarding annual renewal rate");else forwardingAnnualRenewal=forwardingRenewal;}
        }
      }

      let maintenanceMonthly=null;
      if(quote.maintenance){
        maintenanceMonthly=quote.maintenance.monthly;
        moneyLine(`${quote.maintenance.name} maintenance`,maintenanceMonthly,"Monthly, scope to be agreed",quote.maintenance.summary||"Maintenance terms require written agreement before service begins.",maintenanceMonthly==null?unknownFirst:null);
      }

      const supplierInitialKnown=sumKnown([domainInitial,hostingInitial,emailInitial,forwardingInitial,setupCosts]);
      const maintenanceYear=multiply(maintenanceMonthly,12);
      const firstMin=buildMin==null?null:buildMin+supplierInitialKnown+(maintenanceYear||0)+(optionalMonthly*12)+optionalAnnual;
      const firstMax=buildMax==null?null:buildMax+supplierInitialKnown+(maintenanceYear||0)+(optionalMonthly*12)+optionalAnnual;
      const knownFirstTerm=sumKnown([buildMin,supplierInitialKnown,maintenanceYear,optionalMonthly*12,optionalAnnual]);
      const firstYearProvisional=unknownFirst.length>0||buildMin==null||buildMax==null;
      const maintenanceKnown=maintenanceMonthly!=null;
      const currentMonthlyKnown=sumKnown([hostMonthlyCurrent,emailMonthlyCurrent,forwardingMonthlyCurrent]);
      const renewalMonthlyKnown=sumKnown([hostMonthlyRenewal,emailMonthlyRenewal,forwardingMonthlyRenewal]);
      const currentAnnualKnown=sumKnown([hostAnnualCurrent,emailAnnualCurrent,forwardingAnnualCurrent]);
      const renewalAnnualKnown=sumKnown([domainRenewal,hostAnnualRenewal,emailAnnualRenewal,forwardingAnnualRenewal]);
      const annualizedCurrentMonthly=currentMonthlyKnown*12;
      const subsequentYearProvisional=unknownMonthly.length>0||unknownAnnual.length>0;

      return {
        lines,unknownFirst:[...new Set(unknownFirst)],unknownMonthly:[...new Set(unknownMonthly)],unknownAnnual:[...new Set(unknownAnnual)],
        buildMin,buildMax,setupCosts,domainInitial,domainRenewal,domainDueYear:quote.domainChoice==="need"?domainDueYear:null,
        hostingInitial,hostingRenewal,emailInitial,emailRenewal,forwardingInitial,forwardingRenewal,maintenanceMonthly,maintenanceYear,
        firstMin,firstMax,knownFirstTerm,firstYearProvisional,
        currentMonthlyKnown,renewalMonthlyKnown,currentAnnualKnown,renewalAnnualKnown,annualizedCurrentMonthly,
        maintenanceKnown,optionalMonthly,optionalAnnual,subsequentYearProvisional,
        deposit:half(buildMin,buildMax,pricing.depositPercent),balance:half(buildMin,buildMax,pricing.depositPercent),
        supplierSummary:{currentMonthly:range(currentMonthlyKnown,currentMonthlyKnown),renewalMonthly:range(renewalMonthlyKnown,renewalMonthlyKnown),currentAnnual:range(currentAnnualKnown,currentAnnualKnown),renewalAnnual:range(renewalAnnualKnown,renewalAnnualKnown)},
        firstYearLabel:range(firstMin,firstMax),developmentLabel:range(buildMin,buildMax),format
      };
    }
    return { calculate };
  }
  return { createCalculator };
});
