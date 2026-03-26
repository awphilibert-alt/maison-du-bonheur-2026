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
    checkIn: "2026-07-11",
    checkOut: "2026-07-25",
    members: [
      { id: "alexandra", name: "Alexandra", role: "adult", avatar: "👩‍🦱", diet: "", activities: ["Piscine", "Randonnée", "Lecture"], bio: "" },
      { id: "nacim", name: "Nacim", role: "adult", avatar: "👨", diet: "", activities: ["Canoë", "Pétanque", "BBQ"], bio: "" },
      { id: "priam", name: "Priam", role: "child", age: 4, avatar: "👦", diet: "", activities: ["Piscine", "Trampoline", "Dessin"], bio: "" },
    ],
  },
  {
    id: "schmidt-privey",
    name: "Schmidt-Privey",
    emoji: "🐻",
    color: "#4A90D9",
    checkIn: "2026-07-11",
    checkOut: "2026-07-25",
    members: [
      { id: "sarah-marine", name: "Sarah-Marine", role: "adult", avatar: "👩", diet: "", activities: ["Yoga", "Randonnée", "Marchés"], bio: "" },
      { id: "nicolas", name: "Nicolas", role: "adult", avatar: "👨‍🦰", diet: "", activities: ["Ping-pong", "Vélo", "Cuisine"], bio: "" },
      { id: "paul", name: "Paul", role: "child", age: 11, avatar: "🧒", diet: "", activities: ["Foot", "Piscine", "Jeux vidéo"], bio: "" },
      { id: "lucas", name: "Lucas", role: "child", age: 9, avatar: "👦", diet: "", activities: ["Ping-pong", "Piscine", "Mölkky"], bio: "" },
    ],
  },
  {
    id: "louison-lutyens",
    name: "Louison-Lutyens",
    emoji: "🦊",
    color: "#6BBF6B",
    checkIn: "2026-07-11",
    checkOut: "2026-07-25",
    members: [
      { id: "floriane", name: "Floriane", role: "adult", avatar: "👩‍🦳", diet: "", activities: ["Piscine", "Marchés", "Photos"], bio: "" },
      { id: "sandro", name: "Sandro", role: "adult", avatar: "👨‍🦱", diet: "", activities: ["Canoë", "Escalade", "Cognac"], bio: "" },
      { id: "wael", name: "Wael", role: "child", age: 8, avatar: "🧒", diet: "", activities: ["Accrobranche", "Piscine", "Foot"], bio: "" },
      { id: "aden", name: "Aden", role: "child", age: 4, avatar: "👶", diet: "", activities: ["Piscine", "Trampoline", "Dessin"], bio: "" },
    ],
  },
];

const ROOMS_LIST = [
  { name: "Chambre 4", level: "Rez-de-chaussée", icon: "🌿", beds: ["1 lit double 140", "1 lit bébé"] },
  { name: "Chambre 1", level: "Étage", icon: "🌸", beds: ["1 lit double 140", "1 lit simple 90"] },
  { name: "Chambre 3", level: "Étage", icon: "🌙", beds: ["1 lit double 140"] },
  { name: "Chambre 6 — Le Dortoir", level: "Étage", icon: "⭐", beds: ["3 lits simples 90", "1 lit d'appoint 90"] },
  { name: "Chambre 2", level: "Étage", icon: "🏔️", beds: ["1 lit double 140", "2 lits simples 90", "1 appoint 90"], sug: "Idéale pour une famille avec 2-3 enfants" },
  { name: "Chambre 5", level: "Étage", icon: "🌅", beds: ["1 lit double 140"], sug: "Parfaite pour un couple" },
];

// Affectations par défaut : qui dort dans quelle chambre, quelles dates
const DEFAULT_ROOM_ASSIGNMENTS = [
  { id: "dra-1", familyId: "philibert-rahal",  roomName: "Chambre 4",            memberIds: ["alexandra", "nacim", "priam"],          checkIn: "2026-07-11", checkOut: "2026-07-25" },
  { id: "dra-2", familyId: "schmidt-privey",   roomName: "Chambre 3",            memberIds: ["sarah-marine", "nicolas"],               checkIn: "2026-07-11", checkOut: "2026-07-25" },
  { id: "dra-3", familyId: "schmidt-privey",   roomName: "Chambre 6 — Le Dortoir", memberIds: ["paul", "lucas"],                      checkIn: "2026-07-11", checkOut: "2026-07-25" },
  { id: "dra-4", familyId: "louison-lutyens",  roomName: "Chambre 1",            memberIds: ["floriane", "sandro", "aden"],           checkIn: "2026-07-11", checkOut: "2026-07-25" },
  { id: "dra-5", familyId: "louison-lutyens",  roomName: "Chambre 6 — Le Dortoir", memberIds: ["wael"],                               checkIn: "2026-07-11", checkOut: "2026-07-25" },
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
  "Apéro", "Rosé", "Sieste", "Commérage", "Tchin", "Rhum-coca",
  "Bronzage", "Glande", "Ragots", "Bifler Nicolas", "Poker", "Karaokë",
  "Binge-watching", "Footing honteux", "Verre de trop", "Philosophie de comptoir",
];

function computeNights(checkIn, checkOut) {
  const a = new Date((checkIn || "2026-07-11") + "T12:00:00");
  const b = new Date((checkOut || "2026-07-25") + "T12:00:00");
  return Math.max(0, Math.round((b - a) / 86400000));
}

// Calcule les dates effectives d'une famille à partir de ses affectations de chambre
function getFamilyEffectiveDates(familyId, roomAssignments) {
  const fas = roomAssignments.filter(ra => ra.familyId === familyId);
  if (fas.length === 0) return { checkIn: "2026-07-11", checkOut: "2026-07-25" };
  const checkIn = fas.reduce((min, ra) => ra.checkIn < min ? ra.checkIn : min, "9999-99-99");
  const checkOut = fas.reduce((max, ra) => ra.checkOut > max ? ra.checkOut : max, "0000-00-00");
  return { checkIn, checkOut };
}

function computeShares(families, totalCost, roomAssignments) {
  const withNights = families.map(f => {
    const { checkIn, checkOut } = roomAssignments
      ? getFamilyEffectiveDates(f.id, roomAssignments)
      : { checkIn: f.checkIn || "2026-07-11", checkOut: f.checkOut || "2026-07-25" };
    return { ...f, checkIn, checkOut, nights: computeNights(checkIn, checkOut) };
  });
  const totalNights = withNights.reduce((s, f) => s + f.nights, 0);
  if (totalNights === 0 || families.length === 0) {
    const eq = families.length > 0 ? Math.round(totalCost / families.length) : 0;
    return withNights.map(f => ({ ...f, share: eq }));
  }
  let remaining = totalCost;
  return withNights.map((f, i) => {
    const share = i === withNights.length - 1 ? remaining : Math.round((f.nights / totalNights) * totalCost);
    remaining -= share;
    return { ...f, share };
  });
}

// Compress image to base64 thumbnail (~300px, 0.55 quality)
async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 320;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.55));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Tricount-style debt calculation
// Returns { balances: { [memberId]: number }, transactions: [{ from, to, amount }] }
function calculateDebts(expenses, allMembers) {
  const balances = {};
  allMembers.forEach(m => { balances[m.id] = 0; });

  expenses.forEach(exp => {
    if (!exp.participantIds || exp.participantIds.length === 0) return;
    const share = exp.amount / exp.participantIds.length;
    balances[exp.paidById] = (balances[exp.paidById] || 0) + exp.amount;
    exp.participantIds.forEach(pid => {
      balances[pid] = (balances[pid] || 0) - share;
    });
  });

  // Greedy debt simplification — minimal number of transfers
  const d = Object.entries(balances).filter(([, b]) => b < -0.01).map(([id, b]) => ({ id, amount: Math.abs(b) })).sort((a, b) => b.amount - a.amount);
  const c = Object.entries(balances).filter(([, b]) => b > 0.01).map(([id, b]) => ({ id, amount: b })).sort((a, b) => b.amount - a.amount);
  const transactions = [];
  let di = 0, ci = 0;
  while (di < d.length && ci < c.length) {
    const amt = Math.min(d[di].amount, c[ci].amount);
    if (amt > 0.01) transactions.push({ from: d[di].id, to: c[ci].id, amount: Math.round(amt * 100) / 100 });
    d[di].amount -= amt; c[ci].amount -= amt;
    if (d[di].amount < 0.01) di++;
    if (c[ci].amount < 0.01) ci++;
  }
  return { balances, transactions };
}

async function loadData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}
async function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Save error", e); }
}

