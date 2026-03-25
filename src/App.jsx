import { useState, useEffect, useCallback } from "react";
import _ from "lodash";

// ============================================================
// LA MAISON DU BONHEUR 2026 — Ultimate Vacation HQ v2
// ============================================================

const DEFAULT_FAMILIES = [
  {
    id: "philibert-rahal",
    name: "Philibert-Rahal",
    emoji: "🦁",
    color: "#E8733A",
    members: [
      { id: "alexandra", name: "Alexandra", role: "adult", avatar: "👩‍🦱", diet: "", activities: ["Piscine", "Randonnée", "Lecture"], bio: "" },
      { id: "nacim", name: "Nacim", role: "adult", avatar: "👨", diet: "", activities: ["Canoë", "Pétanque", "BBQ"], bio: "" },
      { id: "priam", name: "Priam", role: "child", age: 4, avatar: "👦", diet: "", activities: ["Piscine", "Trampoline", "Dessin"], bio: "" },
    ],
    room: "Chambre 4 (RDC)",
  },
  {
    id: "schmidt-privey",
    name: "Schmidt-Privey",
    emoji: "🐻",
    color: "#4A90D9",
    members: [
      { id: "sarah-marine", name: "Sarah-Marine", role: "adult", avatar: "👩", diet: "", activities: ["Yoga", "Randonnée", "Marchés"], bio: "" },
      { id: "nicolas", name: "Nicolas", role: "adult", avatar: "👨‍🦰", diet: "", activities: ["Ping-pong", "Vélo", "Cuisine"], bio: "" },
      { id: "paul", name: "Paul", role: "child", age: 11, avatar: "🧒", diet: "", activities: ["Foot", "Piscine", "Jeux vidéo"], bio: "" },
      { id: "lucas", name: "Lucas", role: "child", age: 9, avatar: "👦", diet: "", activities: ["Ping-pong", "Piscine", "Mölkky"], bio: "" },
    ],
    room: "Chambre 3 (Étage) — Enfants au dortoir Ch.6",
  },
  {
    id: "louison-lutyens",
    name: "Louison-Lutyens",
    emoji: "🦊",
    color: "#6BBF6B",
    members: [
      { id: "floriane", name: "Floriane", role: "adult", avatar: "👩‍🦳", diet: "", activities: ["Piscine", "Marchés", "Photos"], bio: "" },
      { id: "sandro", name: "Sandro", role: "adult", avatar: "👨‍🦱", diet: "", activities: ["Canoë", "Escalade", "Cognac"], bio: "" },
      { id: "wael", name: "Wael", role: "child", age: 8, avatar: "🧒", diet: "", activities: ["Accrobranche", "Piscine", "Foot"], bio: "" },
      { id: "aden", name: "Aden", role: "child", age: 4, avatar: "👶", diet: "", activities: ["Piscine", "Trampoline", "Dessin"], bio: "" },
    ],
    room: "Chambre 1 (Étage) — Wael au dortoir Ch.6",
  },
];

const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 6, 11 + i);
  return {
    date: d,
    key: `2026-07-${String(11 + i).padStart(2, "0")}`,
    day: d.toLocaleDateString("fr-FR", { weekday: "short" }),
    num: d.getDate(),
    full: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  };
});

const DEFAULT_PLANNING = [
  { am: "🚗 Installation & découverte du gîte", pm: "🏊 Piscine & apéro de bienvenue", eve: "🍕 Pizzas du traiteur" },
  { am: "🥐 Grasse mat' & petit-déj royal", pm: "🏊 Piscine + Mölkky", eve: "🔥 Premier BBQ" },
  { am: "🛶 Canoë à Aubeterre", pm: "🏖️ Plage de la Dronne", eve: "🍽️ Dîner maison" },
  { am: "🥾 Randonnée matinale", pm: "🏊 Piscine & sieste", eve: "🎲 Soirée jeux" },
  { am: "🏰 Visite Aubeterre & église troglodyte", pm: "☕ Glaces + shopping artisanat", eve: "🍷 Soirée dégustation" },
  { am: "🏊 Piscine & farniente", pm: "🏓 Tournoi ping-pong", eve: "🍽️ Dîner resto — L'Envie Gourmande" },
  { am: "🧗 Accrobranche à Poltrot", pm: "🌿 Visite ferme bio + brasserie La Nouge", eve: "🔥 BBQ & musique" },
  { am: "🛒 Marché de producteurs", pm: "🍳 Atelier cuisine tous ensemble", eve: "🎉 Grande tablée" },
  { am: "🏇 Équitation (qui veut ?)", pm: "🏊 Piscine & lecture", eve: "🎬 Soirée film en plein air" },
  { am: "🏰 Château de la Mercerie", pm: "🏌️ Golf ou balade", eve: "🍽️ Dîner maison" },
  { am: "🎨 Angoulême — Cité de la BD", pm: "🎨 Suite visite + cathédrale", eve: "🍕 Traiteur" },
  { am: "🏊 Journée piscine & détente", pm: "🎯 Tournoi Mölkky & pétanque", eve: "🍷 Apéro + grillades" },
  { am: "🛶 Canoë (session 2) ou base de loisirs", pm: "🏖️ Plage & pique-nique", eve: "🎉 GRANDE SOIRÉE DE FIN" },
  { am: "😢 Rangement & ménage collectif", pm: "🚗 Départ — à l'année prochaine !", eve: "" },
];

