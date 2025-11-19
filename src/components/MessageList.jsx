import React, { forwardRef } from 'react';

const MessageList = forwardRef(({ messages, isLoading }, ref) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.type}`}>
          <div className={`message-bubble ${msg.type} ${msg.isConfirmation ? 'is-confirmation' : ''}`}>
            <p>{msg.text}</p>
            {msg.timestamp && (
              <span className="message-time">{msg.timestamp}</span>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message bot">
          <div className="message-bubble bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={ref} />
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;