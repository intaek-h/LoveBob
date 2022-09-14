export function formatDate(date: number) {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();

  return `${year}.${month + 1}.${day}`;
}
