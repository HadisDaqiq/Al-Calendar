import React, { useState } from 'react';
import moment from 'moment-timezone';
import EventDetail from './EventDetail';
import { askModelForDslMeeting } from './lib/gpt';
import './AddEvent.css';

const AddEvent = ({ addEvent }) => {
  const [isMinimized, setIsMinimized] = useState(false);



  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
    const container = document.querySelector('.add-event-container');
    container.style.height = isMinimized ? '280px' : '30px';
  };

  const createEvent = async (input) => {
    const userInput = `input: ${input}`;

    try {
      const response = await askModelForDslMeeting(userInput, 'Adept');
      let output = response;

      const adjustedStartDate = new Date(output.START_TIME);

      output.START_TIME = adjustedStartDate;
      console.log('After input user categorized:', output);
      addEvent(output);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="add-event-container">
      <div className="add-event-header">
        <span>New Event</span>
        <button className="add-event-minimize-button" onClick={handleMinimizeClick}>
          {isMinimized ? '+' : 'x'}
        </button>
      </div>
      {!isMinimized && (
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
      )}
    </div>
  );
};

export default AddEvent;
