import { calculateInspection } from './calculator.js';

const menu = document.querySelector('.menu');
const nav = document.querySelector('#primary-navigation');
const form = document.querySelector('#checkForm');
const input = document.querySelector('#manufacture');
const result = document.querySelector('#result');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  menu.textContent = open ? '關閉' : '選單';
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

const current = new Date();
input.max = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;

function appendText(parent, tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  parent.append(node);
  return node;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const outcome = calculateInspection(input.value);
  result.replaceChildren();

  const mark = appendText(result, 'span', outcome.kind === 'error' ? '×' : outcome.kind === 'not-due' ? '✓' : '!', 'result-mark');
  if (outcome.kind === 'error') mark.classList.add('error');
  const content = document.createElement('div');
  appendText(content, 'small', outcome.kind === 'error' ? '輸入有誤' : '試算結果');
  appendText(content, 'h3', outcome.title || '無法試算');
  appendText(content, 'p', outcome.message);

  if (outcome.kind === 'due') {
    const officialLink = appendText(content, 'a', '前往官方系統確認 ↗');
    officialLink.href = 'https://mobile.moenv.gov.tw/Motor/query/Query_Check.aspx';
    officialLink.target = '_blank';
    officialLink.rel = 'noopener noreferrer';
  }

  result.append(content);
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelectorAll('details').forEach((item) => item.addEventListener('toggle', () => {
  if (!item.open) return;
  document.querySelectorAll('details').forEach((other) => { if (other !== item) other.open = false; });
}));
