import React, { useState, useEffect } from 'react';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to the chat app!',
    },
  ]);
  const [loading, setLoading] = useState(false); // New loading state

  const sendMessage = async (msg) => {
    const userMessage = {
      role: 'user',
      content: msg,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true); // Set loading state to true

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: newMessages,
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const assistantReply = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages([...newMessages, assistantReply]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="chat-app">
      <div id="chat-window" className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.role}`}>
            {renderMessageContent(message.content)}
          </div>
        ))}
        {loading && <div className="loading">Loading...</div>} {/* Render loading sign */}
      </div>
      <div className="user-input">
        <input
          type="text"
          placeholder="Type your message..."
          onKeyUp={(event) => {
            if (event.key === 'Enter' && event.target.value.trim() !== '') {
              sendMessage(event.target.value);
              event.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatApp;
