import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ onOpen }) => {
  return (
    <button onClick={onOpen} className="chat-button">
      <MessageCircle size={28} />
    </button>
  );
};

export default ChatButton;