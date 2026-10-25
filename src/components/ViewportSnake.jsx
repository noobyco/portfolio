import { useEffect, useRef } from "react";

const CELL = 18;
const LENGTH = 14;
const STEP_MS = 120;

const DIRS = [
  { c: 1, r: 0 },
  { c: 0, r: 1 },
  { c: -1, r: 0 },
  { c: 0, r: -1 },
];

function alphaOf(color) {
  if (!color || color === "transparent") return 0;
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return 1;
  const parts = match[1].split(",");
  return parts.length < 4 ? 1 : parseFloat(parts[3]);
}

function obstacleRects() {
  const rects = [];
  for (const element of document.body.querySelectorAll("*")) {
    if (element.closest(".viewport-snake")) continue;
    const computed = getComputedStyle(element);
    if (computed.display === "none" || computed.visibility === "hidden" || Number(computed.opacity) === 0) continue;
    const box = element.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    if (box.bottom < 0 || box.top > window.innerHeight || box.right < 0 || box.left > window.innerWidth) continue;

    const tag = element.tagName;
    const solidTag = tag === "IMG" || tag === "SVG" || tag === "VIDEO" || tag === "BUTTON" || tag === "INPUT" || tag === "A";
    let hasText = false;
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        hasText = true;
        break;
      }
    }
    const painted = alphaOf(computed.backgroundColor) > 0.2 || (computed.backgroundImage && computed.backgroundImage !== "none");
    if (solidTag || hasText || painted) {
      rects.push(box);
      continue;
    }

    const top = parseFloat(computed.borderTopWidth) || 0;
    const right = parseFloat(computed.borderRightWidth) || 0;
    const bottom = parseFloat(computed.borderBottomWidth) || 0;
    const left = parseFloat(computed.borderLeftWidth) || 0;
    if (top) rects.push({ left: box.left, top: box.top, right: box.right, bottom: box.top + top + 2 });
    if (bottom) rects.push({ left: box.left, top: box.bottom - bottom - 2, right: box.right, bottom: box.bottom });
    if (left) rects.push({ left: box.left, top: box.top, right: box.left + left + 2, bottom: box.bottom });
    if (right) rects.push({ left: box.right - right - 2, top: box.top, right: box.right, bottom: box.bottom });
  }
  return rects;
}

function paintObstacles(target, cols, rows, rects) {
  for (const rect of rects) {
    const startCol = Math.max(0, Math.floor(rect.left / CELL));
    const endCol = Math.min(cols - 1, Math.floor((rect.right - 0.1) / CELL));
    const startRow = Math.max(0, Math.floor(rect.top / CELL));
    const endRow = Math.min(rows - 1, Math.floor((rect.bottom - 0.1) / CELL));
    for (let row = startRow; row <= endRow; row += 1) {
      for (let col = startCol; col <= endCol; col += 1) target[row * cols + col] = 1;
    }
  }
}

function dilate(source, cols, rows) {
  const next = new Uint8Array(source);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!source[row * cols + col]) continue;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          next[nr * cols + nc] = 1;
        }
      }
    }
  }
  return next;
}

function blockedAt(grid, cols, rows, col, row) {
  if (col < 0 || row < 0 || col >= cols || row >= rows) return true;
  return grid[row * cols + col] === 1;
}

