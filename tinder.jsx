import { useState, useRef, useEffect } from "react";

const TINDER_GRADIENT = "linear-gradient(135deg, #fd267a 0%, #ff6036 100%)";

const defaultProfile = {
  name: "André",
  age: 28,
  bio: "Apaixonado por tecnologia, teatro e boas conversas. Prefiro nos encontrar pessoalmente a ficar mandando mensagem no app 😏",
  distance: "1 km de distância",
  job: "Engenheiro de Software",
  school: "UFSCar",
  photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  extraPhotos: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  ]
};

// ---- Icons ----
const IconTinder = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
    <path d="M8.21 10.08c-.76 3.56 1.6 6.8 5.13 7.49a6.54 6.54 0 0 0 7.67-4.99 6.52 6.52 0 0 0-3.19-7.11c.09 1.27-.28 2.52-1.03 3.54a4.14 4.14 0 0 0-1.63-3.95 5.3 5.3 0 0 1-1.6 3.94 3.98 3.98 0 0 0-1.04-3.27c-.52 1.45-.52 2.95-.04 4.15a3.6 3.6 0 0 1-4.27.2z"/>
  </svg>
);

const IconHeart = ({ size = 28, color = "#fd267a" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

const IconX = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#f5af19">
    <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
  </svg>
);

const IconStar = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#62b4f9">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconBolt = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#a855f7">
    <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z"/>
  </svg>
);

const IconMessage = ({ active }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#fd267a" : "#bbb"}>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const IconProfile = ({ active }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#fd267a" : "#bbb"}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

const IconDiscover = ({ active }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "#fd267a" : "#bbb"}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4l6-6-6-6v12z"/>
  </svg>
);

