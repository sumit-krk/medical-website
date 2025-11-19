import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ availableDates, selectedDate, onDateSelect, onClose }) => {
  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <Calendar size={20} />
        <div>
          <h3>Choose Your Appointment Date</h3>
          <p className="date-picker-subtitle">Select from available dates starting tomorrow</p>
        </div>
      </div>
      <div className="date-picker-grid">
        {availableDates.map((dateOption, index) => (
          <button
            key={index}
            className={`date-option ${selectedDate === dateOption.date ? 'selected' : ''}`}
            onClick={() => onDateSelect(dateOption.date)}
            title={dateOption.longDisplay}
          >
            <div className="date-day">{dateOption.shortDisplay.split(' ')[0]}</div>
            <div className="date-main">{dateOption.shortDisplay.split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>
      <div className="date-picker-footer">
        <button className="close-picker-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DatePicker;