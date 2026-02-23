import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

const GRAVITY = 0.5;
const JUMP = -11;
const HOOP_WIDTH = 70;
const HOOP_GAP = 160;
const HOOP_SPEED = 3;
const BALL_RADIUS = 18;

interface Hoop {
  id: number;
  x: number;
  y: number;
  scored: boolean;
}

export default function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ballX: 120,
    ballY: 250,
    velY: 0,
    hoops: [] as Hoop[],
    score: 0,
    best: 0,
    alive: true,
    frame: 0,
    hoopId: 0,
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [alive, setAlive] = useState(true);
  const animRef = useRef<number>(null);

  function spawnHoop(x: number) {
    const s = stateRef.current;
    const y = 150 + Math.random() * 200;
    s.hoops.push({ id: s.hoopId++, x, y, scored: false });
  }

  function reset() {
    const s = stateRef.current;
    s.ballX = 120;
    s.ballY = 250;
    s.velY = 0;
    s.hoops = [];
    s.score = 0;
    s.alive = true;
    s.frame = 0;
    spawnHoop(400);
    spawnHoop(700);
    setScore(0);
    setAlive(true);
  }

  function jump() {
    const s = stateRef.current;
    if (!s.alive) { reset(); return; }
    s.velY = JUMP;
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    spawnHoop(400);
    spawnHoop(700);

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Floor and ceiling
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, H - 30, W, 30);
      ctx.fillRect(0, 0, W, 8);

      // Grid lines subtle
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
      }
      for (let i = 0; i < H; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }

      if (s.alive) {
        s.frame++;
        s.velY += GRAVITY;
        s.ballY += s.velY;

        // Move hoops
        s.hoops.forEach(h => h.x -= HOOP_SPEED);
        s.hoops = s.hoops.filter(h => h.x > -100);
        if (s.hoops.length < 3) spawnHoop(W + 100);

        // Scoring
        s.hoops.forEach(h => {
          if (!h.scored && h.x + HOOP_WIDTH / 2 < s.ballX) {
            const dy = Math.abs(s.ballY - h.y);
            if (dy < HOOP_GAP / 2 - BALL_RADIUS) {
              h.scored = true;
              s.score++;
              if (s.score > s.best) s.best = s.score;
              setScore(s.score);
              setBest(s.best);
            }
          }
        });

        // Death — floor/ceiling
        if (s.ballY + BALL_RADIUS > H - 30 || s.ballY - BALL_RADIUS < 8) {
          s.alive = false;
          setAlive(false);
        }

        // Death — hit hoop rim
        s.hoops.forEach(h => {
          const rimTop = h.y - HOOP_GAP / 2;
          const rimBot = h.y + HOOP_GAP / 2;
          const inX = s.ballX + BALL_RADIUS > h.x && s.ballX - BALL_RADIUS < h.x + HOOP_WIDTH;
          if (inX) {
            if (s.ballY - BALL_RADIUS < rimTop + 12 || s.ballY + BALL_RADIUS > rimBot - 12) {
              s.alive = false;
              setAlive(false);
            }
          }
        });
      }

      // Draw hoops
      s.hoops.forEach(h => {
        const rimTop = h.y - HOOP_GAP / 2;
        const rimBot = h.y + HOOP_GAP / 2;

        // Top rim
        ctx.fillStyle = "#e85d04";
        ctx.beginPath();
        ctx.ellipse(h.x + HOOP_WIDTH / 2, rimTop, HOOP_WIDTH / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bottom rim
        ctx.beginPath();
        ctx.ellipse(h.x + HOOP_WIDTH / 2, rimBot, HOOP_WIDTH / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Net lines
        ctx.strokeStyle = "rgba(232,93,4,0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const nx = h.x + (HOOP_WIDTH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(nx, rimTop);
          ctx.lineTo(h.x + HOOP_WIDTH / 2, rimTop + 30);
          ctx.stroke();
        }
      });

      // Draw ball
      const grad = ctx.createRadialGradient(
        s.ballX - 5, s.ballY - 5, 2,
        s.ballX, s.ballY, BALL_RADIUS
      );
      grad.addColorStop(0, "#ff9f1c");
      grad.addColorStop(1, "#e85d04");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Ball lines
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.ballX - BALL_RADIUS, s.ballY);
      ctx.lineTo(s.ballX + BALL_RADIUS, s.ballY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_RADIUS, 0, Math.PI, false);
      ctx.stroke();

      // Dead overlay
      if (!s.alive) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "white";
        ctx.font = "bold 28px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
        ctx.font = "16px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("Tap to restart", W / 2, H / 2 + 16);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current!);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === "Space") { e.preventDefault(); jump(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      {/* Score bar */}
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Score</p>
          <p className="text-3xl font-heading font-bold text-foreground">{score}</p>
        </div>
        <div className="w-[1px] h-10 bg-border" />
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Best</p>
          <p className="text-3xl font-heading font-bold text-foreground">{best}</p>
        </div>
        <div className="w-[1px] h-10 bg-border" />
        <button
          onClick={reset}
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={420}
        onClick={jump}
        className="rounded-2xl border border-border cursor-pointer"
        style={{ touchAction: "none" }}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      />

      <p className="mt-4 text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
        Click or Space to jump through hoops
      </p>
    </div>
  );
}
