export const getLocalDateStr = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getAvailableTimes = (
  targetDate: Date,
  duration: number,
  workingHours: any[],
  blockedTimes: any[],
  appointments: any[],
) => {
  const localStr = getLocalDateStr(targetDate);
  const dayOfWeek = targetDate.getDay();
  const workDay = workingHours.find((w) => w.dayOfWeek === dayOfWeek);
  if (!workDay || !workDay.isActive) return [];

  let [startH, startM] = workDay.startTime.split(":").map(Number);
  const [endH, endM] = workDay.endTime.split(":").map(Number);
  let currentMins = startH * 60 + startM;
  const endMinsTotal = endH * 60 + endM;

  const dayBlocks = blockedTimes.filter(
    (b) => b.date === localStr && !b.allDay,
  );
  const dayAppointments = appointments.filter(
    (a) => a.date === localStr && a.status !== "CANCELLED",
  );

  const slots: string[] = [];
  while (currentMins + duration <= endMinsTotal) {
    const slotStart = currentMins;
    const slotEnd = currentMins + duration;

    const overlapsAppt = dayAppointments.some((app) => {
      const [aStartH, aStartM] = app.startTime.split(":").map(Number);
      const [aEndH, aEndM] = app.endTime.split(":").map(Number);
      return slotStart < aEndH * 60 + aEndM && slotEnd > aStartH * 60 + aStartM;
    });

    const overlapsBlock = dayBlocks.some((b) => {
      if (!b.startTime || !b.endTime) return false;
      const [bStartH, bStartM] = b.startTime.split(":").map(Number);
      const [bEndH, bEndM] = b.endTime.split(":").map(Number);
      return slotStart < bEndH * 60 + bEndM && slotEnd > bStartH * 60 + bStartM;
    });

    // Avoid booking in the past for today
    const currentRealMins =
      new Date().getHours() * 60 + new Date().getMinutes();
    const isToday = getLocalDateStr(targetDate) === getLocalDateStr(new Date());
    const isInPast = isToday && slotStart <= currentRealMins;

    if (!overlapsAppt && !overlapsBlock && !isInPast) {
      const h = Math.floor(slotStart / 60);
      const m = slotStart % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }

    currentMins += 30; // 30 mins step
  }

  return slots;
};

export const isDayAvailable = (
  d: Date,
  workingHours: any[],
  blockedTimes: any[],
  appointments: any[],
  duration?: number,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const testDate = new Date(d);
  testDate.setHours(0, 0, 0, 0);

  // Zabezpieczenie przed przeszłością
  if (testDate < today) return false;

  const localStr = getLocalDateStr(d);
  const dayOfWeek = d.getDay();
  const workDay = workingHours.find((w) => w.dayOfWeek === dayOfWeek);
  if (!workDay || !workDay.isActive) return false;

  const dayBlocks = blockedTimes.filter((b) => b.date === localStr);
  if (dayBlocks.some((b) => b.allDay)) return false;

  if (duration) {
    const times = getAvailableTimes(
      d,
      duration,
      workingHours,
      blockedTimes,
      appointments,
    );
    if (times.length === 0) return false;
  }
  return true;
};
