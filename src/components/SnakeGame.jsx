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
  const bestRef = useRef(0);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [best, setBest] = useState(() => {
    try { const v = parseInt(localStorage.getItem('bj_snake_best') || '0'); return isNaN(v) ? 0 : v; } catch { return 0; }
  });
  bestRef.current = best;

  const spawnFood = useCallback((snake) => {
    let pos;
    do {
      pos = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
    } while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
    return pos;
  }, []);

  const initGame = useCallback(() => {
    const snake = [[11, 11], [10, 11], [9, 11]];
    return { snake, dir: DIR.right, nextDir: DIR.right, food: spawnFood(snake), alive: true, waiting: true, score: 0 };
  }, [spawnFood]);

  // Single source of truth for rendering — reads from the live game object.
  const draw = useCallback((g) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(33,30,25,0.05)'; ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // Food — hollow ink circle
    ctx.strokeStyle = T.text; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(g.food[0] * CELL + CELL / 2, g.food[1] * CELL + CELL / 2, 6, 0, Math.PI * 2); ctx.stroke();
    // Snake — ink squares
    ctx.fillStyle = T.text;
    g.snake.forEach((seg) => {
      ctx.fillRect(seg[0] * CELL + 1, seg[1] * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const die = useCallback((g) => {
    g.alive = false;
    setDead(true);
    const b = Math.max(bestRef.current, g.score);
    setBest(b);
    try { localStorage.setItem('bj_snake_best', String(b)); } catch {}
  }, []);

  // One step of the simulation. Reads/writes the live game object (refs),
  // so it never goes stale and doesn't need to be torn down on score change.
  const step = useCallback(() => {
    const g = gameRef.current;
    if (!g || !g.alive) return;
    if (g.waiting) { draw(g); return; }

    g.dir = g.nextDir;
    const head = [g.snake[0][0] + g.dir[0], g.snake[0][1] + g.dir[1]];

    if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS ||
        g.snake.some(s => s[0] === head[0] && s[1] === head[1])) {
      die(g);
      return;
    }

    g.snake.unshift(head);
    if (head[0] === g.food[0] && head[1] === g.food[1]) {
      g.score++; setScore(g.score); g.food = spawnFood(g.snake);
    } else {
      g.snake.pop();
    }
    draw(g);
  }, [draw, die, spawnFood]);

  const begin = useCallback(() => {
    clearInterval(tickRef.current);
    gameRef.current = initGame();
    setScore(0);
    setDead(false);
    setWaiting(true);
    draw(gameRef.current);
    tickRef.current = setInterval(step, TICK);
  }, [initGame, draw, step]);

  useEffect(() => {
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
          g.waiting = false; g.dir = nd; g.nextDir = nd; setWaiting(false);
          return;
        }
        // Prevent 180° reversal
        if (nd[0] + g.dir[0] !== 0 || nd[1] + g.dir[1] !== 0) g.nextDir = nd;
      }
    };
    window.addEventListener('keydown', onKey, true);
    begin();
    return () => {
      clearInterval(tickRef.current);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [begin]);

  const restart = () => begin();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(250,247,242,0.85)', backdropFilter: 'blur(12px)',
      padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg,
        border: `1px solid ${T.border}`,
        padding: 16,
        maxWidth: '100%',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12, padding: '0 4px', gap: 16,
        }}>
          <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.text }}>
            you found the snake
          </span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMuted }}>
              Best: {best}
            </span>
            <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.text }}>
              {score}
            </span>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: T.textMuted,
              fontFamily: T.sans, fontSize: 12, cursor: 'pointer', padding: '2px 6px',
            }}>esc to leave</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ position: 'relative', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />

          {/* Death overlay */}
          {dead && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(250,247,242,0.85)', backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontFamily: T.serif, fontSize: 28, color: T.text, marginBottom: 4 }}>
                {score >= 10 ? 'Nice run.' : 'Game Over'}
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textFaint, marginBottom: 16 }}>
                Score: {score}
              </div>
              <button onClick={restart} style={{
                background: T.text, border: 'none',
                padding: '8px 24px', fontFamily: T.sans, fontSize: 13,
                fontWeight: 600, color: T.bg, cursor: 'pointer',
              }}>Play Again</button>
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div style={{
          textAlign: 'center', marginTop: 10,
          fontFamily: T.sans, fontSize: 11,
          color: waiting && !dead ? T.textMuted : T.textFaint,
        }}>
          {waiting && !dead ? 'Press an arrow key to start' : 'Arrow keys or WASD'}
        </div>
      </div>
    </div>
  );
}
