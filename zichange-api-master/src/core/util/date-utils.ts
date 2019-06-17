export function getMidnight(date?: Date): Date {
  const midnight = date || new Date();

  midnight.setMilliseconds(0);
  midnight.setSeconds(0);
  midnight.setMinutes(0);
  midnight.setHours(0);

  return midnight;
}