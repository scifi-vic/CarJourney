import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Add visibility state

    // Initialize chatbot with a greeting message
    useEffect(() => {
        const greetingMessage = {
            text: "👋 Hi there! I'm here to help you. Ask me a question and I'll do my best to assist you!",
            sender: 'bot',
        };
        setMessages([greetingMessage]);
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
                {
                    contents: [
                        {
                            parts: [
                                { text: input },
                            ],
                        },
                    ],
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    params: { key: 'AIzaSyDWlAXzOL4dLYGhqksDHCOAdpy82uzwvWk' },
                }
            );

            const botMessage =
                response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from API.';
            setMessages([...newMessages, { text: botMessage, sender: 'bot' }]);
        } catch (error) {
            console.error('Error communicating with Gemini API:', error.response?.data || error.message);
            setMessages([...newMessages, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (!isVisible) return null; // Hide the chatbot when not visible

    return (
        <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="chatbot-header">
                <span onClick={() => setIsMinimized(!isMinimized)}>Chatbot</span>
                <div className="header-buttons">
                    <button onClick={() => setIsMinimized(!isMinimized)}>
                        {isMinimized ? '▲' : '▼'}
                    </button>
                    <button onClick={() => setIsVisible(false)}>✖</button>
                </div>
            </div>
            {!isMinimized && (
                <>
                    <div className="chatbox">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={message.sender === 'user' ? 'user-message' : 'bot-message'}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;