const MIN_YEAR = 1990;

function monthIndex(year, month) {
  return year * 12 + month - 1;
}

function monthFromIndex(index) {
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function formatYearMonth({ year, month }) {
  return `${year} 年 ${month} 月`;
}

export function calculateInspection(value, today = new Date()) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  if (!match) return { kind: 'error', title: '日期格式不正確', message: '請輸入有效的出廠年月。' };

  const year = Number(match[1]);
  const month = Number(match[2]);
  const current = { year: today.getFullYear(), month: today.getMonth() + 1 };
  const manufacturedAt = monthIndex(year, month);
  const currentAt = monthIndex(current.year, current.month);

  if (year < MIN_YEAR) return { kind: 'error', title: '日期超出合理範圍', message: `請輸入 ${MIN_YEAR} 年以後的出廠年月。` };
  if (manufacturedAt > currentAt) return { kind: 'error', title: '日期晚於現在', message: '出廠年月不可晚於目前年月。' };

  const firstDueAt = manufacturedAt + 60;
  if (currentAt < firstDueAt) {
    const firstDue = monthFromIndex(firstDueAt);
    return {
      kind: 'not-due',
      title: '目前尚未滿 5 年',
      message: `這台機車約於 ${formatYearMonth(firstDue)} 滿 5 年，屆時請依官方通知辦理。`,
    };
  }

  const inspectionMonth = { year: current.year, month };
  const centerAt = monthIndex(inspectionMonth.year, inspectionMonth.month);
  const start = monthFromIndex(centerAt - 1);
  const end = monthFromIndex(centerAt + 1);
  const timing = currentAt < centerAt - 1 ? 'upcoming' : currentAt > centerAt + 1 ? 'past' : 'open';
  const titles = {
    upcoming: '今年的定檢期間尚未開始',
    open: '目前在建議定檢期間內',
    past: '今年的建議定檢期間已過',
  };

  return {
    kind: 'due',
    timing,
    title: titles[timing],
    message: `今年建議檢驗期間為 ${formatYearMonth(start)}至 ${formatYearMonth(end)}。`,
  };
}
