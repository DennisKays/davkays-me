/* Public, editable quote configuration. Keep unknown supplier rates null until verified. */
window.DAVKAYS_PRICING = {
  currency: "USD",
  quoteValidityDays: 14,
  depositPercent: 50,
  catalog: [
    { id:"cv-site", category:"website", name:"CV / Personal Website", min:50, max:80, includedPages:1, revisions:1, summary:"A simple personal site to introduce you and your work.", includes:["One responsive page", "About, services or portfolio content", "Contact link that opens the visitor’s email app or a WhatsApp enquiry link", "Basic SEO", "One revision round"], note:"A hosted form that submits information to a service or backend is scoped and priced separately." },
    { id:"personal-landing", category:"website", name:"Personal Landing Page", min:75, max:100, includedPages:1, revisions:1, summary:"A focused one-page website for an individual or idea.", includes:["One responsive page", "About, services or portfolio sections", "Contact link that opens the visitor’s email app or a WhatsApp enquiry link", "Basic SEO", "One revision round"], note:"A hosted form that submits information to a service or backend is scoped and priced separately." },
    { id:"personal-portfolio", category:"website", name:"Personal Portfolio", min:75, max:120, includedPages:1, revisions:1, summary:"A clear place to present selected work and experience.", includes:["Responsive portfolio layout", "Project or work section", "Email-opening contact link or WhatsApp enquiry link", "Basic SEO"], note:"A hosted form that submits information to a service or backend is scoped and priced separately." },
    { id:"starter-website", category:"website", name:"Starter Website", min:150, max:200, includedPages:5, revisions:2, summary:"A small multi-page site for a new or growing business.", includes:["Up to five responsive pages", "Contact link that opens the visitor’s email app or a WhatsApp enquiry link", "Basic SEO", "Two revision rounds"], note:"A hosted form that submits information to a service or backend is scoped and priced separately." },
    { id:"business-website", category:"website", name:"Business Website", min:250, max:350, includedPages:8, revisions:2, summary:"A tailored website for a business with more to explain or offer.", includes:["Up to eight responsive pages", "Customised branding and layout", "Email-opening contact link or WhatsApp enquiry link", "Social media integration", "Analytics setup", "Basic SEO", "Two revision rounds"], note:"A hosted form that submits information to a service or backend is scoped and priced separately." },
    { id:"online-store", category:"website", name:"Online Store", min:450, max:null, includedPages:null, revisions:null, summary:"A store with catalogue and order management; final scope is quoted after review.", includes:["Product catalogue", "Shopping cart", "Order management", "Basic administration", "Testing and deployment"], note:"Payment integration is quoted separately." },
    { id:"personal-blog", category:"website", name:"Personal Blog", min:120, max:null, includedPages:null, revisions:null, summary:"A blog structure sized to the content and publishing needs.", includes:["Blog setup and responsive layout"], note:"Final scope depends on content and publishing requirements." },
    { id:"simple-tool", category:"software", name:"Simple Business Tool", min:250, max:null, summary:"A focused tool to simplify a specific business task.", includes:["Requirements discussion", "Build and agreed review", "Handover guidance"] },
    { id:"database-app", category:"software", name:"Database-backed Web Application", min:400, max:null, summary:"A web application with structured data and workflows.", includes:["Requirements discussion", "Database-backed application", "Testing and agreed review", "Handover guidance"] },
    { id:"management-system", category:"software", name:"Management System", min:null, max:null, summary:"A system to help manage records, people, or day-to-day operations.", includes:["Requirements discussion", "Core management workflows", "Testing and agreed review", "Handover guidance"] },
    { id:"advanced-platform", category:"software", name:"Advanced Custom Platform", min:null, max:null, summary:"A custom quotation follows requirements analysis.", includes:["Requirements analysis", "Written scope and quote before work begins"] },
    { id:"simple-automation", category:"automation", name:"Simple Workflow Automation", min:50, max:100, summary:"Automate a small repetitive workflow.", includes:["Workflow discussion", "One simple automation", "Basic handover"] },
    { id:"forms-sheets", category:"automation", name:"Forms and Spreadsheet Automation", min:75, max:150, summary:"Connect form responses and spreadsheet steps to reduce manual work.", includes:["Form and spreadsheet workflow", "Basic checks", "Handover guidance"] },
    { id:"workflow-integration", category:"automation", name:"Business Workflow Integration", min:150, max:300, summary:"Connect steps across a business workflow.", includes:["Workflow mapping", "Agreed integrations", "Testing and handover"] },
    { id:"advanced-automation", category:"automation", name:"Advanced Automation", min:null, max:null, summary:"A custom quotation follows workflow review.", includes:["Requirements analysis", "Written scope and quote before work begins"] },
    { id:"software-fix", category:"software", name:"Software Fixing", min:null, max:null, summary:"Troubleshooting and repair after the issue and software are reviewed.", includes:["Describe the issue and any error message", "Clear next steps before paid work", "No passwords or private account credentials needed"] },
    { id:"system-support", category:"software", name:"Existing System Support", min:null, max:null, summary:"Discuss support or maintenance for a website or system already in use.", includes:["Review the system and support needs", "A written scope and quote before work begins"] }
  ],
  maintenance: [
    { id:"basic-care", name:"Basic Care", monthly:10, termsPendingOwnerApproval:true, summary:"Work limits, check frequency, response times, exclusions, billing, and cancellation terms must be agreed in writing before service begins." },
    { id:"business-care", name:"Business Care", monthly:20, termsPendingOwnerApproval:true, summary:"Work limits, check frequency, response times, exclusions, billing, and cancellation terms must be agreed in writing before service begins." },
    { id:"priority-care", name:"Priority Care", monthly:35, termsPendingOwnerApproval:true, summary:"Work limits, check frequency, response times, exclusions, billing, and cancellation terms must be agreed in writing before service begins." }
  ],
  providerCosts: {
    domain:{ supplier:null, registrationByTerm:{"1":null,"2":null,"3":null}, renewalAnnual:null, renewalDueAfterTerm:true },
    hosting:{ supplier:null, setupOneTime:null, initialMonthly:null, initialAnnual:null, initialTermMonths:12, renewalMonthly:null, renewalAnnual:null, renewalStartsAfterMonths:12 },
    hostedEmail:{ supplier:null, setupPerMailbox:null, monthlyPerMailbox:null, annualPerMailbox:null, initialTermMonths:12, renewalMonthlyPerMailbox:null, renewalAnnualPerMailbox:null, renewalStartsAfterMonths:12 },
    forwarding:{ supplier:null, setupOneTime:null, initialMonthly:null, initialAnnual:null, initialTermMonths:12, renewalMonthly:null, renewalAnnual:null, renewalStartsAfterMonths:12, isMailbox:false }
  },
  optionalServices: [
    { id:"content", name:"Content writing or entry", price:null, billing:"one-time" },
    { id:"custom-functionality", name:"Additional custom functionality", price:null, billing:"one-time" },
    { id:"extra-revision", name:"Additional revision rounds", price:null, billing:"one-time" },
    { id:"seo", name:"SEO enhancements beyond basic SEO", price:null, billing:"one-time" },
    { id:"analytics", name:"Analytics setup or integrations beyond package inclusions", price:null, billing:"one-time" },
    { id:"payment-integration", name:"Online payment integration", price:null, billing:"one-time" },
    { id:"ssl", name:"SSL if not included with hosting", price:null, billing:"provider dependent" },
    { id:"backups", name:"Additional backups or security services", price:null, billing:"provider dependent" },
    { id:"licences", name:"Premium plugins, software, or licences", price:null, billing:"provider dependent" }
  ],
  paymentTerms:"50% deposit before development begins. Remaining 50% before final handover. Large projects may use milestone-based payments agreed in writing."
};