function ConfigScreen({ profile, setProfile, onDone }) {
  const [form, setForm] = useState({ ...profile });
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ width: "100%", background: TINDER_GRADIENT, padding: "20px 0 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 2px 12px rgba(253,38,122,.3)" }}>
        <IconTinder />
        <span style={{ color: "white", fontFamily: "'Gill Sans', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>TINDER</span>
      </div>

      <div style={{ width: "100%", maxWidth: 420, padding: "28px 20px 0" }}>
        <h2 style={{ fontFamily: "'Gill Sans', sans-serif", color: "#333", marginBottom: 6, fontSize: 22 }}>⚙️ Configurar Perfil</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Configure como sua brincadeira vai aparecer.</p>

        {/* Photo */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Foto de Perfil</label>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div onClick={() => fileRef.current.click()} style={{ width: 90, height: 90, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "2px dashed #fd267a", position: "relative", flexShrink: 0 }}>
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#fd267a", fontSize: 28 }}>+</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Clique na foto para selecionar da galeria</p>
              <button onClick={() => fileRef.current.click()} style={btnSecondary}>📂 Escolher arquivo</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

          <div style={{ marginTop: 10 }}>
            <label style={{ ...labelStyle, marginBottom: 4 }}>Ou cole uma URL de imagem:</label>
            <input style={inputStyle} placeholder="https://..." value={form.photoUrl.startsWith("data:") ? "" : form.photoUrl} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} />
          </div>
        </div>

        {/* Name + Age */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Idade</label>
            <input style={inputStyle} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Bio</label>
          <textarea style={{ ...inputStyle, height: 80, resize: "none" }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
        </div>

        {/* Job / School */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Profissão</label>
            <input style={inputStyle} value={form.job} onChange={e => setForm(f => ({ ...f, job: e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Escola</label>
            <input style={inputStyle} value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
          </div>
        </div>

        {/* Distance */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Distância exibida</label>
          <input style={inputStyle} value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} />
        </div>

        <button onClick={() => { setProfile(form); onDone(); }} style={{ width: "100%", padding: "16px", borderRadius: 50, background: TINDER_GRADIENT, border: "none", color: "white", fontFamily: "'Gill Sans', sans-serif", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(253,38,122,.4)", letterSpacing: 1 }}>
          🚀 Iniciar Brincadeira
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, color: "#333", background: "white", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const btnSecondary = { padding: "8px 14px", borderRadius: 8, border: "1.5px solid #fd267a", background: "white", color: "#fd267a", fontWeight: 600, fontSize: 13, cursor: "pointer" };

// ---- Swipe Card ----
function SwipeCard({ profile, onSwipeLeft, onSwipeRight }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [photoIdx, setPhotoIdx] = useState(0);
  const startRef = useRef(null);
  const cardRef = useRef();
  const photos = [profile.photoUrl, ...profile.extraPhotos].filter(Boolean);
  const [expanded, setExpanded] = useState(false);

  const getPos = (e) => {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const onStart = (e) => {
    startRef.current = getPos(e);
    setDrag(d => ({ ...d, dragging: true }));
  };

  const onMove = (e) => {
    if (!drag.dragging || !startRef.current) return;
    const pos = getPos(e);
    setDrag(d => ({ ...d, x: pos.x - startRef.current.x, y: pos.y - startRef.current.y }));
  };

  const onEnd = () => {
    if (!drag.dragging) return;
    const threshold = 100;
    if (drag.x > threshold) onSwipeRight();
    else if (drag.x < -threshold) onSwipeLeft();
    setDrag({ x: 0, y: 0, dragging: false });
    startRef.current = null;
  };

  const rotation = drag.x * 0.08;
  const likeOpacity = Math.min(drag.x / 80, 1);
  const nopeOpacity = Math.min(-drag.x / 80, 1);

  const transition = drag.dragging ? "none" : "transform .3s ease";

  return (
    <div style={{ width: "100%", maxWidth: 380, margin: "0 auto", position: "relative", userSelect: "none" }}>
      <div
        ref={cardRef}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{
          width: "100%",
          height: 520,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,.18)",
          cursor: drag.dragging ? "grabbing" : "grab",
          transform: `translateX(${drag.x}px) translateY(${drag.y * 0.3}px) rotate(${rotation}deg)`,
          transition,
          background: "#222",
        }}
      >
        {/* Photo */}
        <img src={photos[photoIdx]} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} draggable={false} />

        {/* Photo tap zones */}
        <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 2 }}>
          <div style={{ flex: 1 }} onClick={() => setPhotoIdx(i => Math.max(0, i - 1))} />
          <div style={{ flex: 1 }} onClick={() => setPhotoIdx(i => Math.min(photos.length - 1, i + 1))} />
        </div>

        {/* Photo dots */}
        {photos.length > 1 && (
          <div style={{ position: "absolute", top: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 3 }}>
            {photos.map((_, i) => (
              <div key={i} style={{ height: 3, borderRadius: 3, background: i === photoIdx ? "white" : "rgba(255,255,255,.45)", flex: 1, maxWidth: 60, transition: "background .2s" }} />
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 260, background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 100%)", zIndex: 3 }} />

        {/* LIKE stamp */}
        <div style={{ position: "absolute", top: 60, left: 20, zIndex: 10, opacity: likeOpacity, transform: `rotate(-15deg)`, border: "4px solid #4cd964", borderRadius: 8, padding: "4px 14px", color: "#4cd964", fontWeight: 900, fontSize: 36, fontFamily: "'Gill Sans', sans-serif", letterSpacing: 3, pointerEvents: "none" }}>
          LIKE
        </div>
        {/* NOPE stamp */}
        <div style={{ position: "absolute", top: 60, right: 20, zIndex: 10, opacity: nopeOpacity, transform: `rotate(15deg)`, border: "4px solid #fd267a", borderRadius: 8, padding: "4px 14px", color: "#fd267a", fontWeight: 900, fontSize: 36, fontFamily: "'Gill Sans', sans-serif", letterSpacing: 3, pointerEvents: "none" }}>
          NOPE
        </div>

        {/* Info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px", zIndex: 4 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "white", fontFamily: "'Gill Sans', sans-serif", fontSize: 26, fontWeight: 700 }}>
                {profile.name}, <span style={{ fontWeight: 300 }}>{profile.age}</span>
              </div>
              {profile.job && <div style={{ color: "rgba(255,255,255,.85)", fontSize: 14, marginTop: 2 }}>💼 {profile.job}</div>}
              {profile.school && <div style={{ color: "rgba(255,255,255,.75)", fontSize: 13, marginTop: 1 }}>🎓 {profile.school}</div>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setExpanded(x => !x); }} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 18, backdropFilter: "blur(4px)" }}>
              ℹ️
            </button>
          </div>

          {expanded && (
            <div style={{ marginTop: 12, background: "rgba(0,0,0,.55)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ color: "white", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{profile.bio}</p>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>📍 {profile.distance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Match Screen ----
function MatchScreen({ profile, onReset }) {
  return (
    <div style={{ minHeight: "100vh", background: "#1a0015", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Confetti-like circles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 12 + 6,
          height: Math.random() * 12 + 6,
          borderRadius: "50%",
          background: ["#fd267a", "#ff6036", "#4cd964", "#62b4f9", "#f5af19"][i % 5],
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.7,
          animation: `float ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
        }} />
      ))}

      <style>{`
        @keyframes float { from { transform: translateY(0px) rotate(0deg); } to { transform: translateY(-20px) rotate(180deg); } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ animation: "pulse 1.5s ease-in-out infinite", marginBottom: 8 }}>
        <svg viewBox="0 0 80 80" width="70" height="70">
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fd267a"/>
              <stop offset="100%" stopColor="#ff6036"/>
            </linearGradient>
          </defs>
          <path fill="url(#hg)" d="M40 68C20 52 8 40 8 28a18 18 0 0 1 32-11 18 18 0 0 1 32 11c0 12-12 24-32 40z"/>
        </svg>
      </div>

      <div style={{ background: TINDER_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Gill Sans', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: 3, marginBottom: 6, animation: "fadeIn .6s ease" }}>
        IT'S A MATCH!
      </div>

      <p style={{ color: "rgba(255,255,255,.7)", fontSize: 16, marginBottom: 32, animation: "fadeIn .8s ease" }}>
        Você e <strong style={{ color: "white" }}>{profile.name}</strong> curtiram um ao outro!
      </p>

      {/* Avatars */}
      <div style={{ display: "flex", gap: -20, marginBottom: 36, animation: "fadeIn 1s ease" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "3px solid #fd267a", boxShadow: "0 0 20px rgba(253,38,122,.5)" }}>
          <img src={profile.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="you" />
        </div>
        <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "3px solid #fd267a", marginLeft: -20, display: "flex", alignItems: "center", justifyContent: "center", background: "#333", boxShadow: "0 0 20px rgba(253,38,122,.5)" }}>
          <span style={{ fontSize: 40 }}>😍</span>
        </div>
      </div>

      <button onClick={onReset} style={{ padding: "14px 40px", borderRadius: 50, background: TINDER_GRADIENT, border: "none", color: "white", fontFamily: "'Gill Sans', sans-serif", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(253,38,122,.5)", marginBottom: 14, letterSpacing: 1, width: "100%", maxWidth: 300 }}>
        💬 Enviar mensagem
      </button>
      <button onClick={onReset} style={{ padding: "14px 40px", borderRadius: 50, background: "transparent", border: "2px solid rgba(255,255,255,.3)", color: "rgba(255,255,255,.7)", fontFamily: "'Gill Sans', sans-serif", fontSize: 15, cursor: "pointer", width: "100%", maxWidth: 300 }}>
        Continuar curtindo
      </button>
    </div>
  );
}

// ---- Try Again Screen ----
function TryAgainScreen({ profile, onReset }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
      <style>{`@keyframes shake { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-10deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} }`}</style>

      <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", marginBottom: 24, animation: "shake .5s ease", boxShadow: "0 4px 20px rgba(0,0,0,.15)" }}>
        <img src={profile.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" />
      </div>

      <div style={{ fontSize: 52, marginBottom: 8 }}>💔</div>

      <h2 style={{ fontFamily: "'Gill Sans', sans-serif", fontSize: 28, color: "#333", marginBottom: 8 }}>Que pena!</h2>
      <p style={{ color: "#888", fontSize: 16, marginBottom: 32, maxWidth: 280 }}>
        Talvez seja uma boa hora para tentar de novo? <strong style={{ color: "#fd267a" }}>{profile.name}</strong> ainda está por aqui...
      </p>

      <button onClick={onReset} style={{ padding: "14px 40px", borderRadius: 50, background: TINDER_GRADIENT, border: "none", color: "white", fontFamily: "'Gill Sans', sans-serif", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(253,38,122,.4)", letterSpacing: 1, width: "100%", maxWidth: 300 }}>
        🔄 Tentar de novo
      </button>
    </div>
  );
}

// ---- Bottom Nav ----
function BottomNav({ active }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 12px", zIndex: 100, boxShadow: "0 -2px 12px rgba(0,0,0,.06)" }}>
      {[
        { icon: <IconMessage active={false} />, label: "Mensagens" },
        { icon: <svg viewBox="0 0 24 24" width="26" height="26" fill={active === "home" ? "#fd267a" : "#bbb"}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: "Início" },
        { icon: <IconProfile active={false} />, label: "Perfil" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
          {item.icon}
          <span style={{ fontSize: 10, color: i === 1 ? "#fd267a" : "#bbb" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Main App ----
export default function App() {
  const [screen, setScreen] = useState("config"); // config | cards | match | tryagain
  const [profile, setProfile] = useState(defaultProfile);

  if (screen === "config") {
    return <ConfigScreen profile={profile} setProfile={setProfile} onDone={() => setScreen("cards")} />;
  }

  if (screen === "match") {
    return <MatchScreen profile={profile} onReset={() => setScreen("cards")} />;
  }

  if (screen === "tryagain") {
    return <TryAgainScreen profile={profile} onReset={() => setScreen("cards")} />;
  }

  // Cards screen
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 8px rgba(0,0,0,.05)" }}>
        <button onClick={() => setScreen("config")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#bbb" }}>⚙️</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: TINDER_GRADIENT, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconTinder />
          </div>
          <span style={{ fontFamily: "'Gill Sans', sans-serif", fontWeight: 700, fontSize: 20, background: TINDER_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tinder</span>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#bbb" }}>🔔</button>
      </div>

      {/* Card area */}
      <div style={{ padding: "20px 16px 0" }}>
        {/* Background ghost card */}
        <div style={{ position: "relative", maxWidth: 380, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 520, background: "#e8e8e8", borderRadius: 16 }} />
          <div style={{ position: "absolute", top: 4, left: 4, right: 4, height: 520, background: "#f0f0f0", borderRadius: 16 }} />
          <div style={{ position: "relative" }}>
            <SwipeCard profile={profile} onSwipeLeft={() => setScreen("tryagain")} onSwipeRight={() => setScreen("match")} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 24, paddingBottom: 20 }}>
          <button onClick={() => setScreen("tryagain")} style={{ width: 58, height: 58, borderRadius: "50%", background: "white", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconX size={26} />
          </button>
          <button onClick={() => setScreen("match")} style={{ width: 50, height: 50, borderRadius: "50%", background: "white", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconStar size={20} />
          </button>
          <button onClick={() => setScreen("match")} style={{ width: 68, height: 68, borderRadius: "50%", background: TINDER_GRADIENT, border: "none", boxShadow: "0 4px 20px rgba(253,38,122,.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconHeart size={30} color="white" />
          </button>
          <button style={{ width: 50, height: 50, borderRadius: "50%", background: "white", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconBolt size={20} />
          </button>
          <button style={{ width: 58, height: 58, borderRadius: "50%", background: "white", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#62b4f9"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
          </button>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
