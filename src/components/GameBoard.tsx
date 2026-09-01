import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MapCell, Player, CardJSON } from "../types/game";
import { resolveIllustrationPath } from "../utils/cardMapping";

const HEX_WIDTH = 128;
const HEX_HEIGHT = 111;
const DX = 96; // 0.75 * HEX_WIDTH
const DY = 111;

interface GameBoardProps {
  map: MapCell[][];
  cols: number;
  rows: number;
  players: Player[];
  selectedCell: { col: number; row: number } | null;
  onCellClick: (col: number, row: number) => void;
  selectedLandTileId?: string | null;
  onOutsideClick?: () => void;
  highlightedCells?: { col: number; row: number; color?: "green" | "red" }[];
  onCellRightClick?: (col: number, row: number) => void;
  canPaySelectedCardMana?: boolean;
  onSpellDrop?: (card: CardJSON, handIndex: number, cell: { col: number; row: number } | null) => void;
  activeQuestLocations?: { col: number; row: number; name: string; completed: boolean }[];
  onQuestIconClick?: (questName: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  map,
  cols,
  rows,
  players,
  selectedCell,
  onCellClick,
  selectedLandTileId = null,
  onOutsideClick,
  highlightedCells = [],
  onCellRightClick,
  canPaySelectedCardMana = true,
  onSpellDrop,
  activeQuestLocations = [],
  onQuestIconClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(0.8);
  const [panX, setPanX] = useState(50);
  const [panY, setPanY] = useState(50);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [mouseDownRaw, setMouseDownRaw] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const [clientMousePos, setClientMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showScrollbars, setShowScrollbars] = useState(false);
  const [isDraggingHScroll, setIsDraggingHScroll] = useState(false);
  const [isDraggingVScroll, setIsDraggingVScroll] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartPan, setDragStartPan] = useState({ x: 0, y: 0 });
  const hTrackRef = useRef<HTMLDivElement | null>(null);
  const vTrackRef = useRef<HTMLDivElement | null>(null);

  // Scroll Metrics
  const mapWidth = (cols - 1) * DX + HEX_WIDTH;
  const mapHeight = rows * DY + (cols > 1 ? HEX_HEIGHT / 2 : 0);
  const scaledWidth = mapWidth * zoom;
  const scaledHeight = mapHeight * zoom;

  const getScrollRatioX = () => {
    const totalSpan = scaledWidth + dimensions.width;
    const ratio = dimensions.width / (totalSpan || 1);
    return Math.max(0.18, Math.min(0.35, ratio));
  };

  const getScrollRatioY = () => {
    const totalSpan = scaledHeight + dimensions.height;
    const ratio = dimensions.height / (totalSpan || 1);
    return Math.max(0.18, Math.min(0.35, ratio));
  };

  const maxPanX = Math.max(200, dimensions.width * 0.8);
  const minPanX = Math.min(-scaledWidth + 100, dimensions.width - scaledWidth - 200);
  const rangeX = maxPanX - minPanX;
  const scrollPercentX = rangeX <= 0 ? 50 : Math.max(0, Math.min(100, ((maxPanX - panX) / rangeX) * 100));

  const maxPanY = Math.max(200, dimensions.height * 0.8);
  const minPanY = Math.min(-scaledHeight + 100, dimensions.height - scaledHeight - 200);
  const rangeY = maxPanY - minPanY;
  const scrollPercentY = rangeY <= 0 ? 50 : Math.max(0, Math.min(100, ((maxPanY - panY) / rangeY) * 100));

  const handleHTrackMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const rect = hTrackRef.current?.getBoundingClientRect();
    if (!rect) return;

    const visibleRatioX = getScrollRatioX();
    const thumbWidth = Math.max(30, rect.width * visibleRatioX);
    const availableTrackX = rect.width - thumbWidth;

    const clickX = e.clientX - rect.left;
    if (availableTrackX > 0) {
      const targetPercent = Math.max(0, Math.min(1, (clickX - thumbWidth / 2) / availableTrackX));
      const newPanX = maxPanX - targetPercent * rangeX;
      setPanX(newPanX);
    }

    setIsDraggingHScroll(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartPan({ x: panX, y: panY });
  };

  const handleVTrackMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const rect = vTrackRef.current?.getBoundingClientRect();
    if (!rect) return;

    const visibleRatioY = getScrollRatioY();
    const thumbHeight = Math.max(30, rect.height * visibleRatioY);
    const availableTrackY = rect.height - thumbHeight;

    const clickY = e.clientY - rect.top;
    if (availableTrackY > 0) {
      const targetPercent = Math.max(0, Math.min(1, (clickY - thumbHeight / 2) / availableTrackY));
      const newPanY = maxPanY - targetPercent * rangeY;
      setPanY(newPanY);
    }

