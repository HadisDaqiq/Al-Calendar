import Modal from 'react-modal';
import { FaTimes, FaEdit } from 'react-icons/fa';
import EditEvent from "./EditEvent";
import React, { useState } from "react";
import './EventDetail.css';

// Displays selected event's detail
function EventDetail({ eventData, isOpen, onClose, onSave }) {
  const { START_TIME, DURATION, TITLE, ATTENDEES, VIDEO } = eventData;
  const startDate = new Date(START_TIME);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const start_time_str = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const end_time = new Date(startDate.getTime() + (DURATION) * 60 * 1000);
  const end_time_str = end_time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  let video_str;
  if (VIDEO === 'MEET') {
    video_str = 'Google Meet';
  } else if (VIDEO === 'ZOOM') {
    video_str = 'Zoom';
  } else {
    video_str = 'None';
  }

  const handleOpenModal = () => {
    setIsEditEventModalOpen(true);
  };

  const handleCloseEventDetail = () => {
    setIsEditEventModalOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseEventDetail} className="modal" overlayClassName="overlay">
      <div>
        <div className="modal-header">
          <h2>{TITLE}</h2>
          <div className="header-buttons">
            <button className="edit-btn" onClick={handleOpenModal}>
              <FaEdit />
            </button>
            {isEditEventModalOpen && (
              <EditEvent
                isOpen={isEditEventModalOpen}
                onClose={handleCloseEventDetail}
                onSave={onSave}
                eventData={eventData}
              />
            )}
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="modal-content">
          <p>
            {startDate.toDateString()} {start_time_str} - {end_time_str}
          </p>
          <p>
            <strong>Attendees:</strong> {ATTENDEES.includes("Adept") ? ATTENDEES.replace("Adept", "You") : ATTENDEES}
          </p>
          <p>
            <strong>Location:</strong> {video_str}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default EventDetail;