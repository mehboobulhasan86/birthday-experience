import { useState } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

export default function BirthdayReader() {
  const [, params] = useRoute("/birthday/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, error } = trpc.birthday.read.useQuery({ slug }, { enabled: Boolean(slug) });
  const [scene, setScene] = useState(0);

  if (isLoading) return <main className="recipient-world scene-0"><div className="generation-center"><Loader2 className="spin" size={28} /><p className="generation-kicker">OPENING YOUR PRIVATE CUT</p></div></main>;
  if (error || !data) return <main className="recipient-world scene-0"><div className="generation-center"><p className="generation-kicker">THIS EXPERIENCE HAS GONE QUIET</p><h1>That link is no longer available.</h1></div></main>;
  const current = data.blueprint.scenes[Math.min(scene, data.blueprint.scenes.length - 1)];
  const next = () => setScene((value) => Math.min(value + 1, data.blueprint.scenes.length - 1));
  return <main className={`recipient-world scene-${scene}`}>
    <button className="recipient-close" onClick={() => window.location.href = "/"}><X size={17} /></button>
    <div className="recipient-progress">{data.blueprint.scenes.map((_, index) => <span key={index} className={index <= scene ? "active" : ""} />)}</div>
    <section className="reader-scene">
      <p className="scene-kicker">PRIVATE CUT / {String(scene + 1).padStart(2, "0")}</p>
      <p className="scene-setup">{current.setup}</p>
      <h1>{current.beats[0]}</h1>
      <div className="reader-beats">{current.beats.slice(1).map((beat) => <p key={beat}>{beat}</p>)}</div>
      {current.punchline && <p className="scene-punchline">{current.punchline}</p>}
      {scene < data.blueprint.scenes.length - 1 && <button className="scene-next" onClick={next}>Keep going <ArrowRight size={17} /></button>}
      {scene === data.blueprint.scenes.length - 1 && <button className="scene-next" onClick={() => navigator.share?.({ title: `Birthday Experience for ${data.recipientName}`, url: window.location.href })}>Share this little world <ArrowRight size={17} /></button>}
    </section>
  </main>;
}
