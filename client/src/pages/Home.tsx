// Paper Lantern Cinema: the creator is calm and editorial; the recipient is cinematic, tactile, and specific.
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, Heart, MapPin, MessageCircle, Play, RotateCcw, Share2, Sparkles, Volume2, WandSparkles, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { demoBlueprint } from "@shared/birthday";
import { DynamicBirthdayScene } from "@/components/DynamicBirthdayScene";

type Relationship = "Best friend" | "Partner" | "Parent" | "Sibling" | "Colleague" | "Other";
type Tone = "laugh" | "heartfelt" | "roast" | "everything";
type Step = 1 | 2 | 3;
type Scene = { type: string; importance?: string; visual_concept?: string; interaction?: "tap_to_reveal" | "tap_to_advance" | "none"; setup: string; beats: string[]; punchline: string; pacing?: string; confirmed_details: string[] };
type Blueprint = {
  recipient: { name: string; nickname: string; relationship: Relationship };
  about: string;
  message: string;
  tone: Tone;
  scenes?: Scene[];
  card_layout?: "cinema" | "scrapbook" | "editorial" | "terminal" | "postcard";
  visual_style?: "bestfriend" | "romantic" | "family" | "playful" | "editorial";
  arc_type?: "roast_to_sincere" | "curious_to_warm" | "playful_to_sincere" | "quiet_to_joyful";
  music_mood?: "upbeat_then_soft" | "bright" | "soft" | "cinematic";
  pacing?: { overall?: string; scene_transition?: "cinematic" | "snappy" | "gentle" };
};

const DEMO_INPUT = {
  name: "Ahmed",
  nickname: "Shani",
  relationship: "Best friend" as Relationship,
  about: "Shani is competitive, obsessed with cricket, thinks he's hilarious, and we once got completely lost in Lahore for three hours. We also stayed up all night gaming once. He always thinks he can beat everyone at everything.",
  message: "Happy birthday bro. Honestly I don't know how you've survived another year. We've had some ridiculous memories and I genuinely wouldn't trade any of them. Stay exactly the same idiot you are.",
  tone: "everything" as Tone,
};
const DEMO: Blueprint = { ...DEMO_INPUT, ...demoBlueprint(DEMO_INPUT) };

const tones: { value: Tone; label: string; icon: string }[] = [
  { value: "laugh", label: "Make them laugh", icon: "↗" },
  { value: "heartfelt", label: "Make it heartfelt", icon: "♡" },
  { value: "roast", label: "Roast them", icon: "✦" },
  { value: "everything", label: "A bit of everything", icon: "✺" },
];

