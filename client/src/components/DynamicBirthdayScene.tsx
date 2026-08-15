import { useState } from "react";
import { ArrowRight, Heart, MapPin, Share2, Sparkles } from "lucide-react";
import type { ExperienceBlueprint } from "@shared/birthday";
import { getScenePacingClass } from "@shared/birthdayScene";
import "@/ai-scenes.css";

type Scene = ExperienceBlueprint["scenes"][number];
type Props = {
  scene: Scene;
  index: number;
  total: number;
  recipientName: string;
  creatorMessage?: string;
  cardLayout?: ExperienceBlueprint["card_layout"];
  visualStyle?: ExperienceBlueprint["visual_style"];
  arcType?: ExperienceBlueprint["arc_type"];
  musicMood?: ExperienceBlueprint["music_mood"];
  overallPacing?: string;
  onNext?: () => void;
  onShare?: () => void;
};

function renderMode(scene: Scene) {
  return scene.render_mode || (scene.type === "inside_joke" ? "map" : scene.type === "hobby" ? "dashboard" : scene.type === "message" ? "letter" : "poster");
}

function SceneBody({ scene, mode, recipientName }: { scene: Scene; mode: string; recipientName: string }) {
  const beats = scene.beats.filter(Boolean);
  if (mode === "dashboard") return <div className="ai-render-dashboard"><div className="dashboard-title">LIVE READOUT / {recipientName.toUpperCase()}</div>{beats.map((beat, i) => <div className="dashboard-row" key={`${beat}-${i}`}><span>{i === 0 ? "SIGNAL" : i === 1 ? "ENERGY" : "STATUS"}</span><b>{beat}</b></div>)}</div>;
  if (mode === "map") return <div className="ai-render-map"><div className="map-grid-lines" /><MapPin className="render-map-pin render-map-pin-a" size={22} /><MapPin className="render-map-pin render-map-pin-b" size={22} /><span className="render-map-route" /><strong>{beats[0] || "ROUTE UNKNOWN"}</strong></div>;
  if (mode === "polaroid") return <div className="ai-render-polaroid"><div className="polaroid-image"><Sparkles size={22} /></div><p>{beats[0]}</p></div>;
  if (mode === "journal") return <div className="ai-render-journal"><span className="journal-date">PRIVATE ENTRY / {String(scene.importance).toUpperCase()}</span>{beats.map((beat, i) => <p key={`${beat}-${i}`}>{beat}</p>)}</div>;
  if (mode === "letter") return <div className="ai-render-letter"><div className="letter-seal"><Heart size={18} fill="currentColor" /></div><blockquote>{beats.join(" ")}</blockquote></div>;
  return <div className="ai-render-poster"><span>{recipientName.toUpperCase()}</span><strong>{beats[0] || scene.visual_concept}</strong><small>{beats.slice(1).join(" / ")}</small></div>;
}

export function DynamicBirthdayScene({ scene, index, total, recipientName, creatorMessage, cardLayout, visualStyle, arcType, musicMood, overallPacing, onNext, onShare }: Props) {
  const [revealed, setRevealed] = useState(scene.interaction === "none");
  const mode = renderMode(scene);
  const isFinal = index === total - 1;
  const canContinue = Boolean(isFinal ? onShare : onNext);
  const pacingClass = getScenePacingClass(scene, overallPacing);
  const tokens = scene.asset_tokens || { background: "plum", texture: "grain", lighting: "lantern", typography: "display", motif: "none" };
  return <section className={`ai-scene ai-card-layout-${cardLayout || "cinema"} ai-render-mode-${mode} ${pacingClass} ai-bg-${tokens.background} ai-texture-${tokens.texture} ai-light-${tokens.lighting} ai-type-${tokens.typography} ai-motif-${tokens.motif} ai-style-${visualStyle || "bestfriend"} ai-arc-${arcType || "playful_to_sincere"}`} data-visual-concept={scene.visual_concept} data-asset-direction={scene.asset_direction} data-music-mood={musicMood} style={{ ["--ai-asset-direction" as string]: `"${scene.asset_direction.replaceAll('"', "'")}"` }}>
    <div className="ai-scene-meta"><span>AI CARD / {String(index + 1).padStart(2, "0")} / {scene.type.replaceAll("_", " ").toUpperCase()}</span><span>{mode} / {scene.pacing.replaceAll("_", " ")}</span></div>
    <div className="ai-scene-content">
      <p className="ai-scene-visual"><Sparkles size={14} /> {scene.visual_concept}</p><p className="ai-asset-direction">{scene.asset_direction}</p>
      <h1>{scene.setup}</h1>
      {!revealed ? <button className="ai-reveal-card" onClick={() => setRevealed(true)}><span>{scene.interaction === "tap_to_reveal" ? "Open the detail only your person would recognize" : "Enter this card"}</span><ArrowRight size={18} /></button> : <>
        <SceneBody scene={scene} mode={mode} recipientName={recipientName} />
        {scene.confirmed_details.length > 0 && <div className="ai-confirmed">{scene.confirmed_details.map((detail) => <span key={detail}>{detail}</span>)}</div>}
        {scene.punchline && <p className="ai-punchline">{scene.punchline}</p>}
        {isFinal && creatorMessage && <p className="ai-creator-message">“{creatorMessage}”</p>}
        {canContinue && <button className="scene-cta" onClick={isFinal ? onShare : onNext}>{isFinal ? <><Share2 size={16} /> Share this little world</> : <>Next card <ArrowRight size={16} /></>}</button>}
      </>}
    </div>
  </section>;
}
