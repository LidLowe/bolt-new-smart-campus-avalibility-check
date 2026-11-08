import { describe, expect, it } from 'vitest';
import { BOOKINGS, FICTIONAL_NOW, ROOMS } from '@/data/campusData';
import { checkAvailability } from '@/lib/availability';
import { filterRooms } from '@/lib/roomFilters';

describe('campus fixtures', () => {
  it('F3: a blocked room stays listed by filters but is never reported available', () => {
    const listed = filterRooms(ROOMS, { headcount: 60, equipment: [] }).map((r) => r.id);
    expect(listed).toContain('r3');

    for (const [start, end] of [[540, 600], [600, 660], [1000, 1060]]) {
      const result = checkAvailability('r3', start, end, FICTIONAL_NOW, ROOMS, BOOKINGS);
      expect(result.available).toBe(false);
      expect(result.reason).toContain('[AC3]');
    }
  });

  it('keeps room and booking fixtures unchanged after availability checks and filtering', () => {
    const roomsBefore = structuredClone(ROOMS);
    const bookingsBefore = structuredClone(BOOKINGS);

    for (const room of ROOMS) {
      for (const [start, end] of [[540, 600], [600, 660], [900, 1020], [1000, 1080]]) {
        checkAvailability(room.id, start, end, FICTIONAL_NOW, ROOMS, BOOKINGS);
      }
    }
    filterRooms(ROOMS, { headcount: 20, equipment: ['Projector'] });

    expect(ROOMS).toEqual(roomsBefore);
    expect(BOOKINGS).toEqual(bookingsBefore);
  });

  it('gives every room an ID, equipment list, and bookings that reference real rooms', () => {
    const roomIds = new Set(ROOMS.map((r) => r.id));
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    for (const room of ROOMS) {
      expect(room.id).toBeTruthy();
      expect(Array.isArray(room.equipment)).toBe(true);
    }
    for (const booking of BOOKINGS) {
      expect(roomIds.has(booking.room)).toBe(true);
    }
  });
});
