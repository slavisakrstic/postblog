export const truncateString = (text: string) => {
  if (text && text.length < 500) {
    return text;
  }
  
  return text ? `${text.slice(0, 500)}...` : "";
}