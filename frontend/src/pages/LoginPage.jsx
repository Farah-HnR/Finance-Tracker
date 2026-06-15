import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NetworkBackground from "../components/ui/NetworkBackground";

/* ─── Animations & neon CSS ───────────────────────────────────────────────── */
const CSS = `
  @keyframes floatA { 0%,100%{transform:translateY(0px)}    50%{transform:translateY(-13px)} }
  @keyframes floatB { 0%,100%{transform:translateY(-7px)}   50%{transform:translateY(9px)}  }
  @keyframes floatC { 0%,100%{transform:translateY(-11px)}  50%{transform:translateY(6px)}  }
  @keyframes floatD { 0%,100%{transform:translateY(5px)}    50%{transform:translateY(-14px)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInL { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeInR { from{opacity:0;transform:translateX(22px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideD  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes logoBg  { 0%,100%{opacity:.18;transform:scale(1)} 50%{opacity:.48;transform:scale(1.22)} }
  @keyframes btnGlow { 0%,100%{box-shadow:0 0 28px rgba(139,92,246,.55),0 0 60px rgba(99,102,241,.2)} 50%{box-shadow:0 0 40px rgba(139,92,246,.8),0 0 80px rgba(99,102,241,.35)} }
  @keyframes shimmer { 0%{background-position:-220% center} 100%{background-position:220% center} }
  @keyframes eyePop  { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes dot     { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
  @keyframes numB    { 0%,100%{opacity:1} 50%{opacity:.65} }
  @keyframes streakP { 0%,100%{opacity:.5;transform:translateY(0)}   50%{opacity:1;transform:translateY(-16px)} }
  @keyframes streakN { 0%,100%{opacity:.4;transform:translateY(-8px)} 50%{opacity:.9;transform:translateY(12px)} }
  @keyframes glowPL  { 0%,100%{opacity:.6;transform:scale(1)}  50%{opacity:1;transform:scale(1.06)} }
  @keyframes glowPR  { 0%,100%{opacity:.5;transform:scale(.95)} 50%{opacity:.95;transform:scale(1.04)} }
  @keyframes scanL   { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
  @keyframes scanR   { 0%{transform:translateY(400%)}  100%{transform:translateY(-100%)} }
  @keyframes cardBdr { 0%,100%{opacity:.7} 50%{opacity:1} }
  @keyframes checkAni{ from{stroke-dashoffset:20;opacity:0} to{stroke-dashoffset:0;opacity:1} }
  @keyframes badgeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake      { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(8px)} 45%{transform:translateX(-5px)} 60%{transform:translateX(5px)} 75%{transform:translateX(-2px)} }
  @keyframes homeFlow   { 0%,100%{background-position:0% 50%}  50%{background-position:100% 50%} }
  @keyframes homeText   { 0%,100%{background-position:0% 50%}  50%{background-position:100% 50%} }
  @keyframes homePulse  { 0%,100%{box-shadow:0 0 24px rgba(139,92,246,.55),0 0 48px rgba(99,102,241,.22),0 4px 20px rgba(0,0,18,.65)} 50%{box-shadow:0 0 44px rgba(139,92,246,.9),0 0 80px rgba(99,102,241,.4),0 4px 24px rgba(0,0,18,.7)} }

  /* Neon card glass */
  .nfc {
    background: rgba(5,10,32,.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 14px;
    padding: 10px 13px;
    min-width: 160px;
    position: relative;
  }

  /* Input */
  .fin-input {
    width:100%; border-radius:.75rem; border:1px solid rgba(99,102,241,.28);
    background:rgba(4,8,28,.8); padding:.72rem 1rem;
    color:#fff; font-size:.875rem; outline:none;
    transition: border-color .22s, box-shadow .22s, background .22s;
  }
  .fin-input::placeholder { color:rgba(148,163,184,.5); }
  .fin-input:focus {
    border-color:rgba(139,92,246,.65);
    box-shadow:0 0 0 3px rgba(99,102,241,.15), 0 0 20px rgba(99,102,241,.1);
    background:rgba(4,8,28,.95);
  }
  .fin-input.valid { border-color:rgba(16,185,129,.55); }
  .fin-input.valid:focus { box-shadow:0 0 0 3px rgba(16,185,129,.12), 0 0 16px rgba(16,185,129,.08); }
  .fin-input.err   { border-color:rgba(239,68,68,.52); }
  .fin-input.err:focus { box-shadow:0 0 0 3px rgba(239,68,68,.12); }
  .pl-ic { padding-left:2.6rem; } .pr-ic { padding-right:2.6rem; }

  /* Neon button */
  .nbtn {
    background: linear-gradient(110deg, #4c1d95 0%, #6d28d9 28%, #8b5cf6 48%, #a78bfa 55%, #8b5cf6 68%, #6d28d9 85%, #4c1d95 100%);
    background-size: 230% auto;
    border: 1px solid rgba(167,139,250,.4);
    transition: background-position .5s, transform .15s;
    animation: btnGlow 3s ease-in-out infinite;
  }
  .nbtn:hover:not(:disabled) {
    background-position: right center;
    animation: shimmer 1.8s linear infinite, btnGlow 3s ease-in-out infinite;
    border-color: rgba(167,139,250,.7);
    transform: translateY(-1px);
  }
  .nbtn:active:not(:disabled) { transform: scale(.97); }
`;