const ACTIVITIES_LIST = [
  { icon: "🏊", name: "Piscine au gîte", category: "sport", duration: "Journée", desc: "12m x 6m de bonheur aquatique" },
  { icon: "🛶", name: "Canoë à Aubeterre", category: "sport", duration: "½ journée", desc: "Base de canoë sur la Dronne, 15 min" },
  { icon: "🏰", name: "Aubeterre-sur-Dronne", category: "culture", duration: "½ journée", desc: "Plus beau village de France + église troglodyte" },
  { icon: "🧗", name: "Accrobranche Poltrot", category: "sport", duration: "½ journée", desc: "Parcours tous niveaux, 15 min" },
  { icon: "🥾", name: "Randonnée", category: "sport", duration: "½ journée", desc: "Chemins balisés depuis le gîte" },
  { icon: "🏇", name: "Équitation", category: "sport", duration: "½ journée", desc: "Écuries des Chênes, 15 min" },
  { icon: "🏖️", name: "Plage d'Aubeterre", category: "sport", duration: "½ journée", desc: "Bord de Dronne, 15 min" },
  { icon: "🏌️", name: "Golf de Longeveau", category: "sport", duration: "½ journée", desc: "10 min du gîte" },
  { icon: "🏰", name: "Château de la Mercerie", category: "culture", duration: "½ journée", desc: "10 min — le Versailles charentais" },
  { icon: "🎨", name: "Angoulême & BD", category: "culture", duration: "Journée", desc: "Cité de la BD, murs peints, 30 min" },
  { icon: "🍷", name: "Dégustation Cognac/Pineau", category: "gastro", duration: "½ journée", desc: "Château des Plassons, 10 min" },
  { icon: "🛒", name: "Marché de producteurs", category: "gastro", duration: "Matinée", desc: "Marchés d'été locaux" },
  { icon: "🍽️", name: "Restaurant", category: "gastro", duration: "Soirée", desc: "L'Envie Gourmande, L'École, Le Lavalette..." },
  { icon: "🎯", name: "Mölkky & Pétanque", category: "sport", duration: "Aprem", desc: "Tournoi maison !" },
  { icon: "🏓", name: "Ping-pong", category: "sport", duration: "Aprem", desc: "Le tournoi légendaire" },
  { icon: "🌿", name: "Visite ferme bio", category: "culture", duration: "1h", desc: "Ferme de Nougerède, sur place !" },
  { icon: "🍺", name: "Brasserie La Nouge", category: "gastro", duration: "1h", desc: "Bière bio artisanale, sur place !" },
];

const ALL_ACTIVITY_TAGS = [
  "Piscine", "Randonnée", "Lecture", "Canoë", "Pétanque", "BBQ", "Yoga",
  "Marchés", "Vélo", "Cuisine", "Ping-pong", "Foot", "Jeux vidéo", "Mölkky",
  "Photos", "Escalade", "Cognac", "Accrobranche", "Trampoline", "Dessin",
  "Équitation", "Golf", "Farniente", "Musique", "Jeux de société",
];

async function loadData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}
async function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Save error", e); }
}

function generateCookingPairs(families) {
  const adults = [];
  families.forEach(f => f.members.filter(m => m.role === "adult").forEach(m => adults.push({ name: m.name, family: f.name, color: f.color, avatar: m.avatar })));
  const pairs = [];
  for (let i = 0; i < 28; i++) {
    let pool = _.shuffle([...adults]);
    let a = pool[0], b = pool[1];
    for (let j = 1; j < pool.length; j++) { if (pool[j].family !== a.family) { b = pool[j]; break; } }
    pairs.push([a, b]);
  }
  return pairs;
}

const F = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