function slugFor(name: string, nickname: string) {
  const base = (nickname || name || "birthday").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/birthday/${base || "someone"}-x7k2`;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [mode, setMode] = useState<"landing" | "creator" | "generating" | "recipient" | "share">("landing");
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Blueprint>(DEMO);
  const [scene, setScene] = useState(0);
  const [mapRevealed, setMapRevealed] = useState(false);
  const [sound, setSound] = useState(false);
  const [generationLine, setGenerationLine] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [photoUpload, setPhotoUpload] = useState<{ fileName: string; contentType: "image/jpeg" | "image/png" | "image/webp"; base64: string } | null>(null);
  const generateExperience = trpc.birthday.generate.useMutation();
  const addPhoto = trpc.birthday.addPhoto.useMutation();

  const slug = useMemo(() => slugFor(form.recipient.name, form.recipient.nickname), [form.recipient.name, form.recipient.nickname]);

  const updateRecipient = (key: keyof Blueprint["recipient"], value: string) => setForm((current) => ({ ...current, recipient: { ...current.recipient, [key]: value } as Blueprint["recipient"] }));
  const beginCreator = () => { setMode("creator"); setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startGeneration = async () => {
    setMode("generating");
    setGenerationLine(0);
    if (!isAuthenticated) return;
    try {
      const result = await generateExperience.mutateAsync({ name: form.recipient.name, nickname: form.recipient.nickname, relationship: form.recipient.relationship, about: form.about, message: form.message, tone: form.tone });
      setPublishedSlug(result.slug);
      setForm((current) => ({ ...current, about: result.blueprint.source_details, message: result.blueprint.creator_message, recipient: result.blueprint.recipient }));
      if (photoUpload && result.experienceId) {
        try {
          await addPhoto.mutateAsync({ experienceId: result.experienceId, ...photoUpload });
          toast.success("Your photo is tucked into the private cut.");
        } catch {
          toast.error("The experience is ready, but the photo could not be uploaded. You can continue without it.");
        }
      }
      toast.success(result.fallback ? "Your private cut is ready with our safe fallback director." : "Your private cut is ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't make the experience yet.");
      setMode("creator");
    }
  };

  useEffect(() => {
    if (mode !== "generating") return;
    const timer = window.setInterval(() => setGenerationLine((line) => line + 1), 850);
    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode === "generating" && generationLine >= 5) {
      const timer = window.setTimeout(() => { setMode("recipient"); setScene(0); setMapRevealed(false); }, 680);
      return () => window.clearTimeout(timer);
    }
  }, [mode, generationLine]);

  const openDemo = () => { setForm(DEMO); setPublishedSlug(null); setMode("recipient"); setScene(0); setMapRevealed(false); setShowDemo(false); };

  return (
    <div className="app-shell">
      {mode === "landing" && <Landing onCreate={beginCreator} onDemo={() => setShowDemo(true)} />}
      {mode === "creator" && <Creator step={step} setStep={setStep} form={form} setForm={setForm} onBack={() => setMode("landing")} onGenerate={startGeneration} updateRecipient={updateRecipient} photoUpload={photoUpload} setPhotoUpload={setPhotoUpload} />}
      {mode === "generating" && <Generation name={form.recipient.nickname || form.recipient.name} line={generationLine} />}
      {mode === "recipient" && <Recipient blueprint={form} scene={scene} setScene={setScene} mapRevealed={mapRevealed} setMapRevealed={setMapRevealed} sound={sound} setSound={setSound} onClose={() => setMode("landing")} onShare={() => setMode("share")} />}
      {mode === "share" && <SharePage blueprint={form} slug={publishedSlug ? `/birthday/${publishedSlug}` : slug} onPreview={() => { setMode("recipient"); setScene(0); }} onCreate={() => { setForm(DEMO); setMode("creator"); setStep(1); }} />}
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} onOpen={openDemo} />}
    </div>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <div className={`brand ${inverse ? "brand-inverse" : ""}`}><span className="brand-mark">╱</span><span className="brand-wordmark">birthday<span className="brand-dot">.</span>experience</span></div>;
}

function Landing({ onCreate, onDemo }: { onCreate: () => void; onDemo: () => void }) {
  return <main className="landing">
    <nav className="topbar"><Brand /><div className="nav-note"><span className="status-dot" /> Made for one person</div><button className="nav-button" onClick={onDemo}>See the demo <ArrowRight size={16} /></button></nav>
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> A better kind of birthday surprise</div>
        <h1>Don’t just say<br /><em>happy birthday.</em><br /><span>Make it an experience.</span></h1>
        <p className="hero-sub">Tell us about them. We’ll make something only they could receive.</p>
        <div className="hero-actions"><button className="primary-button" onClick={onCreate}>Create one <ArrowRight size={18} /></button><button className="text-button" onClick={onDemo}><Play size={15} fill="currentColor" /> See how it feels</button></div>
        <div className="proof-line"><div className="proof-avatars"><span>↗</span><span>♡</span><span>✦</span></div><span>For the people who deserve more than a text.</span></div><div className="private-cut-stamp"><span>PRIVATE CUT / 01</span><b>nickname → inside joke → reaction</b></div>
      </div>
      <div className="hero-demo-wrap"><PhoneDemo /></div>
    </section>
    <section className="landing-foot"><div><span className="foot-index">01</span><strong>The brief</strong><span>Give us the nickname, the cricket obsession, the Lahore story.</span></div><div><span className="foot-index">02</span><strong>The private cut</strong><span>We turn the good stuff into scenes, not a template.</span></div><div><span className="foot-index">03</span><strong>The reaction</strong><span>They see their name, then wonder how you made it.</span></div></section>
  </main>;
}

function PhoneDemo() {
  const [frame, setFrame] = useState(0);
  const frames = [
    <><div className="phone-kicker">Someone made something<br />for you<span>...</span></div><div className="phone-envelope"><div className="envelope-flap" /><div className="envelope-seal">✦</div></div><div className="phone-tap">Tap to open <ArrowRight size={14} /></div></>,
    <><div className="phone-kicker">There was one name<br />only certain people use<span>...</span></div><div className="phone-name">SHANI</div><div className="phone-orbit orbit-one" /><div className="phone-orbit orbit-two" /></>,
    <><div className="phone-kicker">Scoreboard says<span>...</span></div><div className="phone-score"><span>AGE</span><b>+1</b><span>CONFIDENCE</span><b>MAX</b><span>MATURITY</span><b>ERROR</b></div></>,
    <><div className="phone-kicker">GPS initializing<span>...</span></div><div className="mini-map"><span className="map-route" /><span className="mini-pin pin-a" /><span className="mini-pin pin-b" /></div><div className="mini-map-copy">RECALCULATING<span>...</span></div></>,
    <><div className="phone-kicker">And then, somehow<span>...</span></div><div className="phone-birthday">HAPPY<br /><em>BIRTHDAY</em><small>SHANI ♡</small></div></>,
  ];
  useEffect(() => { const timer = window.setInterval(() => setFrame((current) => (current + 1) % frames.length), 2300); return () => window.clearInterval(timer); }, [frames.length]);
  return <div className="phone-stage"><div className="phone-top-glow" /><div className="phone"><div className="phone-notch" /><div className={`phone-screen frame-${frame}`}>{frames[frame]}<div className="phone-progress">{frames.map((_, i) => <span key={i} className={i === frame ? "active" : ""} />)}</div></div></div><div className="demo-label"><span>LIVE PREVIEW</span><i /> Five tiny scenes. One very personal reaction.</div></div>;
}

function Creator({ step, setStep, form, setForm, onBack, onGenerate, updateRecipient, photoUpload, setPhotoUpload }: { step: Step; setStep: (step: Step) => void; form: Blueprint; setForm: (form: Blueprint) => void; onBack: () => void; onGenerate: () => void; updateRecipient: (key: keyof Blueprint["recipient"], value: string) => void; photoUpload: { fileName: string; contentType: "image/jpeg" | "image/png" | "image/webp"; base64: string } | null; setPhotoUpload: (value: { fileName: string; contentType: "image/jpeg" | "image/png" | "image/webp"; base64: string } | null) => void }) {
  const canContinue = step === 1 ? Boolean(form.recipient.name && form.recipient.relationship) : true;
  return <main className="creator-page"><nav className="creator-nav"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back</button><Brand /><div className="step-indicator"><span>0{step}</span> / 03</div></nav><div className="creator-layout"><aside className="creator-aside"><div className="aside-kicker">THE GOOD PART</div><h2>Give us the<br /><em>human stuff.</em></h2><p>You don’t need to be a designer. Just tell us what makes them them.</p><div className="aside-note"><span className="aside-mark">╱</span><span>We’ll make the creative decisions for you.</span></div></aside><section className="creator-main"><div className="progress-rail"><span className={step >= 1 ? "done" : ""} /><span className={step >= 2 ? "done" : ""} /><span className={step >= 3 ? "done" : ""} /></div>{step === 1 && <StepOne form={form} updateRecipient={updateRecipient} />}{step === 2 && <StepTwo form={form} setForm={setForm} photoUpload={photoUpload} setPhotoUpload={setPhotoUpload} />}{step === 3 && <StepThree form={form} setForm={setForm} />}<div className="creator-footer"><span className="optional-note">{step === 1 ? "Only name + relationship are required." : "You can always keep it simple."}</span>{step > 1 && <button className="quiet-button" onClick={() => setStep((step - 1) as Step)}><ArrowLeft size={16} /> Back</button>}{step < 3 ? <button className="primary-button" disabled={!canContinue} onClick={() => setStep((step + 1) as Step)}>Continue <ArrowRight size={17} /></button> : <button className="primary-button" onClick={onGenerate}><Sparkles size={17} /> Make their birthday experience</button>}</div></section></div></main>;
}

function StepOne({ form, updateRecipient }: { form: Blueprint; updateRecipient: (key: keyof Blueprint["recipient"], value: string) => void }) { return <div className="form-step"><div className="form-eyebrow">STEP 01 <span>WHO IS THIS FOR?</span></div><h1>Who is this for?</h1><p className="form-lede">Tell us a little about them. We’ll take it from there.</p><label>Name <span>Required</span><input autoFocus value={form.recipient.name} onChange={(event) => updateRecipient("name", event.target.value)} placeholder="Their name" /></label><label>What do you call them? <span>Optional</span><input value={form.recipient.nickname} onChange={(event) => updateRecipient("nickname", event.target.value)} placeholder="Nickname, if they have one" /></label><fieldset><legend>What are they to you?</legend><div className="relationship-grid">{(["Best friend", "Partner", "Parent", "Sibling", "Colleague", "Other"] as Relationship[]).map((item) => <button type="button" key={item} className={form.recipient.relationship === item ? "selected" : ""} onClick={() => updateRecipient("relationship", item)}>{item}{form.recipient.relationship === item && <Check size={15} />}</button>)}</div></fieldset></div>; }

function StepTwo({ form, setForm, photoUpload, setPhotoUpload }: { form: Blueprint; setForm: (form: Blueprint) => void; photoUpload: { fileName: string; contentType: "image/jpeg" | "image/png" | "image/webp"; base64: string } | null; setPhotoUpload: (value: { fileName: string; contentType: "image/jpeg" | "image/png" | "image/webp"; base64: string } | null) => void }) { const [expanded, setExpanded] = useState<string | null>(null); return <div className="form-step"><div className="form-eyebrow">STEP 02 <span>TELL US ABOUT THEM</span></div><h1>Tell us about them</h1><p className="form-lede">Tell us whatever comes to mind — their personality, what they love, a funny memory, an inside joke, anything that makes them them.</p><label>About them <span>Optional, but the good stuff helps</span><textarea autoFocus value={form.about} onChange={(event) => setForm({ ...form, about: event.target.value })} placeholder="Shani is competitive, obsessed with cricket, and we once got completely lost in Lahore for three hours..." /></label><div className="inline-additions">{["inside joke", "memory", "photos"].map((item) => <div key={item}><button onClick={() => setExpanded(expanded === item ? null : item)}><span>＋</span> Add an {item}</button>{expanded === item && <div className="inline-reveal">{item === "photos" ? <label className="photo-picker">{photoUpload ? `Ready: ${photoUpload.fileName}` : "Choose one photo (optional)"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setPhotoUpload({ fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp", base64: String(reader.result) }); reader.readAsDataURL(file); }} /></label> : `Add the ${item} here when it comes to you.`}<X size={14} onClick={() => setExpanded(null)} /></div>}</div>)}</div></div>; }

function StepThree({ form, setForm }: { form: Blueprint; setForm: (form: Blueprint) => void }) { return <div className="form-step"><div className="form-eyebrow">STEP 03 <span>THE PART ONLY YOU CAN WRITE</span></div><h1>What do you want<br />to say to them?</h1><p className="form-lede">This is the part only you can write. We’ll make sure it gets the moment it deserves.</p><label>Your message <span>Optional</span><textarea autoFocus className="message-field" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Happy birthday bro. Honestly I don't know how you've survived another year..." /></label><fieldset><legend>What should they feel? <span>Optional</span></legend><div className="tone-grid">{tones.map((tone) => <button type="button" key={tone.value} className={form.tone === tone.value ? "selected" : ""} onClick={() => setForm({ ...form, tone: tone.value })}><b>{tone.icon}</b>{tone.label}</button>)}</div></fieldset></div>; }

function Generation({ name, line }: { name: string; line: number }) { const lines = [`Getting to know ${name}...`, "Finding the best parts...", "Building something around that Lahore story...", "Making it personal...", "Putting it all together...", "Almost ready..."]; return <main className="generation-page"><div className="generation-center"><div className="generation-mark">╱</div><p className="generation-kicker">A PRIVATE CUT FOR {name.toUpperCase()}</p><h1>{lines[Math.min(line, lines.length - 1)]}</h1><div className="generation-line"><span style={{ width: `${Math.min(100, (line + 1) * 17)}%` }} /></div><div className="generation-caption"><span className="pulse-dot" /> Turning the good stuff into a little world.</div></div><div className="generation-corner">BIRTHDAY<br />EXPERIENCE / 01</div></main>; }

function Recipient({ blueprint, scene, setScene, mapRevealed, setMapRevealed, sound, setSound, onClose, onShare }: { blueprint: Blueprint; scene: number; setScene: (scene: number) => void; mapRevealed: boolean; setMapRevealed: (value: boolean) => void; sound: boolean; setSound: (value: boolean) => void; onClose: () => void; onShare: () => void }) {
  const name = blueprint.recipient.nickname || blueprint.recipient.name;
  const generatedScenes = blueprint.scenes || [];
  const isDynamic = generatedScenes.length > 0;
  const total = isDynamic ? generatedScenes.length + 2 : 6;
  const finalScene = total - 1;
  const next = () => setScene(Math.min(scene + 1, finalScene));
  const previous = () => setScene(Math.max(scene - 1, 0));
  const sceneData = isDynamic ? generatedScenes[scene - 1] : undefined;
  return <main className={`recipient-world scene-${scene} blueprint-style-${blueprint.visual_style || "bestfriend"} blueprint-arc-${blueprint.arc_type || "playful_to_sincere"} blueprint-mood-${blueprint.music_mood || "cinematic"}`}>
    <button className="recipient-close" onClick={onClose}><X size={17} /></button><button className="sound-toggle" onClick={() => setSound(!sound)}>{sound ? <Volume2 size={15} /> : <Volume2 size={15} />} {sound ? "Sound on" : "Sound off"}</button><div className="recipient-scene"><div className="scene-index">{String(scene + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span></div>
      {scene === 0 && <OpenScene onOpen={next} name={name} />}
      {isDynamic && scene > 0 && scene < finalScene && sceneData && <DynamicBirthdayScene scene={sceneData as any} index={scene - 1} total={generatedScenes.length} recipientName={name} creatorMessage={blueprint.message} cardLayout={blueprint.card_layout} visualStyle={blueprint.visual_style} arcType={blueprint.arc_type} musicMood={blueprint.music_mood} overallPacing={blueprint.pacing?.overall} onNext={next} onShare={scene === finalScene - 1 ? onShare : undefined} />}
      {!isDynamic && scene === 1 && <NicknameScene name={name} onNext={next} />}
      {!isDynamic && scene === 2 && <CricketScene onNext={next} />}
      {!isDynamic && scene === 3 && <MapScene revealed={mapRevealed} setRevealed={setMapRevealed} onNext={next} />}
      {!isDynamic && scene === 4 && <MessageScene message={blueprint.message} onNext={next} />}
      {scene === finalScene && <CelebrationScene name={name} message={blueprint.message} onShare={onShare} />}
    </div><div className="recipient-controls">{scene > 0 && <button onClick={previous}><ArrowLeft size={16} /> Previous</button>}<div className="scene-dots">{Array.from({ length: total }, (_, dot) => <span key={dot} className={dot === scene ? "active" : ""} />)}</div>{scene < finalScene && <button onClick={next}>Continue <ArrowRight size={16} /></button>}</div></main>;
}

function OpenScene({ onOpen, name }: { onOpen: () => void; name: string }) { return <div className="open-scene"><div className="recipient-kicker">A PRIVATE CUT FOR {name.toUpperCase()}</div><h1>Someone made<br /><em>something</em> for you<span>...</span></h1><button className="gift-object" onClick={onOpen}><div className="gift-lid" /><div className="gift-body"><span className="gift-ribbon" /></div><div className="gift-spark">✦</div></button><button className="tap-open" onClick={onOpen}>Tap to open <ArrowRight size={16} /></button></div>; }
function NicknameScene({ name, onNext }: { name: string; onNext: () => void }) { return <div className="nickname-scene"><div className="recipient-kicker">SCENE 01 / THE NAME</div><h2>There was one name<br />only certain people use<span>...</span></h2><div className="reveal-name">{name.toUpperCase()}</div><p className="scene-caption">The one that somehow suits you better.</p><button className="scene-cta" onClick={onNext}>Keep going <ArrowRight size={16} /></button></div>; }
function CricketScene({ onNext, scene }: { onNext: () => void; scene?: Scene }) { const setup = scene?.setup || "Another year. Still undefeated in your own head."; const beats = scene?.beats || ["AGE: +1", "CONFIDENCE: MAX", "MATURITY: ERROR"]; return <div className="cricket-scene"><div className="stadium-glow" /><div className="recipient-kicker">SCENE 02 / PERFORMANCE REVIEW</div><h2>{setup}</h2><div className="scoreboard"><div className="score-head"><span>SHANI XI</span><span>LIVE / 01</span></div><div className="score-row"><span>AGE</span><b>+1</b></div>{beats.slice(0, 4).map((beat, index) => <div className="score-row" key={`${beat}-${index}`}><span>{index === 0 ? "AGE" : index === 1 ? "DETAIL" : index === 2 ? "CONFIDENCE" : "MATURITY"}</span><b className={index === 2 ? "copper" : index === 3 ? "error" : ""}>{beat}</b></div>)}</div><button className="scene-cta" onClick={onNext}>There’s more <ArrowRight size={16} /></button></div>; }
function MapScene({ revealed, setRevealed, onNext, scene }: { revealed: boolean; setRevealed: (value: boolean) => void; onNext: () => void; scene?: Scene }) { const setup = scene?.setup || "One city. Zero sense of direction."; const punchline = scene?.punchline || "3 HOURS LATER"; return <div className="map-scene"><div className="recipient-kicker">SCENE 03 / THE INCIDENT</div><h2>{setup}</h2><div className={`map-canvas ${revealed ? "revealed" : ""}`}><div className="map-grid" /><div className="map-label label-lahore">LAHORE</div><div className="map-label label-current">CURRENT LOCATION: UNKNOWN</div><div className="route-line" /><MapPin className="map-pin pin-start" size={19} /><MapPin className="map-pin pin-end" size={19} /></div>{!revealed ? <button className="map-reveal" onClick={() => setRevealed(true)}><MapPin size={15} /> Recalculate route</button> : <><div className="map-punchline">{punchline}<span>...</span></div><button className="scene-cta" onClick={onNext}>But jokes aside <ArrowRight size={16} /></button></>}</div>; }
function MessageScene({ message, onNext }: { message: string; onNext: () => void }) { return <div className="message-scene"><div className="recipient-kicker">SCENE 04 / FROM THE PERSON WHO KNOWS</div><div className="message-quote">“{message || "Happy birthday. I hope this next year gives you more of the good stuff."}”</div><div className="message-signoff">No AI wrote this part.<br /><span>That’s all you.</span></div><button className="scene-cta" onClick={onNext}>One last thing <ArrowRight size={16} /></button></div>; }
function CelebrationScene({ name, message, onShare }: { name: string; message: string; onShare: () => void }) { return <div className="celebration-scene"><div className="confetti confetti-a" /><div className="confetti confetti-b" /><div className="confetti confetti-c" /><div className="recipient-kicker">PRIVATE CUT / FINAL SCENE</div><h1>HAPPY<br /><em>BIRTHDAY</em></h1><div className="celebration-name">{name} <Heart size={24} fill="currentColor" /></div><p>{message ? "Same idiot. More memories. Zero regrets." : "Keep the good parts close."}</p><button className="share-button" onClick={onShare}><Share2 size={16} /> It’s ready to share</button></div>; }

function SharePage({ blueprint, slug, onPreview, onCreate }: { blueprint: Blueprint; slug: string; onPreview: () => void; onCreate: () => void }) { const copy = () => { navigator.clipboard?.writeText(window.location.origin + slug); toast.success("Link copied to your clipboard."); }; const whatsapp = () => window.open(`https://wa.me/?text=${encodeURIComponent("I made something for you 🎁\nOpen this when you have a minute.\n" + window.location.origin + slug)}`, "_blank"); return <main className="share-page"><nav className="creator-nav"><Brand /><button className="back-button" onClick={onCreate}><RotateCcw size={16} /> Make another</button></nav><div className="share-layout"><div className="share-copy"><div className="form-eyebrow">THE PRIVATE LINK IS READY</div><h1>Send it to<br /><em>{blueprint.recipient.nickname || blueprint.recipient.name}.</em></h1><p>Don’t reveal the surprise. Just send this and wait for the reaction.</p><div className="share-link"><span>{window.location.origin}{slug}</span><button onClick={copy}><Copy size={16} /></button></div><div className="share-actions"><button className="primary-button" onClick={whatsapp}><MessageCircle size={17} /> Share on WhatsApp</button><button className="quiet-button bordered" onClick={copy}><Copy size={16} /> Copy link</button><button className="quiet-button bordered" onClick={() => { navigator.share?.({ title: "A birthday experience", url: window.location.origin + slug }); }}><Share2 size={16} /> Share</button></div></div><div className="share-preview"><div className="preview-label">PREVIEW / {blueprint.recipient.nickname?.toUpperCase() || blueprint.recipient.name.toUpperCase()}</div><div className="preview-card"><div className="preview-spark">╱</div><p>Someone made something<br />for you<span>...</span></p><div className="preview-card-name">{(blueprint.recipient.nickname || blueprint.recipient.name).toUpperCase()}</div><button onClick={onPreview}>Open preview <ArrowRight size={15} /></button></div></div></div></main>; }

function DemoModal({ onClose, onOpen }: { onClose: () => void; onOpen: () => void }) { return <div className="modal-backdrop" onClick={onClose}><div className="demo-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={16} /></button><div className="form-eyebrow">THE BENCHMARK CUT</div><h2>Meet Shani.</h2><p>Competitive. Cricket-obsessed. Lost in Lahore for three hours. Someone made something around all of it.</p><div className="modal-scenes"><span>nickname</span><span>scoreboard</span><span>inside joke</span><span>message</span></div><button className="primary-button" onClick={onOpen}><Play size={16} fill="currentColor" /> Open the demo</button></div></div>; }
