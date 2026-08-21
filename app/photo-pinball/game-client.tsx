"use client";

import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  LockKeyhole,
  Play,
  RefreshCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./pinball.module.css";

const BOARD_WIDTH = 720;
const BOARD_HEIGHT = 960;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

type Point = { x: number; y: number };
type Ball = Point & { vx: number; vy: number; radius: number; active: boolean };
type Bumper = Point & { radius: number; value: number; color: string };
type Rail = { a: Point; b: Point; width: number; color: string };
type Particle = Point & { vx: number; vy: number; life: number; color: string };
type GameMap = {
  bumpers: Bumper[];
  rails: Rail[];
  palette: [string, string, string];
  seed: number;
};
type GameStatus = "ready" | "playing" | "over";
type GameState = {
  ball: Ball;
  score: number;
  best: number;
  lives: number;
  status: GameStatus;
  trail: Point[];
  particles: Particle[];
  hitTimes: Map<string, number>;
};
type HudState = Pick<GameState, "score" | "best" | "lives" | "status">;

const BASE_RAILS: Rail[] = [
  { a: { x: 86, y: 54 }, b: { x: 634, y: 54 }, width: 9, color: "#f6f2e7" },
  { a: { x: 52, y: 92 }, b: { x: 86, y: 54 }, width: 9, color: "#f6f2e7" },
  { a: { x: 52, y: 92 }, b: { x: 52, y: 770 }, width: 9, color: "#f6f2e7" },
  { a: { x: 634, y: 54 }, b: { x: 668, y: 92 }, width: 9, color: "#f6f2e7" },
  { a: { x: 668, y: 92 }, b: { x: 668, y: 920 }, width: 9, color: "#f6f2e7" },
  { a: { x: 52, y: 770 }, b: { x: 232, y: 900 }, width: 10, color: "#f6f2e7" },
  { a: { x: 668, y: 805 }, b: { x: 492, y: 900 }, width: 10, color: "#f6f2e7" },
  { a: { x: 604, y: 270 }, b: { x: 604, y: 830 }, width: 7, color: "#d7ff42" },
  { a: { x: 84, y: 650 }, b: { x: 205, y: 777 }, width: 12, color: "#ff5d42" },
  { a: { x: 580, y: 650 }, b: { x: 505, y: 777 }, width: 12, color: "#ff5d42" },
];

const DEFAULT_MAP: GameMap = {
  seed: 101,
  palette: ["#737cff", "#ff5d42", "#d7ff42"],
  bumpers: [
    { x: 195, y: 260, radius: 47, value: 200, color: "#ff5d42" },
    { x: 475, y: 318, radius: 44, value: 200, color: "#d7ff42" },
    { x: 335, y: 470, radius: 51, value: 500, color: "#ff5d42" },
    { x: 175, y: 548, radius: 36, value: 100, color: "#d7ff42" },
  ],
  rails: [
    { a: { x: 110, y: 405 }, b: { x: 235, y: 452 }, width: 8, color: "#d7ff42" },
    { a: { x: 420, y: 555 }, b: { x: 548, y: 500 }, width: 8, color: "#d7ff42" },
    { a: { x: 244, y: 650 }, b: { x: 365, y: 685 }, width: 7, color: "#f6f2e7" },
  ],
};

function makeBall(): Ball {
  return { x: 638, y: 832, vx: 0, vy: 0, radius: 14, active: false };
}

function makeGameState(best = 0): GameState {
  return {
    ball: makeBall(),
    score: 0,
    best,
    lives: 3,
    status: "ready",
    trail: [],
    particles: [],
    hitTimes: new Map(),
  };
}

function createRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function fileSeed(file: File) {
  const source = `${file.name}:${file.size}:${file.lastModified}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hueFromRgb(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (!delta) return 220;
  let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  hue = Math.round(hue * 60);
  return hue < 0 ? hue + 360 : hue;
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawnWidth = sourceWidth * scale;
  const drawnHeight = sourceHeight * scale;
  context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight);
}

function buildMap(bitmap: ImageBitmap, seed: number): GameMap {
  const sampleWidth = 72;
  const sampleHeight = 96;
  const sample = document.createElement("canvas");
  sample.width = sampleWidth;
  sample.height = sampleHeight;
  const context = sample.getContext("2d", { willReadFrequently: true });
  if (!context) return { ...DEFAULT_MAP, seed };

  drawImageCover(context, bitmap, bitmap.width, bitmap.height, sampleWidth, sampleHeight);
  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const luminance = (x: number, y: number) => {
    const offset = (y * sampleWidth + x) * 4;
    return pixels[offset] * 0.299 + pixels[offset + 1] * 0.587 + pixels[offset + 2] * 0.114;
  };
  const random = createRng(seed);
  const candidates: Array<{ x: number; y: number; score: number; angle: number; hue: number }> = [];
  const hueSamples: Array<{ hue: number; saturation: number }> = [];

  for (let y = 8; y < sampleHeight - 23; y += 3) {
    for (let x = 8; x < sampleWidth - 12; x += 3) {
      const gx = luminance(x + 1, y) - luminance(x - 1, y);
      const gy = luminance(x, y + 1) - luminance(x, y - 1);
      const offset = (y * sampleWidth + x) * 4;
      const max = Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
      const min = Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
      const saturation = max - min;
      const hue = hueFromRgb(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
      const score = Math.hypot(gx, gy) + saturation * 0.22 + random() * 13;
      candidates.push({
        x: 92 + (x / sampleWidth) * 455,
        y: 145 + (y / sampleHeight) * 630,
        score,
        angle: Math.atan2(gy, gx) + Math.PI / 2,
        hue,
      });
      hueSamples.push({ hue, saturation });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  hueSamples.sort((a, b) => b.saturation - a.saturation);
  const baseHue = hueSamples[0]?.hue ?? 225;
  const accentHue = hueSamples.find((sampleHue) => {
    const gap = Math.abs(sampleHue.hue - baseHue);
    return Math.min(gap, 360 - gap) > 70;
  })?.hue ?? (baseHue + 145) % 360;
  const palette: [string, string, string] = [
    `hsl(${baseHue} 72% 58%)`,
    `hsl(${accentHue} 92% 61%)`,
    `hsl(${(baseHue + 82) % 360} 92% 63%)`,
  ];

  const selected: typeof candidates = [];
  for (const candidate of candidates) {
    if (selected.every((item) => Math.hypot(item.x - candidate.x, item.y - candidate.y) > 105)) {
      selected.push(candidate);
    }
    if (selected.length === 9) break;
  }

  const fallbackPoints = [
    { x: 185, y: 260 }, { x: 455, y: 310 }, { x: 330, y: 470 },
    { x: 170, y: 560 }, { x: 485, y: 590 }, { x: 295, y: 655 },
  ];
  while (selected.length < 9) {
    const fallback = fallbackPoints[selected.length % fallbackPoints.length];
    selected.push({ ...fallback, score: 0, angle: random() - 0.5, hue: baseHue });
  }

  const bumpers = selected.slice(0, 5).map((candidate, index) => ({
    x: candidate.x,
    y: candidate.y,
    radius: 34 + random() * 10,
    value: index === 0 ? 500 : index < 3 ? 200 : 100,
    color: palette[(index + 1) % palette.length],
  }));

  const rails = selected.slice(5, 9).map((candidate, index) => {
    const angle = Math.max(-0.75, Math.min(0.75, candidate.angle));
    const length = 82 + random() * 52;
    return {
      a: { x: candidate.x - Math.cos(angle) * length / 2, y: candidate.y - Math.sin(angle) * length / 2 },
      b: { x: candidate.x + Math.cos(angle) * length / 2, y: candidate.y + Math.sin(angle) * length / 2 },
      width: 7 + (index % 2) * 2,
      color: index % 2 ? palette[2] : "#f6f2e7",
    };
  });

  return { bumpers, rails, palette, seed };
}

function nearestPoint(point: Point, rail: Rail) {
  const dx = rail.b.x - rail.a.x;
  const dy = rail.b.y - rail.a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const amount = Math.max(0, Math.min(1, ((point.x - rail.a.x) * dx + (point.y - rail.a.y) * dy) / lengthSquared));
  return { x: rail.a.x + amount * dx, y: rail.a.y + amount * dy };
}

function hitRail(ball: Ball, rail: Rail, restitution = 0.86, kick = 0) {
  const nearest = nearestPoint(ball, rail);
  const dx = ball.x - nearest.x;
  const dy = ball.y - nearest.y;
  const distance = Math.hypot(dx, dy) || 0.001;
  const target = ball.radius + rail.width / 2;
  if (distance >= target) return false;
  const nx = dx / distance;
  const ny = dy / distance;
  const overlap = target - distance;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
  const velocity = ball.vx * nx + ball.vy * ny;
  if (velocity < 0) {
    ball.vx -= (1 + restitution) * velocity * nx;
    ball.vy -= (1 + restitution) * velocity * ny;
  }
  if (kick) {
    ball.vx += nx * kick * 0.35;
    ball.vy -= kick;
  }
  return true;
}

function flipperRail(side: "left" | "right", active: boolean): Rail {
  const left = side === "left";
  const pivot = { x: left ? 238 : 482, y: 852 };
  const angle = left ? (active ? -0.48 : 0.22) : (active ? Math.PI + 0.48 : Math.PI - 0.22);
  const length = 132;
  return {
    a: pivot,
    b: { x: pivot.x + Math.cos(angle) * length, y: pivot.y + Math.sin(angle) * length },
    width: 22,
    color: "#d7ff42",
  };
}

function drawRail(context: CanvasRenderingContext2D, rail: Rail, glow = false) {
  context.save();
  context.lineCap = "round";
  context.lineWidth = rail.width;
  context.strokeStyle = rail.color;
  if (glow) {
    context.shadowBlur = 16;
    context.shadowColor = rail.color;
  }
  context.beginPath();
  context.moveTo(rail.a.x, rail.a.y);
  context.lineTo(rail.b.x, rail.b.y);
  context.stroke();
  context.restore();
}

function formatScore(value: number) {
  return Math.max(0, value).toString().padStart(6, "0");
}

export default function PhotoPinballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const gameRef = useRef<GameState>(makeGameState());
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const mapRef = useRef<GameMap>(DEFAULT_MAP);
  const [map, setMap] = useState<GameMap>(DEFAULT_MAP);
  const [photoName, setPhotoName] = useState("샘플 테이블");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [hud, setHud] = useState<HudState>({ score: 0, best: 0, lives: 3, status: "ready" });

  const syncHud = useCallback(() => {
    const game = gameRef.current;
    setHud({ score: game.score, best: game.best, lives: game.lives, status: game.status });
  }, []);

  const resetGame = useCallback(() => {
    const best = gameRef.current.best;
    gameRef.current = makeGameState(best);
    syncHud();
  }, [syncHud]);

  const launchBall = useCallback(() => {
    const game = gameRef.current;
    if (game.status === "over") {
      const best = game.best;
      gameRef.current = makeGameState(best);
    }
    const current = gameRef.current;
    if (current.ball.active) return;
    current.ball = { ...makeBall(), active: true, vx: -2.9, vy: -17.8 };
    current.status = "playing";
    syncHud();
  }, [syncHud]);

  const loadPhoto = useCallback(async (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일을 선택해주세요.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("사진은 15MB 이하로 선택해주세요.");
      return;
    }
    setLoading(true);
    try {
      const bitmap = await createImageBitmap(file);
      bitmapRef.current?.close();
      bitmapRef.current = bitmap;
      const generated = buildMap(bitmap, fileSeed(file));
      mapRef.current = generated;
      setMap(generated);
      setPhotoName(file.name.replace(/\.[^.]+$/, ""));
      resetGame();
    } catch {
      setError("사진을 읽지 못했습니다. 다른 파일로 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [resetGame]);

  const remixMap = useCallback(() => {
    if (!bitmapRef.current) {
      const nextSeed = mapRef.current.seed + 31;
      const random = createRng(nextSeed);
      const remixed = {
        ...DEFAULT_MAP,
        seed: nextSeed,
        bumpers: DEFAULT_MAP.bumpers.map((bumper) => ({
          ...bumper,
          x: bumper.x + (random() - 0.5) * 72,
          y: bumper.y + (random() - 0.5) * 55,
        })),
      };
      mapRef.current = remixed;
      setMap(remixed);
    } else {
      const remixed = buildMap(bitmapRef.current, mapRef.current.seed + 31);
      mapRef.current = remixed;
      setMap(remixed);
    }
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useEffect(() => {
    try {
      const best = Number(window.localStorage.getItem("pixel-punch-best") ?? 0);
      if (Number.isFinite(best)) {
        gameRef.current.best = best;
        setHud((current) => ({ ...current, best }));
      }
    } catch {
      // The game remains fully playable when local storage is unavailable.
    }
    return () => bitmapRef.current?.close();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = BOARD_WIDTH * density;
    canvas.height = BOARD_HEIGHT * density;
    context.setTransform(density, 0, 0, density, 0, 0);

    let frame = 0;
    let previous = performance.now();
    let hudDirty = false;

    const addParticles = (x: number, y: number, color: string) => {
      const random = createRng(Math.floor(x * 31 + y * 17 + performance.now()));
      for (let index = 0; index < 12; index += 1) {
        const angle = random() * Math.PI * 2;
        const speed = 1.5 + random() * 4.5;
        gameRef.current.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color });
      }
    };

    const award = (key: string, amount: number, x: number, y: number, color: string, cooldown: number) => {
      const game = gameRef.current;
      const now = performance.now();
      if ((game.hitTimes.get(key) ?? 0) + cooldown > now) return;
      game.hitTimes.set(key, now);
      game.score += amount;
      game.best = Math.max(game.best, game.score);
      addParticles(x, y, color);
      hudDirty = true;
    };

    const update = (step: number) => {
      const game = gameRef.current;
      const ball = game.ball;
      game.particles.forEach((particle) => {
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.vy += 0.07 * step;
        particle.life -= 0.025 * step;
      });
      game.particles = game.particles.filter((particle) => particle.life > 0);
      if (!ball.active) return;

      ball.vy += 0.235 * step;
      ball.vx *= Math.pow(0.999, step);
      ball.vy *= Math.pow(0.9995, step);
      ball.x += ball.vx * step;
      ball.y += ball.vy * step;
      game.trail.unshift({ x: ball.x, y: ball.y });
      game.trail = game.trail.slice(0, 14);

      for (const rail of BASE_RAILS) hitRail(ball, rail);
      mapRef.current.rails.forEach((rail, index) => {
        if (hitRail(ball, rail, 0.9)) {
          award(`rail-${index}`, 25, ball.x, ball.y, rail.color, 180);
        }
      });

      const left = flipperRail("left", leftPressed.current);
      const right = flipperRail("right", rightPressed.current);
      hitRail(ball, left, 0.92, leftPressed.current ? 2.8 : 0);
      hitRail(ball, right, 0.92, rightPressed.current ? 2.8 : 0);

      mapRef.current.bumpers.forEach((bumper, index) => {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const target = ball.radius + bumper.radius;
        if (distance >= target) return;
        const nx = dx / distance;
        const ny = dy / distance;
        ball.x = bumper.x + nx * target;
        ball.y = bumper.y + ny * target;
        const velocity = ball.vx * nx + ball.vy * ny;
        ball.vx -= 1.9 * velocity * nx;
        ball.vy -= 1.9 * velocity * ny;
        ball.vx += nx * 5.4;
        ball.vy += ny * 5.4;
        award(`bumper-${index}`, bumper.value, bumper.x, bumper.y, bumper.color, 150);
      });

      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed > 21) {
        ball.vx *= 21 / speed;
        ball.vy *= 21 / speed;
      }

      if (ball.y > BOARD_HEIGHT + 35) {
        ball.active = false;
        game.trail = [];
        game.lives -= 1;
        if (game.lives <= 0) {
          game.status = "over";
          try {
            window.localStorage.setItem("pixel-punch-best", String(game.best));
          } catch {
            // Best score persistence is optional.
          }
        } else {
          game.ball = makeBall();
          game.status = "ready";
        }
        hudDirty = true;
      }
    };

    const draw = () => {
      const game = gameRef.current;
      const currentMap = mapRef.current;
      context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      context.fillStyle = "#111310";
      context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

      if (bitmapRef.current) {
        context.save();
        context.globalAlpha = 0.68;
        drawImageCover(context, bitmapRef.current, bitmapRef.current.width, bitmapRef.current.height, BOARD_WIDTH, BOARD_HEIGHT);
        context.restore();
        context.fillStyle = "rgba(8, 10, 9, .48)";
        context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      } else {
        const gradient = context.createLinearGradient(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        gradient.addColorStop(0, currentMap.palette[0]);
        gradient.addColorStop(1, "#20243c");
        context.fillStyle = gradient;
        context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      }

      context.save();
      context.globalAlpha = 0.09;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;
      for (let x = 0; x <= BOARD_WIDTH; x += 40) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, BOARD_HEIGHT); context.stroke();
      }
      for (let y = 0; y <= BOARD_HEIGHT; y += 40) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(BOARD_WIDTH, y); context.stroke();
      }
      context.restore();

      context.fillStyle = "rgba(255,255,255,.76)";
      context.font = "800 13px Arial";
      context.letterSpacing = "2px";
      context.fillText(bitmapRef.current ? "PHOTO FIELD / LOCAL PROCESSING" : "SAMPLE FIELD / READY", 78, 105);

      BASE_RAILS.forEach((rail) => drawRail(context, rail, rail.color === "#d7ff42"));
      currentMap.rails.forEach((rail) => drawRail(context, rail, true));

      currentMap.bumpers.forEach((bumper) => {
        context.save();
        context.shadowBlur = 24;
        context.shadowColor = bumper.color;
        context.fillStyle = bumper.color;
        context.strokeStyle = "#111310";
        context.lineWidth = 8;
        context.beginPath();
        context.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.shadowBlur = 0;
        context.strokeStyle = "rgba(255,255,255,.62)";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(bumper.x, bumper.y, bumper.radius - 10, -2.8, -0.2);
        context.stroke();
        context.fillStyle = "#111310";
        context.font = "900 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(String(bumper.value), bumper.x, bumper.y + 1);
        context.restore();
      });

      drawRail(context, flipperRail("left", leftPressed.current), true);
      drawRail(context, flipperRail("right", rightPressed.current), true);

      game.trail.forEach((point, index) => {
        context.fillStyle = `rgba(215,255,66,${Math.max(0, 0.2 - index * 0.012)})`;
        context.beginPath();
        context.arc(point.x, point.y, Math.max(2, 10 - index * 0.5), 0, Math.PI * 2);
        context.fill();
      });

      game.particles.forEach((particle) => {
        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.fillRect(particle.x - 3, particle.y - 3, 6, 6);
      });
      context.globalAlpha = 1;

      const ball = game.ball;
      context.save();
      context.shadowBlur = 18;
      context.shadowColor = "#ffffff";
      const ballGradient = context.createRadialGradient(ball.x - 5, ball.y - 6, 1, ball.x, ball.y, ball.radius);
      ballGradient.addColorStop(0, "#ffffff");
      ballGradient.addColorStop(0.45, "#e9ece5");
      ballGradient.addColorStop(1, "#8b9189");
      context.fillStyle = ballGradient;
      context.strokeStyle = "#111310";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    };

    const loop = (now: number) => {
      const delta = Math.min(32, now - previous) / 16.6667;
      previous = now;
      const substeps = 2;
      for (let step = 0; step < substeps; step += 1) update(delta / substeps);
      draw();
      if (hudDirty) {
        hudDirty = false;
        syncHud();
      }
      frame = requestAnimationFrame(loop);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      if (event.code === "ArrowLeft" || event.code === "KeyA") leftPressed.current = true;
      if (event.code === "ArrowRight" || event.code === "KeyD") rightPressed.current = true;
      if (event.code === "Space" || event.code === "Enter") launchBall();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") leftPressed.current = false;
      if (event.code === "ArrowRight" || event.code === "KeyD") rightPressed.current = false;
    };
    const onBlur = () => {
      leftPressed.current = false;
      rightPressed.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [launchBall, syncHud]);

  const dropPhoto = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    void loadPhoto(event.dataTransfer.files[0]);
  };

  const holdFlipper = (side: "left" | "right", pressed: boolean) => {
    if (side === "left") leftPressed.current = pressed;
    else rightPressed.current = pressed;
  };

  return (
    <main
      className={`${styles.page} ${dragging ? styles.pageDragging : ""}`}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }}
      onDrop={dropPhoto}
    >
      <header className={styles.header}>
        <a className={styles.brand} href="/photo-pinball" aria-label="픽셀 펀치 핀볼 홈">
          <span className={styles.brandMark}>P</span><span>PIXEL PUNCH</span>
        </a>
        <div className={styles.localBadge}><LockKeyhole size={14} aria-hidden="true" /> 사진은 내 기기에서만 처리돼요</div>
      </header>

      <section className={styles.gameLayout}>
        <aside className={styles.gameIntro}>
          <p className={styles.eyebrow}><Sparkles size={15} /> NO AI · NO TOKEN · 100% LOCAL</p>
          <h1>내 사진이<br /><em>핀볼 맵</em>이 된다.</h1>
          <p className={styles.description}>사진 속 색과 윤곽을 브라우저가 읽어 범퍼와 레일을 배치합니다. 로그인도, 서버 업로드도 필요 없습니다.</p>

          <div className={styles.actions}>
            <button className={styles.uploadButton} type="button" onClick={() => inputRef.current?.click()} disabled={loading}>
              {loading ? <RefreshCw className={styles.spinner} size={20} /> : <ImagePlus size={20} />}
              {loading ? "맵 만드는 중…" : bitmapRef.current ? "다른 사진 고르기" : "사진으로 맵 만들기"}
            </button>
            <button className={styles.remixButton} type="button" onClick={remixMap}>
              <Shuffle size={18} /> 맵 다시 섞기
            </button>
          </div>
          <input
            ref={inputRef}
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={(event) => { void loadPhoto(event.target.files?.[0]); event.target.value = ""; }}
          />
          {error ? <p className={styles.error} role="alert">{error}</p> : <p className={styles.fileHint}>JPG, PNG, WEBP · 최대 15MB · 사진은 전송되지 않아요</p>}

          <div className={styles.instructions}>
            <div><span>01</span><p><strong>사진 선택</strong>색과 윤곽으로 맵을 만듭니다.</p></div>
            <div><span>02</span><p><strong>공 발사</strong>스페이스 또는 발사 버튼을 누르세요.</p></div>
            <div><span>03</span><p><strong>플리퍼</strong>← → 키나 화면 버튼으로 조작하세요.</p></div>
          </div>
        </aside>

        <section className={styles.arcade} aria-label="사진 핀볼 게임">
          <div className={styles.gameShell}>
            <div className={styles.gameTopbar}>
              <span title={photoName}>PHOTO TABLE / {photoName.slice(0, 18).toUpperCase()}</span>
              <span className={styles.liveDot}>{hud.status === "playing" ? "● LIVE" : hud.status === "over" ? "GAME OVER" : "READY"}</span>
            </div>
            <div className={styles.canvasWrap}>
              <canvas ref={canvasRef} className={styles.canvas} aria-label="사진에서 생성된 핀볼 게임 화면" />
              {hud.status !== "playing" && (
                <div className={styles.boardMessage}>
                  <span>{hud.status === "over" ? "FINAL SCORE" : bitmapRef.current ? "PHOTO MAP READY" : "SAMPLE MAP READY"}</span>
                  <strong>{hud.status === "over" ? formatScore(hud.score) : "LET'S ROLL"}</strong>
                  <button type="button" onClick={launchBall}><Play size={15} fill="currentColor" /> {hud.status === "over" ? "다시 플레이" : "공 발사"}</button>
                </div>
              )}
              {dragging && <div className={styles.dropOverlay}>여기에 사진을 놓으세요</div>}
            </div>
            <div className={styles.scoreStrip}>
              <span><small>SCORE</small>{formatScore(hud.score)}</span>
              <span><small>BEST</small>{formatScore(hud.best)}</span>
              <span><small>BALL</small>{Array.from({ length: 3 }, (_, index) => index < hud.lives ? "●" : "○").join(" ")}</span>
            </div>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              aria-label="왼쪽 플리퍼"
              onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); holdFlipper("left", true); }}
              onPointerUp={() => holdFlipper("left", false)}
              onPointerCancel={() => holdFlipper("left", false)}
            ><ArrowLeft size={22} /><span>LEFT</span></button>
            <button className={styles.launchControl} type="button" onClick={launchBall}><Play size={20} fill="currentColor" /><span>LAUNCH</span></button>
            <button
              type="button"
              aria-label="오른쪽 플리퍼"
              onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); holdFlipper("right", true); }}
              onPointerUp={() => holdFlipper("right", false)}
              onPointerCancel={() => holdFlipper("right", false)}
            ><ArrowRight size={22} /><span>RIGHT</span></button>
          </div>
          <button className={styles.resetButton} type="button" onClick={resetGame}><RefreshCw size={14} /> 현재 게임 초기화</button>
        </section>
      </section>

      <footer className={styles.footer}>
        <span>PIXEL PUNCH © 2026</span>
        <span>사진 처리 · 맵 생성 · 게임 실행 모두 이 브라우저 안에서 완료됩니다.</span>
      </footer>
    </main>
  );
}
