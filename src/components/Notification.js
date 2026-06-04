import React from 'react';
import './Notification.css';

export default function Notification({ notif }) {
  if (!notif) return null;
  return (
    <div className={`notification ${notif.type}`}>
      <span className="notif-icon">
        {notif.type === 'success' ? '✦' : '⚠'}
      </span>
      {notif.message}
    </div>
  );
}