function Nav({ active, setActive }) {
  const tabs = [
    { id: "home", icon: "🏡", label: "Accueil" },
    { id: "rooms", icon: "🛏️", label: "Chambres" },
    { id: "planning", icon: "📅", label: "Planning" },
    { id: "cooking", icon: "👨‍🍳", label: "Cuisine" },
    { id: "activities", icon: "🎯", label: "Activités" },
    { id: "profiles", icon: "👥", label: "Profils" },
    { id: "rules", icon: "📜", label: "Règles d'or" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(15,20,30,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", overflowX: "auto", fontFamily: F }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          flex: "1 0 auto", padding: "14px 16px", border: "none", cursor: "pointer",
          background: active === t.id ? "rgba(255,200,60,0.12)" : "transparent",
          color: active === t.id ? "#FFD166" : "rgba(255,255,255,0.5)",
          borderBottom: active === t.id ? "2px solid #FFD166" : "2px solid transparent",
          fontSize: 13, fontWeight: active === t.id ? 700 : 500, transition: "all 0.2s", whiteSpace: "nowrap", fontFamily: "inherit",
        }}>
          <span style={{ fontSize: 18, display: "block", marginBottom: 2 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  );
}

function Hero() {
  const [count, setCount] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(2026, 6, 11, 14, 0, 0);
    const tick = () => { const diff = Math.max(0, target - new Date()); setCount({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) }); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(170deg, #0A1628 0%, #162544 40%, #1B3A5C 70%, #2D6A4F 100%)", overflow: "hidden", padding: "40px 20px", textAlign: "center" }}>
      {Array.from({ length: 50 }).map((_, i) => (<div key={i} style={{ position: "absolute", left: `${Math.random()*100}%`, top: `${Math.random()*70}%`, width: Math.random()*3+1, height: Math.random()*3+1, borderRadius: "50%", background: "white", opacity: Math.random()*0.7+0.2, animation: `twinkle ${2+Math.random()*3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />))}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
        <div style={{ fontSize: 72, marginBottom: 8, filter: "drop-shadow(0 0 30px rgba(255,200,60,0.4))" }}>🏡</div>
        <h1 style={{ fontFamily: PF, fontSize: "clamp(38px,8vw,76px)", fontWeight: 900, background: "linear-gradient(135deg, #FFD166 0%, #FFB347 50%, #FF8C42 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px", lineHeight: 1.05, letterSpacing: "-1px" }}>La Maison du Bonheur</h1>
        <p style={{ fontFamily: F, fontSize: "clamp(13px,2.5vw,18px)", color: "rgba(255,255,255,0.6)", fontWeight: 300, letterSpacing: 8, textTransform: "uppercase", margin: "0 0 36px" }}>Nougerède &bull; Été 2026</p>
        <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 44 }}>
          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "0 0 3px", letterSpacing: 2, textTransform: "uppercase" }}>11 — 25 Juillet 2026</p>
          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>14 nuits &bull; Salles-Lavalette &bull; 3 familles, 11 aventuriers</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
          {[{ val: count.days, label: "Jours" }, { val: count.hours, label: "Heures" }, { val: count.minutes, label: "Min" }, { val: count.seconds, label: "Sec" }].map((c, i) => (
            <div key={i} style={{ width: 82, padding: "18px 8px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: PF, fontSize: 38, fontWeight: 900, color: "#FFD166", lineHeight: 1 }}>{String(c.val).padStart(2, "0")}</div>
              <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {DEFAULT_FAMILIES.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 40, background: `${f.color}18`, border: `1px solid ${f.color}33` }}>
              <span style={{ fontSize: 20 }}>{f.emoji}</span>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: f.color }}>{f.name}</span>
              <span style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>({f.members.length})</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to top, #0F141E, transparent)" }} />
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px 28px" }}>
      <span style={{ fontSize: 44, display: "block", marginBottom: 8 }}>{icon}</span>
      <h2 style={{ fontFamily: PF, fontSize: "clamp(28px,5vw,42px)", fontWeight: 800, color: "#FFD166", margin: "0 0 8px" }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 520, marginInline: "auto" }}>{subtitle}</p>}
    </div>
  );
}

function RoomsSection() {
  const rooms = [
    { name: "Chambre 4", level: "Rez-de-chaussée", icon: "🌿", beds: ["1 lit double 140", "1 lit bébé"], family: "Philibert-Rahal", femoji: "🦁", fc: "#E8733A", occ: "Alexandra, Nacim + Priam (4 ans)" },
    { name: "Chambre 1", level: "Étage", icon: "🌸", beds: ["1 lit double 140", "1 lit simple 90"], family: "Louison-Lutyens", femoji: "🦊", fc: "#6BBF6B", occ: "Floriane, Sandro + Aden (4 ans)" },
    { name: "Chambre 3", level: "Étage", icon: "🌙", beds: ["1 lit double 140"], family: "Schmidt-Privey", femoji: "🐻", fc: "#4A90D9", occ: "Sarah-Marine & Nicolas" },
    { name: "Chambre 6 — Le Dortoir", level: "Étage", icon: "⭐", beds: ["3 lits simples 90", "1 lit d'appoint 90"], family: "Dortoir Enfants", femoji: "🎉", fc: "#FFD166", occ: "Wael (8), Lucas (9), Paul (11) — 1 place dispo !" },
    { name: "Chambre 2", level: "Étage", icon: "🏔️", beds: ["1 lit double 140", "2 lits simples 90", "1 appoint 90"], avail: true, sug: "Idéale pour une famille avec 2-3 enfants" },
    { name: "Chambre 5", level: "Étage", icon: "🌅", beds: ["1 lit double 140"], avail: true, sug: "Parfaite pour un couple" },
  ];
  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="🛏️" title="Les Chambres" subtitle="Répartition optimisée pour le confort de tous" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {rooms.map((r, i) => (
          <div key={i} style={{ background: r.avail ? "linear-gradient(135deg, rgba(45,106,79,0.15), rgba(45,106,79,0.05))" : "rgba(255,255,255,0.03)", border: `1px solid ${r.avail ? "rgba(45,106,79,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, padding: 24, position: "relative" }}>
            {r.avail && <div style={{ position: "absolute", top: 12, right: 12, background: "#2D6A4F", color: "white", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1, fontFamily: F }}>Disponible</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: r.fc ? `${r.fc}22` : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.icon}</div>
              <div><h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>{r.name}</h3><span style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{r.level}</span></div>
            </div>
            <div style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12, lineHeight: 1.6 }}>{r.beds.map((b, j) => <div key={j}>🛏️ {b}</div>)}</div>
            {r.occ && <div style={{ padding: "10px 14px", borderRadius: 12, background: `${r.fc}12`, border: `1px solid ${r.fc}25` }}><div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: r.fc, marginBottom: 2 }}>{r.femoji} {r.family}</div><div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{r.occ}</div></div>}
            {r.avail && <div style={{ fontFamily: F, fontSize: 11, color: "rgba(45,106,79,0.8)", fontStyle: "italic", marginTop: 8 }}>{r.sug}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 16, background: "rgba(255,200,60,0.06)", border: "1px solid rgba(255,200,60,0.15)", fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        💡 <strong style={{ color: "#FFD166" }}>Capacité restante :</strong> 6 à 8 personnes (Ch. 2 + Ch. 5 + lit salon)
      </div>
    </div>
  );
}

function PlanningSection({ families, rsvps, setRsvps, proposals, setProposals, currentUser }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [np, setNp] = useState({ text: "", slot: "pm" });
  const adults = families.flatMap(f => f.members.filter(m => m.role === "adult").map(m => ({ ...m, familyColor: f.color })));
  const dayKey = DATES[selectedDay]?.key;

  const toggleRsvp = (mid, slot, status) => {
    const k = `${dayKey}-${slot}`;
    const next = { ...rsvps, [k]: { ...(rsvps[k] || {}), [mid]: rsvps[k]?.[mid] === status ? null : status } };
    setRsvps(next); saveData("bonheur-rsvps", next);
  };
  const getRsvp = (mid, slot) => rsvps[`${dayKey}-${slot}`]?.[mid] || null;
  const getCounts = (slot) => {
    const e = rsvps[`${dayKey}-${slot}`] || {};
    let y = 0, n = 0; Object.values(e).forEach(v => { if (v === "yes") y++; if (v === "no") n++; }); return { y, n };
  };
  const addProp = () => {
    if (!np.text.trim()) return;
    const next = [...proposals, { id: Date.now().toString(), dayKey, slot: np.slot, text: np.text.trim(), author: currentUser || "Anonyme", votes: [] }];
    setProposals(next); saveData("bonheur-proposals", next); setNp({ text: "", slot: "pm" }); setShowForm(false);
  };
  const voteProp = (pid) => {
    const u = currentUser || "Anonyme";
    const next = proposals.map(p => p.id !== pid ? p : { ...p, votes: p.votes.includes(u) ? p.votes.filter(v => v !== u) : [...p.votes, u] });
    setProposals(next); saveData("bonheur-proposals", next);
  };
  const dayProps = proposals.filter(p => p.dayKey === dayKey);
  const slots = [{ key: "am", label: "Matin", icon: "🌅", color: "#FFD166" }, { key: "pm", label: "Après-midi", icon: "☀️", color: "#FF8C42" }, { key: "eve", label: "Soirée", icon: "🌙", color: "#A78BFA" }].filter(s => DEFAULT_PLANNING[selectedDay]?.[s.key]);

  const nameMap = {};
  families.forEach(f => f.members.forEach(m => { nameMap[m.id] = m.name; }));

  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="📅" title="Le Programme" subtitle="Planning collaboratif — vote & propose !" />
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 24 }}>
        {DATES.map((d, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{ minWidth: 54, padding: "10px 6px", border: "none", cursor: "pointer", borderRadius: 14, textAlign: "center", background: selectedDay === i ? "linear-gradient(135deg, #FFD166, #FF8C42)" : "rgba(255,255,255,0.04)", color: selectedDay === i ? "#0F141E" : "rgba(255,255,255,0.4)", fontFamily: F }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 500 }}>{d.day}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{d.num}</div>
          </button>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ fontFamily: PF, fontSize: 22, color: "#FFD166", margin: "0 0 4px" }}>Jour {selectedDay + 1}</h3>
        <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 24px", textTransform: "capitalize" }}>{DATES[selectedDay].full}</p>
        {slots.map(s => {
          const c = getCounts(s.key);
          return (
            <div key={s.key} style={{ marginBottom: 20, padding: "18px 20px", borderRadius: 18, background: `${s.color}08`, borderLeft: `3px solid ${s.color}55` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F, fontSize: 11, color: s.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontFamily: F, fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{DEFAULT_PLANNING[selectedDay][s.key]}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {c.y > 0 && <span style={{ fontFamily: F, fontSize: 11, color: "#6BBF6B", marginRight: 8 }}>✓ {c.y}</span>}
                  {c.n > 0 && <span style={{ fontFamily: F, fontSize: 11, color: "#EF4444" }}>✗ {c.n}</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {adults.map(m => {
                  const st = getRsvp(m.id, s.key);
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", borderRadius: 10, background: "rgba(0,0,0,0.2)" }}>
                      <span style={{ fontSize: 14 }}>{m.avatar}</span>
                      <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.5)", marginRight: 2, minWidth: 44 }}>{m.name.split("-")[0]}</span>
                      {[["yes", "✓", "#2D6A4F"], ["no", "✗", "#991B1B"], ["maybe", "?", "#92400E"]].map(([v, l, bg]) => (
                        <button key={v} onClick={() => toggleRsvp(m.id, s.key, v)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, background: st === v ? bg : "rgba(255,255,255,0.06)", color: st === v ? "white" : "rgba(255,255,255,0.3)" }}>{l}</button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {dayProps.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>💡 Propositions</h4>
            {dayProps.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{p.text}</span>
                  <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    par {nameMap[p.author] || p.author} &bull; {p.slot === "am" ? "matin" : p.slot === "pm" ? "aprem" : "soirée"}
                  </div>
                </div>
                <button onClick={() => voteProp(p.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: p.votes.includes(currentUser) ? "rgba(107,191,107,0.2)" : "rgba(255,255,255,0.06)", color: p.votes.includes(currentUser) ? "#6BBF6B" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>👍 {p.votes.length}</button>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div style={{ marginTop: 16, padding: "16px 18px", borderRadius: 16, background: "rgba(255,200,60,0.06)", border: "1px solid rgba(255,200,60,0.15)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[["am", "Matin"], ["pm", "Aprem"], ["eve", "Soirée"]].map(([k, l]) => (
                <button key={k} onClick={() => setNp(p => ({ ...p, slot: k }))} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: np.slot === k ? "#FFD166" : "rgba(255,255,255,0.06)", color: np.slot === k ? "#0F141E" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>{l}</button>
              ))}
            </div>
            <input value={np.text} onChange={e => setNp(p => ({ ...p, text: e.target.value }))} placeholder="Ex: Journée kayak sur la Dronne..." onKeyDown={e => e.key === "Enter" && addProp()}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 14, fontFamily: F, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addProp} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "#FFD166", color: "#0F141E", fontWeight: 700, fontSize: 13, fontFamily: F }}>Proposer</button>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} style={{ marginTop: 16, width: "100%", padding: "14px", borderRadius: 14, border: "1px dashed rgba(255,200,60,0.3)", background: "transparent", color: "#FFD166", cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: 600 }}>+ Proposer une activité pour ce jour</button>
        )}
      </div>
    </div>
  );
}

function CookingSection({ families }) {
  const [pairs, setPairs] = useState(() => generateCookingPairs(families));
  const [key, setKey] = useState(0);
  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="👨‍🍳" title="Planning Cuisine" subtitle="Binômes aléatoires inter-familles — remélange autant que tu veux !" />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button onClick={() => { setPairs(generateCookingPairs(families)); setKey(k => k + 1); }} style={{ padding: "14px 32px", borderRadius: 40, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #FFD166, #FF8C42)", color: "#0F141E", fontWeight: 700, fontSize: 15, fontFamily: F, boxShadow: "0 4px 24px rgba(255,140,66,0.3)" }}>🎲 Remélanger !</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {DATES.map((d, di) => (
          <div key={`${di}-${key}`} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#FFD166", marginBottom: 10, textTransform: "capitalize" }}>{d.day} {d.num} juil.</div>
            {["Déjeuner", "Dîner"].map((meal, mi) => {
              const pair = pairs[di * 2 + mi]; if (!pair) return null;
              return (
                <div key={mi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "6px 10px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                  <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", width: 52, flexShrink: 0 }}>{meal}</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {pair.map((p, pi) => (<span key={pi} style={{ fontFamily: F, fontSize: 11, padding: "3px 8px", borderRadius: 8, background: `${p.color}20`, color: p.color, fontWeight: 600 }}>{p.name} {p.avatar}</span>))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesSection() {
  const [filter, setFilter] = useState("all");
  const cats = [{ id: "all", label: "Tout", icon: "✨" }, { id: "sport", label: "Sport", icon: "🏊" }, { id: "culture", label: "Culture", icon: "🏰" }, { id: "gastro", label: "Gastro", icon: "🍷" }];
  const filtered = filter === "all" ? ACTIVITIES_LIST : ACTIVITIES_LIST.filter(a => a.category === filter);
  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="🎯" title="Activités" subtitle="Tout ce qu'on peut faire autour de Nougerède" />
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {cats.map(c => (<button key={c.id} onClick={() => setFilter(c.id)} style={{ padding: "8px 18px", borderRadius: 30, border: "none", cursor: "pointer", background: filter === c.id ? "rgba(255,200,60,0.15)" : "rgba(255,255,255,0.04)", color: filter === c.id ? "#FFD166" : "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 13, fontFamily: F }}>{c.icon} {c.label}</button>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{a.icon}</span>
            <div>
              <h4 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "white", margin: "0 0 4px" }}>{a.name}</h4>
              <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 6px" }}>{a.desc}</p>
              <span style={{ fontFamily: F, fontSize: 10, color: "#FFD166", background: "rgba(255,200,60,0.1)", padding: "2px 8px", borderRadius: 8 }}>⏱ {a.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilesSection({ families, setFamilies, currentUser, setCurrentUser }) {
  const [editing, setEditing] = useState(null);
  const [ed, setEd] = useState({});
  const avatars = ["👨", "👩", "👨‍🦰", "👩‍🦱", "👨‍🦱", "👩‍🦳", "🧔", "👱‍♀️", "👱", "🧒", "👦", "👧", "👶", "🧑", "🧑‍🦰", "🧑‍🦱"];
  const startEdit = (fid, mid) => {
    const m = families.find(f => f.id === fid).members.find(m => m.id === mid);
    setEditing(`${fid}:${mid}`); setEd({ diet: m.diet || "", activities: [...(m.activities || [])], bio: m.bio || "", avatar: m.avatar });
  };
  const saveEdit = (fid, mid) => {
    const next = families.map(f => f.id !== fid ? f : { ...f, members: f.members.map(m => m.id !== mid ? m : { ...m, ...ed }) });
    setFamilies(next); saveData("bonheur-families", next); setEditing(null);
  };
  const togAct = (tag) => setEd(d => ({ ...d, activities: d.activities.includes(tag) ? d.activities.filter(a => a !== tag) : [...d.activities, tag] }));

  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="👥" title="Les Familles" subtitle="Clique ✏️ pour personnaliser ton profil !" />
      <div style={{ marginBottom: 28, padding: "16px 20px", borderRadius: 16, background: "rgba(255,200,60,0.06)", border: "1px solid rgba(255,200,60,0.15)", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 10px" }}>👋 Qui es-tu ? <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>(pour signer tes votes & propositions)</span></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {families.flatMap(f => f.members.filter(m => m.role === "adult").map(m => (
            <button key={m.id} onClick={() => { setCurrentUser(m.id); saveData("bonheur-currentUser", m.id); }}
              style={{ padding: "8px 16px", borderRadius: 24, border: currentUser === m.id ? `1px solid ${f.color}55` : "1px solid transparent", cursor: "pointer", background: currentUser === m.id ? `${f.color}33` : "rgba(255,255,255,0.05)", color: currentUser === m.id ? f.color : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>
              {m.avatar} {m.name}
            </button>
          )))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {families.map(fam => (
          <div key={fam.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, overflow: "hidden", border: `1px solid ${fam.color}33` }}>
            <div style={{ background: `linear-gradient(135deg, ${fam.color}25, ${fam.color}08)`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${fam.color}22` }}>
              <span style={{ fontSize: 40 }}>{fam.emoji}</span>
              <div><h3 style={{ fontFamily: PF, fontSize: 22, fontWeight: 800, color: fam.color, margin: 0 }}>{fam.name}</h3><p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>{fam.room}</p></div>
            </div>
            <div style={{ padding: "12px 24px 20px" }}>
              {fam.members.map((m, mi) => {
                const isEd = editing === `${fam.id}:${m.id}`;
                return (
                  <div key={m.id} style={{ padding: "14px 0", borderBottom: mi < fam.members.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{m.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "white" }}>{m.name}</span>
                          {m.age != null && <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 8 }}>{m.age} ans</span>}
                        </div>
                        {m.bio && !isEd && <p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "4px 0 0", fontStyle: "italic" }}>"{m.bio}"</p>}
                      </div>
                      {!isEd && <button onClick={() => startEdit(fam.id, m.id)} style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 11 }}>✏️</button>}
                    </div>
                    {!isEd && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {m.activities.map((a, j) => (<span key={j} style={{ fontFamily: F, fontSize: 10, padding: "3px 8px", borderRadius: 8, background: `${fam.color}12`, color: `${fam.color}bb`, fontWeight: 500 }}>{a}</span>))}
                        {m.diet && <span style={{ fontFamily: F, fontSize: 10, padding: "3px 8px", borderRadius: 8, background: "rgba(239,68,68,0.12)", color: "#EF4444", fontWeight: 500 }}>⚠️ {m.diet}</span>}
                      </div>
                    )}
                    {isEd && (
                      <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Avatar</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                          {avatars.map(av => (<button key={av} onClick={() => setEd(d => ({ ...d, avatar: av }))} style={{ width: 36, height: 36, borderRadius: 10, border: ed.avatar === av ? `2px solid ${fam.color}` : "2px solid transparent", cursor: "pointer", fontSize: 20, background: ed.avatar === av ? `${fam.color}33` : "rgba(255,255,255,0.06)" }}>{av}</button>))}
                        </div>
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Mini bio / citation</label>
                        <input value={ed.bio} onChange={e => setEd(d => ({ ...d, bio: e.target.value }))} placeholder="Ex: Roi du barbecue et de la sieste..."
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Restrictions alimentaires</label>
                        <input value={ed.diet} onChange={e => setEd(d => ({ ...d, diet: e.target.value }))} placeholder="Ex: Végétarien, sans gluten..."
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Activités préférées</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                          {ALL_ACTIVITY_TAGS.map(tag => (<button key={tag} onClick={() => togAct(tag)} style={{ padding: "5px 10px", borderRadius: 10, border: "none", cursor: "pointer", background: ed.activities.includes(tag) ? `${fam.color}30` : "rgba(255,255,255,0.06)", color: ed.activities.includes(tag) ? fam.color : "rgba(255,255,255,0.35)", fontFamily: F, fontSize: 11, fontWeight: ed.activities.includes(tag) ? 600 : 400 }}>{tag}</button>))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => saveEdit(fam.id, m.id)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: fam.color, color: "white", fontWeight: 700, fontSize: 13, fontFamily: F }}>💾 Sauvegarder</button>
                          <button onClick={() => setEditing(null)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesSection() {
  const rules = [
    { icon: "🤝", title: "Vivre ensemble", text: "On partage tout : cuisine, ménage, bonne humeur. Pas de passager clandestin du frigo." },
    { icon: "🔇", title: "Heures calmes", text: "Après 22h, on baisse le son. Les parents de petits vous remercient." },
    { icon: "🏊", title: "Piscine", text: "Surveillance adulte obligatoire pour les enfants. Pas de bombe sur la tête de mamie." },
    { icon: "🧹", title: "Ménage quotidien", text: "Chacun range après soi. Grand ménage collectif le dernier jour (motivé par l'apéro)." },
    { icon: "🍳", title: "Cuisine", text: "Les binômes cuisinent, les autres font la vaisselle. Équité ou révolution." },
    { icon: "🛒", title: "Courses", text: "Cagnotte commune pour la bouffe. Pas de guerre du Nutella." },
    { icon: "☀️", title: "Crème solaire", text: "On tartine les enfants AVANT la piscine. Oui, même les oreilles." },
    { icon: "📱", title: "Écrans", text: "Pas de tablette avant 18h pour les enfants. Les adultes... on essaie aussi." },
    { icon: "🎵", title: "Musique", text: "Playlist collaborative. Pas de veto (sauf Johnny)." },
    { icon: "📸", title: "Photos", text: "Album partagé. On assume les têtes du matin." },
  ];
  return (
    <div style={{ padding: "0 20px 60px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="📜" title="Les Règles d'Or" subtitle="Le pacte sacré de la Maison du Bonheur" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {rules.map((r, i) => (
          <div key={i} style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><span style={{ fontSize: 24 }}>{r.icon}</span><h4 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#FFD166", margin: 0 }}>{r.title}</h4></div>
            <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [families, setFamilies] = useState(DEFAULT_FAMILIES);
  const [rsvps, setRsvps] = useState({});
  const [proposals, setProposals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const f = await loadData("bonheur-families", null); if (f) setFamilies(f);
      setRsvps(await loadData("bonheur-rsvps", {}));
      setProposals(await loadData("bonheur-proposals", []));
      const u = await loadData("bonheur-currentUser", null); if (u) setCurrentUser(u);
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#0F141E", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 64, marginBottom: 16 }}>🏡</div><div style={{ fontFamily: PF, fontSize: 24, color: "#FFD166" }}>Chargement...</div></div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0F141E", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.9; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        button:hover { filter: brightness(1.1); }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
      <Nav active={active} setActive={setActive} />
      {active === "home" && (
        <>
          <Hero />
          <div style={{ padding: "40px 20px", maxWidth: 920, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {[{ icon: "🏡", stat: "19", label: "Places max" }, { icon: "🛏️", stat: "6", label: "Chambres" }, { icon: "🏊", stat: "12×6m", label: "Piscine" }, { icon: "🌳", stat: "∞", label: "Nature" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "24px 16px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <div style={{ fontFamily: PF, fontSize: 32, fontWeight: 900, color: "#FFD166", margin: "8px 0 2px" }}>{s.stat}</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px 60px" }}>
            <div style={{ padding: 32, borderRadius: 24, background: "linear-gradient(135deg, rgba(45,106,79,0.12), rgba(45,106,79,0.04))", border: "1px solid rgba(45,106,79,0.2)", textAlign: "center" }}>
              <span style={{ fontSize: 48 }}>🌿</span>
              <h3 style={{ fontFamily: PF, fontSize: 24, color: "#6BBF6B", margin: "12px 0 8px" }}>Le Gîte de Nougerède</h3>
              <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 600, margin: "0 auto 16px", lineHeight: 1.7 }}>Ancienne ferme charentaise, grande piscine, terrasse, barbecue, trampoline, ping-pong, Mölkky... Ferme bio et brasserie artisanale sur place !</p>
              <a href="https://www.gite-nougerede.com/" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 30, background: "rgba(107,191,107,0.15)", border: "1px solid rgba(107,191,107,0.3)", color: "#6BBF6B", textDecoration: "none", fontWeight: 600, fontSize: 13, fontFamily: F }}>🔗 Voir le site du gîte</a>
            </div>
          </div>
        </>
      )}
      {active === "rooms" && <RoomsSection />}
      {active === "planning" && <PlanningSection families={families} rsvps={rsvps} setRsvps={setRsvps} proposals={proposals} setProposals={setProposals} currentUser={currentUser} />}
      {active === "cooking" && <CookingSection families={families} />}
      {active === "activities" && <ActivitiesSection />}
      {active === "profiles" && <ProfilesSection families={families} setFamilies={setFamilies} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      {active === "rules" && <RulesSection />}
      <footer style={{ padding: "40px 20px", textAlign: "center", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontFamily: PF, fontSize: 24, color: "#FFD166", margin: "0 0 8px" }}>🏡 La Maison du Bonheur 2026</p>
        <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Gîte de Nougerède &bull; Salles-Lavalette &bull; Charente</p>
        <p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 16 }}>Fait avec amour pour les meilleurs potes du monde ❤️</p>
      </footer>
    </div>
  );
}