function generateCookingPairs(families, roomAssignments) {
  // Construire la liste des adultes avec leurs intervalles de présence
  const adults = [];
  families.forEach(f => {
    const hasYoungChild = f.members.some(m => m.role === "child" && (m.age == null || m.age < 6));
    f.members.filter(m => m.role === "adult").forEach(m => {
      // Présence = union des affectations de chambre qui incluent ce membre
      const intervals = (roomAssignments || [])
        .filter(ra => ra.familyId === f.id && ra.memberIds.includes(m.id))
        .map(ra => ({ checkIn: ra.checkIn, checkOut: ra.checkOut }));
      adults.push({ id: m.id, name: m.name, family: f.name, familyId: f.id, color: f.color, avatar: m.avatar, hasYoungChild, intervals });
    });
  });
  if (adults.length < 1) return [];

  // Présent si checkIn <= dayKey < checkOut (pas de cuisine le jour du départ)
  const isPresent = (adult, dayKey) =>
    adult.intervals.some(iv => iv.checkIn <= dayKey && dayKey < iv.checkOut);

  const DAYS = 14;
  const total = {}, lunches = {}, dinners = {};
  adults.forEach(a => { total[a.id] = 0; lunches[a.id] = 0; dinners[a.id] = 0; });
  const pairHist = {};
  const getPK = (a, b) => [a.id, b.id].sort().join("|");
  const getPH = (a, b) => pairHist[getPK(a, b)] || 0;
  const incPH = (a, b) => { const k = getPK(a, b); pairHist[k] = (pairHist[k] || 0) + 1; };

  const result = [];

  for (let day = 0; day < DAYS; day++) {
    const dayKey = DATES[day].key;
    const usedToday = new Set();

    for (let meal = 0; meal < 2; meal++) {
      const isDinner = meal === 1;
      // Seuls les adultes présents ce jour-là participent
      const presentAdults = adults.filter(a => isPresent(a, dayKey));

      if (presentAdults.length === 0) { result.push(null); continue; }
      if (presentAdults.length === 1) {
        // Solo : cas rare (1 seul adulte sur place)
        const solo = presentAdults[0];
        result.push([solo]);
        total[solo.id]++; usedToday.add(solo.id);
        if (isDinner) dinners[solo.id]++; else lunches[solo.id]++;
        continue;
      }

      // Règle 1 : pas deux fois le même jour
      let pool = presentAdults.filter(a => !usedToday.has(a.id));
      if (pool.length < 2) pool = presentAdults;

      let bestScore = Infinity, bestPairs = [];
      for (let i = 0; i < pool.length; i++) {
        for (let j = i + 1; j < pool.length; j++) {
          const a = pool[i], b = pool[j];
          let score = 0;
          score += (total[a.id] + total[b.id]) * 60;         // Règle 2 : équité
          score += getPH(a, b) * 250;                         // Règle 3 : diversité
          if (isDinner) {
            score += (dinners[a.id] - lunches[a.id] + dinners[b.id] - lunches[b.id]) * 40;
          } else {
            score += (lunches[a.id] - dinners[a.id] + lunches[b.id] - dinners[b.id]) * 40;
          }
          if (isDinner && a.familyId === b.familyId && a.hasYoungChild) score += 8000; // Règle 5
          score += Math.random() * 5;
          if (score < bestScore) { bestScore = score; bestPairs = [[a, b]]; }
          else if (Math.abs(score - bestScore) < 1) bestPairs.push([a, b]);
        }
      }

      const chosen = bestPairs[Math.floor(Math.random() * bestPairs.length)];
      result.push(chosen);
      chosen.forEach(p => { total[p.id]++; usedToday.add(p.id); if (isDinner) dinners[p.id]++; else lunches[p.id]++; });
      incPH(chosen[0], chosen[1]);
    }
  }
  return result;
}

const F = "'DM Sans', sans-serif";
const PF = "'Playfair Display', Georgia, serif";

