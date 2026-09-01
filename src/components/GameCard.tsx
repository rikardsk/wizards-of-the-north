import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { CardJSON, ActivatedAbility } from "../types/game";
import { getManaDataUri } from "../assets/mana/manaIcons";
import { resolveIllustrationPath, resolveOpponentCard, resolveCardNameFromRef, isWizardCard } from "../utils/cardMapping";
import "./GameCard.css";

interface GameCardProps {
  card: CardJSON;
  isSelected?: boolean;
  onClick?: () => void;
  onZoom?: (card: CardJSON) => void;
  showZoomButton?: boolean;
  disabled?: boolean;
  cannotAfford?: boolean;
  noValidTargets?: boolean;
  isPreview?: boolean;
  isLarge?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onActivateAbility?: (card: CardJSON, ability: ActivatedAbility, choiceDetails?: { chosenColor?: string }) => void;
  canPayAbilityCost?: (costStr: string) => boolean;
  isInBattle?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  cardPool?: CardJSON[];
  hasTemporaryBoost?: boolean;
  hasTemporaryDebuff?: boolean;
  onShowWizardBuffs?: () => void;
}

const parseManaCost = (costStr: string): string[] => {
  if (!costStr) return [];
  const bracedMatches = Array.from(costStr.matchAll(/\{([^}]+)\}/g)).map(m => m[1]);
  if (bracedMatches.length > 0) return bracedMatches;

  const cleaned = costStr.replace(/C(\d+)/g, "$1");
  const matches: string[] = [];
  const digitMatch = cleaned.match(/^(\d+)/);
  if (digitMatch) {
    matches.push(digitMatch[1]);
  }
  const symbols = cleaned.replace(/^\d+/, "");
  for (const char of symbols) {
    if (char !== "{" && char !== "}") {
      matches.push(char);
    }
  }
  return matches;
};

const getAbilityType = (text: string) => {
  const lowerText = text.toLowerCase();
  const isBattle =
    lowerText.includes("battle") ||
    lowerText.includes("combat") ||
    lowerText.includes("fight") ||
    lowerText.includes("attack") ||
    lowerText.includes("defend") ||
    lowerText.includes("block") ||
    lowerText.includes("damage") ||
    lowerText.includes("strike") ||
    lowerText.includes("power") ||
    lowerText.includes("toughness");

  if (isBattle) {
    return {
      type: "battle" as const,
      label: "Battle Ability",
      desc: "This ability is triggered or resolved during combat/battle encounters.",
      icon: "fa-solid fa-bolt",
    };
  }

  return {
    type: "direct" as const,
    label: "Direct Ability",
    desc: "This ability can be activated directly during your play phase.",
    icon: "fa-solid fa-wand-magic-sparkles",
  };
};

