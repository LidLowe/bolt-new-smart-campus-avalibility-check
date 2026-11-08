import { describe, expect, it } from 'vitest';
import { checkAvailability, type Booking, type Room } from './availability';

const rooms: Room[] = [
  { id: 'open', name: 'A-101', building: 'Engineering Block', capacity: 40, blocked: false },
  { id: 'blocked', name: 'C-305', building: 'Business Block', capacity: 60, blocked: true },
  { id: 'other', name: 'E-402', building: 'Arts Center', capacity: 30, blocked: false },
];

const bookings: Booking[] = [
  { id: 'b1', room: 'open', start: 600, end: 660, title: 'Intro to Algorithms' },
  { id: 'b2', room: 'other', start: 720, end: 780, title: 'Painting Workshop' },
];

const CURRENT_TIME = 480; // 8:00 AM

function check(roomId: string, start: number, end: number) {
  return checkAvailability(roomId, start, end, CURRENT_TIME, rooms, bookings);
}

describe('checkAvailability', () => {
  it('rejects a request whose start is not after the current time', () => {
    const result = check('other', 450, 510);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC1] Start time must be after the current time');
  });

  it('rejects a start exactly at the current time', () => {
    const result = check('other', CURRENT_TIME, 540);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC1]');
  });

  it('rejects a reversed interval', () => {
    const result = check('other', 660, 600);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC1] Invalid interval');
  });

  it('rejects an interval with equal start and end', () => {
    const result = check('other', 600, 600);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC1] Invalid interval');
  });

  it('rejects a 121-minute request', () => {
    const result = check('other', 540, 661);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC2]');
    expect(result.reason).toContain('121 minutes');
  });

  it('accepts a 120-minute request', () => {
    const result = check('other', 540, 660);
    expect(result.available).toBe(true);
    expect(result.reason).toBe('E-402 is available from 9:00 AM to 11:00 AM.');
  });

  it('rejects a blocked room', () => {
    const result = check('blocked', 540, 600);
    expect(result.available).toBe(false);
    expect(result.reason).toBe('[AC3] C-305 is currently blocked and cannot be booked.');
  });

  it('rejects an interval that overlaps an existing booking', () => {
    const result = check('open', 620, 680);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('[AC4]');
    expect(result.reason).toContain('"Intro to Algorithms"');
  });

  it('allows an interval that ends exactly when a booking starts', () => {
    const result = check('open', 540, 600);
    expect(result.available).toBe(true);
  });

  it('allows an interval that starts exactly when a booking ends', () => {
    const result = check('open', 660, 720);
    expect(result.available).toBe(true);
  });

  it('does not modify rooms or bookings', () => {
    const roomsBefore = structuredClone(rooms);
    const bookingsBefore = structuredClone(bookings);

    check('open', 620, 680);
    check('other', 540, 660);
    check('blocked', 540, 600);

    expect(rooms).toEqual(roomsBefore);
    expect(bookings).toEqual(bookingsBefore);
  });
});
