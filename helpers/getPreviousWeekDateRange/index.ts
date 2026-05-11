import type { DateRange } from "../../types";

export const getPreviousWeekRange = (): DateRange => {
  const now = new Date();
  const currentDay = now.getDay();
  const daysSinceMonday = (currentDay + 6) % 7;

  const currentWeekMonday = new Date(now);
  currentWeekMonday.setHours(0, 0, 0, 0);
  currentWeekMonday.setDate(now.getDate() - daysSinceMonday);

  const start = new Date(currentWeekMonday);
  start.setDate(currentWeekMonday.getDate() - 7);

  const end = new Date(currentWeekMonday);
  end.setMilliseconds(-1);

  return { start, end };
};
