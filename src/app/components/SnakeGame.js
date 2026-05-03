'use client';

import { useState, useEffect, useRef, useCallback } from "react";

const GRID = 20;
const CELL = 22;
const SIZE = 440;

const INIT_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const snakeRef = useRef(INIT_SNAKE.map((s) => ({ ...s })));
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef(randomFood(INIT_SNAKE));
  const scoreRef = useRef(0);
  const phaseRef = useRef("idle");
  const timerRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);

    const f = foodRef.current;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 4, 0, Math.PI * 2);
    ctx.fill();

    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#111827" : "#374151";
      ctx.fillRect(seg.x * CELL, seg.y * CELL, CELL - 2, CELL - 2);
    });
  }, []);

  const endGame = useCallback(() => {
    phaseRef.current = "over";
    setPhase("over");
    clearTimeout(timerRef.current);
    setBest((p) => Math.max(p, scoreRef.current));
  }, []);

  const tick = useCallback(() => {
    if (phaseRef.current !== "playing") return;

    dirRef.current = nextDirRef.current;

    const snake = snakeRef.current;
    const head = {
      x: snake[0].x + dirRef.current.x,
      y: snake[0].y + dirRef.current.y,
    };

    if (
      head.x < 0 ||
      head.x >= GRID ||
      head.y < 0 ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      endGame();
      return;
    }

    const next = [head, ...snake];

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      foodRef.current = randomFood(next);
    } else {
      next.pop();
    }

    snakeRef.current = next;
    draw();

    timerRef.current = setTimeout(tick, 120);
  }, [draw, endGame]);

  const startGame = useCallback(() => {
    clearTimeout(timerRef.current);

    snakeRef.current = INIT_SNAKE.map((s) => ({ ...s }));
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(INIT_SNAKE);

    scoreRef.current = 0;
    setScore(0);

    phaseRef.current = "playing";
    setPhase("playing");

    draw();
    timerRef.current = setTimeout(tick, 120);
  }, [draw, tick]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onKey = (e) => {
      if (phaseRef.current !== "playing") return;

      const d = dirRef.current;

      if (e.key === "ArrowUp" && d.y !== 1) nextDirRef.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && d.y !== -1) nextDirRef.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && d.x !== 1) nextDirRef.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && d.x !== -1) nextDirRef.current = { x: 1, y: 0 };

      if (e.key === " " || e.key === "Enter") startGame();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startGame]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white">
      <div className="flex justify-between w-[440px] mb-2 text-xs">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="border"
      />

      <button
        onClick={startGame}
        className="m-3 px-4 py-2 bg-black text-white rounded"
      >
        Start
      </button>
    </div>
  );
}