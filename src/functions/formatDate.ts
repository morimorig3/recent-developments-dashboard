/**
 * ISO 8601形式の日付文字列をYYYY/MM/DD形式に変換する
 * @param dateString ISO 8601形式の日付文字列 (例: 2025-04-11T10:00:01.283+09:00)
 * @returns YYYY/MM/DD形式の日付文字列 (例: 2025/04/11)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};