    setIsDraggingVScroll(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartPan({ x: panX, y: panY });
  };

  useEffect(() => {
    if (!isDraggingHScroll && !isDraggingVScroll) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDraggingHScroll && hTrackRef.current) {
        const rect = hTrackRef.current.getBoundingClientRect();
        const visibleRatioX = getScrollRatioX();
        const thumbWidth = Math.max(30, rect.width * visibleRatioX);
        const availableTrackX = rect.width - thumbWidth;

        if (availableTrackX > 0) {
          const deltaX = e.clientX - dragStartPos.x;
          const ratioDelta = deltaX / availableTrackX;
          const newPanX = dragStartPan.x - ratioDelta * rangeX;
          setPanX(Math.max(minPanX, Math.min(maxPanX, newPanX)));
        }
      }

      if (isDraggingVScroll && vTrackRef.current) {
        const rect = vTrackRef.current.getBoundingClientRect();
        const visibleRatioY = getScrollRatioY();
        const thumbHeight = Math.max(30, rect.height * visibleRatioY);
        const availableTrackY = rect.height - thumbHeight;

        if (availableTrackY > 0) {
          const deltaY = e.clientY - dragStartPos.y;
          const ratioDelta = deltaY / availableTrackY;
          const newPanY = dragStartPan.y - ratioDelta * rangeY;
          setPanY(Math.max(minPanY, Math.min(maxPanY, newPanY)));
        }
      }
    };

