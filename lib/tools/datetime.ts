// Pure logic functions for Date & Time tools. Uses native Date/Intl only.

export function unixToDate(input: string): string {
  const n = Number(input.trim());
  if (!Number.isFinite(n)) throw new Error("Enter a valid Unix timestamp (seconds)");
  const ms = Math.abs(n) > 1e12 ? n : n * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid timestamp");
  return `Local: ${d.toString()}\nUTC: ${d.toUTCString()}\nISO 8601: ${d.toISOString()}`;
}

export function dateToUnix(input: string): string {
  const d = new Date(input.trim());
  if (Number.isNaN(d.getTime())) throw new Error("Enter a valid date/time (e.g. 2026-08-23T13:50:00)");
  return `Seconds: ${Math.floor(d.getTime() / 1000)}\nMilliseconds: ${d.getTime()}`;
}

export function msToUnits(input: string): string {
  const ms = Number(input.trim());
  if (!Number.isFinite(ms)) throw new Error("Enter a valid number of milliseconds");
  const seconds = ms / 1000;
  return [
    `Milliseconds: ${ms}`,
    `Seconds: ${(seconds).toFixed(3)}`,
    `Minutes: ${(seconds / 60).toFixed(4)}`,
    `Hours: ${(seconds / 3600).toFixed(5)}`,
    `Days: ${(seconds / 86400).toFixed(6)}`,
  ].join("\n");
}

export function convertTimezone(input: string, timeZone: string): string {
  const d = new Date(input.trim());
  if (Number.isNaN(d.getTime())) throw new Error("Enter a valid date/time");
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      dateStyle: "full",
      timeStyle: "long",
    }).format(d);
  } catch {
    throw new Error(`Unknown time zone: "${timeZone}"`);
  }
}

export function toIso8601(input: string): string {
  const d = new Date(input.trim());
  if (Number.isNaN(d.getTime())) throw new Error("Enter a valid date/time");
  return d.toISOString();
}

export function dateDifference(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error("Enter valid start and end dates");
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `Total days: ${days}\nTotal hours: ${Math.floor(totalSeconds / 3600)}\nBreakdown: ${days}d ${hours}h ${minutes}m`;
}

export function ageCalculator(birthDateStr: string): string {
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) throw new Error("Enter a valid birth date");
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
  return `${years} years, ${months} months, ${days} days\nTotal days alive: ${totalDays}`;
}

export function workingDaysBetween(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error("Enter valid start and end dates");
  const [from, to] = start <= end ? [start, end] : [end, start];
  let count = 0;
  const cur = new Date(from);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(to);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return `Working days (Mon-Fri): ${count}`;
}

export function weekNumber(input: string): string {
  const d = new Date(input.trim());
  if (Number.isNaN(d.getTime())) throw new Error("Enter a valid date");
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const weekNum = 1 + Math.round(((target.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `ISO week: ${weekNum}, ${target.getUTCFullYear()}`;
}

export function daysInMonth(input: string): string {
  const [yearStr, monthStr] = input.trim().split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Enter as "YYYY-MM", e.g. 2026-02');
  }
  const days = new Date(year, month, 0).getDate();
  return `${yearStr}-${String(month).padStart(2, "0")} has ${days} days`;
}

export function leapYearCheck(input: string): string {
  const year = Number(input.trim());
  if (!Number.isInteger(year)) throw new Error("Enter a valid year");
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return `${year} is ${isLeap ? "a leap year" : "not a leap year"}.`;
}

export function explainCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error("Enter a standard 5-field cron expression: minute hour day month weekday");
  const [minute, hour, dom, month, dow] = parts;
  const describe = (val: string, unit: string) => {
    if (val === "*") return `every ${unit}`;
    if (val.startsWith("*/")) return `every ${val.slice(2)} ${unit}(s)`;
    if (val.includes(",")) return `${unit}s ${val}`;
    if (val.includes("-")) return `${unit}s ${val.replace("-", " through ")}`;
    return `${unit} ${val}`;
  };
  return [
    `Minute: ${describe(minute, "minute")}`,
    `Hour: ${describe(hour, "hour")}`,
    `Day of month: ${describe(dom, "day")}`,
    `Month: ${describe(month, "month")}`,
    `Day of week: ${describe(dow, "weekday")}`,
  ].join("\n");
}

export function relativeTime(input: string): string {
  const target = new Date(input.trim());
  if (Number.isNaN(target.getTime())) throw new Error("Enter a valid date/time");
  const diffSeconds = Math.round((target.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "seconds"], [60, "minutes"], [24, "hours"], [7, "days"], [4.34524, "weeks"], [12, "months"], [Infinity, "years"],
  ];
  let duration = diffSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "seconds";
  for (const [amount, u] of divisions) {
    if (Math.abs(duration) < amount) {
      unit = u;
      break;
    }
    duration /= amount;
    unit = u;
  }
  return rtf.format(Math.round(duration), unit);
}

export function quarterInfo(input: string): string {
  const date = input.trim() ? new Date(input.trim()) : new Date();
  if (Number.isNaN(date.getTime())) throw new Error("Enter a valid date.");
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  const startMonth = (quarter - 1) * 3;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return [
    `Date: ${fmt(date)}`,
    `Quarter: Q${quarter} ${year}`,
    `Quarter start: ${fmt(start)}`,
    `Quarter end: ${fmt(end)}`,
    `Days into quarter: ${Math.floor((date.getTime() - start.getTime()) / 86400000) + 1}`,
    `Days remaining in quarter: ${Math.floor((end.getTime() - date.getTime()) / 86400000)}`,
  ].join("\n");
}

export function currentTimeSnapshot(): string {
  const now = new Date();
  return [
    `Local: ${now.toString()}`,
    `UTC: ${now.toUTCString()}`,
    `ISO 8601: ${now.toISOString()}`,
    `Unix seconds: ${Math.floor(now.getTime() / 1000)}`,
    `Unix ms: ${now.getTime()}`,
  ].join("\n");
}
