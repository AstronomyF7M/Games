// src/App.jsx
import React from 'react';
import './styles/arcade.css';
import ArcadeCabinet from './components/ArcadeCabinet';

const games = [
  {
    name: 'Neon Runner',
    desc: 'Dash, dodge, and collect orbs in a neon city!',
    component: 'NeonRunner',
  },
  {
    name: 'Circuit Breakers',
    desc: 'Fast-paced neon puzzle battles!',
    component: 'CircuitBreakers',
  },
  {
    name: 'Laser Disc Duel',
    desc: 'Duel with laser discs in a synth arena!',
    component: 'LaserDiscDuel',
  },
  {
    name: 'Cosmic Pinball',
    desc: 'Pinball in zero gravity with neon bots!',
    component: 'CosmicPinball',
  },
  {
    name: 'Synthwave Smash',
    desc: 'Break the beat—arcade style!',
    component: 'SynthwaveSmash',
  },
  {
    name: 'Pixel Heist',
    desc: 'Stealth, gadgets, and neon loot!',
    component: 'PixelHeist',
  },
];

function App() {
  const [activeGame, setActiveGame] = React.useState(null);

  const GameComponent = activeGame
    ? React.lazy(() => import(`./components/${activeGame}.jsx`))
    : null;

  return (
    <div className="arcade-bg">
      <header style={{ textAlign: 'center', padding: '40px' }}>
        <h1 className="neon-text" style={{ fontSize: '4rem' }}>FUTURE 80s ARCADE</h1>
        <p style={{ color: '#fff', fontSize: '1.5rem', textShadow: '0 0 10px #00fff0' }}>
          Play a new generation of neon classics!
        </p>
      </header>
      <main style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {!activeGame ? games.map(game => (
          <ArcadeCabinet
            key={game.name}
            name={game.name}
            desc={game.desc}
            onPlay={() => setActiveGame(game.component)}
          />
        )) : (
          <React.Suspense fallback={<div className="neon-text">Loading...</div>}>
            <button
              className="neon-text"
              style={{ margin: 24, padding: 12, fontSize: 20, background: "black", border: "2px solid #ff00de", borderRadius: 8, cursor: "pointer" }}
              onClick={() => setActiveGame(null)}
            >⬅ Back to Arcade</button>
            <GameComponent />
          </React.Suspense>
        )}
      </main>
      <footer style={{ textAlign: 'center', color: '#fff', marginTop: 60, opacity: 0.6 }}>
        <p>© 2025 The Neon Arcade | Designed by AstronomyF7M & GitHub Copilot</p>
      </footer>
    </div>
  );
}

export default App;
