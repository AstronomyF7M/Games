
// src/components/ArcadeCabinet.jsx
import React from 'react';

export default function ArcadeCabinet({ name, desc, onPlay }) {
  return (
    <div className="cabinet" style={{ width: 320 }}>
      <h2 className="neon-text" style={{ fontSize: '2rem' }}>{name}</h2>
      <p style={{
        fontSize: '1.1rem',
        color: '#00fff0',
        textShadow: '0 0 5px #ff00de',
        minHeight: 60
      }}>{desc}</p>
      <button
        className="neon-text"
        style={{
          background: "#000",
          border: "2px solid #39ff14",
          borderRadius: 9,
          fontSize: 20,
          padding: "12px 32px",
          marginTop: 20,
          cursor: "pointer",
          boxShadow: "0 0 20px #39ff14"
        }}
        onClick={onPlay}
      >
        PLAY
      </button>
    </div>
  );
}
