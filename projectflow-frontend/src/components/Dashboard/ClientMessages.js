import React from 'react';
import './ClientMessages.css';

// Mock data as the backend for this feature is not yet implemented.
const mockMessages = [
    { name: 'David Lee', text: 'Hey, just checking on the progress of the branding project. Let me know how it\'s going!', time: '2h ago', avatar: 'https://i.pravatar.cc/40?u=david' },
    { name: 'Stephanie', text: 'I received the first design draft. It looks great! You can start work on the next phase.', time: 'Yesterday', avatar: 'https://i.pravatar.cc/40?u=stephanie', active: true },
    { name: 'William Chen', text: 'I\'d like to request some changes to the previous work you sent over. Let\'s connect.', time: '3d ago', avatar: 'https://i.pravatar.cc/40?u=william' },
];

const ClientMessages = () => {
    return (
        <aside className="client-messages-container">
            <div className="messages-header">
                <h3>Client Messages</h3>
                <div className="header-icons">...</div>
            </div>
            <div className="messages-list">
                {mockMessages.map(msg => (
                    <div key={msg.name} className={`message-item ${msg.active ? 'active' : ''}`}>
                        <img src={msg.avatar} alt={msg.name} className="message-avatar" />
                        <div className="message-content">
                            <div className="message-info">
                                <span className="sender-name">{msg.name}</span>
                                <span className="message-time">{msg.time}</span>
                            </div>
                            <p className="message-text">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default ClientMessages;