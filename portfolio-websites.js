(() => {
  const output = document.querySelector('[data-portfolio-price]');
  const prices = window.DAVKAYS_PRICING;
  const item = prices?.catalog?.find((entry) => entry.id === 'personal-portfolio');
  if (!output) return;
  if (!prices || !item) { output.textContent = 'Request a quote'; return; }
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: prices.currency, maximumFractionDigits: 2 });
  if (item.min == null) output.textContent = 'Custom quotation';
  else if (item.max == null) output.textContent = 'From ' + format.format(item.min);
  else if (item.min === item.max) output.textContent = format.format(item.min);
  else output.textContent = format.format(item.min) + '–' + format.format(item.max);
})();
