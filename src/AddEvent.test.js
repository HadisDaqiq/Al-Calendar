import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddEvent from './AddEvent';
import { askModelForDslMeeting } from './lib/gpt';

jest.mock('./lib/gpt', () => ({
  askModelForDslMeeting: jest.fn(),
}));

describe('AddEvent', () => {
  const mockAddEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add an event when user input is provided', async () => {
    const mockResponse = {
      TITLE: "Planning Meeting",
      ATTENDEES: "Adept",
      START_TIME: new Date("2022-12-10T09:00:00"),
      DURATION: 60,
      VIDEO: "NONE"
    };

    askModelForDslMeeting.mockResolvedValue(mockResponse);

    const { getByPlaceholderText } = render(<AddEvent addEvent={mockAddEvent} />);
    const inputTextarea = getByPlaceholderText('Type your message here');
    expect(inputTextarea).toBeInTheDocument();

    const testInput = 'Create a 1 hour long meeting at 9am tomorrow for me to plan.';

    fireEvent.change(inputTextarea, { target: { value: testInput } });
    fireEvent.keyDown(inputTextarea, { key: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalledTimes(1);
      expect(mockAddEvent.mock.calls[0][0]).toEqual(mockResponse);
    });
  });
});
