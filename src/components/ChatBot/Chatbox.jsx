import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:5000/predict', { message });
      const newEntry = { user: message, bot: res.data.answer };
      setChatHistory([...chatHistory, newEntry]);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div style={{ maxWidth: '100%', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ height: '400px', marginBottom: '0px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ backgroundColor: '#f5f8fb', padding: '10px', borderRadius: '8px' }}>
          <div style={{ backgroundColor: '#0b2578', color: '#fff', padding: '10px', borderRadius: '8px 8px 0 0', position: 'sticky', top: 0, zIndex: 1 }}>
            <h2 style={{ margin: '0', fontSize: '24px' }}>Chat Support</h2>
            <p style={{ margin: '0', fontSize: '14px' }}>Hi. My name is Sam. How can I help you?</p>
          </div>
          {chatHistory.map((entry, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ marginBottom: '30px', marginLeft: '50px' }}>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#555', textAlign: 'right' }}>User:</p>
                <p style={{ margin: '0 0 10px 0', textAlign: 'justify', background: 'lightBlue', padding: '8px', borderRadius: '8px', borderTopRightRadius: '0px', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)', display: 'inline-block', float: 'right' }}>{entry.user}</p>
              </div>
              <div style={{ marginBottom: '30px', marginRight: '50px' }}>
                <p style={{ margin: '0 0 0 0', fontWeight: 'bold', color: '#555', textAlign: 'left' }}>Bot:</p>
                <p style={{ margin: '0 0 10px 0', textAlign: 'justify', background: '#fff', padding: '8px', borderRadius: '8px', borderTopLeftRadius: '0px', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)', display: 'inline-block', float: 'left' }}>{entry.bot}</p>
              </div>
            </div>
          ))}
          <div ref={chatContainerRef} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={message}
          placeholder="Write a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: '1', marginRight: '10px', marginLeft: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: '#0b2578',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
            marginRight: '10px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

