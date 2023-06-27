import React, { useState } from 'react';
import { askModelForDslMeeting } from './lib/gpt';
import './AddEvent.css';

/** Add event to calendar given user input */
const AddEvent = ({ addEvent }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
    const container = document.querySelector('.add-event-container');
    if (!isMinimized) {
      container.style.height = '30px';
    } else {
      container.style.height = '280px';
    }
  };

  const createEvent = async (input) => {
    try {
      const response = await askModelForDslMeeting(input, 'Adept');
      let output = response;
      console.log("output right after askmodel",output)
      // Adjust the weekday: If userInput contains any day of the week, increment the day in output
      const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dateString = output.START_TIME;
      const dateObjStart = new Date(Date.parse(dateString));
      const userInputLowercase = input.toLowerCase();
      console.log("dateObjStart new Date changes the hour? ",output)
      for (const weekday of weekdays) {
        if (userInputLowercase.includes(weekday)) {
          while (dateObjStart.getDay() !== weekdays.indexOf(weekday)) {
            dateObjStart.setDate(dateObjStart.getDate() + 1);
          }
          break;
        }
      }
    
      output.START_TIME = dateObjStart;
      
      addEvent(output);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="add-event-container">
      <div className={"add-event-header"}>
        <span>New Event</span>
        <button className="add-event-minimize-button" onClick={handleMinimizeClick}>
          {isMinimized ? '+' : 'x'}
        </button>
      </div>
      {!isMinimized &&
        <div className="chat-popup">
          <textarea
            placeholder="Type your message here"
            rows="3"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                createEvent(event.target.value);
                event.target.value = '';
              }
            }}
          />
        </div>
      }
    </div>
  );
};

export default AddEvent;