const renderTextWithManaSymbols = (text: string) => {
  if (!text) return null;
  const regex = /\{([a-zA-Z0-9]+)\}/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    const symbol = match[1];
    parts.push(
      <img
        key={matchIndex}
        src={getManaDataUri(symbol)}
        alt={symbol}
        className="inline-mana-icon"
        style={{
          height: "1.1em",
          width: "auto",
          verticalAlign: "-0.2em",
          margin: "0 2px",
          display: "inline-block"
        }}
      />
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected = false,
  onClick,
  onZoom,
  showZoomButton = false,
  disabled = false,
  cannotAfford = false,
  noValidTargets = false,
  isPreview = false,
  isLarge = false,
  isCollapsed,
  onToggleCollapse,
  onActivateAbility,
  canPayAbilityCost,
  isInBattle = false,
  draggable,
  onDragStart,
  cardPool = [],
  hasTemporaryBoost = false,
  hasTemporaryDebuff = false,
  onShowWizardBuffs,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocallyCollapsed, setIsLocallyCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLocallyCollapsed(null);
  }, [isCollapsed]);

  const effectiveCollapsed = isLocallyCollapsed !== null ? isLocallyCollapsed : (isCollapsed ?? false);

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleCollapse) {
      onToggleCollapse();
    }
    setIsLocallyCollapsed(prev => {
      const current = prev !== null ? prev : (isCollapsed ?? false);
      return !current;
    });
  };

  const [activeChoiceAbility, setActiveChoiceAbility] = useState<ActivatedAbility | null>(null);
  const [pendingActivation, setPendingActivation] = useState<{
    ability: ActivatedAbility;
    chosenColor?: string;
  } | null>(null);

  if (!card) return null;

  const cardColor = card.color || "colorless";
  const cardTypeLower = (card.type || card.cardType || "").toLowerCase();
  const cardNameLower = (card.name || "").toLowerCase();

  const colorClass = `card-${cardColor}`;
  const isCreature = cardTypeLower.includes("creature") || cardTypeLower.includes("wizard");
  const isQuestCard = cardTypeLower.includes("quest") || cardNameLower.includes("quest");

  const getQuestSections = () => {
    let questText = "";
    let rewardText = "";
    let opponentsText = "";

    const levelObj = card.questData?.levels?.[card.questLevel || 0];
    if (levelObj) {
      questText = levelObj.questDescription || levelObj.description || "";
      rewardText = levelObj.rewardsDescription || "";
      opponentsText = levelObj.opponentsDescription || "";

      if (levelObj.opponents && levelObj.opponents.length > 0) {
        const resolvedOpponents = levelObj.opponents.map(ref => 
          resolveOpponentCard(ref, cardPool)
        );
        const combinedPower = resolvedOpponents.reduce((sum, opp) => {
          const p = parseInt(opp.power || "0", 10);
          return sum + (isNaN(p) ? 0 : p);
        }, 0);
        opponentsText = `${opponentsText} (${combinedPower} Power)`;
      } else if (levelObj.army) {
        const combinedPower = levelObj.army.power;
        opponentsText = `Random ${levelObj.army.subType}s (${combinedPower} Max Power)`;
      }
    } else {
      const sourceText = card.customDescription || card.rulesText || "";
      const questMatch = sourceText.match(/Quest:\s*([^\n\r]+)/i);
      const rewardMatch = sourceText.match(/Reward:\s*([^\n\r]+)/i);
      const oppMatch = sourceText.match(/Opponents:\s*([^\n\r]+)/i);

      if (questMatch) questText = questMatch[1].trim();
      if (rewardMatch) rewardText = rewardMatch[1].trim();
      if (oppMatch) opponentsText = oppMatch[1].trim();

      if (!questText && !rewardText && !opponentsText && sourceText) {
        questText = sourceText.replace(/Quest:\s*/i, "").trim();
      }
    }

    return { questText, rewardText, opponentsText };
  };

  const { questText, rewardText, opponentsText } = isQuestCard ? getQuestSections() : { questText: "", rewardText: "", opponentsText: "" };

  const handleCloseCardModal = () => {
    setIsModalOpen(false);
    setActiveChoiceAbility(null);
    setPendingActivation(null);
  };

  const getColorName = (colorCode: string): string => {
    switch (colorCode) {
      case "W": return "White";
      case "U": return "Blue";
      case "B": return "Black";
      case "R": return "Red";
      case "G": return "Green";
      case "C": return "Colorless";
      default: return colorCode;
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pendingActivation) {
          setPendingActivation(null);
        } else if (activeChoiceAbility) {
          setActiveChoiceAbility(null);
        } else {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, activeChoiceAbility, pendingActivation]);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onZoom) {
      onZoom(card);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`game-card-wrapper ${colorClass} ${isSelected ? "selected" : ""} ${
          disabled ? "disabled" : ""
        } ${card.completed ? "completed-quest" : ""} ${cannotAfford ? "cannot-afford" : ""} ${isLarge ? "large-card" : ""}`}
        onClick={handleClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
      <div className="game-card-inner">
        {/* No Valid Targets Warning Badge */}
        {noValidTargets && (
          <div 
            style={{
              position: "absolute",
              top: isLarge ? "38px" : "32px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              border: "1.5px solid rgba(254, 202, 202, 0.9)",
              borderRadius: "6px",
              padding: isLarge ? "3px 10px" : "2px 6px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: isLarge ? "0.82rem" : "0.65rem",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7), 0 0 10px rgba(220, 38, 38, 0.6)",
              whiteSpace: "nowrap",
              zIndex: 15,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            title="No valid targets available for this spell right now"
          >
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "0.85em", color: "#fef08a" }}></i>
            <span>No Valid Target</span>
          </div>
        )}

        {/* Name and Mana Cost */}
        <div className="card-top-bar">
          <span className="card-name-title" title={card.name}>{card.name}</span>
          <div className="card-mana-cost">
            {parseManaCost(card.manaCost).map((symbol, idx) => (
              <img
                key={idx}
                src={getManaDataUri(symbol)}
                alt={symbol}
                className="card-mana-icon"
                draggable={false}
              />
            ))}
          </div>
        </div>

        {/* Artwork Frame */}
        <div className="card-art-box">
          <img
            src={resolveIllustrationPath(card.type, card.illustration, card.name, card.cardSubType)}
            alt={card.name}
            className="card-artwork-img"
            loading="eager"
            draggable={false}
          />
          {card.completed && (
            <div className="card-completed-badge">
              <i className="fa-solid fa-circle-check"></i> Completed
            </div>
          )}
          {card.stackCount && card.stackCount > 1 && !card.ratioText && (
            <div className="card-stack-badge" title={`${card.stackCount} units stacked`}>
              x{card.stackCount}
            </div>
          )}
          {card.ratioText && (
            <div
              className="card-stack-badge"
              style={{
                background: card.isSetComplete
                  ? "linear-gradient(135deg, #15803d 0%, #22c55e 100%)"
                  : "rgba(15, 23, 42, 0.9)",
                border: `1.5px solid ${card.isSetComplete ? "#4ade80" : "rgba(250, 204, 21, 0.6)"}`,
                color: card.isSetComplete ? "#ffffff" : "#facc15",
                fontSize: "0.85rem",
                fontWeight: 900,
                padding: "3px 8px",
                borderRadius: "6px",
                boxShadow: card.isSetComplete ? "0 0 12px rgba(74, 222, 128, 0.6)" : "0 2px 8px rgba(0, 0, 0, 0.6)"
              }}
              title={card.isSetComplete ? "Complete Land Set (+500 PTS End-Game Bonus)" : `Territory Progress: ${card.ratioText}`}
            >
              {card.isSetComplete && <i className="fa-solid fa-circle-check" style={{ marginRight: "4px", color: "#4ade80" }}></i>}
              {card.ratioText}
            </div>
          )}
          {(!isPreview || showZoomButton || !!onZoom) && (
            <button
              className="card-zoom-btn"
              onClick={handleEyeClick}
              title="Zoom Card"
            >
              <i className="fa-regular fa-eye"></i>
            </button>
          )}
        </div>

        {/* Type Bar */}
        <div className="card-type-display" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{card.type}</span>
          {card.cardSubType && (
            <span className="card-subtype-badge" style={{
              fontSize: "0.72rem",
              background: "rgba(0, 255, 204, 0.12)",
              color: "var(--accent-color)",
              padding: "1px 6px",
              borderRadius: "4px",
              border: "1px solid rgba(0, 255, 204, 0.2)",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {card.cardSubType}
            </span>
          )}
        </div>

        {/* Rules & Text Box */}
        <div 
          className={`card-description-box ${effectiveCollapsed ? "collapsed-description" : ""}`}
          onClick={isQuestCard && effectiveCollapsed ? handleToggleCollapse : undefined}
          title={isQuestCard && effectiveCollapsed ? "Click to expand Quest Details" : undefined}
        >
          {isQuestCard ? (
            <div className="quest-card-sections">
              <div 
                className="quest-collapse-toggle-header"
                onClick={handleToggleCollapse}
                title={effectiveCollapsed ? "Expand Quest Details" : "Collapse Quest Details"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <i className="fa-solid fa-scroll" style={{ color: "#38bdf8", fontSize: "0.62rem" }}></i>
                  <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#facc15", textTransform: "uppercase" }}>
                    {card.cardSubType || (card.questLevel !== undefined ? `Level ${card.questLevel + 1}` : "Quest")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "var(--text-muted)", fontSize: "0.6rem" }}>
                  <span>{effectiveCollapsed ? "Expand" : "Collapse"}</span>
                  <i className={`fa-solid ${effectiveCollapsed ? "fa-chevron-down" : "fa-chevron-up"}`}></i>
                </div>
              </div>

              {!effectiveCollapsed && (
                <>
                  {questText && (
                    <div className="quest-row quest-row-objective">
                      <span className="quest-badge quest-badge-objective">
                        <i className="fa-solid fa-scroll"></i> Quest
                      </span>
                      <span className="quest-row-text">{renderTextWithManaSymbols(questText)}</span>
                    </div>
                  )}
                  {rewardText && (
                    <div className="quest-row quest-row-reward">
                      <span className="quest-badge quest-badge-reward">
                        <i className="fa-solid fa-gift"></i> Reward
                      </span>
                      <span className="quest-row-text">{renderTextWithManaSymbols(rewardText)}</span>
                    </div>
                  )}
                  {opponentsText && (
                    <div className="quest-row quest-row-opponents">
                      <span className="quest-badge quest-badge-opponents">
                        <i className="fa-solid fa-skull-crossbones"></i> Opponents
                      </span>
                      <span className="quest-row-text">{renderTextWithManaSymbols(opponentsText)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {card.keywords && card.keywords.length > 0 && (
                <div className="card-keywords-list">
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#e2b127", marginRight: "3px" }}>
                    <i className="fa-solid fa-bolt" style={{ marginRight: "3px" }}></i>
                    Keywords:
                  </span>
                  {card.keywords.map((kw, i) => (
                    <span key={i} className="card-keyword">
                      {kw}
                      {i < card.keywords!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}

              {card.rulesText && (
                <p className="card-rules-text">{renderTextWithManaSymbols(card.rulesText)}</p>
              )}

              {card.customDescription && card.customDescription !== card.rulesText && (
                <p className="card-custom-description">{renderTextWithManaSymbols(card.customDescription)}</p>
              )}

              {(() => {
                const nameLower = (card.name || "").toLowerCase();
                const isNoTargetSpell = nameLower.includes("summon demon");
                if (!isNoTargetSpell) return null;

                return (
                  <div 
                    className="card-no-target-badge" 
                    style={{ 
                      marginTop: "4px", 
                      fontSize: "0.72rem", 
                      color: "#00ffcc", 
                      fontWeight: "bold",
                      background: "rgba(0, 255, 204, 0.12)",
                      border: "1px solid rgba(0, 255, 204, 0.4)",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <i className="fa-solid fa-bullseye" style={{ fontSize: "0.7rem" }}></i>
                    <span>No Target (Drop Anywhere)</span>
                  </div>
                );
              })()}

              {(() => {
                const rawSpells = card.spells || (card as any).spell;
                if (!rawSpells) return null;
                const spellsArr = Array.isArray(rawSpells)
                  ? rawSpells
                  : typeof rawSpells === "string"
                  ? rawSpells.split(",").map((s: string) => s.trim())
                  : [rawSpells];
                const resolvedSpells = spellsArr
                  .filter(Boolean)
                  .map((s: any) => (typeof s === "string" ? resolveCardNameFromRef(s, cardPool) : (s.name || String(s))));
                const uniqueSpells = Array.from(new Set(resolvedSpells.filter(Boolean)));
                if (uniqueSpells.length === 0) return null;
                const spellsStr = uniqueSpells.join(", ");
                const rulesTextHasIt = (card.rulesText || "").includes("Spells:") || (card.customDescription || "").includes("Spells:");
                if (rulesTextHasIt) return null;

                return (
                  <div className="card-spells-badge" style={{ marginTop: "4px", fontSize: "0.78rem", color: "#00e5ff", fontWeight: "bold" }}>
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: "4px" }}></i>
                    Spells: {spellsStr}
                  </div>
                );
              })()}

              {(() => {
                const rawComp = card.companions || card.companion || (card as any).campanian || (card as any).Campanian;
                if (!rawComp) return null;
                const compArr = Array.isArray(rawComp)
                  ? rawComp
                  : typeof rawComp === "string"
                  ? rawComp.split(",").map((s: string) => s.trim())
                  : [rawComp];
                const resolvedComp = compArr
                  .filter(Boolean)
                  .map((c: any) => (typeof c === "string" ? resolveCardNameFromRef(c, cardPool) : (c.name || String(c))));
                const uniqueComp = Array.from(new Set(resolvedComp.filter(Boolean)));
                if (uniqueComp.length === 0) return null;
                const compStr = uniqueComp.join(", ");
                const rulesTextHasIt = (card.rulesText || "").includes("Companions:") || (card.customDescription || "").includes("Companions:");
                if (rulesTextHasIt) return null;

                return (
                  <div className="card-companions-badge" style={{ marginTop: "4px", fontSize: "0.78rem", color: "#ffb703", fontWeight: "bold" }}>
                    <i className="fa-solid fa-paw" style={{ marginRight: "4px" }}></i>
                    Companions: {compStr}
                  </div>
                );
              })()}
            </>
          )}

          {card.activatedAbilities && card.activatedAbilities.length > 0 && (
            <div className="card-activated-abilities">
              {card.activatedAbilities.map((ability, index) => {
                const info = getAbilityType(ability.text);
                const isBattleRestricted = info.type === "battle" && !isInBattle;
                const costStr = ability.cost.join("");
                const canAfford = canPayAbilityCost ? canPayAbilityCost(costStr) : true;
                
                const isPassive = ability.cost.length === 0;
                const isDisabled = !isPassive && (!canAfford || isBattleRestricted);
                const isClickable = isLarge && !isDisabled && !isPassive;

                let titleMsg = "";
                if (isPassive) {
                  titleMsg = "This is a passive ability and is always active.";
                } else if (isBattleRestricted) {
                  titleMsg = "This is a combat ability and can only be activated during battle.";
                } else if (!canAfford) {
                  titleMsg = "You do not have enough mana in your pool to pay for this ability.";
                }

                const handleAbilityTrigger = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!isClickable) return;
                  
                  const isManaChoice = ability.text.toLowerCase().includes("mana of any color") || 
                                       ability.text.toLowerCase().includes("mana of any type");
                  
                  if (isManaChoice) {
                    setActiveChoiceAbility(activeChoiceAbility === ability ? null : ability);
                  } else if (ability.text === "Level Up!") {
                    setPendingActivation({
                      ability,
                      chosenColor: undefined
                    });
                  } else {
                    if (onActivateAbility) {
                      onActivateAbility(card, ability);
                    }
                  }
                };

                return (
                  <div key={index} className="ability-item-container" style={{ width: "100%" }}>
                    <div
                      className={`card-activated-ability ${isClickable ? "clickable-ability" : ""} ${isDisabled ? "disabled-ability" : ""}`}
                      onClick={isLarge ? handleAbilityTrigger : undefined}
                      title={titleMsg}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {ability.cost.length > 0 && (
                          <span className="ability-cost">
                            {ability.cost.map((symbol, sIdx) => (
                              <img
                                key={sIdx}
                                src={getManaDataUri(symbol)}
                                alt={symbol}
                                className="ability-mana-icon"
                                draggable={false}
                              />
                            ))}
                          </span>
                        )}
                        <span className="ability-text">
                          {ability.cost.length > 0 ? ": " : ""}
                          {ability.text}
                        </span>
                      </div>
                    </div>
                    
                    {activeChoiceAbility === ability && (
                      <div className="inline-mana-picker-container">
                        <span className="inline-picker-label">Choose color to add:</span>
                        <div className="inline-mana-picker-list">
                          {["W", "U", "B", "R", "G", "C"].map((color) => (
                            <button
                              key={color}
                              className={`inline-mana-picker-btn ${color}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingActivation({
                                  ability,
                                  chosenColor: color
                                });
                              }}
                              title={`Add ${color} Mana`}
                            >
                              <img
                                src={getManaDataUri(color)}
                                alt={color}
                                className="inline-mana-picker-icon"
                                draggable={false}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!cardTypeLower.includes("spell") && (isCreature || cardTypeLower.includes("tower") || isWizardCard(card) || cardTypeLower.includes("wizard") || cardTypeLower.includes("hero")) && card.power !== undefined && card.toughness !== undefined && card.power !== "" && card.toughness !== "" && (
          <div
            className={`card-stats-bubble ${hasTemporaryDebuff || card.hasTemporaryDebuff ? "debuffed" : (hasTemporaryBoost || card.hasTemporaryBoost || (card as any).isBuffed ? "boosted" : "")}`}
            onClick={(e) => {
              const isWiz = isWizardCard(card) || cardTypeLower.includes("wizard") || cardTypeLower.includes("hero") || cardNameLower.includes("wizard");
              if (isWiz) {
                e.stopPropagation();
                e.preventDefault();
                if (onShowWizardBuffs) {
                  onShowWizardBuffs();
                }
                window.dispatchEvent(new CustomEvent("openWizardBuffsModal", { detail: { card } }));
              }
            }}
            style={{
              cursor: (isWizardCard(card) || cardTypeLower.includes("wizard") || cardTypeLower.includes("hero") || cardNameLower.includes("wizard")) ? "pointer" : undefined,
              zIndex: 35
            }}
            title={(isWizardCard(card) || cardTypeLower.includes("wizard") || cardTypeLower.includes("hero") || cardNameLower.includes("wizard")) ? "Click to view Wizard Attribute Buffs" : undefined}
          >
            <span>
              {card.power}/{card.toughness}
            </span>
          </div>
        )}

        {/* Quest Power Gauge */}
        {isQuestCard && (() => {
          const levelObj = card.questData?.levels?.[card.questLevel || 0];
          let combinedPower = 0;
          if (levelObj) {
            if (levelObj.opponents && levelObj.opponents.length > 0) {
              const resolvedOpponents = levelObj.opponents.map(ref => 
                resolveOpponentCard(ref, cardPool)
              );
              combinedPower = resolvedOpponents.reduce((sum, opp) => {
                const p = parseInt(opp.power || "0", 10);
                return sum + (isNaN(p) ? 0 : p);
              }, 0);
            } else if (levelObj.army) {
              combinedPower = levelObj.army.power;
            } else if (levelObj.armyPower !== undefined) {
              combinedPower = levelObj.armyPower;
            }
          }
          return (
            <div 
              className="card-stats-bubble" 
              style={{ 
                color: "#ff3b30", 
                borderColor: "#ff3b30",
                boxShadow: "0 0 10px rgba(255, 59, 48, 0.4)",
              }}
              title="Combined Opponent Power Gauge"
            >
              <span>{combinedPower}</span>
            </div>
          );
        })()}

        {/* Wizard XP Bar / Badge (Only for Wizards, excluding Towers) */}
        {((cardTypeLower.includes("wizard") || cardNameLower.includes("wizard")) &&
          !cardTypeLower.includes("tower") && !cardNameLower.includes("tower") &&
          !cardNameLower.includes("victory") && !cardTypeLower.includes("victory")) && (
          (() => {
            const getWizardLevelFromCardObj = (c: typeof card): number => {
              const subTypeLower = (c.cardSubType || "").toLowerCase();
              const subTypeMatch = subTypeLower.match(/level\s*(\d+)/i) || subTypeLower.match(/\bl(\d+)\b/i);
              if (subTypeMatch) return parseInt(subTypeMatch[1], 10);
              const match = (c.name || "").match(/Wizard L(\d+)/i) || (c.name || "").match(/Wizard Lv(\d+)/i);
              if (match) return parseInt(match[1], 10);
              if (c.name === "Grand Archmage") return 4;
              if (c.name === "Archmage Adept") return 3;
              if (c.name === "Wizard Mage") return 2;
              return 1;
            };
            const getXpThreshold = (l: number) => {
              if (l === 1) return 200;
              if (l === 2) return 500;
              if (l === 3) return 1000;
              if (l === 4) return 2000;
              return 2000;
            };
            const lvl = getWizardLevelFromCardObj(card);
            const threshold = getXpThreshold(lvl);
            const currentXp = card.xp !== undefined ? card.xp : 0;
            const xpDisplay = lvl >= 5 ? `${currentXp} XP` : `${currentXp}/${threshold} XP`;
            return (
              <div 
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#0f172a",
                  border: "1.5px solid #3b82f6",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: isLarge ? "0.95rem" : "0.72rem",
                  color: "#3b82f6",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.4), 0 0 8px rgba(59, 130, 246, 0.25)",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
                title={`Level ${lvl} Wizard Experience Points`}
              >
                <span>{xpDisplay}</span>
              </div>
            );
          })()
        )}
      </div>
    </div>
 
    {isModalOpen && createPortal(
      <div className="card-modal-overlay" onClick={handleCloseCardModal}>
        <div className="card-modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="card-modal-close" onClick={handleCloseCardModal} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <GameCard 
            card={card} 
            isPreview={true} 
            isLarge={true} 
            onActivateAbility={onActivateAbility}
            canPayAbilityCost={canPayAbilityCost}
            isInBattle={isInBattle}
            cardPool={cardPool}
            hasTemporaryBoost={hasTemporaryBoost}
            hasTemporaryDebuff={hasTemporaryDebuff}
          />
        </div>
      </div>,
      document.body
    )}

    {pendingActivation && createPortal(
      <div className="ability-modal-overlay" onClick={() => setPendingActivation(null)}>
        <div className="ability-modal-container glass" onClick={(e) => e.stopPropagation()} style={{ padding: "24px", maxWidth: "400px" }}>
          <h3 className="ability-modal-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px 0", fontSize: "1.25rem", color: "#f8fafc" }}>
            <i className="fa-solid fa-circle-question" style={{ color: "#38bdf8" }}></i> Confirm Ability
          </h3>
          
          <div className="ability-modal-detail" style={{ margin: "0 0 20px 0" }}>
            <p className="ability-detail-text" style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#cbd5e1", textAlign: "left" }}>
              {pendingActivation.ability.text === "Level Up!" ? (
                <span>Do you want to pay <strong>{pendingActivation.ability.cost.join("").replace(/^C/, "")} colorless mana</strong> to Level Up your Wizard?</span>
              ) : (
                <span>Do you want to pay <strong>{pendingActivation.ability.cost.join("").replace(/^C/, "")} colorless mana</strong> to produce one <strong>{getColorName(pendingActivation.chosenColor!)} mana</strong>?</span>
              )}
            </p>
          </div>

          <div className="ability-modal-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button 
              className="ability-btn confirm" 
              onClick={() => {
                if (onActivateAbility) {
                  onActivateAbility(card, pendingActivation.ability, { chosenColor: pendingActivation.chosenColor });
                }
                setPendingActivation(null);
                setActiveChoiceAbility(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
                color: "#0a0f1d",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
                transition: "all 0.2s"
              }}
            >
              Confirm
            </button>
            <button 
              className="ability-btn cancel" 
              onClick={() => setPendingActivation(null)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
  </>
  );
};

