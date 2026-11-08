import type { Booking, Room } from '@/lib/types';

export const FICTIONAL_NOW = 480; // 08:00, fixed for this demo

export const EQUIPMENT_OPTIONS = ['Projector', 'Whiteboard', 'Video Conferencing', 'Lab Benches'];

export const ROOMS: Room[] = [
  { id: 'r1', name: 'A-101', building: 'Engineering Block', capacity: 40, equipment: ['Projector', 'Whiteboard'], blocked: false },
  { id: 'r2', name: 'B-220', building: 'Science Block', capacity: 25, equipment: ['Projector', 'Lab Benches'], blocked: false },
  { id: 'r3', name: 'C-305', building: 'Business Block', capacity: 60, equipment: ['Projector', 'Whiteboard', 'Video Conferencing'], blocked: true },
  { id: 'r4', name: 'D-110', building: 'Library Wing', capacity: 15, equipment: ['Whiteboard'], blocked: false },
  { id: 'r5', name: 'E-402', building: 'Arts Center', capacity: 30, equipment: ['Video Conferencing'], blocked: false },
];

export const BOOKINGS: Booking[] = [
  { id: 'b1', room: 'r1', start: 600, end: 660, title: 'Intro to Algorithms' },
  { id: 'b2', room: 'r1', start: 780, end: 840, title: 'Faculty Meeting' },
  { id: 'b3', room: 'r2', start: 600, end: 660, title: 'Physics Lab' },
  { id: 'b4', room: 'r2', start: 900, end: 960, title: 'Study Group' },
  { id: 'b5', room: 'r4', start: 480, end: 540, title: 'Reading Session' },
  { id: 'b6', room: 'r5', start: 720, end: 780, title: 'Painting Workshop' },
];
