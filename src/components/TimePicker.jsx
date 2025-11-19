import React from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const TimePicker = ({ timeSlots, selectedTime, onTimeSelect, onClose }) => {
  return (
    <div className="time-picker">
      <div className="time-picker-header">
        <ClockIcon size={20} />
        <h3>Select Your Preferred Time</h3>
        <p className="time-picker-subtitle">Available time slots from 9:00 AM to 5:00 PM</p>
      </div>
      <div className="time-picker-grid">
        {timeSlots.map((timeSlot, index) => (
          <button
            key={index}
            className={`time-option ${selectedTime === timeSlot ? 'selected' : ''}`}
            onClick={() => onTimeSelect(timeSlot)}
          >
            {timeSlot}
          </button>
        ))}
      </div>
      <div className="time-picker-footer">
        <button className="close-picker-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TimePicker;