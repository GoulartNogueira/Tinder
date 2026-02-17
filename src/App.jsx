import { useState, useRef, useEffect, useCallback } from "react";

const GRADIENT = "linear-gradient(135deg, #fd267a 0%, #ff6036 100%)";
const GRADIENT_REV = "linear-gradient(135deg, #ff6036 0%, #fd267a 100%)";

const PROFILES_STORAGE_KEY = "tinder.profiles.v1";

/* ─── Default profiles ────────────────────────────────────────── */
const defaultProfiles = [{
  name: "André",
  age: 34,
  bio: "Apaixonado por tecnologia, teatro e boas conversas. Prefiro nos encontrar pessoalmente 😏",
  distance: "1 km de distância",
  job: "Engenheiro de Software",
  school: "UFSCar",
  photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  mode: "kiss", // "original" | "kiss"
}];

function loadPersistedProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return defaultProfiles;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) return defaultProfiles;
    return parsed;
  } catch {
    return defaultProfiles;
  }
}

/* ─── Tiny icons ─────────────────────────────────────────────── */
const TinderLogo = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
    <path d="M8.21 10.08c-.76 3.56 1.6 6.8 5.13 7.49a6.54 6.54 0 0 0 7.67-4.99 6.52 6.52 0 0 0-3.19-7.11c.09 1.27-.28 2.52-1.03 3.54a4.14 4.14 0 0 0-1.63-3.95 5.3 5.3 0 0 1-1.6 3.94 3.98 3.98 0 0 0-1.04-3.27c-.52 1.45-.52 2.95-.04 4.15a3.6 3.6 0 0 1-4.27.2z"/>
  </svg>
);

