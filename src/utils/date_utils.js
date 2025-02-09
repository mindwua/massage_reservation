export function formatDate(isoDateStr) {
  try {

    if (!isoDateStr || isoDateStr === null) {
      throw new Error("Invalid ISO date format");
    }

    
    const date = new Date(isoDateStr);

    if (isNaN(date)) {
        throw new Error("Invalid ISO date format");
    }
  
    // Extract day, month, year, hour, and minute **without timezone conversion**
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getUTCFullYear();
    const hour = String(date.getUTCHours()).padStart(2, "0"); // Keep the same hour value
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
  
    return `${day}-${month}-${year} ${hour}:${minute}`;
  } catch (e) {
    throw new Error("Invalid ISO date format");
  }
}

