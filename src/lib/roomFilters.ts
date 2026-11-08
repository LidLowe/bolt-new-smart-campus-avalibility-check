import type { Room } from '@/lib/types';

export interface RoomFilters {
  headcount: number | null;
  equipment: string[];
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  return rooms.filter(
    (room) =>
      (filters.headcount === null || room.capacity >= filters.headcount) &&
      filters.equipment.every((item) => room.equipment.includes(item)),
  );
}
