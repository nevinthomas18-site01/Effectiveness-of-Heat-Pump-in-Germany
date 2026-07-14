const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const seasonData = {
  winter: { source: '8–12°C ground', output: '35–55°C water', copy: 'The basket loop absorbs low-grade heat. The compressor lifts it to a useful temperature for radiators or surface heating.' },
  summer: { source: '18–26°C rooms', output: 'Cool ground sink', copy: 'The direction reverses: heat leaves the building and enters the ground. Passive cooling may be possible where system design and condensation control permit.' }
};
document.querySelectorAll('.process-tabs button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.process-tabs button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-selected', 'true');
  const data = seasonData[button.dataset.season];
  document.querySelector('#source-temp').textContent = data.source;
  document.querySelector('#output-temp').textContent = data.output;
  document.querySelector('#season-copy').textContent = data.copy;
  document.querySelector('#flow-diagram').classList.toggle('summer-mode', button.dataset.season === 'summer');
}));

const inputs = ['heat','flow','area','rain'].map(id => document.querySelector('#' + id));
const formatters = {
  heat: v => Number(v).toLocaleString('en-US') + ' kWh/yr', flow: v => v + '°C',
  area: v => v + ' m²', rain: v => v + ' m³/yr'
};
function calculate() {
  const [heat, flow, area, rain] = inputs.map(i => +i.value);
  inputs.forEach(i => document.querySelector('#' + i.id + 'Out').textContent = formatters[i.id](i.value));
  let score = 68;
  score -= Math.max(0, (heat - 20000) / 1200);
  score -= Math.max(0, flow - 45) * 1.2;
  score += Math.min(14, area / 18);
  score += Math.min(7, rain / 20);
  score = Math.max(18, Math.min(91, Math.round(score)));
  let title, copy;
  if (score >= 72) { title = 'Strong study candidate'; copy = 'Proceed to measured heat-load, site and infiltration tests. The score does not determine basket quantity or heat-pump capacity.'; }
  else if (score >= 52) { title = 'Promising—with validation'; copy = 'Prioritise a ground survey and verify the cold-day flow temperature. Basket count and spacing require a dynamic ground model.'; }
  else { title = 'Constraints need work'; copy = 'Reduce building demand or flow temperature, then compare baskets with boreholes, air-source or a hybrid system before excavation.'; }
  document.querySelector('#resultTitle').textContent = title;
  document.querySelector('#resultScore').innerHTML = score + '<small>/100</small>';
  document.querySelector('#resultCopy').textContent = copy;
}
inputs.forEach(i => i.addEventListener('input', calculate));
calculate();
