export const truncateText = (text: string) => {
  return text.length >= 9 ? `${text.slice(0, 8)}...` : text;
};
