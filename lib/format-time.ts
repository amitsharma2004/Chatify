export function formatMessageTime(timestamp: number): string {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  const isToday = 
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();
  
  const isThisYear = messageDate.getFullYear() === now.getFullYear();
  
  const timeString = messageDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  if (isToday) {
    return timeString;
  }
  
  const dateString = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  if (isThisYear) {
    return `${dateString}, ${timeString}`;
  }
  
  const dateWithYear = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  return `${dateWithYear}, ${timeString}`;
}
