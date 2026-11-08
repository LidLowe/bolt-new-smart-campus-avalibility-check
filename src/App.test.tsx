// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '@/App';

afterEach(cleanup);

function selectRoom(name: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
}

function setTimeWindow(start: string, end: string) {
  fireEvent.change(document.getElementById('start-time') as HTMLInputElement, { target: { value: start } });
  fireEvent.change(document.getElementById('end-time') as HTMLInputElement, { target: { value: end } });
}

function setHeadcount(value: string) {
  fireEvent.change(screen.getByLabelText(/Headcount/), { target: { value } });
}

function toggleEquipment(item: string) {
  fireEvent.click(screen.getByRole('button', { name: item }));
}

describe('room availability UI', () => {
  it('F5: switching rooms clears old feedback and the same interval gives the new room result', () => {
    render(<App />);

    selectRoom('B-220');
    setTimeWindow('15:00', '16:00');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('UNAVAILABLE')).toBeTruthy();
    expect(screen.getByText(/overlaps with "Study Group"/)).toBeTruthy();

    selectRoom('A-101');
    expect(screen.queryByText('UNAVAILABLE')).toBeNull();
    expect(screen.queryByText('AVAILABLE')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('AVAILABLE')).toBeTruthy();
    expect(screen.getByText('A-101 is available from 3:00 PM to 4:00 PM.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'A-101 Schedule' })).toBeTruthy();
  });

  it('F2: equipment chips show only rooms containing every selected item', () => {
    render(<App />);

    toggleEquipment('Projector');
    toggleEquipment('Whiteboard');

    expect(screen.getByText('2 of 5 rooms')).toBeTruthy();
    expect(screen.getByRole('button', { name: /A-101/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /C-305/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /B-220/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /D-110/ })).toBeNull();
  });

  it('F4: shows an empty state when no room matches', () => {
    render(<App />);

    setHeadcount('70');

    expect(screen.getByText('No rooms match these filters')).toBeTruthy();
    expect(screen.queryAllByRole('button', { name: /-\d{3}/ })).toHaveLength(0);
  });

  it('F3: a blocked room returns UNAVAILABLE in the UI', () => {
    render(<App />);

    selectRoom('C-305');
    setTimeWindow('09:00', '10:00');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));

    expect(screen.getByText('UNAVAILABLE')).toBeTruthy();
    expect(screen.getByText(/C-305 is currently blocked and cannot be booked/)).toBeTruthy();
  });

  it('F5: a filter that hides the selected room clears the selection and feedback', () => {
    render(<App />);

    selectRoom('D-110');
    setTimeWindow('09:00', '10:00');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('AVAILABLE')).toBeTruthy();

    setHeadcount('20');

    expect(screen.queryByRole('button', { name: /D-110/ })).toBeNull();
    expect(screen.queryByText('AVAILABLE')).toBeNull();
    const checkButton = screen.getByRole('button', { name: 'Check Availability' }) as HTMLButtonElement;
    expect(checkButton.disabled).toBe(true);
    expect(screen.getByText('Select a room to view its existing bookings.')).toBeTruthy();
  });
});
