import React, { useState, useEffect } from 'react';
import './App.css';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import AddEvent from './AddEvent';
import EventDetail from './EventDetail';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const App = () => {
  const [isEventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localizer, setLocalizer] = useState(null);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [events, setEvents] = useState([
    {
      ID: 1,
      TITLE: 'Product Launch',
      ATTENDEES: 'Adept, Elaine, Fatima',
      START_TIME: new Date('2023-06-28T10:30:00Z'),
      DURATION: 45,
      VIDEO: 'ZOOM',
    },
    {
      ID: 2,
      TITLE: 'Project Review',
      ATTENDEES: 'Adept, John Smith, Jane Doe',
      START_TIME: new Date('2023-06-26T11:30:00Z'),
      DURATION: 60,
      VIDEO: 'MEET',
    },
    {
      ID: 3,
      TITLE: 'Interview with Sylvia',
      ATTENDEES: 'Adept, Sylvia',
      START_TIME: new Date('2023-07-12T08:00:00'),
      DURATION: 60,
      VIDEO: 'MEET',
    },
  ]);

  useEffect(() => {
    const formattedEvents = events.map((event) => ({
      id: event.ID,
      title: event.TITLE,
      attendees: event.ATTENDEES,
      end: new Date(new Date(event.START_TIME).getTime() + event.DURATION * 60000),
      start: new Date(event.START_TIME),
      video: event.VIDEO,
    }));

    const localizer = {
      format,
      parse,
      getDay,
    };

    setLocalizer(localizer);
    setFormattedEvents(formattedEvents);
  }, [events]);

  const addEvent = (newEvent) => {
    newEvent = {
      ID: events.length + 1,
      TITLE: newEvent.TITLE,
      ATTENDEES: newEvent.ATTENDEES,
      START_TIME: new Date(newEvent.START_TIME),
      DURATION: newEvent.DURATION,
      VIDEO: newEvent.VIDEO,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleSelectEvent = (clickInfo) => {
    const event = clickInfo.event;
    const formattedEvent = {
      ID: event.id,
      TITLE: event.title,
      ATTENDEES: event.extendedProps.attendees,
      START_TIME: new Date(event.start),
      DURATION: (event.end - event.start) / 60000,
      VIDEO: event.extendedProps.video,
    };

    setSelectedEvent(formattedEvent);
    setEventDetailModalOpen(true);
  };

  const handleCloseEventDetailModal = () => {
    setEventDetailModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (data) => {
    const updatedEvent = { ...selectedEvent, ...data };
    const updatedEvents = events.map((event) =>
      String(event.ID) === selectedEvent.ID ? updatedEvent : event
    );
    setEvents(updatedEvents);
  };

  return (
    <>
      {localizer && formattedEvents && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="timeGridWeek"
          events={formattedEvents}
          eventClick={handleSelectEvent}
        />
      )}

      <div className="popup">
        <AddEvent addEvent={addEvent} />
      </div>

      {selectedEvent && (
        <EventDetail
          eventData={selectedEvent}
          isOpen={isEventDetailModalOpen}
          onClose={handleCloseEventDetailModal}
          onSave={handleSaveEvent}
        />
      )}
    </>
  );
};

export default App;
