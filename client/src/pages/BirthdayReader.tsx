import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { DynamicBirthdayScene } from "@/components/DynamicBirthdayScene";

export default function BirthdayReader() {
  const [, params] = useRoute("/birthday/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, error } = trpc.birthday.read.useQuery({ slug }, { enabled: Boolean(slug) });
  const [scene, setScene] = useState(0);

  if (isLoading) return <main className="recipient-world scene-0"><div className="generation-center"><Loader2 className="spin" size={28} /><p className="generation-kicker">OPENING YOUR PRIVATE CUT</p></div></main>;
  if (error || !data) return <main className="recipient-world scene-0"><div className="generation-center"><p className="generation-kicker">THIS EXPERIENCE HAS GONE QUIET</p><h1>That link is no longer available.</h1></div></main>;

  const scenes = data.blueprint.scenes;
  const current = scenes[Math.min(scene, scenes.length - 1)];
  const next = () => setScene((value) => Math.min(value + 1, scenes.length - 1));
  const previous = () => setScene((value) => Math.max(value - 1, 0));

  return <main className={`recipient-world scene-${scene} blueprint-style-${data.blueprint.visual_style} blueprint-arc-${data.blueprint.arc_type} blueprint-mood-${data.blueprint.music_mood}`}>
    <button className="recipient-close" onClick={() => window.location.href = "/"}><X size={17} /></button>
    <div className="recipient-scene"><div className="scene-index">{String(scene + 1).padStart(2, "0")} <span>/ {String(scenes.length).padStart(2, "0")}</span></div>
      <DynamicBirthdayScene scene={current} index={scene} total={scenes.length} recipientName={data.recipientName} creatorMessage={data.blueprint.creator_message} cardLayout={data.blueprint.card_layout} visualStyle={data.blueprint.visual_style} arcType={data.blueprint.arc_type} musicMood={data.blueprint.music_mood} overallPacing={data.blueprint.pacing.overall} onNext={scene < scenes.length - 1 ? next : undefined} onShare={scene === scenes.length - 1 ? () => navigator.share?.({ title: `Birthday Experience for ${data.recipientName}`, url: window.location.href }) : undefined} />
    </div>
    <div className="recipient-controls">{scene > 0 && <button onClick={previous}><ArrowLeft size={16} /> Previous</button>}<div className="scene-dots">{scenes.map((_, index) => <span key={index} className={index === scene ? "active" : ""} />)}</div>{scene < scenes.length - 1 && <button onClick={next}>Continue <ArrowRight size={16} /></button>}</div>
  </main>;
}
