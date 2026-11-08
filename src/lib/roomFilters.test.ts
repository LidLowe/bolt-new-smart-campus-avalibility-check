import { describe, expect, it } from 'vitest';
import { ROOMS } from '@/data/campusData';
import { filterRooms } from './roomFilters';

const names = (rooms: { name: string }[]) => rooms.map((r) => r.name);

describe('filterRooms', () => {
  it('F1: includes a room whose capacity exactly matches the headcount', () => {
    expect(names(filterRooms(ROOMS, { headcount: 40, equipment: [] }))).toContain('A-101');
  });

  it('F1: excludes a room whose capacity is one seat short of the headcount', () => {
    expect(names(filterRooms(ROOMS, { headcount: 41, equipment: [] }))).not.toContain('A-101');
  });

  it('F1: with no headcount, every room matches', () => {
    expect(filterRooms(ROOMS, { headcount: null, equipment: [] })).toHaveLength(ROOMS.length);
  });

  it('F2: requires every selected equipment item', () => {
    const result = names(filterRooms(ROOMS, { headcount: null, equipment: ['Projector', 'Whiteboard'] }));
    expect(result).toEqual(['A-101', 'C-305']);
  });

  it('F2: a single selected item matches every room that has it', () => {
    const result = names(filterRooms(ROOMS, { headcount: null, equipment: ['Projector'] }));
    expect(result).toEqual(['A-101', 'B-220', 'C-305']);
  });

  it('F4: returns an empty list when no room satisfies the filters', () => {
    expect(filterRooms(ROOMS, { headcount: 70, equipment: [] })).toEqual([]);
    expect(filterRooms(ROOMS, { headcount: null, equipment: ['Lab Benches', 'Video Conferencing'] })).toEqual([]);
  });

  it('combines capacity and equipment with AND', () => {
    const result = names(filterRooms(ROOMS, { headcount: 30, equipment: ['Projector', 'Whiteboard'] }));
    expect(result).toEqual(['A-101', 'C-305']);
  });
});