function shade(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift) => Math.max(0, Math.min(255, ((value >> shift) & 255) + amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function drawCube(context, x, y, size, base) {
  const depth = Math.max(4, Math.round(size * 0.34));
  const front = size - depth;
  const light = shade(base, 52);
  const dark = shade(base, -42);
  const darker = shade(base, -68);
  context.fillStyle = darker;
  context.beginPath();
  context.moveTo(x + front, y + depth);
  context.lineTo(x + size, y + 1);
  context.lineTo(x + size, y + front + 1);
  context.lineTo(x + front, y + size);
  context.fill();
  context.fillStyle = light;
  context.beginPath();
  context.moveTo(x + 1, y + depth);
  context.lineTo(x + depth, y + 1);
  context.lineTo(x + size - 1, y + 1);
  context.lineTo(x + front, y + depth);
  context.fill();
  context.fillStyle = base;
  context.fillRect(x, y + depth, front, front);
  context.fillStyle = light;
  context.fillRect(x + 1, y + depth + 1, front - 2, 2);
  context.fillStyle = dark;
  context.fillRect(x + 1, y + size - 3, front - 2, 2);
  context.fillStyle = "#141414";
  context.fillRect(x, y + depth, front, 1);
  context.fillRect(x, y + size - 1, front, 1);
  context.fillRect(x, y + depth, 1, front);
  context.fillRect(x + front - 1, y + depth, 1, front);
  return { depth, front };
}

function drawPortal(context, x, y, progress, spin) {
  const grow = Math.min(1, progress / 0.28);
  const radius = CELL * 1.45 * grow;
  const count = 10;
  for (let index = 0; index < count; index += 1) {
    const angle = spin + (index / count) * Math.PI * 2;
    const px = Math.round(x + Math.cos(angle) * radius - CELL / 2);
    const py = Math.round(y + Math.sin(angle) * radius - CELL / 2);
    drawCube(context, px, py, 12, "#2a2140");
  }
  for (let ring = 0; ring < 2; ring += 1) {
    const ringRadius = radius * (0.62 - ring * 0.24);
    const segments = 8;
    for (let index = 0; index < segments; index += 1) {
      const angle = -spin * (1.4 + ring) + (index / segments) * Math.PI * 2;
      const px = Math.round(x + Math.cos(angle) * ringRadius);
      const py = Math.round(y + Math.sin(angle) * ringRadius);
      context.fillStyle = ring === 0 ? "#9a3dff" : "#d8ff3e";
      context.fillRect(px - 2, py - 2, 4, 4);
      context.fillStyle = "#ffffff";
      context.fillRect(px - 1, py - 1, 2, 2);
    }
  }
  for (let index = 0; index < 10; index += 1) {
    const angle = spin * 2 + index;
    const dist = radius * (0.15 + ((index * 37) % 10) / 18);
    const px = Math.round(x + Math.cos(angle) * dist);
    const py = Math.round(y + Math.sin(angle) * dist);
    context.fillStyle = index % 2 ? "#c77dff" : "#f4f1e8";
    context.fillRect(px, py, 3, 3);
  }
}

export default function ViewportSnake() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    let frame = 0;
    let active = true;
    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let snake = [];
    let direction = DIRS[0];
    let heat = new Map();
    let accumulator = 0;
    let last = performance.now();
    let nextPortalAt = performance.now() + 2800;
    let portal = null;
    let tick = 0;
    let boosting = null;
    let builtRow = -1;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const keyOf = (col, row) => `${col},${row}`;
    const rowBase = () => Math.floor(window.scrollY / CELL);
    const occupied = (col, docRow) => {
      const viewRow = docRow - rowBase();
      if (viewRow < 0 || viewRow >= rows) return false;
      return blockedAt(grid, cols, rows, col, viewRow);
    };

    const rebuild = (relocate) => {
      cols = Math.max(1, Math.floor(window.innerWidth / CELL));
      rows = Math.max(1, Math.floor(window.innerHeight / CELL));
      const next = new Uint8Array(cols * rows);
      paintObstacles(next, cols, rows, obstacleRects());
      grid = dilate(next, cols, rows);
      builtRow = rowBase();
      if (relocate && !portal && (!snake.length || snake.some((part) => occupied(part.c, part.r)))) {
        const placed = placeSnake();
        if (!placed) snake = [];
      }
    };

    const placeSnake = () => {
      for (let row = 1; row < rows - 1; row += 1) {
        for (let col = 1; col < cols - LENGTH - 1; col += 1) {
          let open = true;
          for (let index = 0; index < LENGTH; index += 1) {
            if (blockedAt(grid, cols, rows, col + index, row)) open = false;
          }
          if (!open) continue;
          const shift = rowBase();
          snake = Array.from({ length: LENGTH }, (_, index) => ({
            c: col + LENGTH - 1 - index,
            r: row + shift,
          }));
          direction = DIRS[0];
          return true;
        }
      }
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (blockedAt(grid, cols, rows, col, row)) continue;
          snake = [{ c: col, r: row + rowBase() }];
          direction = DIRS[0];
          return true;
        }
      }
      return false;
    };

    const bodyHas = (col, row, ignoreTail) => {
      const end = ignoreTail ? snake.length - 1 : snake.length;
      for (let index = 0; index < end; index += 1) {
        if (snake[index].c === col && snake[index].r === row) return true;
      }
      return false;
    };

    const areaIsOpen = (col, row) => {
      let free = 0;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          if (!occupied(col + dc, row + dr)) free += 1;
        }
      }
      return free >= 16;
    };

    const randomDestination = (from) => {
      const choices = [];
      const shift = rowBase();
      for (let row = shift; row < shift + rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (occupied(col, row)) continue;
          if (Math.abs(col - from.c) + Math.abs(row - from.r) < 8) continue;
          if (!areaIsOpen(col, row)) continue;
          DIRS.forEach((dir) => {
            let open = true;
            for (let step = 0; step < LENGTH; step += 1) {
              if (occupied(col + dir.c * step, row + dir.r * step)) open = false;
            }
            if (open) choices.push({ cell: { c: col, r: row }, dir });
          });
        }
      }
      if (!choices.length) return null;
      return choices[Math.floor(Math.random() * choices.length)];
    };

    const openPortal = () => {
      if (!snake.length || portal) return false;
      const head = snake[0];
      const ahead = [];
      for (let step = 1; step <= 5; step += 1) {
        const cell = { c: head.c + direction.c * step, r: head.r + direction.r * step };
        if (occupied(cell.c, cell.r) || bodyHas(cell.c, cell.r, false)) break;
        ahead.push(cell);
      }
      if (ahead.length < 1) return false;
      const destination = randomDestination(head);
      if (!destination) return false;
      portal = {
        phase: "approach",
        from: ahead[Math.min(2, ahead.length - 1)],
        to: destination.cell,
        exitDir: destination.dir,
        started: performance.now(),
        doneAt: 0,
      };
      nextPortalAt = performance.now() + 9000 + Math.random() * 5000;
      return true;
    };

    const findLanding = () => {
      const shift = rowBase();
      const midR = shift + Math.floor(rows / 2);
      const midC = Math.floor(cols / 2);
      const collect = (runway) => {
        const choices = [];
        for (let row = shift + 1; row < shift + rows - 1; row += 1) {
          for (let col = 1; col < cols - 1; col += 1) {
            if (occupied(col, row)) continue;
            DIRS.forEach((dir) => {
              let open = true;
              for (let step = 0; step < runway; step += 1) {
                if (occupied(col + dir.c * step, row + dir.r * step)) open = false;
              }
              if (!open) return;
              const toward = (dir.c !== 0 && dir.c === Math.sign(midC - col) ? 1 : 0)
                + (dir.r !== 0 && dir.r === Math.sign(midR - row) ? 1 : 0);
              choices.push({
                cell: { c: col, r: row },
                dir,
                score: Math.abs(row - midR) + Math.abs(col - midC) - toward * 14,
              });
            });
          }
        }
        return choices;
      };
      const choices = collect(LENGTH).length ? collect(LENGTH) : collect(4);
      if (!choices.length) return null;
      choices.sort((a, b) => a.score - b.score);
      const pool = choices.slice(0, Math.min(8, choices.length));
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const openReturnPortal = (dir) => {
      if (!snake.length || (portal && portal.phase !== "done")) return false;
      const head = snake[0];
      const destination = findLanding();
      if (!destination) return false;
      const screen = head.r * CELL - window.scrollY;
      const outside = screen < 0 || screen > window.innerHeight;
      const ahead = { c: head.c + dir.c * 2, r: head.r + dir.r * 2 };
      const from = outside || occupied(ahead.c, ahead.r) ? { c: head.c, r: head.r } : ahead;
      portal = {
        phase: "approach",
        from,
        to: destination.cell,
        exitDir: destination.dir,
        started: performance.now(),
        doneAt: 0,
        boost: dir,
      };
      nextPortalAt = performance.now() + 9000 + Math.random() * 5000;
      return true;
    };

    const moveForward = () => {
      const head = snake[0];
      if (!head) return false;
      const next = { c: head.c + direction.c, r: head.r + direction.r };
      if (occupied(next.c, next.r) || bodyHas(next.c, next.r, true)) return false;
      heat.set(keyOf(next.c, next.r), (heat.get(keyOf(next.c, next.r)) || 0) + 1);
      snake = [next, ...snake.slice(0, LENGTH - 1)];
      tick += 1;
      return true;
    };

    const reverseAndMove = () => {
      if (snake.length < 2) return false;
      snake.reverse();
      const head = snake[0];
      const neck = snake[1];
      direction = { c: head.c - neck.c, r: head.r - neck.r };
      return moveForward();
    };

    const openness = (col, row) => DIRS.reduce(
      (count, dir) => count + (occupied(col + dir.c, row + dir.r) ? 0 : 1),
      0,
    );

    let stillTicks = 0;
    let lastHeadKey = "";
    let outsideTicks = 0;

    const headScreen = () => (snake[0] ? snake[0].r * CELL - window.scrollY : 0);

    const recoveryDir = () => {
      if (!snake.length) return null;
      const screen = headScreen();
      const height = window.innerHeight;
      if (screen < 0) return { c: 0, r: 1 };
      if (screen > height) return { c: 0, r: -1 };
      if (boosting?.r === 1 && screen < height * 0.4) return { c: 0, r: 1 };
      if (boosting?.r === -1 && screen > height * 0.6) return { c: 0, r: -1 };
      return null;
    };

    const dash = (dir) => {
      for (let step = 0; step < 3; step += 1) {
        const head = snake[0];
        if (!head) return;
        const options = [];
        for (let side = 0; side <= 8; side += 1) {
          const offsets = side === 0 ? [0] : [side, -side];
          offsets.forEach((offset) => {
            options.push({
              c: head.c + (dir.c === 0 ? offset : dir.c),
              r: head.r + (dir.r === 0 ? offset : dir.r),
            });
          });
        }
        const next = options.find((cell) => cell.c >= 0 && cell.c < cols && !occupied(cell.c, cell.r) && !bodyHas(cell.c, cell.r, true));
        if (!next) return;
        direction = { c: Math.sign(next.c - head.c), r: Math.sign(next.r - head.r) };
        snake = [next, ...snake.slice(0, -1)];
        tick += 1;
      }
    };

    const stepSnake = (now) => {
      if (!grid.length) return;
      if (portal?.phase === "done" && now - portal.doneAt > 420) portal = null;

      if (portal && portal.phase !== "done") {
        const exitY = portal.to.r * CELL - window.scrollY;
        const exitOff = exitY < -CELL || exitY > window.innerHeight + CELL;
        const screen = snake.length ? headScreen() : -CELL * 2;
        const headOff = screen < 0 || screen > window.innerHeight;
        if (exitOff && headOff) {
          portal = null;
          boosting = null;
          if (!snake.length) {
            const above = screen < window.innerHeight / 2;
            snake = [{
              c: Math.max(1, Math.min(cols - 2, Math.floor(cols / 2))),
              r: above ? rowBase() - 2 : rowBase() + rows + 2,
            }];
            direction = { c: 0, r: above ? 1 : -1 };
          }
        }
      }

      const away = !portal || portal.phase === "done" ? recoveryDir() : null;
      if (away) {
        boosting = away;
        const beforeKey = keyOf(snake[0].c, snake[0].r);
        dash(away);
        const screen = headScreen();
        const stillOut = screen < 0 || screen > window.innerHeight;
        const moved = snake[0] && keyOf(snake[0].c, snake[0].r) !== beforeKey;
        if (stillOut && !moved) {
          openReturnPortal(away);
        } else if (stillOut) {
          outsideTicks += 1;
          if (outsideTicks > 3) openReturnPortal(away);
        } else {
          outsideTicks = 0;
          if (!moved) boosting = null;
        }
        if (boosting && (!portal || portal.phase === "done")) return;
      } else if (!portal || portal.phase === "done") {
        boosting = null;
        outsideTicks = 0;
      }

      const headKey = snake[0] ? keyOf(snake[0].c, snake[0].r) : "";
      if (!portal) {
        if (headKey && headKey === lastHeadKey) stillTicks += 1;
        else stillTicks = 0;
        lastHeadKey = headKey;
        if (stillTicks > 6) {
          stillTicks = 0;
          if (!reverseAndMove()) placeSnake();
          return;
        }
      } else {
        stillTicks = 0;
        lastHeadKey = headKey;
      }

      if (portal?.phase === "approach" || portal?.phase === "swallow") {
        if (portal.boost) boosting = portal.boost;
        const hops = portal.boost ? 2 : 1;
        for (let hop = 0; hop < hops; hop += 1) {
          const head = snake[0];
          if (!head) {
            portal.phase = "emerge";
            direction = portal.exitDir;
            snake = [];
            break;
          }
          if (head.c !== portal.from.c || head.r !== portal.from.r) {
            const dc = Math.sign(portal.from.c - head.c);
            const dr = dc === 0 ? Math.sign(portal.from.r - head.r) : 0;
            direction = { c: dc, r: dr };
            snake = [{ c: head.c + dc, r: head.r + dr }, ...snake.slice(0, -1)];
          }
          if (snake[0] && snake[0].c === portal.from.c && snake[0].r === portal.from.r) {
            snake = snake.slice(1);
          }
          if (!snake.length) {
            portal.phase = "emerge";
            direction = portal.exitDir;
            break;
          }
          portal.phase = "swallow";
          tick += 1;
        }
        return;
      }

      if (portal?.phase === "emerge") {
        if (portal.boost) boosting = portal.exitDir;
        const hops = portal.boost ? 2 : 1;
        for (let hop = 0; hop < hops; hop += 1) {
          if (!snake.length) {
            direction = portal.exitDir;
            snake = [{ ...portal.to }];
            tick += 1;
            continue;
          }
          const head = snake[0];
          direction = portal.exitDir;
          snake = [{ c: head.c + direction.c, r: head.r + direction.r }, ...snake];
          if (snake.length > LENGTH) snake.pop();
          const tail = snake[snake.length - 1];
          if (snake.length >= LENGTH && (tail.c !== portal.to.c || tail.r !== portal.to.r)) {
            portal.phase = "done";
            portal.doneAt = now;
            boosting = null;
            break;
          }
          tick += 1;
        }
        return;
      }

      if (!snake.length) return;
      if (!portal && now >= nextPortalAt) openPortal();

      const head = snake[0];
      const left = { c: -direction.r, r: direction.c };
      const right = { c: direction.r, r: -direction.c };
      const candidates = [direction, left, right, { c: -direction.c, r: -direction.r }]
        .map((dir) => ({ dir, c: head.c + dir.c, r: head.r + dir.r }))
        .filter((option) => !occupied(option.c, option.r) && !bodyHas(option.c, option.r, true));
      if (!candidates.length) {
        if (reverseAndMove()) return;
        openPortal();
        if (!portal) placeSnake();
        return;
      }
      const bestOpen = Math.max(...candidates.map((option) => openness(option.c, option.r)));
      const openPool = candidates.filter((option) => openness(option.c, option.r) === bestOpen);
      openPool.sort((a, b) => (heat.get(keyOf(a.c, a.r)) || 0) - (heat.get(keyOf(b.c, b.r)) || 0));
      const lowest = heat.get(keyOf(openPool[0].c, openPool[0].r)) || 0;
      const pool = openPool.filter((option) => (heat.get(keyOf(option.c, option.r)) || 0) <= lowest + 2);
      const straight = pool.find((option) => option.dir === direction);
      const choice = straight && Math.random() < 0.72 ? straight : pool[Math.floor(Math.random() * pool.length)];
      direction = choice.dir;
      heat.set(keyOf(choice.c, choice.r), (heat.get(keyOf(choice.c, choice.r)) || 0) + 1);
      snake = [{ c: choice.c, r: choice.r }, ...snake.slice(0, LENGTH - 1)];
      tick += 1;
    };

    const drawSnake = (now) => {
      const portalAge = portal ? now - portal.started : 0;
      const grown = portal ? Math.min(1, portalAge / 260) : 0;
      const faded = portal?.phase === "done" ? Math.max(0, 1 - (now - portal.doneAt) / 420) : 1;
      const portalAlpha = grown * faded;

      if (portal && portalAlpha > 0.02) {
        const spin = Math.floor(portalAge / 70) * 0.35;
        context.save();
        context.globalAlpha = portalAlpha;
        drawPortal(
          context,
          portal.from.c * CELL + CELL / 2,
          portal.from.r * CELL + CELL / 2 - window.scrollY,
          1,
          spin,
        );
        drawPortal(
          context,
          portal.to.c * CELL + CELL / 2,
          portal.to.r * CELL + CELL / 2 - window.scrollY,
          1,
          -spin,
        );
        context.restore();
      }

      snake.forEach((part, index) => {
        const x = part.c * CELL + 1;
        const y = part.r * CELL + 1 - window.scrollY;
        const size = CELL - 2;
        const base = index === 0 ? "#c6ef3a" : index % 3 === 2 ? "#f4f1e6" : "#7fbe28";
        const face = drawCube(context, x, y, size, base);
        if (index === 0) {
          const px = -direction.r;
          const py = direction.c;
          const ox = x + face.front / 2 + direction.c * face.front * 0.18;
          const oy = y + face.depth + face.front / 2 + direction.r * face.front * 0.18;
          context.fillStyle = "#ffffff";
          context.fillRect(ox + px * 3 - 1, oy + py * 3 - 1, 3, 3);
          context.fillRect(ox - px * 3 - 1, oy - py * 3 - 1, 3, 3);
          context.fillStyle = "#141414";
          context.fillRect(ox + px * 3, oy + py * 3, 2, 2);
          context.fillRect(ox - px * 3, oy - py * 3, 2, 2);
        } else if (index % 3 === 2) {
          context.fillStyle = "#141414";
          context.fillRect(x + 4, y + face.depth + 4, face.front - 8, 2);
        } else {
          context.fillStyle = "#f7f4ea";
          context.fillRect(x + 3, y + face.depth + face.front - 5, face.front - 6, 2);
        }
      });

      if (boosting && snake.length) {
        const tail = snake[snake.length - 1];
        const originX = tail.c * CELL + CELL / 2;
        const originY = tail.r * CELL + CELL / 2 - window.scrollY;
        const backC = -boosting.c;
        const backR = -boosting.r;
        for (let puff = 1; puff <= 5; puff += 1) {
          const size = Math.max(3, 9 - puff);
          const flicker = ((tick + puff) % 3) - 1;
          const fx = originX + backC * puff * 8 - size / 2 + flicker * 2;
          const fy = originY + backR * puff * 8;
          context.fillStyle = puff % 2 === 0 ? "#ffb000" : "#ff5a1f";
          context.fillRect(fx, fy, size, size);
          context.fillStyle = puff === 1 ? "#fff4c2" : "#d8ff3e";
          context.fillRect(fx + size / 3, fy + 2, 3, 3);
        }
      }
    };

    const draw = (now) => {
      if (!active) return;
      if (rowBase() !== builtRow) rebuild(false);
      const delta = Math.min(48, now - last);
      last = now;
      accumulator += delta;
      const stepMs = boosting || portal?.boost ? 42 : STEP_MS;
      let portalSteps = 0;
      while (accumulator >= stepMs) {
        accumulator -= stepMs;
        const portaling = portal && portal.phase !== "done";
        if (portaling && portalSteps > 0) continue;
        stepSnake(now);
        if (portaling) portalSteps += 1;
      }
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawSnake(now);
      frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resizeCanvas();
      rebuild(true);
    };

    resizeCanvas();
    rebuild(true);
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="viewport-snake" aria-hidden="true" />;
}
