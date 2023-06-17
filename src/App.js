import "./App.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useEffect } from "react";
import { startOfWeek, addDays } from "date-fns";
import AddEvent from "./AddEvent";
import EventDetail from "./EventDetail";

const App = () => {
  const [isEventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localizer, setLocalizer] = useState(null);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [events, setEvents] = useState([
    {
      ID: 1,
      TITLE: "Product Launch",
      ATTENDEES: "Adept, Elaine, Fatima",
      START_TIME: new Date("2023-05-22T10:30:00Z"),
      DURATION: 45,
      VIDEO: "ZOOM",
    },
    {
      ID: 2,
      TITLE: "Project Review",
      ATTENDEES: "Adept, John Smith, Jane Doe",
      START_TIME: new Date("2023-05-26T11:30:00Z"),
      DURATION: 60,
      VIDEO: "MEET",
    },
    {
      ID: 3,
      TITLE: "Interview with Sylvia",
      ATTENDEES: "Adept, Sylvia",
      START_TIME: new Date("2023-05-25T08:00:00"),
      DURATION: 60,
      VIDEO: "MEET",
    },
  ]);

  useEffect(() => {
    // Perform any additional logic or side effects here
    // This code will run whenever the `events` state changes
    const formattedEvents = events.map((event) => ({
      id: event.ID,
      title: event.TITLE,
      attendees: event.ATTENDEES,
      end: new Date(new Date(event.START_TIME).getTime() + event.DURATION * 60000),
      start: new Date(event.START_TIME),
      video: event.VIDEO,
    }));

    const locales = {
      "en-US": require("date-fns/locale/en-US"),
    };

    const startOfWeekWithMonday = (date) => {
      const modifiedDate = startOfWeek(date);
      return modifiedDate.getDay() === 0 ? addDays(modifiedDate, 1) : modifiedDate;
    };

    const localizer = dateFnsLocalizer({
      format,
      parse,
      startOfWeek: (date) => (getDay(date) === 0 ? date : startOfWeekWithMonday(date)),
      getDay,
      locales,
    });

    // Update the localizer and formatted events
    // You can set them as separate states if needed
    setLocalizer(localizer);
    setFormattedEvents(formattedEvents);
  }, [events]);

  const handleAddEvent = (newEvent) => {
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

  const handleSelectEvent = (event) => {
    const formattedEvent = {
      ID: event.id,
      TITLE: event.title,
      ATTENDEES: event.attendees,
      START_TIME: new Date(event.start),
      DURATION: (event.end - event.start) / 60000,
      VIDEO: event.video,
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
      event.ID === selectedEvent.ID ? updatedEvent : event
    );

    setEvents(updatedEvents);
  };



  return (
    <>
      {localizer && formattedEvents && (
        <Calendar
        localizer={localizer}
        events={formattedEvents}
        style={{ height: 500, margin: "50px" }}
        defaultView="week"
        onSelectEvent={handleSelectEvent}
      />
      )}

      <div className="popup">
        <AddEvent addEvent={handleAddEvent} />
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