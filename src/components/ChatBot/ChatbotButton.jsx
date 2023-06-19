import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import Chatbot from './Chatbox';

const ChatbotButton = () => {
  const [showChat, setShowChat] = useState(false); // State to control the visibility of the chat window
  

  const handleClick = () => {
    setShowChat(!showChat); // Toggle the visibility of the chat window
  };

  return (
    <div style={{ position: 'relative' }}>
      {showChat && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            width: 400,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
          }}
        >
          <Chatbot />
        </div>
      )} {/* Render the Chatbot component within a div with the desired styles if showChat is true */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#0b2578',
          borderRadius: '50%',
          height: 60,
          width: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          zIndex: 9999,
        }}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faCommentAlt} size="2x" color="#fff" />
      </div>
    </div>
  );
};

export default ChatbotButton;

