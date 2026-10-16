export const truncateText = (text: string) => {
  const width = window.innerWidth;
  if (width < 600) {
    return text.length > 4 ? `${text.slice(0, 3)}...` : text;
  }
  if (width < 700) {
    return text.length >= 6 ? `${text.slice(0, 5)}...` : text;
  }
  return text.length >= 9 ? `${text.slice(0, 8)}...` : text;
};
