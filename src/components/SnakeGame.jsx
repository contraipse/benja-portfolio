import { useEffect, useRef, useState, useCallback } from 'react';
import { T } from '../data/tokens';

const CELL = 16;
const COLS = 22;
const ROWS = 22;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK = 100;

const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function SnakeGame({ onClose }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const tickRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('bj_snake_best') || '0'); } catch { return 0; }
  });

  const spawnFood = useCallback((snake) => {
    let pos;
    do {
      pos = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
    } while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
    return pos;
  }, []);

  const initGame = useCallback(() => {
    const snake = [[11, 11], [10, 11], [9, 11]];
    return {
      snake,
      dir: DIR.right,
      nextDir: DIR.right,
      food: spawnFood(snake),
      alive: true,
      waiting: true,
      score: 0,
    };
  }, [spawnFood]);

  useEffect(() => {
    gameRef.current = initGame();
    setScore(0);
    setDead(false);

    const onKey = (e) => {
      const g = gameRef.current;
      const keyMap = {
        ArrowUp: DIR.up, ArrowDown: DIR.down, ArrowLeft: DIR.left, ArrowRight: DIR.right,
        w: DIR.up, s: DIR.down, a: DIR.left, d: DIR.right,
      };
      if (e.key === 'Escape') { closeRef.current(); e.preventDefault(); e.stopPropagation(); return; }
      const nd = keyMap[e.key];
      if (nd) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (!g || !g.alive) return;
        if (g.waiting) {
          g.waiting = false;
          g.dir = nd;
          g.nextDir = nd;
          setWaiting(false);
          return;
        }
        // Prevent 180° reversal
        if (nd[0] + g.dir[0] !== 0 || nd[1] + g.dir[1] !== 0) {
          g.nextDir = nd;
        }
      }
    };
    window.addEventListener('keydown', onKey, true);

    // Game loop
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawState = (g) => {
      ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = T.accent; ctx.shadowColor = 'rgba(255,77,0,0.6)'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(g.food[0] * CELL + CELL / 2, g.food[1] * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      g.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#fff' : `rgba(255,77,0,${1 - (i / g.snake.length) * 0.5})`;
        if (i === 0) { ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 6; }
        ctx.beginPath(); ctx.roundRect(seg[0] * CELL + 1, seg[1] * CELL + 1, CELL - 2, CELL - 2, 3); ctx.fill(); ctx.shadowBlur = 0;
      });
    };

    // Draw initial state
    drawState(gameRef.current);

    const tick = () => {
      const g = gameRef.current;
      if (!g || !g.alive) return;
      if (g.waiting) { drawState(g); return; }

      g.dir = g.nextDir;
      const head = [g.snake[0][0] + g.dir[0], g.snake[0][1] + g.dir[1]];

      // Wall collision
      if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) {
        g.alive = false;
        setDead(true);
        const b = Math.max(best, g.score);
        setBest(b);
        try { localStorage.setItem('bj_snake_best', String(b)); } catch {}
        return;
      }

      // Self collision
      if (g.snake.some(s => s[0] === head[0] && s[1] === head[1])) {
        g.alive = false;
        setDead(true);
        const b = Math.max(best, g.score);
        setBest(b);
        try { localStorage.setItem('bj_snake_best', String(b)); } catch {}
        return;
      }

      g.snake.unshift(head);

      // Eat food
      if (head[0] === g.food[0] && head[1] === g.food[1]) {
        g.score++;
        setScore(g.score);
        g.food = spawnFood(g.snake);
      } else {
        g.snake.pop();
      }

      drawState(g);
    };

    tickRef.current = setInterval(tick, TICK);

    return () => {
      clearInterval(tickRef.current);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [initGame, spawnFood, best]);

  const restart = () => {
    clearInterval(tickRef.current);
    gameRef.current = initGame();
    setScore(0);
    setDead(false);
    setWaiting(true);
    // Draw initial state
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const g = gameRef.current;
      ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = T.accent; ctx.shadowColor = 'rgba(255,77,0,0.6)'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(g.food[0] * CELL + CELL / 2, g.food[1] * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      g.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#fff' : `rgba(255,77,0,${1 - (i / g.snake.length) * 0.5})`;
        if (i === 0) { ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 6; }
        ctx.beginPath(); ctx.roundRect(seg[0] * CELL + 1, seg[1] * CELL + 1, CELL - 2, CELL - 2, 3); ctx.fill(); ctx.shadowBlur = 0;
      });
    }
    tickRef.current = setInterval(() => {
      const g = gameRef.current;
      if (!g || !g.alive) { clearInterval(tickRef.current); return; }
      if (g.waiting) return;

      g.dir = g.nextDir;
      const head = [g.snake[0][0] + g.dir[0], g.snake[0][1] + g.dir[1]];
      if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS ||
          g.snake.some(s => s[0] === head[0] && s[1] === head[1])) {
        g.alive = false; setDead(true);
        const b = Math.max(best, g.score); setBest(b);
        try { localStorage.setItem('bj_snake_best', String(b)); } catch {}
        return;
      }
      g.snake.unshift(head);
      if (head[0] === g.food[0] && head[1] === g.food[1]) {
        g.score++; setScore(g.score); g.food = spawnFood(g.snake);
      } else { g.snake.pop(); }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = T.accent; ctx.shadowColor = 'rgba(255,77,0,0.6)'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(g.food[0] * CELL + CELL / 2, g.food[1] * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      g.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#fff' : `rgba(255,77,0,${1 - (i / g.snake.length) * 0.5})`;
        if (i === 0) { ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 6; }
        ctx.beginPath(); ctx.roundRect(seg[0] * CELL + 1, seg[1] * CELL + 1, CELL - 2, CELL - 2, 3); ctx.fill(); ctx.shadowBlur = 0;
      });
    }, TICK);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(12px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0A0A0A',
        border: `1px solid rgba(255,77,0,0.2)`,
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12, padding: '0 4px',
        }}>
          <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.accent, letterSpacing: 2 }}>
            SNAKE
          </span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Best: {best}
            </span>
            <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: '#fff' }}>
              {score}
            </span>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontFamily: T.sans, fontSize: 11, cursor: 'pointer', padding: '2px 6px',
            }}>ESC</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block' }} />

          {/* Death overlay */}
          {dead && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontFamily: T.serif, fontSize: 28, color: '#fff', marginBottom: 4 }}>
                {score >= 10 ? 'Nice run.' : 'Game Over'}
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                Score: {score}
              </div>
              <button onClick={restart} style={{
                background: T.accent, border: 'none', borderRadius: 20,
                padding: '8px 24px', fontFamily: T.sans, fontSize: 13,
                fontWeight: 600, color: '#fff', cursor: 'pointer',
              }}>Play Again</button>
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div style={{
          textAlign: 'center', marginTop: 10,
          fontFamily: T.sans, fontSize: 11,
          color: waiting && !dead ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
        }}>
          {waiting && !dead ? 'Press an arrow key to start' : 'Arrow keys or WASD'}
        </div>
      </div>
    </div>
  );
}