const IconX   = () => <svg viewBox="0 0 24 24" width="26" height="26" fill="#f5af19"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>;
const IconHeart = ({ size=28, color="#fd267a" }) => <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>;
const IconStar = ({ size=22 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="#62b4f9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconBolt = ({ size=22 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="#a855f7"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z"/></svg>;

/* ─── Shared styles ──────────────────────────────────────────── */
const S = {
  label: { display:"block", fontSize:12, fontWeight:600, color:"#555", marginBottom:6, textTransform:"uppercase", letterSpacing:.5 },
  input: { width:"100%", padding:"12px 14px", borderRadius:10, border:"1.5px solid #e0e0e0", fontSize:15, color:"#333", background:"white", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btnPrimary: { width:"100%", padding:"16px", borderRadius:50, background:GRADIENT, border:"none", color:"white", fontFamily:"inherit", fontSize:17, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(253,38,122,.4)", letterSpacing:1 },
  btnOutline: { padding:"14px 40px", borderRadius:50, background:"transparent", border:"2px solid rgba(255,255,255,.35)", color:"rgba(255,255,255,.8)", fontFamily:"inherit", fontSize:15, cursor:"pointer", width:"100%", maxWidth:300 },
  card: { borderRadius:16, overflow:"hidden", position:"relative", boxShadow:"0 8px 32px rgba(0,0,0,.18)", background:"#222" },
};

/* ─── Camera hook ───────────────────────────────────────────── */
function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [permitted, setPermitted] = useState(null); // null | true | false

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPermitted(true);
    } catch {
      setPermitted(false);
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, permitted, start, stop };
}

/* ─── CONFIG SCREEN ──────────────────────────────────────────── */
function ConfigScreen({ profiles, setProfiles, onDone }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [form, setForm] = useState({ ...profiles[selectedIndex] });
  const fileRef = useRef();
  const { videoRef, permitted, start, stop } = useCamera();
  const [showCamPreview, setShowCamPreview] = useState(false);

  // Update form when selectedIndex changes
  useEffect(() => {
    setForm({ ...profiles[selectedIndex] });
  }, [selectedIndex, profiles]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleCamRequest = async () => {
    setShowCamPreview(true);
    await start();
  };

  const handleDone = () => {
    stop();
    const updatedProfiles = [...profiles];
    updatedProfiles[selectedIndex] = form;
    setProfiles(updatedProfiles);
    onDone();
  };

  const handleAddProfile = () => {
    const newProfile = {
      name: "Novo Perfil",
      age: 25,
      bio: "Adicione uma bio aqui...",
      distance: "2 km de distância",
      job: "Sua profissão",
      school: "Sua escola",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
      mode: "original",
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setSelectedIndex(updatedProfiles.length - 1);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f5f5f5", display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:40 }}>
      {/* Header */}
      <div style={{ width:"100%", background:GRADIENT, padding:"18px 0 14px", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 2px 12px rgba(253,38,122,.3)" }}>
        <TinderLogo />
        <span style={{ color:"white", fontSize:22, fontWeight:700, letterSpacing:1 }}>TINDER</span>
      </div>

      <div style={{ width:"100%", maxWidth:420, padding:"28px 20px 0" }}>
        <h2 style={{ color:"#333", marginBottom:6, fontSize:22, fontWeight:700 }}>⚙️ Configurar Perfil</h2>
        <p style={{ color:"#888", fontSize:14, marginBottom:24 }}>Personalize como sua brincadeira vai aparecer.</p>

        {/* ── Profile selector ── */}
        <div style={{ marginBottom:24, background:"white", borderRadius:14, padding:"16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          <label style={S.label}>Perfis</label>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:12 }}>
            {profiles.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  cursor:"pointer",
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:6,
                  padding:8,
                  borderRadius:10,
                  border:`2px solid ${idx === selectedIndex ? "#fd267a" : "#e0e0e0"}`,
                  background: idx === selectedIndex ? "#fff0f5" : "white",
                  transition:"all .2s",
                  flex:"0 0 auto"
                }}
              >
                <div style={{ width:48, height:48, borderRadius:"50%", overflow:"hidden", border:"2px solid #fd267a" }}>
                  <img src={p.photoUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <span style={{ fontSize:11, fontWeight:600, color: idx === selectedIndex ? "#fd267a" : "#888" }}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
          <button onClick={handleAddProfile} style={{ width:"100%", padding:"10px", borderRadius:10, border:"2px dashed #fd267a", background:"white", color:"#fd267a", fontWeight:600, fontSize:14, cursor:"pointer", transition:"all .2s" }}>
            ➕ Adicionar Perfil
          </button>
        </div>

        {/* ── Mode selector ── */}
        <div style={{ marginBottom:24, background:"white", borderRadius:14, padding:"16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          <label style={S.label}>Modo da brincadeira</label>
          <div style={{ display:"flex", gap:10 }}>
            {[["original","🎉 Match clássico"],["kiss","💋 Pedir beijo"]].map(([val, label]) => (
              <button key={val} onClick={() => setForm(f=>({...f, mode:val}))} style={{ flex:1, padding:"12px 6px", borderRadius:10, border:`2px solid ${form.mode===val?"#fd267a":"#e0e0e0"}`, background:form.mode===val?"#fff0f5":"white", color:form.mode===val?"#fd267a":"#888", fontWeight:600, fontSize:14, cursor:"pointer", transition:"all .2s" }}>
                {label}
              </button>
            ))}
          </div>
          {form.mode === "kiss" && (
            <p style={{ fontSize:12, color:"#fd267a", marginTop:10, background:"#fff0f5", borderRadius:8, padding:"8px 12px" }}>
              💋 Ao dar match, a tela vai convidar diretamente para um beijo — com câmera frontal ao vivo!
            </p>
          )}
        </div>

        {/* ── Photo ── */}
        <div style={{ background:"white", borderRadius:14, padding:"16px 18px", marginBottom:18, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          <label style={S.label}>Foto de Perfil</label>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div onClick={() => fileRef.current.click()} style={{ width:86, height:86, borderRadius:12, overflow:"hidden", cursor:"pointer", border:"2px dashed #fd267a", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {form.photoUrl ? <img src={form.photoUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:26, color:"#fd267a" }}>+</span>}
            </div>
            <div style={{ flex:1 }}>
              <button onClick={() => fileRef.current.click()} style={{ display:"block", marginBottom:8, padding:"8px 14px", borderRadius:8, border:"1.5px solid #fd267a", background:"white", color:"#fd267a", fontWeight:600, fontSize:13, cursor:"pointer", width:"100%" }}>
                📂 Galeria
              </button>
              <button onClick={handleCamRequest} style={{ display:"block", padding:"8px 14px", borderRadius:8, border:"1.5px solid #62b4f9", background:"white", color:"#62b4f9", fontWeight:600, fontSize:13, cursor:"pointer", width:"100%" }}>
                📷 Selfie agora
              </button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile} />

          {/* Camera preview */}
          {showCamPreview && (
            <div style={{ marginTop:14 }}>
              {permitted === false ? (
                <p style={{ fontSize:13, color:"#e53935", background:"#ffeaea", borderRadius:8, padding:"10px 12px" }}>❌ Câmera bloqueada. Permita o acesso nas configurações do navegador.</p>
              ) : (
                <>
                  <div style={{ borderRadius:12, overflow:"hidden", background:"#000", position:"relative", height:160 }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
                  </div>
                  {permitted === true && (
                    <p style={{ fontSize:12, color:"#4caf50", marginTop:6 }}>✅ Câmera ativa — aparecerá na tela de match!</p>
                  )}
                </>
              )}
            </div>
          )}

          <div style={{ marginTop:12 }}>
            <label style={{ ...S.label, marginBottom:4 }}>Ou cole uma URL de imagem:</label>
            <input style={S.input} placeholder="https://..." value={form.photoUrl.startsWith("data:") ? "" : form.photoUrl} onChange={e => setForm(f=>({...f, photoUrl:e.target.value}))} />
          </div>
        </div>

        {/* ── Info fields ── */}
        <div style={{ background:"white", borderRadius:14, padding:"16px 18px", marginBottom:18, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ flex:2 }}>
              <label style={S.label}>Nome</label>
              <input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div style={{ flex:1 }}>
              <label style={S.label}>Idade</label>
              <input style={S.input} type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} />
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Bio</label>
            <textarea style={{ ...S.input, height:76, resize:"none" }} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} />
          </div>
          <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <label style={S.label}>Profissão</label>
              <input style={S.input} value={form.job} onChange={e=>setForm(f=>({...f,job:e.target.value}))} />
            </div>
            <div style={{ flex:1 }}>
              <label style={S.label}>Escola</label>
              <input style={S.input} value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))} />
            </div>
          </div>
          <div>
            <label style={S.label}>Distância exibida</label>
            <input style={S.input} value={form.distance} onChange={e=>setForm(f=>({...f,distance:e.target.value}))} />
          </div>
        </div>

        <button onClick={handleDone} style={S.btnPrimary}>
          🚀 Iniciar Brincadeira
        </button>
      </div>
    </div>
  );
}

/* ─── SWIPE CARD ─────────────────────────────────────────────── */
function SwipeCard({ profile, onLeft, onRight }) {
  const [drag, setDrag]     = useState({ x:0, y:0, active:false });
  const [photoIdx, setIdx]  = useState(0);
  const [expanded, setExp]  = useState(false);
  const startRef = useRef(null);

  const photos = [profile.photoUrl].filter(Boolean);

  const pos = e => e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY };
  const onStart = e => { startRef.current = pos(e); setDrag(d=>({...d, active:true})); };
  const onMove  = e => { if (!drag.active || !startRef.current) return; const p=pos(e); setDrag(d=>({...d, x:p.x-startRef.current.x, y:p.y-startRef.current.y})); };
  const onEnd   = () => {
    if (!drag.active) return;
    if (drag.x > 90) onRight();
    else if (drag.x < -90) onLeft();
    setDrag({ x:0, y:0, active:false });
    startRef.current = null;
  };

  const rot   = drag.x * 0.07;
  const likeO = Math.min(drag.x / 70, 1);
  const nopeO = Math.min(-drag.x / 70, 1);

  return (
    <div style={{ width:"100%", maxWidth:380, margin:"0 auto", userSelect:"none" }}>
      <div
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{ ...S.card, width:"100%", height:520, cursor:drag.active?"grabbing":"grab", transform:`translateX(${drag.x}px) translateY(${drag.y*.3}px) rotate(${rot}deg)`, transition:drag.active?"none":"transform .3s ease" }}
      >
        <img src={photos[photoIdx]} alt="profile" draggable={false} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0, pointerEvents:"none" }} />

        {/* tap zones */}
        <div style={{ position:"absolute", inset:0, display:"flex", zIndex:2 }}>
          <div style={{ flex:1 }} onClick={()=>setIdx(i=>Math.max(0,i-1))} />
          <div style={{ flex:1 }} onClick={()=>setIdx(i=>Math.min(photos.length-1,i+1))} />
        </div>

        {/* dots */}
        {photos.length > 1 && (
          <div style={{ position:"absolute", top:10, left:0, right:0, display:"flex", justifyContent:"center", gap:5, zIndex:3, padding:"0 12px" }}>
            {photos.map((_,i) => <div key={i} style={{ height:3, borderRadius:3, background:i===photoIdx?"white":"rgba(255,255,255,.4)", flex:1, maxWidth:60, transition:"background .2s" }} />)}
          </div>
        )}

        {/* LIKE stamp */}
        <div style={{ position:"absolute", top:58, left:18, zIndex:10, opacity:likeO, transform:"rotate(-14deg)", border:"4px solid #4cd964", borderRadius:8, padding:"4px 12px", color:"#4cd964", fontWeight:900, fontSize:36, letterSpacing:3, pointerEvents:"none" }}>LIKE</div>
        {/* NOPE stamp */}
        <div style={{ position:"absolute", top:58, right:18, zIndex:10, opacity:nopeO, transform:"rotate(14deg)", border:"4px solid #fd267a", borderRadius:8, padding:"4px 12px", color:"#fd267a", fontWeight:900, fontSize:36, letterSpacing:3, pointerEvents:"none" }}>NOPE</div>

        {/* gradient */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:260, background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 100%)", zIndex:3 }} />

        {/* info */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 18px", zIndex:4 }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div>
              <div style={{ color:"white", fontSize:26, fontWeight:700 }}>{profile.name}, <span style={{ fontWeight:300 }}>{profile.age}</span></div>
              {profile.job    && <div style={{ color:"rgba(255,255,255,.85)", fontSize:14, marginTop:2 }}>💼 {profile.job}</div>}
              {profile.school && <div style={{ color:"rgba(255,255,255,.75)", fontSize:13, marginTop:1 }}>🎓 {profile.school}</div>}
            </div>
            <button onClick={e=>{ e.stopPropagation(); setExp(x=>!x); }} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(4px)", fontSize:16 }}>ℹ️</button>
          </div>
          {expanded && (
            <div style={{ marginTop:12, background:"rgba(0,0,0,.55)", backdropFilter:"blur(8px)", borderRadius:12, padding:"12px 14px" }}>
              <p style={{ color:"white", fontSize:14, lineHeight:1.5, margin:0 }}>{profile.bio}</p>
              <p style={{ color:"rgba(255,255,255,.6)", fontSize:12, marginTop:8, marginBottom:0 }}>📍 {profile.distance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MATCH SCREEN (original) ────────────────────────────────── */
function MatchScreenOriginal({ profile, onReset }) {
  return (
    <div style={{ minHeight:"100vh", background:"#1a0015", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <style>{`@keyframes float{from{transform:translateY(0)rotate(0)}to{transform:translateY(-22px)rotate(180deg)}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}} @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {[...Array(22)].map((_,i)=>(
        <div key={i} style={{ position:"absolute", width:Math.random()*12+5, height:Math.random()*12+5, borderRadius:"50%", background:["#fd267a","#ff6036","#4cd964","#62b4f9","#f5af19"][i%5], top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity:.7, animation:`float ${2+Math.random()*3}s ease-in-out infinite alternate` }} />
      ))}

      <div style={{ animation:"pulse 1.5s ease-in-out infinite", marginBottom:8 }}>
        <svg viewBox="0 0 80 80" width="70" height="70">
          <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fd267a"/><stop offset="100%" stopColor="#ff6036"/></linearGradient></defs>
          <path fill="url(#hg)" d="M40 68C20 52 8 40 8 28a18 18 0 0 1 32-11 18 18 0 0 1 32 11c0 12-12 24-32 40z"/>
        </svg>
      </div>

      <div style={{ background:GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontSize:42, fontWeight:900, letterSpacing:3, marginBottom:6, animation:"fadeUp .6s ease" }}>IT'S A MATCH!</div>
      <p style={{ color:"rgba(255,255,255,.7)", fontSize:16, marginBottom:32, animation:"fadeUp .8s ease" }}>Você e <strong style={{ color:"white" }}>{profile.name}</strong> curtiram um ao outro!</p>

      <div style={{ display:"flex", marginBottom:36, animation:"fadeUp 1s ease" }}>
        <div style={{ width:100, height:100, borderRadius:"50%", overflow:"hidden", border:"3px solid #fd267a", boxShadow:"0 0 20px rgba(253,38,122,.5)" }}>
          <img src={profile.photoUrl} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
        </div>
        <div style={{ width:100, height:100, borderRadius:"50%", overflow:"hidden", border:"3px solid #fd267a", marginLeft:-20, display:"flex", alignItems:"center", justifyContent:"center", background:"#333", boxShadow:"0 0 20px rgba(253,38,122,.5)", fontSize:42 }}>😍</div>
      </div>

      <button onClick={onReset} style={{ ...S.btnPrimary, maxWidth:300, marginBottom:12 }}>💬 Enviar mensagem</button>
      <button onClick={onReset} style={S.btnOutline}>Continuar curtindo</button>
    </div>
  );
}

/* ─── MATCH SCREEN (kiss mode) ───────────────────────────────── */
function MatchScreenKiss({ profile, onReset }) {
  const { videoRef, permitted, start } = useCamera();

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0010", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.25)} 28%{transform:scale(1)} 42%{transform:scale(1.15)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      `}</style>

      {/* Ambient bokeh */}
      {[...Array(14)].map((_,i) => (
        <div key={i} style={{ position:"absolute", width:Math.random()*60+20, height:Math.random()*60+20, borderRadius:"50%", background:["rgba(253,38,122,.12)","rgba(255,96,54,.1)","rgba(255,180,200,.08)"][i%3], top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, filter:"blur(8px)" }} />
      ))}

      <div style={{ animation:"fadeUp .5s ease", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ animation:"heartbeat 1.2s ease infinite", marginBottom:2 }}>
          <svg viewBox="0 0 80 80" width="52" height="52">
            <defs><linearGradient id="kg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fd267a"/><stop offset="100%" stopColor="#ff6036"/></linearGradient></defs>
            <path fill="url(#kg)" d="M40 68C20 52 8 40 8 28a18 18 0 0 1 32-11 18 18 0 0 1 32 11c0 12-12 24-32 40z"/>
          </svg>
        </div>

        <div style={{ background:GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontSize:36, fontWeight:900, letterSpacing:2, marginBottom:6 }}>
          É UM MATCH!
        </div>
        <div style={{ fontSize:22, color:"white", fontWeight:700, marginBottom:6 }}>
          {profile.name} quer um beijo seu 💋
        </div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,.65)", marginBottom:26, maxWidth:320, lineHeight:1.5 }}>
          O que você acha?
        </div>

        {/* Overlay: profile photo + live selfie */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:30, height:140 }}>
          <div style={{ width:128, height:128, borderRadius:"50%", overflow:"hidden", border:"3px solid #fd267a", boxShadow:"0 0 24px rgba(253,38,122,.45)", background:"#222" }}>
            <img src={profile.photoUrl} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
          </div>

          <div style={{ width:128, height:128, borderRadius:"50%", overflow:"hidden", border:"3px solid #fd267a", boxShadow:"0 0 28px rgba(253,38,122,.6)", background:"#111", marginLeft:-22, position:"relative" }}>
            {permitted === false ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:34 }}>🙈</span>
                <span style={{ fontSize:11, color:"#888" }}>câmera bloqueada</span>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
            )}
          </div>

          
        </div>

        <button onClick={onReset} style={S.btnOutline}>
          Voltar
        </button>
      </div>
    </div>
  );
}

/* ─── TRY AGAIN SCREEN ───────────────────────────────────────── */
function TryAgainScreen({ profile, onReset }) {
  return (
    <div style={{ minHeight:"100vh", background:"#f5f5f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <style>{`@keyframes shake{0%,100%{transform:rotate(0)}20%{transform:rotate(-10deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-7deg)}80%{transform:rotate(7deg)}}`}</style>
      <div style={{ width:100, height:100, borderRadius:"50%", overflow:"hidden", marginBottom:24, animation:"shake .5s ease", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
        <img src={profile.photoUrl} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
      </div>
      <div style={{ fontSize:52, marginBottom:8 }}>💔</div>
      <h2 style={{ fontSize:28, color:"#333", marginBottom:8 }}>Que pena!</h2>
      <p style={{ color:"#888", fontSize:16, marginBottom:32, maxWidth:280 }}>
        Talvez seja uma boa hora para tentar de novo? <strong style={{ color:"#fd267a" }}>{profile.name}</strong> ainda está por aqui...
      </p>
      <button onClick={onReset} style={{ ...S.btnPrimary, maxWidth:300, background:GRADIENT }}>🔄 Tentar de novo</button>
    </div>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────────── */
function BottomNav() {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderTop:"1px solid #f0f0f0", display:"flex", justifyContent:"space-around", alignItems:"center", padding:"10px 0 12px", zIndex:100, boxShadow:"0 -2px 12px rgba(0,0,0,.06)" }}>
      {[
        { icon:<svg viewBox="0 0 24 24" width="26" height="26" fill="#bbb"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>, label:"Mensagens" },
        { icon:<svg viewBox="0 0 24 24" width="26" height="26" fill="#fd267a"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label:"Início", active:true },
        { icon:<svg viewBox="0 0 24 24" width="26" height="26" fill="#bbb"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>, label:"Perfil" },
      ].map((item,i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer" }}>
          {item.icon}
          <span style={{ fontSize:10, color:item.active?"#fd267a":"#bbb" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen]   = useState("config");
  const [profiles, setProfiles] = useState(() => loadPersistedProfiles());
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const currentProfile = profiles[currentProfileIndex];

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch {
      // ignore (e.g. storage full / blocked)
    }
  }, [profiles]);

  const reset = () => setScreen("cards");

  const handleSwipeLeft = () => {
    setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
  };

  if (screen === "config")    return <ConfigScreen profiles={profiles} setProfiles={setProfiles} onDone={()=>setScreen("cards")} />;
  if (screen === "tryagain")  return <TryAgainScreen profile={currentProfile} onReset={reset} />;
  if (screen === "match") {
    return currentProfile.mode === "kiss"
      ? <MatchScreenKiss    profile={currentProfile} onReset={reset} />
      : <MatchScreenOriginal profile={currentProfile} onReset={reset} />;
  }

  /* ── Cards screen ── */
  return (
    <div style={{ minHeight:"100vh", background:"#f7f7f7", paddingBottom:80 }}>
      <div style={{ background:"white", borderBottom:"1px solid #f0f0f0", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
        <button onClick={()=>setScreen("config")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>⚙️</button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ background:GRADIENT, borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center" }}><TinderLogo /></div>
          <span style={{ fontWeight:700, fontSize:20, background:GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>tinder</span>
        </div>
        <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>🔔</button>
      </div>

      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ position:"relative", maxWidth:380, margin:"0 auto" }}>
          <div style={{ position:"absolute", top:8, left:8, right:8, height:520, background:"#e8e8e8", borderRadius:16 }} />
          <div style={{ position:"absolute", top:4, left:4, right:4, height:520, background:"#f0f0f0", borderRadius:16 }} />
          <div style={{ position:"relative" }}>
            <SwipeCard profile={currentProfile} onLeft={handleSwipeLeft} onRight={()=>setScreen("match")} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:18, marginTop:16, paddingBottom:20 }}>
          <button onClick={handleSwipeLeft} style={{ width:58, height:58, borderRadius:"50%", background:"white", border:"none", boxShadow:"0 2px 16px rgba(0,0,0,.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><IconX /></button>
          <button onClick={()=>setScreen("match")}    style={{ width:50, height:50, borderRadius:"50%", background:"white", border:"none", boxShadow:"0 2px 16px rgba(0,0,0,.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><IconStar size={20} /></button>
          <button onClick={()=>setScreen("match")}    style={{ width:68, height:68, borderRadius:"50%", background:GRADIENT, border:"none", boxShadow:"0 4px 20px rgba(253,38,122,.4)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><IconHeart size={30} color="white" /></button>
          <button style={{ width:50, height:50, borderRadius:"50%", background:"white", border:"none", boxShadow:"0 2px 16px rgba(0,0,0,.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><IconBolt size={20} /></button>
          <button style={{ width:58, height:58, borderRadius:"50%", background:"white", border:"none", boxShadow:"0 2px 16px rgba(0,0,0,.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#62b4f9"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
