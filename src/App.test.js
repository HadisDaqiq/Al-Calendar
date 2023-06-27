import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

test('renders the FullCalendar component', () => {
  render(<App />);

  const calendarElement = screen.getByRole('grid');
  expect(calendarElement).toBeInTheDocument();

  const prevButton = screen.getByTitle('Previous week');
  expect(prevButton).toBeInTheDocument();

});
