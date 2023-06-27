import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './EditEvent.css';
import { FaUser } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

// Updates selected calendar event detail
function EditEvent({ isOpen, onClose, onSave, eventData }) {

  const [eventDataState, setEventDataState] = useState(eventData);
  const [attendees, setAttendees] = useState(eventDataState.ATTENDEES ? eventDataState.ATTENDEES.split(','): []);
  const startTime = moment(eventData.START_TIME);
  const formattedTime = startTime.format('HH:mm');
  const [date, setDate] = useState(eventData.START_TIME.toISOString().split("T")[0]);
  const [time, setTime] = useState(formattedTime);

  useEffect(() => {
    const updatedDateTime = new Date(`${date}T${time}:00`);
    setEventDataState((prevState) => ({ ...prevState, START_TIME: updatedDateTime }));
  }, [date, time]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    if(name === 'DATE' || name === "TIME") {
      name === "DATE"? setDate(value) : setTime(value)
    } else if (name === 'DURATION') {
      let newValue = parseInt(value, 10);
      newValue = isNaN(newValue) ? 10 : Math.max(10, Math.round(newValue / 10) * 10);
      setEventDataState((prevState) => ({ ...prevState, [name]: newValue }));
    } else {
      setEventDataState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleAttendeeChange = (event, index) => {
    const newAttendees = [...attendees];
    newAttendees[index] = event.target.value.trim();
    setAttendees(newAttendees);
  };

  const handleAddAttendee = () => {
    setAttendees([...attendees, '']);
  };

  const handleRemoveAttendee = (index) => {
    const newAttendees = [...attendees];
    newAttendees.splice(index, 1);
    setAttendees(newAttendees);
  };


  const handleSubmit = () => {
    const attendeeString = attendees.filter((attendee) => attendee !== '').join(',');
    const updatedEventData = {
      ...eventDataState,
      ATTENDEES: attendeeString,
      TITLE: eventDataState.TITLE,
      START_TIME: eventDataState.START_TIME,
      
      DURATION: eventDataState.DURATION,
    };
    onSave(updatedEventData);
    setEventDataState(updatedEventData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
      <div className="modal-header">
        <h2>Edit Event</h2>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="modal-content">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="title">Title </label>
              <input placeholder="Event title" type="text" id="title" name="TITLE" className="form-control" value={eventDataState.TITLE || ''} onChange={handleChange} />
            </div>
          </div>
        </div>


        <div className="form-group">
        <div className="row">
            <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="DATE" className="form-control" value={ date || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input type="time" id="time" name="TIME" className="form-control" value={ time || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (Mint)</label>
            <input type="number" id="duration" name="DURATION" className="form-control" value={eventDataState.DURATION} onChange={handleChange} min={10} step={10} />
          </div>

          </div>
          <label htmlFor="attendees">Attendees</label>
            {attendees.slice(1).map((attendee, index) => (
              <div key={index} className="attendee-row">
                <input type="text" value={attendee} className="form-control" onChange={(event) => handleAttendeeChange(event, index + 1)} />
                <button type="button" className="remove-button" onClick={() => handleRemoveAttendee(index + 1)}>Remove</button>
              </div>
            ))}
          <button type="button" className="add-button" onClick={handleAddAttendee}> Add Attendee</button>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="video">Location </label>
              <select id="video" name="VIDEO" className="form-control" value={eventDataState.VIDEO || ''} onChange={handleChange}>
                <option value="ZOOM">Zoom</option>
                <option value="MEET">Google Meet</option>
                <option value="NONE">None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <div className="buttons">
          <button className="save-button" onClick={handleSubmit}>Save</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

export default EditEvent;





