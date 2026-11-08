export interface Booking {
  id: string;
  room: string;
  start: number; // minutes from midnight
  end: number;
  title: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
}

export type RoomRef = Pick<Room, 'id' | 'name' | 'blocked'>;

export interface CheckResult {
  available: boolean;
  reason: string;
}
