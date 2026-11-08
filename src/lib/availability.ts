import type { Booking, CheckResult, RoomRef } from '@/lib/types';

export const DAY_END_MINUTES = 1440;
export const MAX_BOOKING_MINUTES = 120;

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  // Touching endpoints are allowed, so strict inequality
  return aStart < bEnd && bStart < aEnd;
}

export function bookingsForRoom(bookings: Booking[], roomId: string): Booking[] {
  return bookings.filter((b) => b.room === roomId);
}

export function checkAvailability(
  roomId: string,
  start: number,
  end: number,
  currentTime: number,
  rooms: RoomRef[],
  bookings: Booking[],
): CheckResult {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return { available: false, reason: 'Please select a room.' };

  // AC1: valid interval — 0 <= start < end <= 1440, and start must be after current time
  if (start < 0 || end > DAY_END_MINUTES || start >= end) {
    return { available: false, reason: `[AC1] Invalid interval: start must be earlier than end, and both must be within 00:00–24:00. You entered ${minutesToLabel(start)} – ${minutesToLabel(end)}.` };
  }
  if (start <= currentTime) {
    return { available: false, reason: `[AC1] Start time must be after the current time (${minutesToLabel(currentTime)}). You entered ${minutesToLabel(start)}.` };
  }

  // AC2: max 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) {
    return { available: false, reason: `[AC2] Booking exceeds the 120-minute limit. Your interval is ${end - start} minutes (${minutesToLabel(start)} – ${minutesToLabel(end)}).` };
  }

  // AC3: room blocked
  if (room.blocked) {
    return { available: false, reason: `[AC3] ${room.name} is currently blocked and cannot be booked.` };
  }

  // AC4: overlap check (touching endpoints allowed)
  for (const b of bookingsForRoom(bookings, roomId)) {
    if (overlap(start, end, b.start, b.end)) {
      return {
        available: false,
        reason: `[AC4] Your interval (${minutesToLabel(start)} – ${minutesToLabel(end)}) overlaps with "${b.title}" (${minutesToLabel(b.start)} – ${minutesToLabel(b.end)}). Touching endpoints are allowed.`,
      };
    }
  }

  return { available: true, reason: `${room.name} is available from ${minutesToLabel(start)} to ${minutesToLabel(end)}.` };
}
