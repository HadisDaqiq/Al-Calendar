import React, { useState } from 'react';
import moment from 'moment-timezone'; 
import EventDetail from './EventDetail';
import { askModelForDslMeeting } from './lib/gpt';
import './AddEvent.css';

/** Add event to calendar given user input */
const AddEvent = ({addEvent}) => {
  console.log("event add happens in landing back")
  const [isMinimized, setIsMinimized] = useState(false)
  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
    const container = document.querySelector('.add-event-container');
    if (!isMinimized) {
      container.style.height = '30px';
    } else {
      container.style.height = '280px';
    }
  };
  let output;
  const createEvent = async (input) => {
    const userInput = `input: ${input}`;

    try {
      const response = await askModelForDslMeeting(userInput, "Adept");
      output = response;

      // Adjust the weekday: If userInput contains any day of the week, increment the day in output
      const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday","saturday","sunday"];
      const adjustedStartDate = new Date(output.START_TIME);
      const userInputLowercase = input.toLowerCase();

      for (const weekday of weekdays) {
        if (userInputLowercase.includes(weekday)) {
          const currentWeekday = adjustedStartDate.getDay();
          const desiredWeekday = weekdays.indexOf(weekday);

          adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
          break;
        }
      }

      output.START_TIME = adjustedStartDate;
      console.log("After input user categorized:", output);
      addEvent(output);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div 
      className="add-event-container"
      
    >
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
}

export default AddEvent;