import React from 'react';
import { X, Send, Stethoscope } from 'lucide-react';
import MessageList from './MessageList';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const ChatWindow = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onVoiceInput,
  isRecording,
  showDatePicker,
  showTimePicker,
  availableDates,
  timeSlots,
  bookingData,
  onDateSelect,
  onTimeSelect,
  onCloseDatePicker,
  onCloseTimePicker,
  messagesEndRef
}) => {
  if (!isOpen) return null;

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-window">
      {/* Chat Header Area */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <Stethoscope size={20} />
          </div>
          <div>
            <h3 className="chat-title">HealthCare Plus Clinic</h3>
            <p className="chat-status">Available Now</p>
          </div>
        </div>
        <button onClick={onClose} className="chat-close">
          <X size={20} />
        </button>
      </div>

      {/* Message Display Area */}
      <MessageList messages={messages} isLoading={isLoading} ref={messagesEndRef} />

      {/* Date Selection Interface */}
      {showDatePicker && (
        <DatePicker
          availableDates={availableDates}
          selectedDate={bookingData.date}
          onDateSelect={onDateSelect}
          onClose={onCloseDatePicker}
        />
      )}

      {/* Time Selection Interface */}
      {showTimePicker && (
        <TimePicker
          timeSlots={timeSlots}
          selectedTime={bookingData.time}
          onTimeSelect={onTimeSelect}
          onClose={onCloseTimePicker}
        />
      )}

      {/* Message Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your message here..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onVoiceInput}
            className={`mic-btn ${isRecording ? "recording" : ""}`}
          >
            🎤
          </button>
          <button
            onClick={onSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="chat-send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;