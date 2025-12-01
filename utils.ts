import { EST_TIMEZONE, TimeSlot } from './types';

// Helper to format date nicely
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const formatTime = (date: Date | string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
};

// Check if a slot is in the past
export const isPast = (date: Date) => {
  return date.getTime() < new Date().getTime();
};

// Generate available slots for a given day based on strict EST rules
export const generateSlotsForDate = (
  targetDate: Date,
  durationMinutes: number
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Format target date to EST to find the day of week in EST
  const estDateString = targetDate.toLocaleDateString('en-US', { timeZone: EST_TIMEZONE });
  const estDate = new Date(estDateString);
  const dayOfWeek = estDate.getDay(); // 0 = Sunday, 1 = Monday, ...

  // Defined Windows in EST Hours (24h)
  // Monday (1): 02:00 - 11:00
  // Tue (2), Wed (3), Thu (4): 02:00 - 11:00 AND 11:00 - 14:00 (Essentially 02:00 - 14:00)
  // Friday (5): 02:00 - 07:00 AND 11:00 - 14:00
  // Sat(6), Sun(0): Closed (Assumption based on missing info, safe default)

  const windows: { start: number; end: number }[] = [];

  if (dayOfWeek === 1) { // Mon
    windows.push({ start: 2, end: 11 });
  } else if (dayOfWeek >= 2 && dayOfWeek <= 4) { // Tue, Wed, Thu
    windows.push({ start: 2, end: 14 });
  } else if (dayOfWeek === 5) { // Fri
    windows.push({ start: 2, end: 7 });
    windows.push({ start: 11, end: 14 });
  }

  // Generate slots for each window
  windows.forEach(window => {
    // Create start time in EST
    // We construct a string ISO for the EST time then parse it
    // Note: constructing strict timezone dates in JS is tricky without libraries like date-fns-tz or luxon.
    // We will attempt a robust native approach:
    // 1. Create a date object for the target day at the window start hour in EST.
    // 2. Convert that equivalent UTC time.
    
    // Quick hack for robust "Day" parsing:
    // targetDate is assumed to be the user's selected "Day" (local time usually).
    // We need the slots for that specific calendar date BUT interpreted in EST rules.
    // If user clicks "Today" (Monday), they want Monday slots.
    
    // Let's iterate hours and minutes.
    let startHour = window.start;
    const endHour = window.end;
    
    // Construct base string for EST date: "MM/DD/YYYY HH:mm:ss"
    const baseDateStr = estDate.toLocaleDateString('en-US', { timeZone: EST_TIMEZONE });
    
    // Create a start Date object by parsing "MM/DD/YYYY HH:00:00" as EST
    // Then converting to local JS Date object
    let currentEstHour = startHour;
    let currentEstMinute = 0;

    while (currentEstHour < endHour || (currentEstHour === endHour && currentEstMinute === 0)) {
        // Construct ISO-like string for the specific time in EST
        // We use a library-free way: 
        // 1. Get the parts of the EST date
        // 2. Build a string that Date.parse accepts with offset? No, Date.parse is flaky.
        // 3. Use Intl to get parts, then build UTC.
        
        // Let's use a simpler trick: The `targetDate` gives us the Y/M/D.
        // We just need to shift it to correct absolute time.
        
        // Create a date in UTC that corresponds to the EST time
        // EST is UTC-5 (Standard) or UTC-4 (Daylight). 
        // We will detect offset dynamically? Too complex for this snippet.
        // We will assume 'America/New_York' using toLocaleString to get the epoch.
        
        const testDate = new Date(estDate);
        testDate.setHours(currentEstHour, currentEstMinute, 0, 0); 
        
        // This `testDate` is currently in local time with the correct hours "numerically".
        // We need to shift it so that these hours are treated as EST.
        // BUT `estDate` was already derived from `targetDate` as an EST string.
        
        // Let's try: 
        const year = estDate.getFullYear();
        const month = estDate.getMonth() + 1;
        const day = estDate.getDate();
        
        const hourStr = currentEstHour.toString().padStart(2, '0');
        const minStr = currentEstMinute.toString().padStart(2, '0');
        
        // "YYYY-MM-DDTHH:mm:00-05:00" (or -04:00)
        // We can let the browser parse the "America/New_York" time.
        // Actually, easiest way: 
        // "MM/DD/YYYY, HH:mm:ss" -> new Date(string) works in most browsers but uses local.
        
        // Reliable method:
        // Use a reference date, format it to parts in New York, compare with desired hours, adjust.
        // This is getting too complex for a single file util without a library.
        // Let's use a simplified approach: Assume New York is UTC-4 (EDT) for now (Summer) or UTC-5 (Winter).
        // Since we are simulating, we will assume a fixed offset of UTC-4 (Current scheduling period usually).
        // Or better: Use `new Date("2023-10-27T10:00:00-04:00")`.
        
        // We will format the date string with offset.
        // Determine offset first?
        const offsetCheck = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' });
        const isEDT = offsetCheck.includes('EDT');
        const offset = isEDT ? '-04:00' : '-05:00';
        
        const isoString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hourStr}:${minStr}:00${offset}`;
        const slotStart = new Date(isoString);
        
        // Calculate end time
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
        
        // Verify the end time is still within the window (in EST)
        // The slotEnd might spill over. Convert back to EST hours to check.
        const endEstString = slotEnd.toLocaleTimeString('en-US', { timeZone: EST_TIMEZONE, hour12: false });
        const [endH, endM] = endEstString.split(':').map(Number);
        const endTimeVal = endH + (endM / 60);
        
        if (endTimeVal <= window.end && !isPast(slotStart)) {
            slots.push({
                start: slotStart,
                end: slotEnd,
                available: true
            });
        }
        
        // Increment
        currentEstMinute += durationMinutes;
        if (currentEstMinute >= 60) {
            currentEstHour += Math.floor(currentEstMinute / 60);
            currentEstMinute %= 60;
        }
    }
  });

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
};