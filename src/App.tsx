import { useState, useMemo } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DoorOpen,
  Lock,
  CalendarClock,
} from 'lucide-react';
import {
  checkAvailability,
  minutesToLabel,
  type Booking,
  type CheckResult,
  type Room,
} from '@/lib/availability';

// ---------- Sample data ----------

const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'A-101', building: 'Engineering Block', capacity: 40, blocked: false },
  { id: 'r2', name: 'B-220', building: 'Science Block', capacity: 25, blocked: false },
  { id: 'r3', name: 'C-305', building: 'Business Block', capacity: 60, blocked: true },
  { id: 'r4', name: 'D-110', building: 'Library Wing', capacity: 15, blocked: false },
  { id: 'r5', name: 'E-402', building: 'Arts Center', capacity: 30, blocked: false },
];

const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', room: 'r1', start: 600, end: 660, title: 'Intro to Algorithms' },
  { id: 'b2', room: 'r1', start: 780, end: 840, title: 'Faculty Meeting' },
  { id: 'b3', room: 'r2', start: 600, end: 660, title: 'Physics Lab' },
  { id: 'b4', room: 'r2', start: 900, end: 960, title: 'Study Group' },
  { id: 'b5', room: 'r4', start: 480, end: 540, title: 'Reading Session' },
  { id: 'b6', room: 'r5', start: 720, end: 780, title: 'Painting Workshop' },
];

// ---------- Component ----------

function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [bookings] = useState<Booking[]>(SAMPLE_BOOKINGS);

  const [roomId, setRoomId] = useState<string>('');
  const [startStr, setStartStr] = useState<string>('');
  const [endStr, setEndStr] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(480); // 8:00 AM default
  const [result, setResult] = useState<CheckResult | null>(null);

  // Convert HH:MM input to minutes
  const timeToMinutes = (s: string): number | null => {
    if (!s) return null;
    const [h, m] = s.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const minutesToTimeInput = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const roomBookings = useMemo(
    () => bookings.filter((b) => b.room === roomId).sort((a, b) => a.start - b.start),
    [bookings, roomId],
  );

  const handleCheck = () => {
    const start = timeToMinutes(startStr);
    const end = timeToMinutes(endStr);

    if (start === null || end === null) {
      setResult({ available: false, reason: 'Please enter valid start and end times.' });
      return;
    }

    setResult(checkAvailability(roomId, start, end, currentTime, rooms, bookings));
  };

  const handleReset = () => {
    setRoomId('');
    setStartStr('');
    setEndStr('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <div className="bg-teal-600 rounded-xl p-2.5 text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">Check if a campus room is free for your time slot</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-teal-600" />
                Check Room Availability
              </h2>

              {/* Current time */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-slate-400" />
                  Current Time
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={minutesToTimeInput(currentTime)}
                    onChange={(e) => {
                      const v = timeToMinutes(e.target.value);
                      if (v !== null) setCurrentTime(v);
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition w-40"
                  />
                  <span className="text-xs text-slate-400">
                    Bookings must start after this time
                  </span>
                </div>
              </div>

              {/* Room selection */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Room</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rooms.map((room) => {
                    const isSelected = roomId === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setRoomId(room.id)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-200'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-sm">{room.name}</span>
                          {room.blocked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Open
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {room.building} · Cap {room.capacity}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startStr}
                    onChange={(e) => setStartStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endStr}
                    onChange={(e) => setEndStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCheck}
                  disabled={!roomId || !startStr || !endStr}
                  className="flex-1 bg-teal-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Check Availability
                </button>
                <button
                  onClick={handleReset}
                  className="sm:w-auto w-full border border-slate-300 text-slate-600 font-medium py-2.5 px-5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Result */}
              {result && (
                <div
                  className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 transition-opacity duration-200 ${
                    result.available
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {result.available ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-bold text-sm ${
                        result.available ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {result.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </p>
                    <p
                      className={`text-sm mt-0.5 ${
                        result.available ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {result.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Constraints info */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 space-y-0.5">
                <p>· Bookings are limited to 120 minutes maximum.</p>
                <p>· Start time must be after the current time and before end time.</p>
                <p>· Touching endpoints are allowed (e.g. 10:00–11:00 and 11:00–12:00).</p>
                <p>· Blocked rooms cannot be booked.</p>
              </div>
            </div>
          </div>

          {/* Sidebar: room schedule */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 sticky top-6">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-teal-600" />
                {selectedRoom ? `${selectedRoom.name} Schedule` : 'Room Schedule'}
              </h2>

              {!selectedRoom ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Select a room to view its existing bookings.
                </p>
              ) : roomBookings.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No existing bookings for this room.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {roomBookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="w-1.5 h-10 rounded-full bg-teal-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{b.title}</p>
                        <p className="text-xs text-slate-500">
                          {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedRoom && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Building</span>
                    <span className="font-medium text-slate-700">{selectedRoom.building}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-slate-500">Capacity</span>
                    <span className="font-medium text-slate-700">{selectedRoom.capacity} seats</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`font-medium ${
                        selectedRoom.blocked ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {selectedRoom.blocked ? 'Blocked' : 'Open'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400">
          Smart Campus Room Availability Checker · Fictional sample data
        </div>
      </footer>
    </div>
  );
}

export default App;
