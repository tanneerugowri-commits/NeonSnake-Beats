import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150; // ms per tick

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true); // start paused
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ref for mutable state that doesn't need to trigger re-renders instantly but is needed in loop
  const dirRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    dirRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    containerRef.current?.focus();
  };

  const checkCollision = (head: Point, currentSnake: Point[]) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // Self collision (skip tail as it will move)
    for (let i = 0; i < currentSnake.length - 1; i++) {
        if (head.x === currentSnake[i].x && head.y === currentSnake[i].y) {
            return true;
        }
    }
    return false;
  };

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        if (checkCollision(newHead, prev)) {
          setIsGameOver(true);
          setHighScore((prevObj) => Math.max(prevObj, score));
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // remove tail
        }

        return newSnake;
      });
    };

    // Calculate speed based on score (gets faster)
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);
    
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, food, score, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused) return;

      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) {
            setDirection({ x: 0, y: -1 });
            dirRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) {
            setDirection({ x: 0, y: 1 });
            dirRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) {
            setDirection({ x: -1, y: 0 });
            dirRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) {
            setDirection({ x: 1, y: 0 });
            dirRef.current = { x: 1, y: 0 };
          }
          break;
      }
    };

    // Attach to the specific container to avoid intercepting global spacebar (from music player) when unfocused
    const el = containerRef.current;
    if (el) {
        el.addEventListener('keydown', handleKeyDown);
        return () => el.removeEventListener('keydown', handleKeyDown);
    }
  }, [isGameOver, isPaused]);

  return (
    <div className="flex flex-col items-center">
      
      {/* Score Header */}
      <div className="flex w-full justify-between items-end mb-6 font-mono text-zinc-400">
         <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest opacity-50">Current Score</span>
            <span className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{score.toString().padStart(4, '0')}</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-xs uppercase tracking-widest opacity-50">High Score</span>
            <span className="text-2xl font-black text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]">{highScore.toString().padStart(4, '0')}</span>
         </div>
      </div>

      {/* Game Board */}
      <div 
        ref={containerRef}
        tabIndex={0}
        className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] focus:outline-none focus:shadow-[0_0_60px_rgba(232,121,249,0.3)] transition-shadow duration-500 cursor-pointer"
        style={{ width: '400px', height: '400px' }}
      >
        <svg viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} width="100%" height="100%" className="block">
           {/* Grid Lines (Neon Vibe) */}
           <defs>
             <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.05" />
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#grid)" />

           {/* Food */}
           <circle 
              cx={food.x + 0.5} 
              cy={food.y + 0.5} 
              r="0.4" 
              className="fill-fuchsia-500 drop-shadow-[0_0_4px_rgba(232,121,249,1)] animate-pulse" 
           />

           {/* Snake */}
           {snake.map((segment, i) => {
              const isHead = i === 0;
              return (
                 <rect 
                    key={`${segment.x}-${segment.y}-${i}`}
                    x={segment.x + 0.05} 
                    y={segment.y + 0.05} 
                    width="0.9" 
                    height="0.9" 
                    rx="0.2"
                    className={`${isHead ? 'fill-cyan-400' : 'fill-cyan-600'} drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]`}
                 />
              )
           })}
        </svg>

        {/* Overlays */}
        {isPaused && !isGameOver && score === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6" onClick={resetGame}>
            <h2 className="text-3xl font-black text-cyan-400 tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">NEON SNAKE</h2>
            <p className="text-zinc-300 font-mono text-sm uppercase tracking-wider mb-8">Click to Initialize System</p>
            <div className="flex gap-4 font-mono text-xs text-zinc-500">
               <span>[WASD] to Move</span>
               <span>[SPACE] to Pause</span>
            </div>
          </div>
        )}

        {isPaused && !isGameOver && score > 0 && (
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center" onClick={() => setIsPaused(false)}>
              <div className="text-2xl font-mono text-white tracking-[0.5em] animate-pulse">PAUSED</div>
           </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="text-5xl font-black text-red-500 mb-2 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase">System Failure</div>
             <div className="text-zinc-300 font-mono text-lg mb-8">FINAL SCORE: {score}</div>
             <button 
                onClick={(e) => { e.stopPropagation(); resetGame(); }}
                className="px-6 py-3 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-mono text-sm uppercase tracking-widest transition-all rounded hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] focus:outline-none"
             >
                [ ENTER TO REBOOT ]
             </button>
          </div>
        )}
      </div>

    </div>
  );
}
