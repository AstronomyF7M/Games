// src/components/NeonRunner.jsx
import React, { useRef, useEffect, useState } from 'react';

const WIDTH = 600, HEIGHT = 400;

function randomColor() {
  const neonColors = ['#39ff14', '#ff00de', '#00fff0', '#ffd600', '#ff004c'];
  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

function drawPlayer(ctx, x, y, jump, shield) {
  ctx.save();
  ctx.shadowColor = '#39ff14';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#00fff0';
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.fill();
  if (shield) {
    ctx.strokeStyle = '#ff00de';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Jet trail
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#ff00de';
  ctx.beginPath();
  ctx.ellipse(x - 30, y + 12, 10, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawObstacle(ctx, obs) {
  ctx.save();
  ctx.shadowColor = obs.color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = obs.color;
  ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  ctx.restore();
}

function drawOrb(ctx, orb) {
  ctx.save();
  ctx.shadowColor = '#ffd600';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function NeonRunner() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [power, setPower] = useState(null);

  // Game state
  let running = true;
  let y = HEIGHT - 44, vy = 0, gravity = 1, jumpForce = -18, isJumping = false, shield = false;
  let obstacles = [], orbs = [];
  let speed = 6, orbScore = 0;
  let frame = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    function resetGame() {
      y = HEIGHT - 44;
      vy = 0;
      isJumping = false;
      obstacles = [];
      orbs = [];
      orbScore = 0;
      speed = 6;
      setGameOver(false);
      setPower(null);
    }

    function jump() {
      if (y >= HEIGHT - 44) {
        vy = jumpForce;
        isJumping = true;
      }
    }

    function handleKey(e) {
      if (e.code === 'Space' || e.key === 'ArrowUp') jump();
      if (e.key === 'r' && gameOver) {
        resetGame();
        running = true;
        requestAnimationFrame(loop);
      }
    }

    window.addEventListener('keydown', handleKey);

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // BG
      ctx.save();
      ctx.fillStyle = '#111';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.restore();

      // Draw synthwave lines
      for (let l = 0; l < 8; l++) {
        ctx.save();
        ctx.strokeStyle = '#00fff0';
        ctx.globalAlpha = 0.15 + 0.05 * (l % 2);
        ctx.beginPath();
        ctx.moveTo(0, HEIGHT - l * 44);
        ctx.lineTo(WIDTH, HEIGHT - l * 44);
        ctx.stroke();
        ctx.restore();
      }

      // Player
      drawPlayer(ctx, 80, y, isJumping, shield);

      // Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= speed;
        drawObstacle(ctx, obs);

        // Collision
        if (
          80 + 20 > obs.x &&
          80 - 20 < obs.x + obs.w &&
          y + 20 > obs.y &&
          y - 20 < obs.y + obs.h
        ) {
          if (shield) {
            obstacles.splice(i, 1);
            shield = false;
            setPower(null);
          } else {
            setGameOver(true);
            running = false;
            return;
          }
        }

        if (obs.x + obs.w < 0) obstacles.splice(i, 1);
      }

      // Orbs
      for (let i = orbs.length - 1; i >= 0; i--) {
        let orb = orbs[i];
        orb.x -= speed;
        drawOrb(ctx, orb);
        if (Math.abs(orb.x - 80) < 28 && Math.abs(orb.y - y) < 32) {
          orbs.splice(i, 1);
          orbScore++;
          setScore(s => s + 1);
          // 1 in 5 chance of shield power
          if (Math.random() < 0.2) {
            shield = true;
            setPower('SHIELD');
          }
        }
        if (orb.x < 0) orbs.splice(i, 1);
      }

      // Gravity/jump
      vy += gravity;
      y += vy;
      if (y > HEIGHT - 44) {
        y = HEIGHT - 44;
        vy = 0;
        isJumping = false;
      }

      // Add obstacles and orbs
      if (frame % Math.max(44 - Math.floor(orbScore/2), 18) === 0) {
        if (Math.random() > 0.4) {
          obstacles.push({
            x: WIDTH + 40,
            y: HEIGHT - 44 - (Math.random() > 0.5 ? 0 : 60),
            w: 32 + Math.random() * 32,
            h: 44 + (Math.random() > 0.7 ? 30 : 0),
            color: randomColor(),
          });
        }
        if (Math.random() > 0.7) {
          orbs.push({
            x: WIDTH + 40,
            y: HEIGHT - 44 - (Math.random() > 0.5 ? 60 : 0) - 20,
          });
        }
      }

      // Speed up
      if (frame % 300 === 0) speed += 0.2 + Math.random() * 0.4;

      // Score
      ctx.save();
      ctx.font = 'bold 26px Orbitron, Arial';
      ctx.fillStyle = '#FFD600';
      ctx.shadowColor = '#ff00de';
      ctx.shadowBlur = 10;
      ctx.fillText('Score: ' + orbScore, 20, 36);
      ctx.restore();

      // Powerup
      if (power) {
        ctx.save();
        ctx.font = 'bold 24px Orbitron, Arial';
        ctx.fillStyle = '#39ff14';
        ctx.shadowColor = '#00fff0';
        ctx.shadowBlur = 12;
        ctx.fillText(power, WIDTH - 140, 36);
        ctx.restore();
      }

      frame++;
      if (!gameOver) animId = requestAnimationFrame(loop);
    }

    resetGame();
    running = true;
    loop();

    return () => {
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(animId);
    };
    // eslint-disable-next-line
  }, [gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
      <h2 className="neon-text" style={{ fontSize: '2rem' }}>Neon Runner</h2>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          background: 'rgba(10,0,40,0.92)',
          border: '4px solid #00fff0',
          borderRadius: 14,
          boxShadow: '0 0 40px #ff00de',
        }}
      />
      <div style={{ marginTop: 16, color: '#00fff0', fontFamily: 'Orbitron, Arial', fontSize: 20 }}>
        {gameOver
          ? <span>
              <span style={{ color: '#ff004c', fontWeight: 'bold', fontSize: 28 }}>GAME OVER</span><br />
              <span>Score: {score} <br /> Press <span className="neon-text">R</span> to Restart</span>
            </span>
          : <span>Press <span className="neon-text">Space</span> or <span className="neon-text">↑</span> to Jump</span>
        }
      </div>
    </div>
  );
}

export default NeonRunner;