function Nav({ active, setActive }) {
  const tabs = [
    { id: "home", icon: "🏡", label: "Accueil" },
    { id: "rooms", icon: "🛏️", label: "Chambres" },
    { id: "budget", icon: "💰", label: "Budget" },
    { id: "planning", icon: "📅", label: "Planning" },
    { id: "cooking", icon: "👨‍🍳", label: "Cuisine" },
    { id: "activities", icon: "🎯", label: "Activités" },
    { id: "courses", icon: "🛒", label: "Courses" },
    { id: "expenses", icon: "💸", label: "Dépenses" },
    { id: "profiles", icon: "👥", label: "Profils" },
    { id: "rules", icon: "📜", label: "Règles d'or" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(15,20,30,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.11)", display: "flex", overflowX: "auto", fontFamily: F }}>
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

function Hero({ families }) {
  const [count, setCount] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(2026, 6, 11, 14, 0, 0);
    const tick = () => { const diff = Math.max(0, target - new Date()); setCount({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) }); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "40px 20px", textAlign: "center" }}>
      {Array.from({ length: 50 }).map((_, i) => (<div key={i} style={{ position: "absolute", left: `${Math.random()*100}%`, top: `${Math.random()*70}%`, width: Math.random()*3+1, height: Math.random()*3+1, borderRadius: "50%", background: "white", opacity: Math.random()*0.7+0.2, animation: `twinkle ${2+Math.random()*3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />))}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
        <div style={{ fontSize: 72, marginBottom: 8, filter: "drop-shadow(0 0 30px rgba(255,200,60,0.4))" }}>🏡</div>
        <h1 style={{ fontFamily: PF, fontSize: "clamp(38px,8vw,76px)", fontWeight: 900, background: "linear-gradient(135deg, #FFD166 0%, #FFB347 50%, #FF8C42 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px", lineHeight: 1.05, letterSpacing: "-1px" }}>La Maison du Bonheur</h1>
        <p style={{ fontFamily: F, fontSize: "clamp(13px,2.5vw,18px)", color: "rgba(255,255,255,0.6)", fontWeight: 300, letterSpacing: 8, textTransform: "uppercase", margin: "0 0 36px" }}>Nougerède &bull; Été 2026</p>
        <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 44 }}>
          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "0 0 3px", letterSpacing: 2, textTransform: "uppercase" }}>11 — 25 Juillet 2026</p>
          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>14 nuits &bull; Salles-Lavalette &bull; {families.length} famille{families.length > 1 ? "s" : ""}, {families.reduce((s, f) => s + f.members.length, 0)} aventurier{families.reduce((s, f) => s + f.members.length, 0) > 1 ? "s" : ""}</p>
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
          {families.map(f => (
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

function RoomsSection({ families, setFamilies, roomAssignments, setRoomAssignments }) {
  const FAMILY_EMOJIS = ["🦁", "🐻", "🦊", "🐼", "🦅", "🦋", "🐬", "🐯", "🦉", "🦄", "🐸", "🐺", "🦓", "🦒", "🐙", "🦀"];
  const FAMILY_COLORS = ["#E8733A", "#4A90D9", "#6BBF6B", "#9B59B6", "#E74C3C", "#F39C12", "#1ABC9C", "#E91E63", "#00BCD4", "#FF5722"];
  const BLANK_MEMBER = { name: "", role: "adult", age: "" };
  const BLANK_FAM_FORM = { name: "", emoji: "🦄", color: "#9B59B6", members: [{ ...BLANK_MEMBER }] };

  // State: formulaire d'affectation (par chambre)
  const [assigningRoom, setAssigningRoom] = useState(null);
  const [assignForm, setAssignForm] = useState({ familyId: "", memberIds: [], checkIn: "2026-07-11", checkOut: "2026-07-25" });
  const [assignError, setAssignError] = useState("");
  const [editingRA, setEditingRA] = useState(null);
  const [datesForm, setDatesForm] = useState({});
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 };
  const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  // Chevauchement : overlap si checkIn A < checkOut B ET checkOut A > checkIn B
  const hasOverlap = (a, b) => a.checkIn < b.checkOut && a.checkOut > b.checkIn;

  const getRoomAssignments = (roomName) => roomAssignments.filter(ra => ra.roomName === roomName);

  // Validation membres : enfants < 6 ans doivent être avec un adulte
  const validateMembers = (familyId, memberIds) => {
    const fam = families.find(f => f.id === familyId);
    if (!fam || memberIds.length === 0) return "Sélectionne au moins un membre.";
    const selected = fam.members.filter(m => memberIds.includes(m.id));
    const hasAdult = selected.some(m => m.role === "adult");
    const hasYoungChild = selected.some(m => m.role === "child" && (m.age == null || m.age < 6));
    if (hasYoungChild && !hasAdult) return "Les enfants de moins de 6 ans doivent être accompagnés d'un adulte dans la même chambre.";
    return null;
  };

  const openAssignForm = (roomName) => {
    setAssigningRoom(roomName);
    setAssignForm({ familyId: "", memberIds: [], checkIn: "2026-07-11", checkOut: "2026-07-25" });
    setAssignError("");
  };

  const toggleMember = (mid) => setAssignForm(f => ({
    ...f, memberIds: f.memberIds.includes(mid) ? f.memberIds.filter(id => id !== mid) : [...f.memberIds, mid]
  }));

  const submitAssignment = () => {
    const err = validateMembers(assignForm.familyId, assignForm.memberIds);
    if (err) { setAssignError(err); return; }
    const existing = getRoomAssignments(assigningRoom);
    if (existing.some(ra => hasOverlap(ra, assignForm))) { setAssignError("Cette chambre est déjà occupée pour ces dates."); return; }
    const next = [...roomAssignments, { id: `ra-${Date.now()}`, familyId: assignForm.familyId, roomName: assigningRoom, memberIds: assignForm.memberIds, checkIn: assignForm.checkIn, checkOut: assignForm.checkOut }];
    setRoomAssignments(next); saveData("bonheur-roomAssignments", next);
    setAssigningRoom(null);
  };

  const deleteAssignment = (raId) => {
    const next = roomAssignments.filter(ra => ra.id !== raId);
    setRoomAssignments(next); saveData("bonheur-roomAssignments", next);
  };

  const saveDates = (raId) => {
    const next = roomAssignments.map(ra => ra.id !== raId ? ra : { ...ra, ...datesForm });
    setRoomAssignments(next); saveData("bonheur-roomAssignments", next); setEditingRA(null);
  };

  const selectedFamily = families.find(f => f.id === assignForm.familyId);

  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="🛏️" title="Les Chambres" subtitle="Assigne les membres de chaque famille à leur chambre — avec dates et règles de partage" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
        {ROOMS_LIST.map((r) => {
          const assignments = getRoomAssignments(r.name);
          const isFree = assignments.length === 0;
          const isOpen = assigningRoom === r.name;
          return (
            <div key={r.name} style={{ background: isFree ? "linear-gradient(135deg,rgba(45,106,79,0.15),rgba(45,106,79,0.05))" : "rgba(255,255,255,0.07)", border: `1px solid ${isFree ? "rgba(45,106,79,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, padding: 20 }}>
              {/* En-tête chambre */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: assignments[0] ? `${families.find(f=>f.id===assignments[0].familyId)?.color}22`:"rgba(255,255,255,0.11)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "white", margin: 0 }}>{r.name}</h3>
                  <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{r.level}</span>
                </div>
                {isFree && <span style={{ background: "#2D6A4F", color: "white", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1, fontFamily: F }}>Libre</span>}
              </div>
              <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.6 }}>
                {r.beds.map((b, j) => <div key={j}>🛏️ {b}</div>)}
              </div>

              {/* Affectations */}
              {assignments.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                  {assignments.map(ra => {
                    const fam = families.find(f => f.id === ra.familyId);
                    if (!fam) return null;
                    const members = fam.members.filter(m => ra.memberIds.includes(m.id));
                    return (
                      <div key={ra.id} style={{ padding: "10px 12px", borderRadius: 12, background: `${fam.color}12`, border: `1px solid ${fam.color}28` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: fam.color }}>{fam.emoji} {fam.name}</span>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => { setEditingRA(ra.id); setDatesForm({ checkIn: ra.checkIn, checkOut: ra.checkOut }); }} style={{ padding: "2px 7px", borderRadius: 7, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 10 }}>📅</button>
                            <button onClick={() => deleteAssignment(ra.id)} style={{ padding: "2px 7px", borderRadius: 7, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: 10 }}>✕</button>
                          </div>
                        </div>
                        <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
                          {members.map(m => `${m.avatar} ${m.name}${m.age != null ? ` (${m.age} ans)` : ""}`).join(" · ")}
                        </div>
                        {editingRA === ra.id ? (
                          <div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
                              <input type="date" value={datesForm.checkIn} min="2026-07-11" max="2026-07-24" onChange={e => setDatesForm(d => ({ ...d, checkIn: e.target.value }))} style={{ ...inputStyle, fontSize: 11, padding: "6px 8px" }} />
                              <input type="date" value={datesForm.checkOut} min={datesForm.checkIn||"2026-07-12"} max="2026-07-25" onChange={e => setDatesForm(d => ({ ...d, checkOut: e.target.value }))} style={{ ...inputStyle, fontSize: 11, padding: "6px 8px" }} />
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => saveDates(ra.id)} style={{ padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: fam.color, color: "white", fontWeight: 700, fontSize: 11, fontFamily: F }}>✓ OK</button>
                              <button onClick={() => setEditingRA(null)} style={{ padding: "5px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: F }}>✕</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                            📅 {fmtDate(ra.checkIn)} → {fmtDate(ra.checkOut)} · {computeNights(ra.checkIn, ra.checkOut)} nuits
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bouton / formulaire d'affectation */}
              {!isOpen ? (
                <button onClick={() => openAssignForm(r.name)} style={{ width: "100%", padding: "8px", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.15)", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.35)", fontFamily: F, fontSize: 12 }}>
                  + Affecter une famille
                </button>
              ) : (
                <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={labelStyle}>Famille</label>
                    <select value={assignForm.familyId} onChange={e => setAssignForm(f => ({ ...f, familyId: e.target.value, memberIds: [] }))} style={{ ...inputStyle, fontSize: 12, padding: "8px 10px" }}>
                      <option value="">— Choisir —</option>
                      {families.map(fam => <option key={fam.id} value={fam.id}>{fam.emoji} {fam.name}</option>)}
                    </select>
                  </div>
                  {selectedFamily && (
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelStyle}>Membres dans cette chambre</label>
                      {selectedFamily.members.map(m => {
                        const isYoung = m.role === "child" && (m.age == null || m.age < 6);
                        const checked = assignForm.memberIds.includes(m.id);
                        return (
                          <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "7px 10px", borderRadius: 9, marginBottom: 4, background: checked ? `${selectedFamily.color}20` : "rgba(255,255,255,0.07)", border: `1px solid ${checked ? selectedFamily.color+"40" : "rgba(255,255,255,0.11)"}` }}>
                            <input type="checkbox" checked={checked} onChange={() => toggleMember(m.id)} style={{ accentColor: selectedFamily.color }} />
                            <span style={{ fontFamily: F, fontSize: 12, color: "white", flex: 1 }}>{m.avatar} {m.name}</span>
                            <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                              {m.role === "adult" ? "adulte" : `${m.age != null ? m.age : "?"}ans${isYoung ? " 👨‍👩requis" : ""}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <div><label style={labelStyle}>Arrivée</label><input type="date" value={assignForm.checkIn} min="2026-07-11" max="2026-07-24" onChange={e => setAssignForm(f => ({ ...f, checkIn: e.target.value }))} style={{ ...inputStyle, fontSize: 11, padding: "7px 10px" }} /></div>
                    <div><label style={labelStyle}>Départ</label><input type="date" value={assignForm.checkOut} min={assignForm.checkIn||"2026-07-12"} max="2026-07-25" onChange={e => setAssignForm(f => ({ ...f, checkOut: e.target.value }))} style={{ ...inputStyle, fontSize: 11, padding: "7px 10px" }} /></div>
                  </div>
                  {assignError && <div style={{ fontFamily: F, fontSize: 11, color: "#EF4444", marginBottom: 8 }}>⚠️ {assignError}</div>}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={submitAssignment} disabled={!assignForm.familyId || assignForm.memberIds.length === 0} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: assignForm.familyId && assignForm.memberIds.length > 0 ? "pointer" : "default", background: assignForm.familyId && assignForm.memberIds.length > 0 ? "linear-gradient(135deg,#FFD166,#FF8C42)" : "rgba(255,255,255,0.08)", color: assignForm.familyId && assignForm.memberIds.length > 0 ? "#0F141E" : "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 12, fontFamily: F }}>✓ Affecter</button>
                    <button onClick={() => setAssigningRoom(null)} style={{ padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: F }}>Annuler</button>
                  </div>
                </div>
              )}
              {isFree && r.sug && <div style={{ fontFamily: F, fontSize: 11, color: "rgba(45,106,79,0.7)", fontStyle: "italic", marginTop: 8 }}>{r.sug}</div>}
            </div>
          );
        })}
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
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 24, padding: 28, border: "1px solid rgba(255,255,255,0.11)" }}>
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
                        <button key={v} onClick={() => toggleRsvp(m.id, s.key, v)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, background: st === v ? bg : "rgba(255,255,255,0.11)", color: st === v ? "white" : "rgba(255,255,255,0.3)" }}>{l}</button>
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
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.11)", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{p.text}</span>
                  <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    par {nameMap[p.author] || p.author} &bull; {p.slot === "am" ? "matin" : p.slot === "pm" ? "aprem" : "soirée"}
                  </div>
                </div>
                <button onClick={() => voteProp(p.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: p.votes.includes(currentUser) ? "rgba(107,191,107,0.2)" : "rgba(255,255,255,0.11)", color: p.votes.includes(currentUser) ? "#6BBF6B" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>👍 {p.votes.length}</button>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div style={{ marginTop: 16, padding: "16px 18px", borderRadius: 16, background: "rgba(255,200,60,0.06)", border: "1px solid rgba(255,200,60,0.15)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[["am", "Matin"], ["pm", "Aprem"], ["eve", "Soirée"]].map(([k, l]) => (
                <button key={k} onClick={() => setNp(p => ({ ...p, slot: k }))} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: np.slot === k ? "#FFD166" : "rgba(255,255,255,0.11)", color: np.slot === k ? "#0F141E" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>{l}</button>
              ))}
            </div>
            <input value={np.text} onChange={e => setNp(p => ({ ...p, text: e.target.value }))} placeholder="Ex: Journée kayak sur la Dronne..." onKeyDown={e => e.key === "Enter" && addProp()}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 14, fontFamily: F, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addProp} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "#FFD166", color: "#0F141E", fontWeight: 700, fontSize: 13, fontFamily: F }}>Proposer</button>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} style={{ marginTop: 16, width: "100%", padding: "14px", borderRadius: 14, border: "1px dashed rgba(255,200,60,0.3)", background: "transparent", color: "#FFD166", cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: 600 }}>+ Proposer une activité pour ce jour</button>
        )}
      </div>
    </div>
  );
}

function CookingSection({ families, roomAssignments, meals, setMeals }) {
  const raKey = (roomAssignments || []).map(ra => `${ra.id}:${ra.checkIn}-${ra.checkOut}-${ra.memberIds.join(",")}`).join("|");
  const [pairs, setPairs] = useState(() => generateCookingPairs(families, roomAssignments));
  const [key, setKey] = useState(0);
  // { dayKey, type: "lunch"|"dinner" } | null
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealDraft, setMealDraft] = useState("");

  useEffect(() => {
    setPairs(generateCookingPairs(families, roomAssignments));
    setKey(k => k + 1);
  }, [families.length, raKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const regen = () => { setPairs(generateCookingPairs(families, roomAssignments)); setKey(k => k + 1); };

  const saveMeal = (dayKey, type) => {
    const next = { ...meals, [dayKey]: { ...(meals[dayKey] || {}), [type]: mealDraft.trim() } };
    setMeals(next); saveData("bonheur-meals", next); setEditingMeal(null);
  };
  const clearMeal = (dayKey, type) => {
    const next = { ...meals, [dayKey]: { ...(meals[dayKey] || {}), [type]: "" } };
    setMeals(next); saveData("bonheur-meals", next);
  };
  const startEdit = (dayKey, type) => {
    setEditingMeal({ dayKey, type });
    setMealDraft((meals[dayKey] || {})[type] || "");
  };

  // Compteurs par personne
  const mealCounts = {};
  pairs.forEach(pair => { if (pair) pair.forEach(p => { mealCounts[p.id] = (mealCounts[p.id] || 0) + 1; }); });
  const allAdults = families.flatMap(f => f.members.filter(m => m.role === "adult").map(m => ({ ...m, color: f.color })));

  const mealMeta = [
    { type: "lunch", label: "Déjeuner", icon: "🥗", color: "#FFD166" },
    { type: "dinner", label: "Dîner",    icon: "🌙", color: "#A78BFA" },
  ];

  return (
    <div style={{ padding: "0 20px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionTitle icon="👨‍🍳" title="Planning Cuisine" subtitle="Binômes · menu · tout en un coup d'œil" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={regen} style={{ padding: "12px 28px", borderRadius: 40, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #FFD166, #FF8C42)", color: "#0F141E", fontWeight: 700, fontSize: 14, fontFamily: F, boxShadow: "0 4px 20px rgba(255,140,66,0.3)" }}>🎲 Remélanger</button>
        {allAdults.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: `${m.color}15`, border: `1px solid ${m.color}30` }}>
            <span style={{ fontSize: 15 }}>{m.avatar}</span>
            <span style={{ fontFamily: F, fontSize: 11, color: m.color, fontWeight: 600 }}>{m.name}</span>
            <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{mealCounts[m.id] || 0}×</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {DATES.map((d, di) => (
          <div key={`${di}-${key}`} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {/* En-tête jour */}
            <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.11)", background: "rgba(255,200,60,0.04)" }}>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#FFD166", textTransform: "capitalize" }}>{d.day} {d.num} juillet</span>
            </div>

            {/* Blocs déjeuner + dîner */}
            {mealMeta.map(({ type, label, icon, color }, mi) => {
              const pair = pairs[di * 2 + mi];
              const dayKey = d.key;
              const mealText = (meals[dayKey] || {})[type] || "";
              const isEditing = editingMeal?.dayKey === dayKey && editingMeal?.type === type;

              return (
                <div key={type} style={{ padding: "12px 14px", borderBottom: mi === 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  {/* Ligne cuisine */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.8, minWidth: 58 }}>{icon} {label}</span>
                    {!pair ? (
                      <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>—</span>
                    ) : (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {pair.map((p, pi) => (
                          <span key={pi} style={{ fontFamily: F, fontSize: 11, padding: "2px 8px", borderRadius: 8, background: `${p.color}22`, color: p.color, fontWeight: 600 }}>{p.avatar} {p.name}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ligne menu */}
                  <div style={{ marginLeft: 0 }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 5 }}>
                        <input
                          autoFocus
                          value={mealDraft}
                          onChange={e => setMealDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") saveMeal(dayKey, type); if (e.key === "Escape") setEditingMeal(null); }}
                          placeholder="Ex: salade tomates, coquillettes jambon…"
                          style={{ flex: 1, padding: "5px 10px", borderRadius: 9, border: `1px solid ${color}55`, background: "rgba(0,0,0,0.35)", color: "white", fontSize: 12, fontFamily: F, outline: "none" }}
                        />
                        <button onClick={() => saveMeal(dayKey, type)} style={{ padding: "5px 10px", borderRadius: 9, border: "none", cursor: "pointer", background: color, color: type === "lunch" ? "#0F141E" : "white", fontWeight: 700, fontSize: 12 }}>✓</button>
                        <button onClick={() => setEditingMeal(null)} style={{ padding: "5px 8px", borderRadius: 9, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>✕</button>
                      </div>
                    ) : mealText ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ flex: 1, fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, fontStyle: "italic" }}>🍽 {mealText}</span>
                        <button onClick={() => startEdit(dayKey, type)} style={{ padding: "3px 6px", borderRadius: 7, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", fontSize: 10 }}>✏️</button>
                        <button onClick={() => clearMeal(dayKey, type)} style={{ padding: "3px 6px", borderRadius: 7, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.5)", fontSize: 10 }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(dayKey, type)} style={{ width: "100%", textAlign: "left", padding: "5px 10px", borderRadius: 9, border: `1px dashed ${color}25`, background: "transparent", color: `${color}55`, cursor: "pointer", fontFamily: F, fontSize: 11 }}>+ Ajouter le menu…</button>
                    )}
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
          <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}>
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

function ProfilesSection({ families, setFamilies, currentUser, setCurrentUser, roomAssignments }) {
  const FAMILY_EMOJIS = ["🦁", "🐻", "🦊", "🐼", "🦅", "🦋", "🐬", "🐯", "🦉", "🦄", "🐸", "🐺", "🦓", "🦒", "🐙", "🦀"];
  const FAMILY_COLORS = ["#E8733A", "#4A90D9", "#6BBF6B", "#9B59B6", "#E74C3C", "#F39C12", "#1ABC9C", "#E91E63", "#00BCD4", "#FF5722"];
  const BLANK_MEMBER = { name: "", role: "adult", age: "" };
  const BLANK_FAM_FORM = { name: "", emoji: "🦄", color: "#9B59B6", members: [{ ...BLANK_MEMBER }] };
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 };

  const [editing, setEditing] = useState(null);
  const [ed, setEd] = useState({});
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [famForm, setFamForm] = useState(BLANK_FAM_FORM);

  const updateFamMember = (idx, field, val) => setFamForm(f => ({ ...f, members: f.members.map((m, i) => i === idx ? { ...m, [field]: val } : m) }));
  const addFamMember = () => setFamForm(f => ({ ...f, members: [...f.members, { ...BLANK_MEMBER }] }));
  const removeFamMember = (idx) => setFamForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));
  const canCreateFam = famForm.name.trim() && famForm.members.some(m => m.name.trim());

  const createFamily = () => {
    if (!canCreateFam) return;
    const slug = famForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const newFam = {
      id: `${slug}-${Date.now()}`,
      name: famForm.name.trim(), emoji: famForm.emoji, color: famForm.color,
      members: famForm.members.filter(m => m.name.trim()).map((m, i) => ({
        id: `${slug}-${i + 1}`, name: m.name.trim(), role: m.role,
        ...(m.role === "child" && m.age ? { age: Number(m.age) } : {}),
        avatar: m.role === "adult" ? "👤" : "🧒", diet: "", activities: [], bio: "",
      })),
    };
    const next = [...families, newFam];
    setFamilies(next); saveData("bonheur-families", next);
    setShowAddFamily(false); setFamForm(BLANK_FAM_FORM);
  };
  const avatars = [
    // Femmes — teintes variées
    "👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿",
    // Hommes — teintes variées
    "👨🏻", "👨🏼", "👨🏽", "👨🏾", "👨🏿",
    // Barbus
    "🧔🏻", "🧔🏽", "🧔🏾", "🧔🏿",
    // Cheveux roux/bouclés/blancs
    "👨🏽‍🦰", "👩🏽‍🦱", "👨🏾‍🦱", "👩🏾‍🦳",
    // Enfants — teintes variées
    "🧒🏻", "🧒🏼", "🧒🏽", "🧒🏾", "🧒🏿",
    "👦🏻", "👦🏽", "👦🏾", "👧🏼", "👧🏽", "👧🏾",
    // Bébés
    "👶🏻", "👶🏽", "👶🏾", "👶🏿",
    // Neutres
    "🧑🏻", "🧑🏽", "🧑🏾",
  ];
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
          <div key={fam.id} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 24, overflow: "hidden", border: `1px solid ${fam.color}33` }}>
            <div style={{ background: `linear-gradient(135deg, ${fam.color}25, ${fam.color}08)`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${fam.color}22` }}>
              <span style={{ fontSize: 40 }}>{fam.emoji}</span>
              <div><h3 style={{ fontFamily: PF, fontSize: 22, fontWeight: 800, color: fam.color, margin: 0 }}>{fam.name}</h3><p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>{(roomAssignments||[]).filter(ra=>ra.familyId===fam.id).map(ra=>ra.roomName).filter((v,i,a)=>a.indexOf(v)===i).join(", ")||"—"}</p></div>
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
                          {m.age != null && <span style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.11)", padding: "2px 8px", borderRadius: 8 }}>{m.age} ans</span>}
                        </div>
                        {m.bio && !isEd && <p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "4px 0 0", fontStyle: "italic" }}>"{m.bio}"</p>}
                      </div>
                      {!isEd && <button onClick={() => startEdit(fam.id, m.id)} style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 11 }}>✏️</button>}
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
                          {avatars.map(av => (<button key={av} onClick={() => setEd(d => ({ ...d, avatar: av }))} style={{ width: 36, height: 36, borderRadius: 10, border: ed.avatar === av ? `2px solid ${fam.color}` : "2px solid transparent", cursor: "pointer", fontSize: 20, background: ed.avatar === av ? `${fam.color}33` : "rgba(255,255,255,0.11)" }}>{av}</button>))}
                        </div>
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Mini bio / citation</label>
                        <input value={ed.bio} onChange={e => setEd(d => ({ ...d, bio: e.target.value }))} placeholder="Ex: Roi du barbecue et de la sieste..."
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Restrictions alimentaires</label>
                        <input value={ed.diet} onChange={e => setEd(d => ({ ...d, diet: e.target.value }))} placeholder="Ex: Végétarien, sans gluten..."
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
                        <label style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Activités préférées</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                          {ALL_ACTIVITY_TAGS.map(tag => (<button key={tag} onClick={() => togAct(tag)} style={{ padding: "5px 10px", borderRadius: 10, border: "none", cursor: "pointer", background: ed.activities.includes(tag) ? `${fam.color}30` : "rgba(255,255,255,0.11)", color: ed.activities.includes(tag) ? fam.color : "rgba(255,255,255,0.35)", fontFamily: F, fontSize: 11, fontWeight: ed.activities.includes(tag) ? 600 : 400 }}>{tag}</button>))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => saveEdit(fam.id, m.id)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: fam.color, color: "white", fontWeight: 700, fontSize: 13, fontFamily: F }}>💾 Sauvegarder</button>
                          <button onClick={() => setEditing(null)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
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

      {/* Créer une nouvelle famille */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.11)", paddingTop: 28, marginTop: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button onClick={() => { setShowAddFamily(!showAddFamily); setFamForm(BLANK_FAM_FORM); }} style={{ padding: "12px 28px", borderRadius: 30, border: "none", cursor: "pointer", background: showAddFamily ? "rgba(255,255,255,0.11)" : "linear-gradient(135deg,#FFD166,#FF8C42)", color: showAddFamily ? "rgba(255,255,255,0.5)" : "#0F141E", fontWeight: 700, fontSize: 14, fontFamily: F }}>
            {showAddFamily ? "✕ Annuler" : "➕ Créer une nouvelle famille"}
          </button>
        </div>
        {showAddFamily && (
          <div style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 600, margin: "0 auto" }}>
            <h3 style={{ fontFamily: PF, fontSize: 20, color: "#FFD166", margin: "0 0 18px" }}>➕ Nouvelle famille</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Nom de la famille *</label>
              <input value={famForm.name} onChange={e => setFamForm(d => ({ ...d, name: e.target.value }))} placeholder="Ex: Dupont" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Emoji</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {FAMILY_EMOJIS.map(em => (<button key={em} onClick={() => setFamForm(d => ({ ...d, emoji: em }))} style={{ width: 34, height: 34, borderRadius: 9, border: famForm.emoji === em ? "2px solid #FFD166" : "2px solid transparent", cursor: "pointer", fontSize: 19, background: famForm.emoji === em ? "rgba(255,200,60,0.15)" : "rgba(255,255,255,0.11)" }}>{em}</button>))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Couleur</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {FAMILY_COLORS.map(col => (<button key={col} onClick={() => setFamForm(d => ({ ...d, color: col }))} style={{ width: 28, height: 28, borderRadius: "50%", border: famForm.color === col ? "3px solid white" : "3px solid transparent", cursor: "pointer", background: col, outline: "none" }} />))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ ...labelStyle, margin: 0 }}>Membres *</label>
                <button onClick={addFamMember} style={{ padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: "rgba(255,200,60,0.12)", color: "#FFD166", fontFamily: F, fontSize: 12, fontWeight: 600 }}>+ Ajouter</button>
              </div>
              {famForm.members.map((m, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <input value={m.name} onChange={e => updateFamMember(idx, "name", e.target.value)} placeholder={idx === 0 ? "Prénom (référent)" : "Prénom"} style={{ ...inputStyle, padding: "8px 12px", fontSize: 12 }} />
                  <select value={m.role} onChange={e => updateFamMember(idx, "role", e.target.value)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 12, fontFamily: F, cursor: "pointer", outline: "none" }}>
                    <option value="adult">Adulte</option>
                    <option value="child">Enfant</option>
                  </select>
                  {m.role === "child" ? <input type="number" value={m.age} onChange={e => updateFamMember(idx, "age", e.target.value)} placeholder="Âge" min="0" max="17" style={{ ...inputStyle, width: 60, padding: "8px 8px", fontSize: 12, textAlign: "center" }} /> : <div style={{ width: 60 }} />}
                  {famForm.members.length > 1 ? <button onClick={() => removeFamMember(idx)} style={{ padding: "6px 9px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: 12 }}>✕</button> : <div style={{ width: 34 }} />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={createFamily} disabled={!canCreateFam} style={{ padding: "11px 26px", borderRadius: 13, border: "none", cursor: canCreateFam ? "pointer" : "default", background: canCreateFam ? "linear-gradient(135deg,#FFD166,#FF8C42)" : "rgba(255,255,255,0.08)", color: canCreateFam ? "#0F141E" : "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 13, fontFamily: F }}>✓ Créer la famille</button>
              <button onClick={() => { setShowAddFamily(false); setFamForm(BLANK_FAM_FORM); }} style={{ padding: "11px 18px", borderRadius: 13, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingSection({ meals, shoppingItems, setShoppingItems, currentUser, families }) {
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "done"

  const nameMap = {};
  families.forEach(f => f.members.forEach(m => { nameMap[m.id] = { name: m.name, avatar: m.avatar, color: f.color }; }));

  // Build meal-derived items list (read-only suggestions from planning)
  const mealSuggestions = DATES.flatMap(d => {
    const dm = meals[d.key] || {};
    const rows = [];
    if (dm.lunch) rows.push({ dateKey: d.key, dateLabel: `${d.day} ${d.num} juil.`, type: "lunch", typeLabel: "Déjeuner", text: dm.lunch });
    if (dm.dinner) rows.push({ dateKey: d.key, dateLabel: `${d.day} ${d.num} juil.`, type: "dinner", typeLabel: "Dîner", text: dm.dinner });
    return rows;
  });

  const toggleItem = (id) => {
    const next = shoppingItems.map(it => it.id === id ? { ...it, checked: !it.checked, checkedBy: !it.checked ? (currentUser || "Anonyme") : null } : it);
    setShoppingItems(next); saveData("bonheur-shopping", next);
  };

  const deleteItem = (id) => {
    const next = shoppingItems.filter(it => it.id !== id);
    setShoppingItems(next); saveData("bonheur-shopping", next);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const next = [...shoppingItems, { id: `si-${Date.now()}`, text: newItem.trim(), checked: false, checkedBy: null, addedBy: currentUser || "Anonyme", category: "misc" }];
    setShoppingItems(next); saveData("bonheur-shopping", next); setNewItem("");
  };

  const clearDone = () => {
    const next = shoppingItems.filter(it => !it.checked);
    setShoppingItems(next); saveData("bonheur-shopping", next);
  };

  const displayed = filter === "pending" ? shoppingItems.filter(i => !i.checked) : filter === "done" ? shoppingItems.filter(i => i.checked) : shoppingItems;
  const doneCount = shoppingItems.filter(i => i.checked).length;

  return (
    <div style={{ padding: "0 20px 60px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="🛒" title="Liste de Courses" subtitle="Planifie les repas → génère la liste → coche au fur et à mesure !" />

      {/* Menu planifié → idées courses */}
      {mealSuggestions.length > 0 && (
        <div style={{ marginBottom: 32, padding: 24, borderRadius: 20, background: "rgba(107,191,107,0.05)", border: "1px solid rgba(107,191,107,0.15)" }}>
          <h3 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#6BBF6B", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>🍽️ Repas planifiés</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
            {mealSuggestions.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>{s.type === "lunch" ? "🥗" : "🌙"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "capitalize" }}>{s.dateLabel} · {s.typeLabel}</div>
                  <div style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{s.text}</div>
                </div>
                <button onClick={() => {
                  const next = [...shoppingItems, { id: `si-${Date.now()}`, text: `[${s.typeLabel} ${s.dateLabel}] ${s.text}`, checked: false, checkedBy: null, addedBy: currentUser || "Anonyme", category: "meal" }];
                  setShoppingItems(next); saveData("bonheur-shopping", next);
                }} title="Ajouter à la liste" style={{ padding: "4px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(107,191,107,0.15)", color: "#6BBF6B", fontSize: 12, flexShrink: 0 }}>+ Liste</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ajouter un item manuel */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addItem()}
          placeholder="Ajouter un article (ex: huile d'olive, feta, rosé…)"
          style={{ flex: 1, padding: "14px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 14, fontFamily: F, outline: "none" }}
        />
        <button onClick={addItem} style={{ padding: "14px 24px", borderRadius: 16, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#FFD166,#FF8C42)", color: "#0F141E", fontWeight: 700, fontSize: 15, fontFamily: F }}>+</button>
      </div>

      {/* Filtres + stats */}
      {shoppingItems.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[["all", "Tout", shoppingItems.length], ["pending", "À acheter", shoppingItems.length - doneCount], ["done", "Cochés", doneCount]].map(([id, label, count]) => (
            <button key={id} onClick={() => setFilter(id)} style={{ padding: "7px 16px", borderRadius: 24, border: "none", cursor: "pointer", background: filter === id ? "rgba(255,200,60,0.15)" : "rgba(255,255,255,0.04)", color: filter === id ? "#FFD166" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: 600 }}>{label} <span style={{ opacity: 0.6 }}>({count})</span></button>
          ))}
          {doneCount > 0 && (
            <button onClick={clearDone} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 24, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "#EF4444", fontFamily: F, fontSize: 12, fontWeight: 600 }}>🗑 Supprimer cochés</button>
          )}
        </div>
      )}

      {/* Liste */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.25)", fontFamily: F }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <div>{shoppingItems.length === 0 ? "Commence par planifier des repas dans le Planning, puis ajoute des articles !" : "Rien à afficher dans ce filtre."}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {displayed.map(item => {
            const adder = nameMap[item.addedBy];
            const checker = item.checkedBy ? nameMap[item.checkedBy] : null;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: item.checked ? "rgba(107,191,107,0.05)" : "rgba(255,255,255,0.07)", border: `1px solid ${item.checked ? "rgba(107,191,107,0.2)" : "rgba(255,255,255,0.11)"}`, transition: "all 0.2s" }}>
                <button onClick={() => toggleItem(item.id)} style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${item.checked ? "#6BBF6B" : "rgba(255,255,255,0.2)"}`, background: item.checked ? "#6BBF6B" : "transparent", cursor: "pointer", color: "white", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.checked ? "✓" : ""}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontSize: 14, color: item.checked ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)", textDecoration: item.checked ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</div>
                  <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                    Ajouté par {adder ? `${adder.avatar} ${adder.name}` : item.addedBy}
                    {item.checked && checker && ` · Coché par ${checker.avatar} ${checker.name}`}
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id)} style={{ padding: "5px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "rgba(239,68,68,0.6)", fontSize: 12, flexShrink: 0 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EXPENSE_CATS = [
  { id: "courses", label: "Courses", icon: "🛒" },
  { id: "alcool", label: "Alcool", icon: "🍷" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "activite", label: "Activité", icon: "🎯" },
  { id: "hygiene", label: "Hygiène", icon: "🧴" },
  { id: "autre", label: "Autre", icon: "💡" },
];
const BLANK_EXP = { description: "", amount: "", paidById: "", date: "2026-07-11", participantIds: [], category: "courses", receiptThumb: null };

function ExpensesSection({ families, roomAssignments, expenses, setExpenses, currentUser }) {
  const [view, setView] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_EXP);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const inp = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 13, fontFamily: F, outline: "none", boxSizing: "border-box" };
  const lbl = { fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 5 };

  // Flat member list
  const allMembers = families.flatMap(f => f.members.map(m => ({ ...m, familyName: f.name, familyColor: f.color, familyEmoji: f.emoji })));
  const adults = allMembers.filter(m => m.role === "adult");
  const memberMap = Object.fromEntries(allMembers.map(m => [m.id, m]));

  const catMap = Object.fromEntries(EXPENSE_CATS.map(c => [c.id, c]));

  // Who is present on a given date (checkIn <= date < checkOut)
  const getPresentIds = (dateKey) => {
    const ids = new Set();
    (roomAssignments || []).forEach(ra => {
      if (ra.checkIn <= dateKey && dateKey < ra.checkOut) ra.memberIds.forEach(id => ids.add(id));
    });
    return [...ids];
  };

  const openForm = () => {
    const presentIds = getPresentIds("2026-07-11");
    const defaultPayer = currentUser || (adults[0]?.id || "");
    setForm({ ...BLANK_EXP, paidById: defaultPayer, participantIds: presentIds });
    setReceiptPreview(null);
    setShowForm(true);
  };

  const handleDateChange = (date) => {
    setForm(f => ({ ...f, date, participantIds: getPresentIds(date) }));
  };

  const toggleParticipant = (mid) => {
    setForm(f => ({ ...f, participantIds: f.participantIds.includes(mid) ? f.participantIds.filter(id => id !== mid) : [...f.participantIds, mid] }));
  };

  const handleReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const thumb = await compressImage(file);
    setReceiptPreview(thumb);
    setForm(f => ({ ...f, receiptThumb: thumb }));
  };

  const canAdd = form.description.trim() && form.amount > 0 && form.paidById && form.participantIds.length > 0;

  const addExpense = () => {
    if (!canAdd) return;
    const next = [...expenses, { id: `exp-${Date.now()}`, description: form.description.trim(), amount: parseFloat(form.amount), paidById: form.paidById, date: form.date, participantIds: form.participantIds, category: form.category, receiptThumb: form.receiptThumb, createdAt: Date.now() }];
    setExpenses(next); saveData("bonheur-expenses", next);
    setShowForm(false); setForm(BLANK_EXP); setReceiptPreview(null);
  };

  const deleteExpense = (id) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next); saveData("bonheur-expenses", next);
  };

  // Sort by date descending
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const { balances, transactions } = calculateDebts(expenses, allMembers);

  const fmtEur = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div style={{ padding: "0 20px 60px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="💸" title="Dépenses" subtitle="Tricount maison — qui a payé quoi, qui doit quoi à qui" />

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
        {[["list", "📋 Dépenses"], ["settlement", "⚖️ Règlement"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{ padding: "10px 24px", borderRadius: 30, border: "none", cursor: "pointer", background: view === id ? "linear-gradient(135deg,#FFD166,#FF8C42)" : "rgba(255,255,255,0.05)", color: view === id ? "#0F141E" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 13, fontFamily: F }}>{label}</button>
        ))}
      </div>

      {/* === VIEW: LIST === */}
      {view === "list" && (
        <>
          {/* Stats bar */}
          {expenses.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ padding: "14px 20px", borderRadius: 16, background: "rgba(255,200,60,0.08)", border: "1px solid rgba(255,200,60,0.15)", flex: 1 }}>
                <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Total dépensé</div>
                <div style={{ fontFamily: PF, fontSize: 28, fontWeight: 900, color: "#FFD166" }}>{fmtEur(totalSpent)}</div>
              </div>
              <div style={{ padding: "14px 20px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", flex: 1 }}>
                <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{expenses.length} dépense{expenses.length > 1 ? "s" : ""}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {EXPENSE_CATS.filter(cat => expenses.some(e => e.category === cat.id)).map(cat => (
                    <span key={cat.id} style={{ fontFamily: F, fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.5)" }}>{cat.icon} {cat.label}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add button */}
          {!showForm && (
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button onClick={openForm} style={{ padding: "13px 32px", borderRadius: 30, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#FFD166,#FF8C42)", color: "#0F141E", fontWeight: 700, fontSize: 14, fontFamily: F }}>➕ Ajouter une dépense</button>
            </div>
          )}

          {/* Add form */}
          {showForm && (
            <div style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
              <h3 style={{ fontFamily: PF, fontSize: 18, color: "#FFD166", margin: "0 0 20px" }}>➕ Nouvelle dépense</h3>

              {/* Description + Montant */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Description *</label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Courses Lidl, Bouteilles rosé…" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Montant (€) *</label>
                  <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0,00" style={{ ...inp, width: 110, textAlign: "right" }} />
                </div>
              </div>

              {/* Payé par + Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Payé par *</label>
                  <select value={form.paidById} onChange={e => setForm(f => ({ ...f, paidById: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                    <option value="">— Choisir —</option>
                    {adults.map(m => <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" value={form.date} min="2026-07-11" max="2026-07-25" onChange={e => handleDateChange(e.target.value)} style={inp} />
                </div>
              </div>

              {/* Catégorie */}
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Catégorie</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {EXPENSE_CATS.map(cat => (
                    <button key={cat.id} onClick={() => setForm(f => ({ ...f, category: cat.id }))} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: form.category === cat.id ? "rgba(255,200,60,0.2)" : "rgba(255,255,255,0.05)", color: form.category === cat.id ? "#FFD166" : "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12, fontWeight: form.category === cat.id ? 700 : 400 }}>{cat.icon} {cat.label}</button>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...lbl, margin: 0 }}>Concernés par la dépense * <span style={{ color: "rgba(255,255,255,0.25)" }}>({form.participantIds.length} sélectionné{form.participantIds.length > 1 ? "s" : ""})</span></label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setForm(f => ({ ...f, participantIds: allMembers.map(m => m.id) }))} style={{ padding: "3px 10px", borderRadius: 14, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 11 }}>Tous</button>
                    <button onClick={() => setForm(f => ({ ...f, participantIds: [] }))} style={{ padding: "3px 10px", borderRadius: 14, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 11 }}>Aucun</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {allMembers.map(m => {
                    const sel = form.participantIds.includes(m.id);
                    return (
                      <button key={m.id} onClick={() => toggleParticipant(m.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: sel ? `1px solid ${m.familyColor}55` : "1px solid rgba(255,255,255,0.08)", cursor: "pointer", background: sel ? `${m.familyColor}22` : "rgba(255,255,255,0.07)", color: sel ? m.familyColor : "rgba(255,255,255,0.35)", fontFamily: F, fontSize: 12, fontWeight: sel ? 600 : 400 }}>
                        <span>{m.avatar}</span>
                        <span>{m.name}</span>
                        {m.role === "child" && m.age != null && <span style={{ fontSize: 10, opacity: 0.6 }}>{m.age}a</span>}
                      </button>
                    );
                  })}
                </div>
                {form.participantIds.length > 0 && form.amount > 0 && (
                  <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
                    → {(parseFloat(form.amount) / form.participantIds.length).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € par personne
                  </div>
                )}
              </div>

              {/* Ticket de caisse */}
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Ticket de caisse <span style={{ color: "rgba(255,255,255,0.2)" }}>(optionnel)</span></label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label style={{ padding: "8px 16px", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.15)", cursor: "pointer", fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.02)" }}>
                    📷 Choisir une photo
                    <input type="file" accept="image/*" onChange={handleReceipt} style={{ display: "none" }} />
                  </label>
                  {receiptPreview && <img src={receiptPreview} alt="ticket" style={{ height: 60, width: 60, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />}
                  {receiptPreview && <button onClick={() => { setReceiptPreview(null); setForm(f => ({ ...f, receiptThumb: null })); }} style={{ padding: "4px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: 11 }}>✕</button>}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addExpense} disabled={!canAdd} style={{ padding: "11px 26px", borderRadius: 13, border: "none", cursor: canAdd ? "pointer" : "default", background: canAdd ? "linear-gradient(135deg,#FFD166,#FF8C42)" : "rgba(255,255,255,0.08)", color: canAdd ? "#0F141E" : "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 13, fontFamily: F }}>✓ Ajouter</button>
                <button onClick={() => { setShowForm(false); setForm(BLANK_EXP); setReceiptPreview(null); }} style={{ padding: "11px 18px", borderRadius: 13, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: F }}>Annuler</button>
              </div>
            </div>
          )}

          {/* Expense list */}
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.25)", fontFamily: F }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💸</div>
              <div>Personne n'a encore rien payé. Ça ne va pas durer.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sorted.map(exp => {
                const payer = memberMap[exp.paidById];
                const cat = catMap[exp.category] || catMap.autre;
                const sharePerPerson = exp.participantIds.length > 0 ? exp.amount / exp.participantIds.length : 0;
                const isExpanded = expandedId === exp.id;
                return (
                  <div key={exp.id} style={{ borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", overflow: "hidden" }}>
                    <div onClick={() => setExpandedId(isExpanded ? null : exp.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>{exp.description}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          {fmtDate(exp.date)} · {payer ? `${payer.avatar} ${payer.name}` : "?"} a payé · {exp.participantIds.length} personne{exp.participantIds.length > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: PF, fontSize: 20, fontWeight: 800, color: "#FFD166" }}>{fmtEur(exp.amount)}</div>
                        <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{fmtEur(sharePerPerson)}/pers.</div>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginLeft: 4 }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8, marginTop: 10 }}>Concernés :</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                          {exp.participantIds.map(pid => {
                            const m = memberMap[pid];
                            if (!m) return null;
                            return <span key={pid} style={{ fontFamily: F, fontSize: 11, padding: "3px 9px", borderRadius: 10, background: `${m.familyColor}20`, color: m.familyColor, fontWeight: 500 }}>{m.avatar} {m.name}</span>;
                          })}
                        </div>
                        {exp.receiptThumb && (
                          <div style={{ marginBottom: 12 }}>
                            <img src={exp.receiptThumb} alt="ticket" style={{ height: 80, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", objectFit: "cover" }} />
                          </div>
                        )}
                        <button onClick={() => deleteExpense(exp.id)} style={{ padding: "6px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.1)", color: "#EF4444", fontFamily: F, fontSize: 12, fontWeight: 600 }}>🗑 Supprimer</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* === VIEW: SETTLEMENT === */}
      {view === "settlement" && (
        <>
          {expenses.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.25)", fontFamily: F }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
              <div>Aucune dépense enregistrée pour l'instant.</div>
            </div>
          ) : (
            <>
              {/* Balance per person */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
                {allMembers.filter(m => balances[m.id] !== undefined).map(m => {
                  const bal = balances[m.id] || 0;
                  const isPos = bal > 0.01, isNeg = bal < -0.01;
                  const color = isPos ? "#6BBF6B" : isNeg ? "#EF4444" : "rgba(255,255,255,0.4)";
                  return (
                    <div key={m.id} style={{ padding: "16px 18px", borderRadius: 16, background: isPos ? "rgba(107,191,107,0.06)" : isNeg ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.07)", border: `1px solid ${isPos ? "rgba(107,191,107,0.2)" : isNeg ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.11)"}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 26 }}>{m.avatar}</span>
                        <div>
                          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{m.name}</div>
                          <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{m.familyName}</div>
                        </div>
                      </div>
                      <div style={{ fontFamily: PF, fontSize: 22, fontWeight: 800, color }}>
                        {isPos ? "+" : ""}{bal.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </div>
                      <div style={{ fontFamily: F, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {isPos ? "doit recevoir" : isNeg ? "doit payer" : "équilibré ✓"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Transactions */}
              {transactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, borderRadius: 16, background: "rgba(107,191,107,0.06)", border: "1px solid rgba(107,191,107,0.15)", fontFamily: F, fontSize: 14, color: "#6BBF6B" }}>✓ Tout le monde est à l'équilibre !</div>
              ) : (
                <div>
                  <h3 style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>💸 Virements à faire</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {transactions.map((t, i) => {
                      const from = memberMap[t.from], to = memberMap[t.to];
                      if (!from || !to) return null;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <span style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 22 }}>{from.avatar}</span>
                            <span style={{ fontWeight: 600, color: "#EF4444" }}>{from.name}</span>
                          </span>
                          <span style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>→</span>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontFamily: PF, fontSize: 22, fontWeight: 900, color: "#FFD166" }}>{fmtEur(t.amount)}</div>
                          </div>
                          <span style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>→</span>
                          <span style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontWeight: 600, color: "#6BBF6B" }}>{to.name}</span>
                            <span style={{ fontSize: 22 }}>{to.avatar}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
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
          <div key={i} style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><span style={{ fontSize: 24 }}>{r.icon}</span><h4 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#FFD166", margin: 0 }}>{r.title}</h4></div>
            <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetSection({ families, totalCost, setTotalCost, roomAssignments }) {
  const [editingCost, setEditingCost] = useState(false);
  const [tempCost, setTempCost] = useState(String(totalCost));
  const shares = computeShares(families, totalCost, roomAssignments);
  const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const inputStyle = { padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontFamily: F, outline: "none" };

  return (
    <div style={{ padding: "0 20px 60px", maxWidth: 920, margin: "0 auto" }}>
      <SectionTitle icon="💰" title="Budget" subtitle="Répartition équitable du coût du séjour selon les nuits de chaque famille" />

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {editingCost ? (
          <div style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
            <input type="number" value={tempCost} onChange={e => setTempCost(e.target.value)} style={{ ...inputStyle, width: 140, fontSize: 22, textAlign: "center" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 22 }}>€</span>
            <button onClick={() => { const v = Number(tempCost); if (v > 0) { setTotalCost(v); saveData("bonheur-totalCost", v); } setEditingCost(false); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: "#FFD166", color: "#0F141E", fontWeight: 700, fontFamily: F }}>✓</button>
            <button onClick={() => setEditingCost(false)} style={{ padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.4)", fontFamily: F }}>✕</button>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: PF, fontSize: 64, fontWeight: 900, color: "#FFD166", lineHeight: 1 }}>{totalCost.toLocaleString("fr-FR")} €</div>
            <div style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6, marginBottom: 14 }}>Coût total du gîte · {families.length} famille{families.length > 1 ? "s" : ""}</div>
            <button onClick={() => { setTempCost(String(totalCost)); setEditingCost(true); }} style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", fontFamily: F, fontSize: 12 }}>✏️ Modifier le montant</button>
          </div>
        )}
      </div>

      {families.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontFamily: F }}>Aucune famille enregistrée. Ajoute des familles dans l'onglet Profils.</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
            {shares.map(f => (
              <div key={f.id} style={{ padding: 24, borderRadius: 20, background: `${f.color}10`, border: `1px solid ${f.color}35` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 36 }}>{f.emoji}</span>
                  <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: f.color, margin: 0 }}>{f.name}</h3>
                </div>
                <div style={{ fontFamily: PF, fontSize: 42, fontWeight: 900, color: "white", lineHeight: 1, marginBottom: 6 }}>
                  {f.share.toLocaleString("fr-FR")} €
                </div>
                <div style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  {f.nights} nuit{f.nights > 1 ? "s" : ""} · {families.length > 0 ? Math.round(f.share / totalCost * 100) : 0}% du total
                </div>
                <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.25)", padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)" }}>
                  📅 {fmtDate(f.checkIn || "2026-07-11")} → {fmtDate(f.checkOut || "2026-07-25")}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(255,200,60,0.06)", border: "1px solid rgba(255,200,60,0.15)", fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            💡 La part de chaque famille est <strong style={{ color: "#FFD166" }}>proportionnelle à son nombre de nuits</strong>. Si une famille arrive ou repart plus tôt, sa part s'ajuste automatiquement.
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [families, setFamilies] = useState(DEFAULT_FAMILIES);
  const [roomAssignments, setRoomAssignments] = useState(DEFAULT_ROOM_ASSIGNMENTS);
  const [totalCost, setTotalCost] = useState(4560);
  const [rsvps, setRsvps] = useState({});
  const [proposals, setProposals] = useState([]);
  const [meals, setMeals] = useState({});
  const [shoppingItems, setShoppingItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const f = await loadData("bonheur-families", null);
      if (f) setFamilies(f.map(fam => ({ checkIn: "2026-07-11", checkOut: "2026-07-25", ...fam })));
      const ra = await loadData("bonheur-roomAssignments", null);
      if (ra) setRoomAssignments(ra); else setRoomAssignments(DEFAULT_ROOM_ASSIGNMENTS);
      const tc = await loadData("bonheur-totalCost", 4560); setTotalCost(tc);
      setRsvps(await loadData("bonheur-rsvps", {}));
      setProposals(await loadData("bonheur-proposals", []));
      setMeals(await loadData("bonheur-meals", {}));
      setShoppingItems(await loadData("bonheur-shopping", []));
      setExpenses(await loadData("bonheur-expenses", []));
      const u = await loadData("bonheur-currentUser", null); if (u) setCurrentUser(u);
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #0A1628 0%, #162544 40%, #1B3A5C 70%, #2D6A4F 100%)", backgroundAttachment: "fixed", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 64, marginBottom: 16 }}>🏡</div><div style={{ fontFamily: PF, fontSize: 24, color: "#FFD166" }}>Chargement...</div></div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #0A1628 0%, #162544 40%, #1B3A5C 70%, #2D6A4F 100%)", backgroundAttachment: "fixed", color: "white" }}>
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
          <Hero families={families} />
          <div style={{ padding: "40px 20px", maxWidth: 920, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {[{ icon: "🏡", stat: "19", label: "Places max" }, { icon: "🛏️", stat: "6", label: "Chambres" }, { icon: "🏊", stat: "12×6m", label: "Piscine" }, { icon: "🌳", stat: "∞", label: "Nature" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "24px 16px", borderRadius: 20, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}>
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
      {active === "rooms" && <RoomsSection families={families} setFamilies={setFamilies} roomAssignments={roomAssignments} setRoomAssignments={setRoomAssignments} />}
      {active === "budget" && <BudgetSection families={families} totalCost={totalCost} setTotalCost={setTotalCost} roomAssignments={roomAssignments} />}
      {active === "planning" && <PlanningSection families={families} rsvps={rsvps} setRsvps={setRsvps} proposals={proposals} setProposals={setProposals} currentUser={currentUser} />}
      {active === "cooking" && <CookingSection families={families} roomAssignments={roomAssignments} meals={meals} setMeals={setMeals} />}
      {active === "activities" && <ActivitiesSection />}
      {active === "courses" && <ShoppingSection meals={meals} shoppingItems={shoppingItems} setShoppingItems={setShoppingItems} currentUser={currentUser} families={families} />}
      {active === "expenses" && <ExpensesSection families={families} roomAssignments={roomAssignments} expenses={expenses} setExpenses={setExpenses} currentUser={currentUser} />}
      {active === "profiles" && <ProfilesSection families={families} setFamilies={setFamilies} currentUser={currentUser} setCurrentUser={setCurrentUser} roomAssignments={roomAssignments} />}
      {active === "rules" && <RulesSection />}
      <footer style={{ padding: "40px 20px", textAlign: "center", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontFamily: PF, fontSize: 24, color: "#FFD166", margin: "0 0 8px" }}>🏡 La Maison du Bonheur 2026</p>
        <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Gîte de Nougerède &bull; Salles-Lavalette &bull; Charente</p>
        <p style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 16 }}>Fait avec amour pour les meilleurs potes du monde ❤️</p>
      </footer>
    </div>
  );
}
