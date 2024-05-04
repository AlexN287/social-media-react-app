export const formatDateOrTime = (dateTimeString) => {
    const messageDate = new Date(dateTimeString);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset current date to midnight for comparison
  
    if (dateTimeString === null) {
      return dateTimeString;
    }
  
    if (messageDate >= currentDate) {
      // If the message was sent today, return the time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // If the message was sent on a previous date, return the date
      return messageDate.toLocaleDateString();
    }
  };