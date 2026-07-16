const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '關閉' : '選單';
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = '選單';
}));

const form = document.querySelector('#checkForm');
const result = document.querySelector('#result');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.querySelector('#manufacture').value;
  if (!value) return;
  const [year, month] = value.split('-').map(Number);
  const now = new Date();
  const age = now.getFullYear() - year - (now.getMonth() + 1 < month ? 1 : 0);
  const rocYear = year - 1911;
  if (age < 5) {
    result.innerHTML = `<span class="result-mark">✓</span><div><small>試算結果</small><h3>目前尚未滿 5 年</h3><p>這台機車約於民國 ${rocYear + 5} 年 ${month} 月滿 5 年，屆時請依官方通知辦理。</p></div>`;
  } else {
    const prev = month === 1 ? 12 : month - 1;
    const next = month === 12 ? 1 : month + 1;
    result.innerHTML = `<span class="result-mark">!</span><div><small>試算結果</small><h3>今年需辦理排氣定檢</h3><p>建議檢驗期間為 ${prev} 月至 ${next} 月（以出廠月 ${month} 月前後 1 個月估算）。</p><a href="https://www.motorim.org.tw/query/Query_Check.aspx" target="_blank" rel="noopener">前往官方系統確認 ↗</a></div>`;
  }
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelectorAll('details').forEach((item) => item.addEventListener('toggle', () => {
  if (!item.open) return;
  document.querySelectorAll('details').forEach((other) => { if (other !== item) other.open = false; });
}));
