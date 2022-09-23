/**
 * 날짜를 YYYY.MM.DD 형식으로 포매팅 합니다.
 * @param {number} date - Date.now() 의 반환값
 * @returns string
 */
export function formatDate(date: number) {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();

  return `${year}.${month + 1}.${day}`;
}
