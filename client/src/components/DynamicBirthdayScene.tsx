import { useMemo, useState } from "react";
import { ArrowRight, Heart, MapPin, Share2, Sparkles } from "lucide-react";
import type { ExperienceBlueprint } from "@shared/birthday";
import { getScenePacingClass, getSceneVisualFamily } from "@shared/birthdayScene";
import "@/ai-scenes.css";

type Scene = ExperienceBlueprint["scenes"][number];

type Props = {
  scene: Scene;
  index: number;
  total: number;
  recipientName: string;
  creatorMessage?: string;
  visualStyle?: ExperienceBlueprint["visual_style"];
  arcType?: ExperienceBlueprint["arc_type"];
  musicMood?: ExperienceBlueprint["music_mood"];
  overallPacing?: string;
  onNext?: () => void;
  onShare?: () => void;
};

function kicker(scene: Scene, index: number) {
  const readable = scene.type.replaceAll("_", " ").toUpperCase();
  return `AI CUT / ${String(index + 1).padStart(2, "0")} / ${readable}`;
}

export function DynamicBirthdayScene({ scene, index, total, recipientName, creatorMessage, visualStyle, arcType, musicMood, overallPacing, onNext, onShare }: Props) {
  const [revealed, setRevealed] = useState(scene.interaction === "none");
  const family = useMemo(() => getSceneVisualFamily(scene, visualStyle), [scene, visualStyle]);
  const pacingClass = getScenePacingClass(scene, overallPacing);
  const beats = scene.beats.filter(Boolean);
  const confirmed = scene.confirmed_details.filter(Boolean);
  const isFinal = index === total - 1;
  const canContinue = Boolean(isFinal ? onShare : onNext);

  return (
    <section className={`ai-scene ai-scene-${family} ${pacingClass} ai-style-${visualStyle || "bestfriend"} ai-arc-${arcType || "playful_to_sincere"}`} data-visual-concept={scene.visual_concept} data-music-mood={musicMood} data-overall-pacing={overallPacing}>
      <div className="ai-scene-meta">
        <span>{kicker(scene, index)}</span>
        <span>{scene.pacing.replaceAll("_", " ")} / {overallPacing || "AI paced"}</span>
      </div>
      <div className="ai-scene-content">
        <p className="ai-scene-visual"><Sparkles size={14} /> {scene.visual_concept}</p>
        <h1>{scene.setup}</h1>
        {!revealed ? (
          <button className="ai-reveal-card" onClick={() => setRevealed(true)}>
            <span>{scene.interaction === "tap_to_reveal" ? "A detail only your person would recognize" : "Open the next cut"}</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <>
            <div className="ai-visual-panel">
              {family === "map" && <div className="ai-map-lines"><MapPin size={22} /><span /><MapPin size={22} /></div>}
              {family === "score" && <div className="ai-score-orbit"><span>PERSONALITY INDEX</span><b>{scene.importance.toUpperCase()}</b></div>}
              {family === "letter" && <div className="ai-letter-mark">“</div>}
              {family === "gallery" && <div className="ai-gallery-grid"><i /><i /><i /></div>}
              {family === "collage" && <div className="ai-collage-mark"><Heart size={26} /><span>{recipientName.toUpperCase()}</span></div>}
            </div>
            <div className="ai-beats">{beats.map((beat, beatIndex) => <p key={`${beat}-${beatIndex}`} className={beatIndex === 0 ? "lead" : ""}>{beat}</p>)}</div>
            {confirmed.length > 0 && <div className="ai-confirmed">{confirmed.map((detail) => <span key={detail}>{detail}</span>)}</div>}
            {scene.punchline && <p className="ai-punchline">{scene.punchline}</p>}
            {index === total - 1 && creatorMessage && <p className="ai-creator-message">“{creatorMessage}”</p>}
            {canContinue && <button className="scene-cta" onClick={isFinal ? onShare : onNext}>{isFinal ? <><Share2 size={16} /> Share this little world</> : <>Keep going <ArrowRight size={16} /></>}</button>}
          </>
        )}
      </div>
    </section>
  );
}