    const handleWindowMouseUp = () => {
      setIsDraggingHScroll(false);
      setIsDraggingVScroll(false);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDraggingHScroll, isDraggingVScroll, dragStartPos, dragStartPan, rangeX, rangeY, maxPanX, maxPanY, minPanX, minPanY, dimensions, scaledWidth, scaledHeight]);

  const parseTileId = (tileId: string) => {
    const match = tileId.match(/(.+)\s+L(\d+)/);
    if (match) {
      return { type: match[1], level: `Level ${match[2]}` };
    }
    return { type: tileId, level: "" };
  };

  // Get pixel center of hex coordinates (c, r)
  const getCellCenter = (c: number, r: number) => {
    const x = c * DX + HEX_WIDTH / 2;
    const y = r * DY + HEX_HEIGHT / 2 + (c % 2 === 1 ? HEX_HEIGHT / 2 : 0);
    return { x, y };
  };

  const hasAdjacentOwnership = (c: number, r: number, playerIdx: number): boolean => {
    const cell = map[c][r];
    if (cell.ownerId === playerIdx) return true;

    const odd = c % 2 === 1;
    const neighbors = [
      [c, r - 1], [c, r + 1],
      [c - 1, r], [c + 1, r],
      [c - 1, odd ? r + 1 : r - 1],
      [c + 1, odd ? r + 1 : r - 1],
    ];

    return neighbors.some(([nc, nr]) => {
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
        return map[nc][nr].ownerId === playerIdx;
      }
      return false;
    });
  };

  // Distance helper
  const getDistSq = (x1: number, y1: number, x2: number, y2: number) => {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
  };

  // Convert client click to Hex coordinates using distance checks
  const getHexAtMouse = (mx: number, my: number) => {
    const worldX = (mx - panX) / zoom;
    const worldY = (my - panY) / zoom;

    let bestCol = 0;
    let bestRow = 0;
    let minDist = Infinity;

    // Search neighbors around rough coordinates
    const approxCol = Math.floor((worldX - HEX_WIDTH / 2) / DX);
    const colStart = Math.max(0, approxCol - 1);
    const colEnd = Math.min(cols - 1, approxCol + 2);

    for (let c = colStart; c <= colEnd; c++) {
      const approxRow = Math.floor((worldY - (c % 2 === 1 ? HEX_HEIGHT / 2 : 0) - HEX_HEIGHT / 2) / DY);
      const rowStart = Math.max(0, approxRow - 1);
      const rowEnd = Math.min(rows - 1, approxRow + 2);

      for (let r = rowStart; r <= rowEnd; r++) {
        const center = getCellCenter(c, r);
        const dist = getDistSq(worldX, worldY, center.x, center.y);
        if (dist < minDist) {
          minDist = dist;
          bestCol = c;
          bestRow = r;
        }
      }
    }

    // Limit check to size of hex radius
    const maxRadiusSq = (HEX_WIDTH / 2) ** 2;
    return minDist < maxRadiusSq ? { col: bestCol, row: bestRow } : null;
  };

  // Preload game tile assets and creature images
  useEffect(() => {
    const preloadAssets = async () => {
      const loaded: Record<string, HTMLImageElement> = {};
      const uniqueTileIds = Array.from(new Set(map.flat().map((c) => c.tileId)));
      const uniqueCreatureFiles = Array.from(
        new Set([
          ...map
            .flat()
            .map((c) => c.occupant?.illustration)
            .filter(Boolean) as string[],
          "Wizard L1.png",
          "Wizard L2.png",
          "Wizard L3.png",
          "Wizard L4.png",
        ])
      );

       const promises = [
        ...uniqueTileIds.map((id) => {
          const src = id.startsWith("data:image/") ? id : `/assets/tiles/${id}.png`;
          return loadImg(src, id, loaded);
        }),
        ...uniqueCreatureFiles.map((file) => {
          const src = resolveIllustrationPath("Creature", file);
          return loadImg(src, file, loaded);
        }),
      ];

      await Promise.all(promises);
      setImages(loaded);
    };

    preloadAssets();
  }, [map]);

  const loadImg = (src: string, key: string, dest: Record<string, HTMLImageElement>) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        dest[key] = img;
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
    });
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      setDimensions({ width: rect.width, height: rect.height });
    });

    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    wrapper.addEventListener("contextmenu", handleContextMenu);
    return () => {
      wrapper.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(images).length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset dimensions for High-DPI (Retina) support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Pass 1: Draw all terrain backgrounds
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        drawCellTerrain(ctx, c, r);
      }
    }

    // Pass 2: Draw all ownership rings, creature avatars, and overlays
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        drawCellDecorations(ctx, c, r);
      }
    }

    ctx.restore();
  }, [map, cols, rows, panX, panY, zoom, hoveredCell, selectedCell, selectedLandTileId, images, players, dimensions, highlightedCells, activeQuestLocations]);

  const drawCellTerrain = (ctx: CanvasRenderingContext2D, c: number, r: number) => {
    const cell = map[c][r];
    const { x, y } = getCellCenter(c, r);

    // Draw terrain background
    const img = images[cell.tileId];
    if (img) {
      ctx.drawImage(img, x - HEX_WIDTH / 2, y - HEX_HEIGHT / 2, HEX_WIDTH, HEX_HEIGHT);
    }
  };

  const drawQuestBadge = (ctx: CanvasRenderingContext2D, px: number, py: number) => {
    ctx.save();
    ctx.shadowColor = "rgba(255, 183, 3, 0.7)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 15, 26, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "#ffb703";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const grad = ctx.createRadialGradient(px, py, 0, px, py, 14);
    grad.addColorStop(0, "rgba(255, 215, 0, 0.9)");
    grad.addColorStop(1, "rgba(255, 140, 0, 0.7)");
    
    ctx.beginPath();
    ctx.arc(px, py, 13, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📜", px, py + 1);
    ctx.restore();
  };

  const drawQuestAndCombatBadge = (ctx: CanvasRenderingContext2D, px: number, py: number) => {
    ctx.save();
    ctx.shadowColor = "rgba(239, 35, 60, 0.85)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const w = 54;
    const h = 26;
    const bx = px - w / 2;
    const by = py + 22;

    ctx.beginPath();
    ctx.moveTo(px, by);
    ctx.lineTo(bx + w, by);
    ctx.lineTo(bx + w, by + h * 0.6);
    ctx.quadraticCurveTo(bx + w, by + h, px, by + h + 4);
    ctx.quadraticCurveTo(bx, by + h, bx, by + h * 0.6);
    ctx.lineTo(bx, by);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(bx, by, bx, by + h + 4);
    fillGrad.addColorStop(0, "#2a0408");
    fillGrad.addColorStop(0.5, "#520c15");
    fillGrad.addColorStop(1, "#1c0104");
    ctx.fillStyle = fillGrad;
    ctx.fill();

    const strokeGrad = ctx.createLinearGradient(bx, by, bx + w, by);
    strokeGrad.addColorStop(0, "#d90429");
    strokeGrad.addColorStop(0.5, "#ffb703");
    strokeGrad.addColorStop(1, "#d90429");
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📜⚔️", px, by + h / 2 + 1);
    ctx.restore();
  };

  const drawTrophyBadge = (ctx: CanvasRenderingContext2D, px: number, py: number, isOccupied: boolean) => {
    ctx.save();
    
    const size = isOccupied ? 12 : 16;
    const offset = isOccupied ? 24 : 0;
    const font = isOccupied ? "11px sans-serif" : "14px sans-serif";
    const cy = py + offset;

    ctx.shadowColor = "rgba(250, 204, 21, 0.6)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.arc(px, cy, size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 15, 26, 0.9)";
    ctx.fill();
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = isOccupied ? 1.5 : 2.5;
    ctx.stroke();

    const grad = ctx.createRadialGradient(px, cy, 0, px, cy, size - 2);
    grad.addColorStop(0, "#fef08a");
    grad.addColorStop(1, "#ca8a04");
    
    ctx.beginPath();
    ctx.arc(px, cy, size - 3, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🏆", px, cy + (isOccupied ? 0.5 : 1));
    ctx.restore();
  };

  const drawCellDecorations = (ctx: CanvasRenderingContext2D, c: number, r: number) => {
    const cell = map[c][r];
    const { x, y } = getCellCenter(c, r);

    // Draw ownership ring
    if (cell.ownerId !== null) {
      const owner = players[cell.ownerId];
      if (owner) {
        drawHexRing(ctx, x, y, owner.color, 4);
      }
    }

    // Draw occupant creature avatar
    if (cell.occupant) {
      const ill = cell.occupant.illustration;
      let crImg = images[ill];

      if (!crImg) {
        // Look up by base filename (case-insensitive, ignoring extension)
        const baseName = ill.replace(/\.[^/.]+$/, "").toLowerCase();
        const matchingKey = Object.keys(images).find(k => {
          const kBase = k.replace(/\.[^/.]+$/, "").split("/").pop()?.toLowerCase();
          return kBase === baseName;
        });
        if (matchingKey) {
          crImg = images[matchingKey];
        } else {
          // Asynchronously trigger dynamic fallback loading
          const src = resolveIllustrationPath(cell.occupant.type || "Creature", ill, cell.occupant.name, cell.occupant.cardSubType);
          if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setTimeout(() => {
                setImages(prev => {
                  if (prev[ill]) return prev;
                  return { ...prev, [ill]: img };
                });
              }, 0);
            };
          }
        }
      }

      if (crImg) {
        ctx.drawImage(ctx.canvas, 0, 0, 1, 1); // Avoid empty draw
        ctx.save();
        // Draw circular frame for the creature on hex center
        ctx.beginPath();
        ctx.arc(x, y, 36, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(crImg, x - 36, y - 36, 72, 72);
        ctx.restore();
        
        // Creature outline
        ctx.beginPath();
        ctx.arc(x, y, 36, 0, Math.PI * 2);
        ctx.strokeStyle = cell.ownerId !== null ? players[cell.ownerId].color : "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Stack count badge
        if (cell.occupant.stackCount && cell.occupant.stackCount > 1) {
          const bx = x + 26;
          const by = y - 26;
          ctx.save();
          ctx.beginPath();
          ctx.arc(bx, by, 11, 0, Math.PI * 2);
          ctx.fillStyle = "#7209b7";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px 'Outfit', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`x${cell.occupant.stackCount}`, bx, by);
          ctx.restore();
        }
      }
    }

    // Draw active quest / completed quest / combat symbols if applicable
    const questAtCell = activeQuestLocations?.find(loc => loc.col === c && loc.row === r);
    if (questAtCell) {
      if (questAtCell.completed) {
        drawTrophyBadge(ctx, x, y, !!cell.occupant);
      } else {
        const isAccessible = hasAdjacentOwnership(c, r, 0);
        if (isAccessible) {
          ctx.save();
          ctx.shadowColor = cell.occupant ? "#ff3366" : "#ffb703";
          ctx.shadowBlur = cell.occupant ? 28 : 24;
          ctx.beginPath();
          const glowY = cell.occupant ? (y + 35) : y;
          const glowRadius = cell.occupant ? 16 : 20;
          ctx.arc(x, glowY, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = cell.occupant ? "rgba(255, 51, 102, 0.4)" : "rgba(255, 183, 3, 0.35)";
          ctx.fill();
          ctx.strokeStyle = cell.occupant ? "rgba(255, 51, 102, 0.9)" : "rgba(255, 215, 0, 0.85)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        }

        if (cell.occupant) {
          // Draw a glowing red crossed swords game icon directly at the top of the quest tile (above the occupant circle portrait)
          ctx.save();
          ctx.shadowColor = "rgba(217, 4, 41, 0.9)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#ff3366";
          ctx.font = "20px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⚔️", x, y - 44);
          ctx.restore();

          drawQuestAndCombatBadge(ctx, x, y);
        } else {
          drawQuestBadge(ctx, x, y);
        }
      }
    }

    // Draw selected/hovered overlay
    const isSelected = selectedCell?.col === c && selectedCell?.row === r;
    const cleanTileName = (id: string) => id.trim().toLowerCase();
    const cleanBaseName = (id: string) => id.replace(/\s+L\d+/i, "").trim().toLowerCase();
    const selectedLower = selectedLandTileId ? selectedLandTileId.trim().toLowerCase() : null;

    const isExactMatch = !!selectedLower && cleanTileName(cell.tileId) === selectedLower;
    const isBaseMatch = !!selectedLower && cleanBaseName(cell.tileId) === selectedLower;
    const isLandMatch = isExactMatch || isBaseMatch;

    const isSelectedLand = isLandMatch && cell.ownerId === 0;
    const isUnownedLandMatch = isLandMatch && cell.ownerId !== 0;
    const isRestUnownedLand = !!selectedLower && !isLandMatch && cell.ownerId !== 0;
    const isHovered = hoveredCell?.col === c && hoveredCell?.row === r;
    const highlightInfo = highlightedCells?.find((hc) => hc.col === c && hc.row === r);
    const isHighlighted = !!highlightInfo;

    const getHighlightColor = (tileId: string): string => {
      const tile = tileId.toLowerCase();
      if (tile.includes("plain")) return "rgba(255, 255, 255, 1.0)"; // Pure White Plains
      if (tile.includes("forrest")) return "rgba(34, 197, 94, 1.0)"; // Vivid Emerald Green
      if (tile.includes("mountain")) return "rgba(239, 68, 68, 1.0)"; // Vivid Red Mountain
      if (tile.includes("swamp")) return "rgba(168, 85, 247, 1.0)"; // Vivid Purple Swamp
      if (tile.includes("tower")) return "rgba(59, 130, 246, 1.0)"; // Vivid Blue Tower
      return "rgba(0, 255, 204, 1.0)";
    };

    const getHighlightFillColor = (tileId: string): string => {
      const tile = tileId.toLowerCase();
      if (tile.includes("plain")) return "rgba(255, 255, 255, 0.15)";
      if (tile.includes("forrest")) return "rgba(34, 197, 94, 0.15)";
      if (tile.includes("mountain")) return "rgba(239, 68, 68, 0.15)";
      if (tile.includes("swamp")) return "rgba(168, 85, 247, 0.15)";
      if (tile.includes("tower")) return "rgba(59, 130, 246, 0.15)";
      return "rgba(0, 255, 204, 0.15)";
    };

    if (isSelected) {
      drawHexRing(ctx, x, y, "#00ffcc", 3);
      ctx.fillStyle = "rgba(0, 255, 204, 0.25)";
      fillHex(ctx, x, y);
    } else if (isSelectedLand) {
      drawHexRing(ctx, x, y, "#22c55e", 4);
      ctx.fillStyle = "rgba(34, 197, 94, 0.25)";
      fillHex(ctx, x, y);
    } else if (isUnownedLandMatch) {
      drawHexRing(ctx, x, y, "#00f2fe", 4.5);
      ctx.fillStyle = "rgba(0, 242, 254, 0.35)";
      fillHex(ctx, x, y);
    } else if (isRestUnownedLand) {
      drawHexRing(ctx, x, y, "#facc15", 3);
      ctx.fillStyle = "rgba(250, 204, 21, 0.18)";
      fillHex(ctx, x, y);
    } else if (isHighlighted) {
      let ringColor = getHighlightColor(cell.tileId);
      let fillColor = getHighlightFillColor(cell.tileId);

      if (highlightInfo.color === "green") {
        ringColor = "#22c55e"; // Vivid Emerald Green
        fillColor = "rgba(34, 197, 94, 0.25)";
      } else if (highlightInfo.color === "red") {
        ringColor = "#ef4444"; // Vivid Red
        fillColor = "rgba(239, 68, 68, 0.25)";
      } else if (highlightInfo.color === "gold") {
        ringColor = "#facc15"; // Quest Gold Ring
        fillColor = "rgba(250, 204, 21, 0.28)";
      } else if (highlightInfo.color === "cyan") {
        ringColor = "#00f2fe"; // Vivid Cyan Ring
        fillColor = "rgba(0, 242, 254, 0.28)";
      }

      drawHexRing(ctx, x, y, ringColor, 5.0);
      ctx.fillStyle = fillColor;
      fillHex(ctx, x, y);
      if (isHovered) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        fillHex(ctx, x, y);
      }
    } else if (isHovered) {
      drawHexRing(ctx, x, y, "rgba(255, 255, 255, 0.8)", 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      fillHex(ctx, x, y);
    }
  };

  const drawHexRing = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    pathHexagon(ctx, x, y);
    ctx.closePath();
    ctx.stroke();
  };

  const fillHex = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    pathHexagon(ctx, x, y);
    ctx.closePath();
    ctx.fill();
  };

  const pathHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const size = HEX_WIDTH / 2;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDraggingHScroll || isDraggingVScroll) return;
    setMouseDownRaw({ x: e.clientX, y: e.clientY });
    if (e.button === 2) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingHScroll || isDraggingVScroll) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setClientMousePos({ x: e.clientX, y: e.clientY });

    if (isPanning) {
      setPanX(e.clientX - startPan.x);
      setPanY(e.clientY - startPan.y);
      return;
    }

    const hex = getHexAtMouse(mx, my);
    setHoveredCell(hex);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDraggingHScroll || isDraggingVScroll) return;
    const rawDown = mouseDownRaw;
    setMouseDownRaw(null);

    if (e.button === 2) {
      setIsPanning(false);
      if (rawDown) {
        const dx = Math.abs(e.clientX - rawDown.x);
        const dy = Math.abs(e.clientY - rawDown.y);
        if (dx < 5 && dy < 5) {
          const rect = wrapperRef.current?.getBoundingClientRect();
          if (!rect) return;
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          const hex = getHexAtMouse(mx, my);
          if (hex && onCellRightClick) {
            onCellRightClick(hex.col, hex.row);
          }
        }
      }
      return;
    }

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hex = getHexAtMouse(mx, my);
    if (!hex) {
      if (onOutsideClick) onOutsideClick();
      return;
    }

    const questAtCell = activeQuestLocations?.find(loc => loc.col === hex.col && loc.row === hex.row && !loc.completed);
    if (questAtCell && onQuestIconClick) {
      const center = getCellCenter(hex.col, hex.row);
      const cell = map[hex.col][hex.row];
      const worldX = (mx - panX) / zoom;
      const worldY = (my - panY) / zoom;
      const clickedBadge = cell.occupant 
        ? (Math.abs(worldX - center.x) <= 27 && Math.abs(worldY - (center.y + 22)) <= 13)
        : (getDistSq(worldX, worldY, center.x, center.y) <= 256);
      if (clickedBadge) {
        onQuestIconClick(questAtCell.name);
        return;
      }
    }

    onCellClick(hex.col, hex.row);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hex = getHexAtMouse(mx, my);
    setHoveredCell(hex);
  };

  const handleDragLeave = () => {
    setHoveredCell(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHoveredCell(null);
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hex = getHexAtMouse(mx, my);

    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.type === "spell" && onSpellDrop) {
          onSpellDrop(data.card, data.index, hex);
        }
      }
    } catch (err) {
      console.error("Failed to parse drop data:", err);
    }
  };

  const centerMap = () => {
    const mapWidth = (cols - 1) * DX + HEX_WIDTH;
    const mapHeight = rows * DY + (cols > 1 ? HEX_HEIGHT / 2 : 0);
    
    const fitZoom = Math.min(
      (dimensions.width * 0.95) / mapWidth,
      (dimensions.height * 0.95) / mapHeight,
      1.1
    );
    
    setZoom(fitZoom);
    setPanX((dimensions.width - mapWidth * fitZoom) / 2);
    setPanY((dimensions.height - mapHeight * fitZoom) / 2);
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      centerMap();
    }
    // We only want to run this centering logic on initialization, container resize,
    // or grid size changes. We explicitly exclude panel visibility toggles (showProfile, showBottomPanel)
    // so that opening/closing HUD overlays does not cause the map to shift or scale.
  }, [dimensions.width, dimensions.height, cols, rows]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      if (showScrollbars) {
        const scrollStep = 50;
        const delta = e.deltaY < 0 ? scrollStep : -scrollStep;
        setPanY((prev) => Math.max(minPanY, Math.min(maxPanY, prev + delta)));
      } else {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        setZoom((z) => Math.max(0.4, Math.min(1.5, z * factor)));
      }
    };

    wrapper.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => {
      wrapper.removeEventListener("wheel", handleWheelNative);
    };
  }, [showScrollbars, minPanY, maxPanY]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#080b11",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.6)",
        cursor: isPanning
          ? "grabbing"
          : (hoveredCell && highlightedCells.some(hc => hc.col === hoveredCell.col && hc.row === hoveredCell.row) && !canPaySelectedCardMana)
            ? "not-allowed"
            : "pointer",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setHoveredCell(null)}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.8rem",
            pointerEvents: "none",
            background: "rgba(10, 15, 26, 0.8)",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div style={{ marginBottom: "2px" }}>
            <i className="fa-solid fa-arrows-up-down-left-right" style={{ marginRight: "6px" }}></i>
            Right-Click + Drag to Pan
          </div>
          <div>
            <i className="fa-solid fa-magnifying-glass-plus" style={{ marginRight: "6px" }}></i>
            Scroll to Zoom ({Math.round(zoom * 100)}%)
          </div>
        </div>

        <button
          onClick={centerMap}
          style={{
            background: "rgba(10, 15, 26, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            width: "fit-content",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-color)";
            e.currentTarget.style.color = "#06090e";
            e.currentTarget.style.borderColor = "var(--accent-color)";
            e.currentTarget.style.boxShadow = "0 0 10px var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(10, 15, 26, 0.85)";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
          }}
        >
          <i className="fa-solid fa-arrows-to-dot"></i>
          <span>Center Map</span>
        </button>

        {/* Zoom Slider Panel */}
        <div style={{ display: "flex", alignItems: "stretch", gap: "6px", width: "160px" }}>
          {/* Minus Button */}
          <button
            onClick={() => setZoom((z) => Math.max(0.4, parseFloat((z - 0.1).toFixed(2))))}
            style={{
              background: "rgba(10, 15, 26, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              borderRadius: "6px",
              width: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-color)";
              e.currentTarget.style.color = "#06090e";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(10, 15, 26, 0.85)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            -
          </button>

          {/* Slider Panel */}
          <div
            style={{
              flex: 1,
              background: "rgba(10, 15, 26, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "8px 10px",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.65rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{
                width: "100%",
                cursor: "pointer",
                accentColor: "var(--accent-color)",
                background: "rgba(255, 255, 255, 0.1)",
                height: "4px",
                borderRadius: "2px",
                outline: "none",
              }}
            />
          </div>

          {/* Plus Button */}
          <button
            onClick={() => setZoom((z) => Math.min(1.5, parseFloat((z + 0.1).toFixed(2))))}
            style={{
              background: "rgba(10, 15, 26, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              borderRadius: "6px",
              width: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-color)";
              e.currentTarget.style.color = "#06090e";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(10, 15, 26, 0.85)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            +
          </button>
        </div>

        {/* Scrollbar Toggle Button */}
        <button
          onClick={() => setShowScrollbars((prev) => !prev)}
          style={{
            background: showScrollbars ? "var(--accent-color)" : "rgba(10, 15, 26, 0.85)",
            border: `1px solid ${showScrollbars ? "var(--accent-color)" : "rgba(255, 255, 255, 0.15)"}`,
            color: showScrollbars ? "#06090e" : "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            boxShadow: showScrollbars ? "0 0 10px var(--accent-glow)" : "0 4px 10px rgba(0, 0, 0, 0.3)",
            width: "fit-content",
          }}
          onMouseEnter={(e) => {
            if (!showScrollbars) {
              e.currentTarget.style.background = "var(--accent-color)";
              e.currentTarget.style.color = "#06090e";
              e.currentTarget.style.borderColor = "var(--accent-color)";
              e.currentTarget.style.boxShadow = "0 0 10px var(--accent-glow)";
            }
          }}
          onMouseLeave={(e) => {
            if (!showScrollbars) {
              e.currentTarget.style.background = "rgba(10, 15, 26, 0.85)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
            }
          }}
        >
          <i className="fa-solid fa-scroll"></i>
          <span>{showScrollbars ? "Hide Scrollbars" : "Show Scrollbars"}</span>
        </button>
      </div>

      {showScrollbars && (
        <>
          {/* Horizontal Scrollbar */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              right: "44px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              zIndex: 20,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* Left Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPanX((prev) => Math.min(maxPanX, prev + 80));
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              style={{
                width: "20px",
                height: "20px",
                background: "rgba(10, 15, 26, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                padding: 0,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-color)";
                e.currentTarget.style.color = "#06090e";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 15, 26, 0.9)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <i className="fa-solid fa-caret-left"></i>
            </button>

            {/* Track */}
            <div
              ref={hTrackRef}
              onMouseDown={handleHTrackMouseDown}
              style={{
                flex: 1,
                height: "14px",
                background: "rgba(10, 15, 26, 0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "7px",
                position: "relative",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                cursor: "pointer",
              }}
            >
              {(() => {
                const trackW = hTrackRef.current ? hTrackRef.current.clientWidth : Math.max(1, dimensions.width - 96);
                const visibleRatioX = getScrollRatioX();
                const thumbW = Math.max(30, trackW * visibleRatioX);
                const availX = Math.max(0, trackW - thumbW);
                const thumbL = Math.max(0, Math.min(availX, (scrollPercentX / 100) * availX));
                return (
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      bottom: "2px",
                      left: `${thumbL}px`,
                      width: `${thumbW}px`,
                      background: "var(--accent-color)",
                      borderRadius: "5px",
                      boxShadow: "0 0 8px var(--accent-glow)",
                      cursor: "grab",
                      transition: isDraggingHScroll ? "none" : "left 0.05s ease-out",
                    }}
                  />
                );
              })()}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPanX((prev) => Math.max(minPanX, prev - 80));
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              style={{
                width: "20px",
                height: "20px",
                background: "rgba(10, 15, 26, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                padding: 0,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-color)";
                e.currentTarget.style.color = "#06090e";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 15, 26, 0.9)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <i className="fa-solid fa-caret-right"></i>
            </button>
          </div>

          {/* Vertical Scrollbar */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              bottom: "44px",
              right: "12px",
              width: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              zIndex: 20,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* Top Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPanY((prev) => Math.min(maxPanY, prev + 80));
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              style={{
                width: "20px",
                height: "20px",
                background: "rgba(10, 15, 26, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                padding: 0,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-color)";
                e.currentTarget.style.color = "#06090e";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 15, 26, 0.9)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <i className="fa-solid fa-caret-up"></i>
            </button>

            {/* Track */}
            <div
              ref={vTrackRef}
              onMouseDown={handleVTrackMouseDown}
              style={{
                flex: 1,
                width: "14px",
                background: "rgba(10, 15, 26, 0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "7px",
                position: "relative",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                cursor: "pointer",
              }}
            >
              {(() => {
                const trackH = vTrackRef.current ? vTrackRef.current.clientHeight : Math.max(1, dimensions.height - 96);
                const visibleRatioY = getScrollRatioY();
                const thumbH = Math.max(30, trackH * visibleRatioY);
                const availY = Math.max(0, trackH - thumbH);
                const thumbT = Math.max(0, Math.min(availY, (scrollPercentY / 100) * availY));
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: "2px",
                      right: "2px",
                      top: `${thumbT}px`,
                      height: `${thumbH}px`,
                      background: "var(--accent-color)",
                      borderRadius: "5px",
                      boxShadow: "0 0 8px var(--accent-glow)",
                      cursor: "grab",
                      transition: isDraggingVScroll ? "none" : "top 0.05s ease-out",
                    }}
                  />
                );
              })()}
            </div>

            {/* Bottom Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPanY((prev) => Math.max(minPanY, prev - 80));
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              style={{
                width: "20px",
                height: "20px",
                background: "rgba(10, 15, 26, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                padding: 0,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-color)";
                e.currentTarget.style.color = "#06090e";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10, 15, 26, 0.9)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <i className="fa-solid fa-caret-down"></i>
            </button>
          </div>
        </>
      )}

      {hoveredCell && map[hoveredCell.col]?.[hoveredCell.row] && (() => {
        const cell = map[hoveredCell.col][hoveredCell.row];
        const tileInfo = parseTileId(cell.tileId);
        const occupant = cell.occupant;

        const rect = wrapperRef.current?.getBoundingClientRect();
        const wrapperHeight = rect ? rect.height : 500;
        const wrapperWidth = rect ? rect.width : 800;

        const relativeY = rect ? (clientMousePos.y - rect.top) : 250;
        const relativeX = rect ? (clientMousePos.x - rect.left) : 400;

        const topPos = relativeY > wrapperHeight / 2 
          ? clientMousePos.y - (occupant ? 190 : 70) 
          : clientMousePos.y + 16;
          
        const leftPos = relativeX > wrapperWidth / 2 
          ? clientMousePos.x - 180 
          : clientMousePos.x + 16;

        return createPortal(
          <div
            style={{
              position: "fixed",
              top: `${topPos}px`,
              left: `${leftPos}px`,
              pointerEvents: "none",
              zIndex: 99999,
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(10, 15, 26, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: "160px",
            }}
          >
            {/* Creature Occupant Details */}
            {occupant && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "4px" }}>
                <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${cell.ownerId !== null ? players[cell.ownerId].color : "#fff"}` }}>
                  <img
                    src={resolveIllustrationPath(occupant.type || "Creature", occupant.illustration, occupant.name)}
                    alt={occupant.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff", textAlign: "center" }}>
                  {occupant.name}
                </div>
                {occupant.power && occupant.toughness && (
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: (occupant.hasTemporaryBoost || (occupant as any).isBuffed) ? "#4ade80" : "var(--accent-color)" }}>
                    {occupant.power} / {occupant.toughness}
                  </div>
                )}
              </div>
            )}

            {/* Land/Cell Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontWeight: 600, color: "#00ffcc", fontSize: "0.75rem" }}>
                {tileInfo.type}
              </div>
              <div style={{ opacity: 0.8, fontSize: "0.7rem" }}>
                Location: X: {cell.col}, Y: {cell.row}
              </div>
              {tileInfo.level && (
                <div style={{ opacity: 0.8, fontSize: "0.7rem" }}>
                  {tileInfo.level}
                </div>
              )}
              {cell.ownerId !== null && players[cell.ownerId] && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    marginTop: "2px",
                    color: players[cell.ownerId].color,
                    fontWeight: 600,
                  }}
                >
                  Owner: {players[cell.ownerId].name}
                </div>
              )}
            </div>
          </div>,
          document.body
        );
      })()}
    </div>
  );
};