/* ─── helper ─────────────────────────────────────────────────────────────── */
const hx = (hex,a) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a.toFixed(3)})`; };

/* ─── Canvas Logo ─────────────────────────────────────────────────────────── */
function Logo() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), DPR = Math.min(window.devicePixelRatio||1,2), S = 82;
    c.width=S*DPR; c.height=S*DPR; c.style.width=`${S}px`; c.style.height=`${S}px`;
    ctx.scale(DPR,DPR); const cx=S/2, cy=S/2;
    const COLS = ["#818cf8","#22d3ee","#a78bfa","#60a5fa"];
    const pts = Array.from({length:8},(_,i)=>({a:(i/8)*Math.PI*2,spd:i%2===0?.014:-.011,r:i%2===0?30:34,sz:2.1,col:COLS[i%4]}));
    let fr=0, raf;
    const loop = () => {
      fr++; ctx.clearRect(0,0,S,S);
      [[33,.005,"rgba(129,140,248,.4)",1,[5,11]],[25,-.011,"rgba(167,139,250,.45)",1,[3,7]],[17,.02,"rgba(34,211,238,.28)",.8,[2,5]]].forEach(([r,spd,st,lw,dash]) => {
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(fr*spd);
        ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
        ctx.strokeStyle=st; ctx.lineWidth=lw; ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      });
      pts.forEach(p => {
        p.a+=p.spd; const px=cx+Math.cos(p.a)*p.r, py=cy+Math.sin(p.a)*p.r, fade=.38+Math.sin(fr*.06+p.a)*.42;
        const pg=ctx.createRadialGradient(px,py,0,px,py,6); pg.addColorStop(0,hx(p.col,.62*fade)); pg.addColorStop(1,hx(p.col,0));
        ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,p.sz,0,Math.PI*2); ctx.fillStyle=hx(p.col,.88*fade); ctx.fill();
      });
      const cg=ctx.createRadialGradient(cx-3,cy-4,0,cx,cy,17); cg.addColorStop(0,"#818cf8"); cg.addColorStop(1,"#5b21b6");
      ctx.beginPath(); ctx.arc(cx,cy,17,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,17,0,Math.PI*2);
      ctx.strokeStyle=`rgba(167,139,250,${.45+Math.sin(fr*.05)*.3})`; ctx.lineWidth=1.6; ctx.stroke();
      ctx.fillStyle=`rgba(255,255,255,${.78+Math.sin(fr*.04)*.22})`; ctx.font="bold 18px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("$",cx,cy+1);
      raf=requestAnimationFrame(loop);
    };
    loop(); return () => cancelAnimationFrame(raf);
  },[]);
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 rounded-full" style={{background:"radial-gradient(circle,rgba(139,92,246,.42),transparent 68%)",filter:"blur(16px)",animation:"logoBg 3s ease-in-out infinite"}}/>
      <canvas ref={ref} className="relative"/>
    </div>
  );
}

/* ─── Mini Charts ─────────────────────────────────────────────────────────── */
const LineChart = ({c="#10b981"}) => (
  <svg width="78" height="28" viewBox="0 0 78 28" fill="none">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity=".3"/><stop offset="100%" stopColor={c} stopOpacity="0"/></linearGradient></defs>
    <path d="M0 23 L11 19 L22 21 L33 13 L44 15 L55 7 L66 9 L78 2 L78 28 L0 28Z" fill="url(#lg)"/>
    <polyline points="0,23 11,19 22,21 33,13 44,15 55,7 66,9 78,2" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="78" cy="2" r="2.5" fill={c}/>
  </svg>
);
const BarChart = ({c="#ef4444"}) => (
  <svg width="78" height="28" viewBox="0 0 78 28" fill="none">
    {[24,15,36,11,42,19,48].map((h,i)=>(
      <rect key={i} x={i*11+3} y={28-h} width="8" height={h} rx="1.5" fill={c} opacity={i===6?1:.65}/>
    ))}
  </svg>
);

/* ─── Neon Floating Card ──────────────────────────────────────────────────── */
function NFC({ icon, label, amount, change, pos=true, color, delay=0, anim="floatA", revDelay="0s", revAni="fadeInL" }) {
  const glowColor = hx(color, .25);
  const borderColor = hx(color, .45);
  return (
    <div style={{
      position:"relative", borderRadius:14, padding:"1.2px",
      background:`linear-gradient(135deg, ${hx(color,.6)}, ${hx(color,.2)}, ${hx(color,.5)})`,
      boxShadow:`0 0 18px ${hx(color,.28)}, 0 0 40px ${hx(color,.12)}`,
      animation:`${anim} ${4.6+delay*.45}s ease-in-out ${delay}s infinite`,
    }}>
      <div className="nfc" style={{borderRadius:12.8}}>
        {/* inner color glow */}
        <div style={{position:"absolute",inset:0,borderRadius:12.8,background:`radial-gradient(ellipse at 30% 30%, ${hx(color,.08)} 0%, transparent 65%)`,pointerEvents:"none"}}/>
        <div style={{animation:`${revAni} .55s ease-out ${revDelay} both`, position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${hx(color,.25)},${hx(color,.12)})`,border:`1px solid ${hx(color,.4)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,boxShadow:`0 0 10px ${hx(color,.3)}`}}>
              {icon}
            </div>
            <span style={{fontSize:11,color:"rgba(148,163,184,.6)"}}>{label}</span>
          </div>
          <div style={{fontWeight:700,color:"#fff",fontSize:"1.04rem",lineHeight:1.2,textShadow:`0 0 12px ${hx(color,.5)}`}}>{amount}</div>
          {change && <div style={{fontSize:11,fontWeight:600,marginTop:2,color:pos?"#34d399":"#f87171"}}>{pos?"+":""}{change}</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── Password Strength ───────────────────────────────────────────────────── */
const SM = [null,
  {l:"Weak",  c:"#ef4444", m:"Password could be stronger"},
  {l:"Fair",  c:"#f59e0b", m:"Getting there, add symbols"},
  {l:"Good",  c:"#3b82f6", m:"Nice! Try adding a symbol"},
  {l:"Strong",c:"#10b981", m:"Great! Your password is strong."},
];
const gstr = pw => { if(!pw) return 0; let s=0; if(pw.length>=6)s++; if(pw.length>=10)s++; if(/[A-Z]/.test(pw)&&/[0-9]/.test(pw))s++; if(/[^A-Za-z0-9]/.test(pw))s++; return s; };

function PwStr({ pw }) {
  const s=gstr(pw), m=SM[s]; if(!pw) return null;
  return (
    <div style={{animation:"slideD .2s ease-out"}}>
      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",flex:1,gap:4}}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{height:4,flex:1,borderRadius:4,transition:"background .5s",
              background:i<=s?`linear-gradient(90deg,${m.c},${i===s?"rgba(255,255,255,.4)":m.c})`:  "rgba(30,58,138,.38)"}}/>
          ))}
        </div>
        <span style={{fontSize:11,fontWeight:600,color:m.c}}>{m.l}</span>
      </div>
      <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6,fontSize:11,color:m.c,opacity:.85}}>
        <svg viewBox="0 0 20 20" fill="currentColor" style={{width:13,height:13,flexShrink:0}}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
        {m.m}
      </div>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────────────────────── */
const MailIco = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:15,height:15}}><path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const LockIco = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:15,height:15}}><rect x="3" y="11" width="18" height="11" rx="2"/><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const EyeIco  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:15,height:15}}><path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:15,height:15}}><path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const CheckIco= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{width:15,height:15,animation:"checkAni .28s ease-out"}} strokeDasharray="20" strokeDashoffset="0"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const ArrowIco= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{width:15,height:15}}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>;
const AlertIco= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:15,height:15,flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

/* ─── validate ────────────────────────────────────────────────────────────── */
const validate = (email,pw) => {
  const e={};
  if(!email) e.email="Email is required"; else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email="Enter a valid email";
  if(!pw) e.pw="Password is required"; else if(pw.length<6) e.pw="Minimum 6 characters";
  return e;
};

/* ─── Neon Streak component ───────────────────────────────────────────────── */
function Streak({ left, right, top, height, colors, anim, animDelay="0s", opacity=1 }) {
  const pos = left!=null ? {left} : {right};
  const [c1,c2] = Array.isArray(colors) ? colors : [colors,colors];
  return (
    <div style={{position:"absolute",...pos,top,height,pointerEvents:"none"}}>
      {/* Wide outer glow */}
      <div style={{position:"absolute",left:-14,right:-14,top:0,bottom:0,
        background:`linear-gradient(180deg,transparent,${hx(c1,.18)} 20%,${hx(c2,.15)} 80%,transparent)`,
        filter:"blur(10px)", animation:`${anim} 4.5s ease-in-out ${animDelay} infinite`, opacity}}/>
      {/* Mid glow */}
      <div style={{position:"absolute",left:-4,right:-4,top:0,bottom:0,
        background:`linear-gradient(180deg,transparent,${hx(c1,.45)} 20%,${hx(c2,.4)} 80%,transparent)`,
        filter:"blur(4px)", animation:`${anim} 4.5s ease-in-out ${animDelay} infinite`, opacity}}/>
      {/* Core line */}
      <div style={{position:"absolute",left:0,right:0,top:0,bottom:0,width:2,margin:"auto",
        background:`linear-gradient(180deg,transparent,${c1} 20%,${c2} 80%,transparent)`,
        boxShadow:`0 0 8px ${c1}, 0 0 16px ${hx(c1,.6)}`,
        animation:`${anim} 4.5s ease-in-out ${animDelay} infinite`, opacity}}/>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth(), navigate = useNavigate();
  const cardRef = useRef(null);
  const [form, setForm]     = useState({ email:"", pw:"" });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoad]  = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [eBlur, setEBlur]   = useState(false);

  const set = f => e => setForm(v=>({...v,[f]:e.target.value}));
  const emailOk = eBlur && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const shake = () => {
    const el=cardRef.current; if(!el) return;
    el.style.animation="none"; void el.offsetHeight;
    el.style.animation="shake .42s ease-out";
    setTimeout(()=>{ if(el) el.style.animation=""; },450);
  };
  const onSubmit = async e => {
    e.preventDefault();
    const errs=validate(form.email,form.pw);
    if(Object.keys(errs).length){ setErrors(errs); shake(); return; }
    setErrors({}); setApiErr(""); setLoad(true);
    try { await login(form.email,form.pw); navigate("/dashboard"); }
    catch(err){ setApiErr(err.response?.data?.message||"Invalid email or password"); shake(); }
    finally { setLoad(false); }
  };

  return (
    <div style={{position:"relative",width:"100vw",height:"100vh",overflow:"hidden",background:"#020914"}}>
      <style>{CSS}</style>
      <NetworkBackground/>

      {/* ════════════════ BACK TO HOME ═══════════════════ */}
      <div style={{position:"absolute",top:16,left:18,zIndex:50,animation:"fadeUp .4s ease-out"}}>
        <div style={{
          padding:"1.5px", borderRadius:13,
          background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#22d3ee,#6366f1,#8b5cf6,#6d28d9)",
          backgroundSize:"300% 300%",
          animation:"homeFlow 3s ease-in-out infinite, homePulse 3s ease-in-out infinite",
        }}>
          <Link to="/" style={{
            display:"flex", alignItems:"center", gap:9,
            padding:"8px 18px", borderRadius:11.5,
            background:"linear-gradient(135deg,rgba(4,6,26,.94),rgba(3,5,20,.96))",
            backdropFilter:"blur(18px)",
            textDecoration:"none",
          }}>
            <div style={{
              width:26, height:26, borderRadius:8, flexShrink:0,
              background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 14px rgba(139,92,246,.75), inset 0 0 6px rgba(255,255,255,.12)",
              fontSize:14, fontWeight:800, color:"#fff",
            }}>←</div>
            <span style={{
              fontSize:13.5, fontWeight:700, letterSpacing:".02em",
              background:"linear-gradient(90deg,#c084fc,#8b5cf6,#22d3ee,#8b5cf6,#c084fc)",
              backgroundSize:"200% 100%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              animation:"homeText 2.5s ease-in-out infinite",
            }}>Home</span>
          </Link>
        </div>
      </div>

      {/* ════════════════ AMBIENT LAYERS ═════════════════ */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1}}>

        {/* Left green zone */}
        <div style={{position:"absolute",left:"-10%",top:"5%",width:"40%",height:"90%",
          background:"radial-gradient(ellipse at 30% 50%, rgba(16,185,129,.18) 0%, rgba(16,185,129,.06) 45%, transparent 68%)",
          animation:"glowPL 5s ease-in-out infinite"}}/>
        {/* Left bright spot (around cards) */}
        <div style={{position:"absolute",left:"0",top:"38%",width:"26%",height:"30%",
          background:"radial-gradient(ellipse at 50% 50%, rgba(16,185,129,.28) 0%, rgba(34,211,238,.1) 50%, transparent 70%)",
          filter:"blur(2px)", animation:"glowPL 4s ease-in-out .5s infinite"}}/>

        {/* Right purple zone */}
        <div style={{position:"absolute",right:"-10%",top:"0%",width:"42%",height:"95%",
          background:"radial-gradient(ellipse at 70% 40%, rgba(139,92,246,.16) 0%, rgba(99,102,241,.06) 45%, transparent 68%)",
          animation:"glowPR 5.5s ease-in-out .8s infinite"}}/>
        {/* Right orange-red spot (bills area) */}
        <div style={{position:"absolute",right:"0",top:"35%",width:"28%",height:"28%",
          background:"radial-gradient(ellipse at 60% 40%, rgba(249,115,22,.2) 0%, rgba(239,68,68,.08) 50%, transparent 70%)",
          filter:"blur(2px)", animation:"glowPR 4.5s ease-in-out 1s infinite"}}/>
      </div>

      {/* ════════════════ NEON STREAKS ═══════════════════ */}
      <div className="hidden lg:block" style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2}}>
        {/* Left green streaks */}
        <Streak left="22.5%" top="14%" height="62%" colors={["#10b981","#22d3ee"]} anim="streakP" animDelay=".2s"/>
        <Streak left="20.5%" top="24%" height="42%" colors={["#10b981","#10b981"]} anim="streakN" animDelay=".9s" opacity={0.55}/>
        {/* Right purple streak */}
        <Streak right="22.5%" top="20%" height="55%" colors={["#8b5cf6","#a855f7"]} anim="streakP" animDelay=".5s"/>
        {/* Right orange streak (between bills & transport) */}
        <Streak right="20.5%" top="38%" height="35%" colors={["#f97316","#ef4444"]} anim="streakN" animDelay="1.2s" opacity={0.7}/>
      </div>

      {/* ════════════════ TOP-LEFT: Balance ══════════════ */}
      <div className="hidden lg:block" style={{position:"absolute",top:"3%",left:"1.5%",zIndex:10,animation:"fadeInL .55s ease-out"}}>
        <div style={{padding:"1px",borderRadius:14,background:"linear-gradient(135deg,rgba(16,185,129,.6),rgba(16,185,129,.15),rgba(34,211,238,.4))",boxShadow:"0 0 20px rgba(16,185,129,.22)"}}>
          <div className="nfc" style={{borderRadius:13,minWidth:162}}>
            <div style={{fontSize:10,marginBottom:2,color:"rgba(148,163,184,.55)"}}>Total Balance</div>
            <div style={{fontSize:"1.15rem",fontWeight:700,color:"#fff",textShadow:"0 0 12px rgba(16,185,129,.5)",animation:"numB 4s ease-in-out infinite"}}>$24,580.00</div>
            <div style={{fontSize:11,fontWeight:600,color:"#34d399",marginBottom:8}}>+12.5% this month</div>
            <LineChart c="#10b981"/>
          </div>
        </div>
      </div>

      {/* ════════════════ TOP-CENTER: Logo ═══════════════ */}
      <div style={{position:"absolute",top:"2%",left:"50%",transform:"translateX(-50%)",zIndex:10,textAlign:"center",animation:"fadeUp .45s ease-out"}}>
        <div style={{display:"flex",justifyContent:"center"}}><Logo/></div>
        <h1 style={{marginTop:6,fontSize:"1.55rem",fontWeight:700,color:"#fff",letterSpacing:"-.02em",textShadow:"0 0 30px rgba(139,92,246,.4)"}}>FinanceBudget</h1>
        <p style={{fontSize:13,color:"rgba(96,165,250,.7)"}}>Your personal finance tracker</p>
      </div>

      {/* ════════════════ TOP-RIGHT: Spending ════════════ */}
      <div className="hidden lg:block" style={{position:"absolute",top:"3%",right:"1.5%",zIndex:10,animation:"fadeInR .55s ease-out"}}>
        <div style={{padding:"1px",borderRadius:14,background:"linear-gradient(135deg,rgba(239,68,68,.55),rgba(239,68,68,.15),rgba(249,115,22,.4))",boxShadow:"0 0 20px rgba(239,68,68,.2)"}}>
          <div className="nfc" style={{borderRadius:13,minWidth:162}}>
            <div style={{fontSize:10,marginBottom:2,color:"rgba(148,163,184,.55)"}}>Monthly Spending</div>
            <div style={{fontSize:"1.15rem",fontWeight:700,color:"#fff",textShadow:"0 0 12px rgba(239,68,68,.45)"}}>$2,340</div>
            <div style={{fontSize:11,fontWeight:600,color:"#f87171",marginBottom:8}}>-8.6% vs last month</div>
            <BarChart c="#ef4444"/>
          </div>
        </div>
      </div>

      {/* ════════════════ LEFT CARDS ═════════════════════ */}
      <div className="hidden lg:flex flex-col gap-3" style={{position:"absolute",left:"1.5%",top:"50%",transform:"translateY(-50%)",zIndex:10}}>
        <NFC icon="📈" label="Income"       amount="+$4,250"    change="$4,250"   pos={true}  color="#10b981" delay={0}   anim="floatA" revDelay=".1s"  revAni="fadeInL"/>
        <NFC icon="🏦" label="Bank Account" amount="$12,480.50"                   color="#3b82f6" delay={.9}  anim="floatB" revDelay=".25s" revAni="fadeInL"/>
        <NFC icon="💰" label="Savings"      amount="$6,840.20"  change="8.3%"    pos={true}  color="#22d3ee" delay={1.7} anim="floatC" revDelay=".4s"  revAni="fadeInL"/>
      </div>

      {/* ════════════════ CENTER FORM ════════════════════ */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10,width:"min(440px,92vw)"}}>

        {/* Gradient border wrapper */}
        <div ref={cardRef} style={{
          padding:"1.5px",borderRadius:20,
          background:"linear-gradient(135deg, #6d28d9 0%, #8b5cf6 20%, #06b6d4 45%, #6366f1 65%, #8b5cf6 80%, #4f46e5 100%)",
          boxShadow:"0 0 35px rgba(139,92,246,.45), 0 0 80px rgba(99,102,241,.18), 0 32px 80px rgba(0,0,20,.75)",
          animation:"cardBdr 3s ease-in-out infinite",
        }}>
          {/* Glass inner card */}
          <div style={{
            background:"linear-gradient(148deg, rgba(7,11,36,.97) 0%, rgba(3,6,22,.99) 100%)",
            borderRadius:18.5, padding:"26px 28px", position:"relative", overflow:"hidden",
            animation:"fadeUp .6s ease-out",
          }}>
            {/* Inner top shimmer */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:"60%",background:"linear-gradient(180deg,rgba(139,92,246,.04),transparent)",pointerEvents:"none"}}/>
            {/* TR corner glow */}
            <div style={{position:"absolute",top:-60,right:-60,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.1),transparent 70%)",pointerEvents:"none"}}/>
            {/* BL corner glow */}
            <div style={{position:"absolute",bottom:-50,left:-50,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,.07),transparent 70%)",pointerEvents:"none"}}/>

            <div style={{marginBottom:20,position:"relative"}}>
              <h2 style={{fontSize:"1.25rem",fontWeight:600,color:"#fff",textShadow:"0 0 20px rgba(139,92,246,.3)"}}>Welcome back</h2>
              <p style={{marginTop:2,fontSize:13,color:"rgba(203,213,225,.85)"}}>Sign in to continue to your dashboard</p>
            </div>

            {apiErr && (
              <div style={{marginBottom:14,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,fontSize:13,
                background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.2)",color:"#f87171"}}>
                <AlertIco/> {apiErr}
              </div>
            )}

            <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:16}} noValidate>

              {/* Email */}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:13,fontWeight:500,color:"rgba(226,232,240,.95)"}}>Email address</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"rgba(139,92,246,.65)",pointerEvents:"none",display:"flex"}}>
                    <MailIco/>
                  </span>
                  <input type="email" placeholder="you@example.com" autoComplete="email"
                    value={form.email} onChange={set("email")} onBlur={()=>setEBlur(true)}
                    className={`fin-input pl-ic pr-ic${errors.email?" err":emailOk?" valid":""}`}/>
                  {emailOk && (
                    <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#10b981",display:"flex"}}>
                      <CheckIco/>
                    </span>
                  )}
                </div>
                {errors.email && <p style={{fontSize:11,color:"#f87171",animation:"slideD .2s ease-out"}}>⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <label style={{fontSize:13,fontWeight:500,color:"rgba(226,232,240,.95)"}}>Password</label>
                  <button type="button" style={{fontSize:11,fontWeight:500,color:"rgba(167,139,250,.95)",background:"none",border:"none",cursor:"pointer",padding:0}} className="hover:text-white transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"rgba(139,92,246,.65)",pointerEvents:"none",display:"flex"}}>
                    <LockIco/>
                  </span>
                  <input type={showPw?"text":"password"} placeholder="••••••••" autoComplete="current-password"
                    value={form.pw} onChange={set("pw")}
                    className={`fin-input pl-ic pr-ic${errors.pw?" err":""}`}/>
                  <button type="button" tabIndex={-1}
                    style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"rgba(139,92,246,.6)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center"}}
                    className="hover:text-purple-300 transition-colors"
                    onClick={()=>setShowPw(v=>!v)}>
                    <span key={showPw?"off":"on"} style={{display:"block",animation:"eyePop .18s ease-out"}}>
                      {showPw ? <EyeOff/> : <EyeIco/>}
                    </span>
                  </button>
                </div>
                {errors.pw && <p style={{fontSize:11,color:"#f87171",animation:"slideD .2s ease-out"}}>⚠ {errors.pw}</p>}
                <PwStr pw={form.pw}/>
              </div>

              {/* Submit button */}
              <button type="submit" disabled={loading}
                className="nbtn"
                style={{width:"100%",borderRadius:12,padding:"13px 24px",marginTop:4,fontSize:14,fontWeight:600,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:loading?"not-allowed":"pointer",opacity:loading?.55:1,animation:loading?"none":"btnGlow 3s ease-in-out infinite"}}>
                {loading
                  ? <span style={{display:"flex",gap:6}}>{[0,1,2].map(i=><span key={i} style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#fff",animation:`dot 1.2s ease-in-out ${i*.16}s infinite`}}/>)}</span>
                  : <><ArrowIco/> Sign in</>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:14,margin:"18px 0"}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,.2))"}}/>
              <span style={{fontSize:11,color:"rgba(148,163,184,.75)"}}>or</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(99,102,241,.2),transparent)"}}/>
            </div>

            <p style={{textAlign:"center",fontSize:13,color:"rgba(203,213,225,.85)"}}>
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{fontWeight:600,color:"rgba(192,166,255,1)",textDecoration:"none"}} className="hover:text-white transition-colors">Create one</Link>
            </p>

            {/* Trust badges */}
            <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:18}}>
              {[["🔒","256-bit SSL"],["🛡️","Bank-grade security"],["⚡","Instant sync"]].map(([ic,lb])=>(
                <div key={lb} style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12}}>{ic}</span>
                  <span style={{fontSize:10,color:"rgba(148,163,184,.78)"}}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{marginTop:10,borderRadius:12,padding:"8px 16px",textAlign:"center",
          background:"rgba(8,14,45,.22)",border:"1px solid rgba(99,102,241,.15)",backdropFilter:"blur(8px)"}}>
          <p style={{fontSize:11,color:"rgba(148,163,184,.8)"}}>
            Demo:{" "}
            <button type="button" onClick={()=>setForm({email:"maki@example.com",pw:"secret123"})}
              style={{fontWeight:600,textDecoration:"underline",textUnderlineOffset:2,color:"rgba(192,166,255,1)",background:"none",border:"none",cursor:"pointer",fontSize:11}}
              className="hover:text-white transition-colors">
              maki@example.com / secret123
            </button>
          </p>
        </div>
      </div>

      {/* ════════════════ RIGHT CARDS ════════════════════ */}
      <div className="hidden lg:flex flex-col gap-3" style={{position:"absolute",right:"1.5%",top:"50%",transform:"translateY(-50%)",zIndex:10}}>
        <NFC icon="🛒" label="Shopping"    amount="-$420"     change="-$420"   pos={false} color="#8b5cf6" delay={.3}  anim="floatB" revDelay=".1s"  revAni="fadeInR"/>
        <NFC icon="📄" label="Bills"       amount="-$880"     change="-$880"   pos={false} color="#f97316" delay={1.1} anim="floatA" revDelay=".25s" revAni="fadeInR"/>
        <NFC icon="🚗" label="Transport"   amount="$219"      change="$219"    pos={true}  color="#0ea5e9" delay={1.8} anim="floatC" revDelay=".4s"  revAni="fadeInR"/>
        <NFC icon="📊" label="Investments" amount="$5,259.30" change="+15.4%"  pos={true}  color="#06b6d4" delay={.6}  anim="floatD" revDelay=".55s" revAni="fadeInR"/>
      </div>

      {/* ════════════════ BOTTOM BADGES ══════════════════ */}
      <div style={{position:"absolute",bottom:"2%",left:"50%",transform:"translateX(-50%)",zIndex:10,
        display:"flex",gap:36,animation:"badgeUp .9s ease-out",whiteSpace:"nowrap"}}>
        {[["🎯","Smart budgeting","Track and optimize"],["⚡","Real-time insights","Make better decisions"],["🔐","Secure & private","Bank-level protection"]].map(([ic,t,s])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18,filter:"drop-shadow(0 0 8px rgba(139,92,246,.5))"}}>{ic}</span>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#fff"}}>{t}</div>
              <div style={{fontSize:10,color:"rgba(96,165,250,.4)"}}>{s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
