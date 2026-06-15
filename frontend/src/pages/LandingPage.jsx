import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   CSS — keyframes + global classes
   ───────────────────────────────────────────────────────────────────────────── */
const CSS = `
  /* AURORA */
  @keyframes auroraA{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(90px,-80px)scale(1.22)}66%{transform:translate(-65px,50px)scale(0.85)}}
  @keyframes auroraB{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(-85px,60px)scale(1.15)}66%{transform:translate(70px,-40px)scale(0.88)}}
  @keyframes auroraC{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(55px,75px)scale(1.08)}66%{transform:translate(-55px,-50px)scale(0.92)}}
  @keyframes auroraD{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(-45px,-65px)scale(1.1)}66%{transform:translate(75px,35px)scale(0.9)}}

  /* DASHBOARD MOCKUP FLOAT */
  @keyframes mockFloat{0%,100%{transform:perspective(1300px)rotateY(-16deg)rotateX(5deg)translateY(0)}50%{transform:perspective(1300px)rotateY(-16deg)rotateX(5deg)translateY(-16px)}}

  /* GRADIENT ANIMATIONS */
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes borderFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

  /* GRADIENT TEXT */
  .lp-grad-text{background:linear-gradient(135deg,#e879f9,#8b5cf6,#6366f1,#06b6d4,#22d3ee,#8b5cf6,#e879f9);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShift 4s ease-in-out infinite}

  /* BUTTON GLOW */
  @keyframes btnPulse{0%,100%{box-shadow:0 0 28px rgba(139,92,246,.6),0 4px 28px rgba(99,102,241,.4)}50%{box-shadow:0 0 55px rgba(139,92,246,.95),0 4px 55px rgba(99,102,241,.65)}}

  /* NAV */
  @keyframes navLine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes navLogoPulse{0%,100%{box-shadow:0 0 18px rgba(139,92,246,.7),0 0 36px rgba(99,102,241,.35)}50%{box-shadow:0 0 36px rgba(139,92,246,1),0 0 65px rgba(99,102,241,.6)}}

  /* 3-D CARD ROTATIONS — each card tumbles through a unique 3-D path */
  @keyframes rot3d0{
    0%  {transform:perspective(1000px)rotateX(12deg)rotateY(-15deg)translateY(0px)}
    25% {transform:perspective(1000px)rotateX(8deg) rotateY(-9deg) translateY(-12px)}
    50% {transform:perspective(1000px)rotateX(15deg)rotateY(-18deg)translateY(-5px)}
    75% {transform:perspective(1000px)rotateX(9deg) rotateY(-12deg)translateY(-10px)}
    100%{transform:perspective(1000px)rotateX(12deg)rotateY(-15deg)translateY(0px)}
  }
  @keyframes rot3d1{
    0%  {transform:perspective(1000px)rotateX(9deg) rotateY(14deg) translateY(-5px)}
    25% {transform:perspective(1000px)rotateX(14deg)rotateY(8deg)  translateY(-14px)}
    50% {transform:perspective(1000px)rotateX(6deg) rotateY(17deg) translateY(0px)}
    75% {transform:perspective(1000px)rotateX(12deg)rotateY(11deg) translateY(-9px)}
    100%{transform:perspective(1000px)rotateX(9deg) rotateY(14deg) translateY(-5px)}
  }
  @keyframes rot3d2{
    0%  {transform:perspective(1000px)rotateX(14deg)rotateY(1deg)  translateY(-3px)}
    25% {transform:perspective(1000px)rotateX(9deg) rotateY(8deg)  translateY(-13px)}
    50% {transform:perspective(1000px)rotateX(16deg)rotateY(-5deg) translateY(-7px)}
    75% {transform:perspective(1000px)rotateX(11deg)rotateY(4deg)  translateY(-15px)}
    100%{transform:perspective(1000px)rotateX(14deg)rotateY(1deg)  translateY(-3px)}
  }
  @keyframes rot3d3{
    0%  {transform:perspective(1000px)rotateX(8deg) rotateY(18deg) translateY(-7px)}
    25% {transform:perspective(1000px)rotateX(13deg)rotateY(12deg) translateY(0px)}
    50% {transform:perspective(1000px)rotateX(5deg) rotateY(21deg) translateY(-12px)}
    75% {transform:perspective(1000px)rotateX(11deg)rotateY(15deg) translateY(-4px)}
    100%{transform:perspective(1000px)rotateX(8deg) rotateY(18deg) translateY(-7px)}
  }
  @keyframes rot3d4{
    0%  {transform:perspective(1000px)rotateX(11deg)rotateY(-13deg)translateY(-4px)}
    25% {transform:perspective(1000px)rotateX(6deg) rotateY(-7deg) translateY(-15px)}
    50% {transform:perspective(1000px)rotateX(14deg)rotateY(-16deg)translateY(-8px)}
    75% {transform:perspective(1000px)rotateX(8deg) rotateY(-10deg)translateY(-2px)}
    100%{transform:perspective(1000px)rotateX(11deg)rotateY(-13deg)translateY(-4px)}
  }

  /* SIMPLE FLOAT — for step cards */
  @keyframes cf0{0%,100%{transform:translateY(0px)}   50%{transform:translateY(-9px)}}
  @keyframes cf1{0%,100%{transform:translateY(-5px)}  50%{transform:translateY(7px)}}
  @keyframes cf2{0%,100%{transform:translateY(-3px)}  50%{transform:translateY(9px)}}
  @keyframes cf3{0%,100%{transform:translateY(4px)}   50%{transform:translateY(-8px)}}

  /* GLOW PULSES per accent colour */
  @keyframes cardGlow0{0%,100%{box-shadow:0 0 35px rgba(59,130,246,.32),0 0 70px rgba(59,130,246,.12)}  50%{box-shadow:0 0 65px rgba(59,130,246,.65),0 0 120px rgba(59,130,246,.28)}}
  @keyframes cardGlow1{0%,100%{box-shadow:0 0 35px rgba(139,92,246,.32),0 0 70px rgba(139,92,246,.12)} 50%{box-shadow:0 0 65px rgba(139,92,246,.65),0 0 120px rgba(139,92,246,.28)}}
  @keyframes cardGlow2{0%,100%{box-shadow:0 0 35px rgba(249,115,22,.28),0 0 70px rgba(249,115,22,.10)}  50%{box-shadow:0 0 65px rgba(249,115,22,.55),0 0 120px rgba(249,115,22,.22)}}
  @keyframes cardGlow3{0%,100%{box-shadow:0 0 35px rgba(6,182,212,.28),0 0 70px rgba(6,182,212,.10)}   50%{box-shadow:0 0 65px rgba(6,182,212,.55),0 0 120px rgba(6,182,212,.22)}}
  @keyframes cardGlow4{0%,100%{box-shadow:0 0 35px rgba(16,185,129,.28),0 0 70px rgba(16,185,129,.10)} 50%{box-shadow:0 0 65px rgba(16,185,129,.55),0 0 120px rgba(16,185,129,.22)}}

  /* INNER BG BREATHE */
  @keyframes innerBreathe{0%,100%{background:linear-gradient(148deg,rgba(6,9,30,.97),rgba(3,5,20,1))}50%{background:linear-gradient(148deg,rgba(11,17,52,.97),rgba(7,11,35,1))}}

  /* ICON / BADGE */
  @keyframes iconGlow{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.1);filter:brightness(1.3)}}
  @keyframes badgeDot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
  @keyframes floatWidget{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

  /* REVEAL */
  @keyframes revLeft {from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes revRight{from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)}}

  /* LIGHT BEAMS */
  @keyframes beam0{0%,100%{opacity:.07;transform:rotate(-22deg)translateX(0px)}  50%{opacity:.17;transform:rotate(-22deg)translateX(25px)}}
  @keyframes beam1{0%,100%{opacity:.06;transform:rotate(-22deg)translateX(14px)} 50%{opacity:.13;transform:rotate(-22deg)translateX(-12px)}}
  @keyframes beam2{0%,100%{opacity:.08;transform:rotate(-22deg)translateX(-7px)} 50%{opacity:.16;transform:rotate(-22deg)translateX(18px)}}

  /* CYBER GRID */
  @keyframes gridPulse{0%,100%{opacity:.05}50%{opacity:.11}}

  /* SCAN LINE */
  @keyframes scanX{0%{transform:translateX(-100%)}100%{transform:translateX(200vw)}}

  /* NAV LINKS */
  .lp-nav-link{color:rgba(203,213,225,.75);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s,text-shadow .2s;position:relative}
  .lp-nav-link:hover{color:#f1f5f9;text-shadow:0 0 14px rgba(139,92,246,.9),0 0 28px rgba(99,102,241,.5)}
  .lp-nav-link::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:linear-gradient(90deg,#8b5cf6,#06b6d4);transform:scaleX(0);transition:transform .25s}
  .lp-nav-link:hover::after{transform:scaleX(1)}
  .lp-scroll{scroll-behavior:smooth}

  @keyframes ringFillLP{from{stroke-dashoffset:var(--circ,314)}to{stroke-dashoffset:0}}
  @keyframes barGrowLP {from{height:0;opacity:0}to{height:100%;opacity:1}}
`;

/* ─────────────────────────────────────────────────────────────────────────────
   HOOKS
   ───────────────────────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function CountUp({ to, prefix = '', suffix = '', dur = 1600 }) {
  const [ref, vis] = useReveal(.5);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!vis) return;
    const t0 = Date.now();
    const tick = () => { const p = Math.min((Date.now()-t0)/dur,1); setVal(Math.round((1-Math.pow(1-p,3))*to)); if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [vis, to, dur]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BACKGROUND EFFECTS
   ───────────────────────────────────────────────────────────────────────────── */
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const COLS = ['#8b5cf6','#6366f1','#06b6d4','#22d3ee','#a78bfa','#3b82f6','#c084fc'];
    const pts = Array.from({ length: 100 }, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.32,
      r:Math.random()*2+.4, col:COLS[Math.floor(Math.random()*7)], ph:Math.random()*Math.PI*2,
    }));
    const ctx = c.getContext('2d'); let raf;
    const loop = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.ph+=.013;
        if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0;
        if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0;
        const a = .1+Math.abs(Math.sin(p.ph))*.42;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.col+Math.round(a*255).toString(16).padStart(2,'0'); ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>;
}

function Aurora() {
  const blobs = [
    {w:'60%',h:'60%',l:'2%', t:'-18%',col:'rgba(109,40,217,.30)', a:'auroraA',dur:'10s'},
    {w:'55%',h:'55%',r:'-6%',t:'-5%', col:'rgba(6,182,212,.22)',  a:'auroraB',dur:'12s'},
    {w:'50%',h:'50%',l:'28%',t:'18%', col:'rgba(99,102,241,.20)', a:'auroraC',dur:'14s'},
    {w:'40%',h:'45%',r:'18%',b:'-12%',col:'rgba(139,92,246,.18)',a:'auroraD',dur:'11s'},
    {w:'35%',h:'40%',l:'55%',t:'40%', col:'rgba(232,121,249,.12)',a:'auroraA',dur:'13s'},
  ];
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      {blobs.map((b,i) => (
        <div key={i} style={{
          position:'absolute',width:b.w,height:b.h,left:b.l,right:b.r,top:b.t,bottom:b.b,
          background:`radial-gradient(ellipse,${b.col},transparent 70%)`,
          filter:'blur(55px)', animation:`${b.a} ${b.dur} ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

function CyberGrid() {
  return (
    <div style={{
      position:'absolute',inset:0,pointerEvents:'none',zIndex:1,
      backgroundImage:`linear-gradient(rgba(99,102,241,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.08) 1px,transparent 1px)`,
      backgroundSize:'58px 58px',
      maskImage:'radial-gradient(ellipse 85% 75% at 50% 40%,black 25%,transparent 100%)',
      WebkitMaskImage:'radial-gradient(ellipse 85% 75% at 50% 40%,black 25%,transparent 100%)',
      animation:'gridPulse 5s ease-in-out infinite',
    }}/>
  );
}

function LightBeams() {
  const beams = [
    {left:'6%',  color:'#8b5cf6', w:140, a:'beam0', dur:'18s', delay:'0s'},
    {left:'42%', color:'#06b6d4', w:90,  a:'beam1', dur:'22s', delay:'6s'},
    {left:'74%', color:'#6366f1', w:110, a:'beam2', dur:'16s', delay:'11s'},
  ];
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:1}}>
      {beams.map((b,i) => (
        <div key={i} style={{
          position:'absolute',top:'-50%',left:b.left,width:b.w,height:'200%',
          background:`linear-gradient(180deg,transparent 0%,${b.color} 35%,${b.color} 65%,transparent 100%)`,
          filter:'blur(32px)',
          animation:`${b.a} ${b.dur} ${b.delay} ease-in-out infinite`,
        }}/>
      ))}
      {/* Horizontal scan line */}
      <div style={{
        position:'absolute',top:'38%',left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(139,92,246,.35),rgba(6,182,212,.35),transparent)',
        filter:'blur(1px)',
        animation:'scanX 8s linear infinite',
      }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG CHARTS
   ───────────────────────────────────────────────────────────────────────────── */
function NeonLine({ color='#10b981', w=150, h=48, delay=0 }) {
  const pRef = useRef(null);
  useEffect(() => {
    const p = pRef.current; if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    setTimeout(() => { p.style.transition=`stroke-dashoffset 2s ${delay}ms cubic-bezier(.4,0,.2,1)`; p.style.strokeDashoffset='0'; }, 300+delay);
  }, [delay]);
  const pts = [[0,42],[22,30],[44,34],[66,16],[88,20],[110,5],[132,9],[148,6]];
  const d = pts.map((p,i)=>`${i===0?'M':'L'}${p[0]} ${p[1]}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs><linearGradient id={`nlg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".5"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={`${d} L${pts[pts.length-1][0]} ${h} L0 ${h} Z`} fill={`url(#nlg${color.replace('#','')})`}/>
      <path ref={pRef} d={d} stroke={color} strokeWidth="2.2" fill="none" style={{filter:`drop-shadow(0 0 6px ${color})`}}/>
    </svg>
  );
}

function DonutRings({ size=110 }) {
  const segs = [{pct:.72,color:'#8b5cf6',r:47},{pct:.58,color:'#10b981',r:37},{pct:.42,color:'#f97316',r:27},{pct:.88,color:'#06b6d4',r:17}];
  const cx=size/2, cy=size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segs.map(({pct,color,r},i) => {
        const circ=2*Math.PI*r, dash=pct*circ;
        return (<g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(30,40,80,.5)" strokeWidth="7"/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ/4} strokeLinecap="round"
            style={{filter:`drop-shadow(0 0 7px ${color})`,animation:`ringFillLP .9s ${i*160+200}ms ease-out both`}}/>
        </g>);
      })}
      <text x={cx} y={cy-5} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">72%</text>
      <text x={cx} y={cy+9} textAnchor="middle" fill="rgba(203,213,225,.7)" fontSize="8" fontFamily="system-ui,sans-serif">Budget</text>
    </svg>
  );
}

function NeonBarChart({ color='#8b5cf6', w=90, h=54 }) {
  const bars=[.45,.7,.55,.85,.6,.78,.5];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {bars.map((v,i)=>(
        <rect key={i} x={i*13+1} y={h-v*(h-8)} width="9" height={v*(h-8)} rx="3" fill={color}
          style={{opacity:.7+v*.3,filter:`drop-shadow(0 0 5px ${color})`,animation:`barGrowLP .6s ${i*80+200}ms ease-out both`}}/>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DASHBOARD MOCKUP
   ───────────────────────────────────────────────────────────────────────────── */
function DashboardMockup() {
  const txns=[
    {icon:'🛒',name:'Grocery Store',  cat:'Food & Drink',   amt:'-$45.80', col:'#f87171'},
    {icon:'💼',name:'Monthly Salary', cat:'Income',         amt:'+$3,200', col:'#34d399'},
    {icon:'🔌',name:'Electric Bill',  cat:'Utilities',      amt:'-$118.40',col:'#fb923c'},
    {icon:'🎬',name:'Netflix Premium',cat:'Entertainment',  amt:'-$15.99', col:'#a78bfa'},
    {icon:'🚌',name:'Bus Pass',       cat:'Transport',      amt:'-$42.00', col:'#60a5fa'},
  ];
  const budgets=[{label:'Food & Dining',pct:.68,col:'#8b5cf6'},{label:'Entertainment',pct:.42,col:'#06b6d4'},{label:'Transport',pct:.81,col:'#10b981'}];
  return (
    <div style={{
      padding:'1.5px',borderRadius:20,
      background:'linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4,#6366f1,#8b5cf6,#4f46e5)',
      backgroundSize:'300% 300%',
      boxShadow:'0 0 80px rgba(139,92,246,.4),0 0 160px rgba(99,102,241,.18),0 40px 100px rgba(0,0,20,.8)',
      animation:'mockFloat 7s ease-in-out infinite,borderFlow 4s ease-in-out infinite',
    }}>
      <div style={{background:'linear-gradient(148deg,rgba(6,9,30,.97),rgba(3,5,20,.99))',borderRadius:18.5,padding:20,width:520,overflow:'hidden'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
          <div>
            <div style={{fontSize:10,color:'rgba(203,213,225,.6)',marginBottom:2}}>Total Balance</div>
            <div style={{fontSize:'1.55rem',fontWeight:700,color:'#fff',letterSpacing:'-.02em'}}>$24,580.00</div>
            <div style={{fontSize:10,color:'#34d399',marginTop:2,display:'flex',alignItems:'center',gap:4}}><span>▲</span><span>+12.5% this month</span></div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:'rgba(203,213,225,.5)',marginBottom:4}}>Spending trend</div>
            <NeonLine color="#10b981" w={140} h={38} delay={200}/>
          </div>
        </div>
        <div style={{height:1,background:'rgba(99,102,241,.22)',marginBottom:14}}/>
        <div style={{display:'flex',gap:16}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:'rgba(167,139,250,.85)',letterSpacing:.6,marginBottom:8}}>RECENT TRANSACTIONS</div>
            {txns.map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'5px 0',borderBottom:'1px solid rgba(99,102,241,.13)'}}>
                <div style={{width:26,height:26,borderRadius:8,flexShrink:0,background:'rgba(99,102,241,.16)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{t.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:'rgba(226,232,240,.95)',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</div>
                  <div style={{fontSize:9,color:'rgba(203,213,225,.6)'}}>{t.cat}</div>
                </div>
                <div style={{fontSize:11,fontWeight:600,color:t.col,flexShrink:0}}>{t.amt}</div>
              </div>
            ))}
          </div>
          <div style={{width:140,flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:600,color:'rgba(167,139,250,.85)',letterSpacing:.6,marginBottom:6}}>BUDGET OVERVIEW</div>
            <div style={{display:'flex',justifyContent:'center',marginBottom:12}}><DonutRings size={108}/></div>
            {budgets.map((b,i)=>(
              <div key={i} style={{marginBottom:7}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:9,color:'rgba(203,213,225,.75)'}}>{b.label}</span>
                  <span style={{fontSize:9,color:b.col,fontWeight:700}}>{Math.round(b.pct*100)}%</span>
                </div>
                <div style={{height:4,borderRadius:99,background:'rgba(30,40,80,.6)',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:99,width:`${b.pct*100}%`,background:`linear-gradient(90deg,${b.col}99,${b.col})`,boxShadow:`0 0 8px ${b.col}`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{height:1,background:'rgba(99,102,241,.22)',margin:'12px 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:9,color:'rgba(203,213,225,.6)',marginBottom:4}}>Monthly Spending</div><NeonBarChart color="#8b5cf6" w={100} h={44}/></div>
          <div><div style={{fontSize:9,color:'rgba(203,213,225,.6)',marginBottom:4}}>Income</div><NeonBarChart color="#10b981" w={100} h={44}/></div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,color:'rgba(203,213,225,.6)'}}>Savings rate</div>
            <div style={{fontSize:'1.2rem',fontWeight:700,color:'#10b981',marginTop:4}}>34%</div>
            <div style={{fontSize:9,color:'rgba(52,211,153,.7)'}}>▲ 5% vs last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CARD 3D — mouse-tracking tilt + holographic shine + depth shadow
   ───────────────────────────────────────────────────────────────────────────── */
const R3D = {
  anims:  ['rot3d0','rot3d1','rot3d2','rot3d3','rot3d4'],
  durs:   ['9s','11s','8.5s','12s','10s'],
  delays: ['0s','2s','1s','3s','1.5s'],
};

function Card3D({ children, idx, color }) {
  const wRef  = useRef(null);
  const shRef = useRef(null);
  const sdRef = useRef(null);
  const timer = useRef(null);

  const onMove = e => {
    const el = wRef.current; if (!el) return;
    const rc = el.getBoundingClientRect();
    const cx = (e.clientX-rc.left)/rc.width-.5;
    const cy = (e.clientY-rc.top) /rc.height-.5;
    el.style.transform  = `perspective(1000px) rotateX(${cy*-30}deg) rotateY(${cx*38}deg) scale(1.07)`;
    el.style.transition = 'transform .1s linear';
    if (shRef.current) {
      shRef.current.style.background = `radial-gradient(circle at ${(cx+.5)*100}% ${(cy+.5)*100}%,rgba(255,255,255,.20) 0%,rgba(139,92,246,.07) 42%,transparent 68%)`;
      shRef.current.style.opacity = '1';
    }
    if (sdRef.current) {
      sdRef.current.style.transform = `translateX(${cx*26}px) translateY(${22+Math.abs(cy)*16}px) scaleX(${.58+Math.abs(cx)*.38})`;
      sdRef.current.style.opacity   = `${.2+Math.abs(cx)*.25}`;
    }
  };

  const onEnter = () => { clearTimeout(timer.current); if(wRef.current) wRef.current.style.animationPlayState='paused'; };

  const onLeave = () => {
    const el = wRef.current; if (!el) return;
    el.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.transition = 'transform .85s cubic-bezier(.23,1,.32,1)';
    if (shRef.current) shRef.current.style.opacity = '0';
    if (sdRef.current) { sdRef.current.style.transform='translateX(0)translateY(22px)scaleX(.68)'; sdRef.current.style.opacity='.18'; }
    timer.current = setTimeout(() => { if(wRef.current){wRef.current.style.transform='';wRef.current.style.transition='';wRef.current.style.animationPlayState='running';} }, 850);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div style={{position:'relative',paddingBottom:26}}>
      {/* Ground shadow */}
      <div ref={sdRef} style={{
        position:'absolute',bottom:4,left:'14%',right:'14%',height:24,
        background:`radial-gradient(ellipse,${color}60,transparent 70%)`,
        filter:'blur(18px)',zIndex:0,pointerEvents:'none',
        transform:'translateX(0)translateY(22px)scaleX(.68)',opacity:.18,
        transition:'all .85s cubic-bezier(.23,1,.32,1)',
      }}/>
      {/* Rotating card */}
      <div ref={wRef} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={{animation:`${R3D.anims[idx]} ${R3D.durs[idx]} ${R3D.delays[idx]} ease-in-out infinite`,willChange:'transform',position:'relative',zIndex:1}}>
        {/* Holographic shine overlay */}
        <div ref={shRef} style={{position:'absolute',inset:0,borderRadius:21,zIndex:10,pointerEvents:'none',opacity:0,transition:'opacity .2s ease',mixBlendMode:'screen'}}/>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h=()=>setScrolled(window.scrollY>20);
    window.addEventListener('scroll',h,{passive:true});
    return ()=>window.removeEventListener('scroll',h);
  },[]);
  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:100,height:66,
      backdropFilter:'blur(24px) saturate(1.5)',
      background:scrolled?'linear-gradient(180deg,rgba(4,6,28,.94),rgba(2,4,22,.9))':'linear-gradient(180deg,rgba(4,6,28,.6),rgba(2,4,22,.35))',
      transition:'background .35s ease',
    }}>
      {/* Top neon hairline */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,transparent 0%,#6d28d9 18%,#8b5cf6 38%,#06b6d4 58%,#6366f1 78%,transparent 100%)',backgroundSize:'300% 100%',animation:'navLine 5s ease-in-out infinite',opacity:.9}}/>
      {/* Bottom glow border */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,#8b5cf640 14%,#8b5cf6 34%,#06b6d4 54%,#6366f1 74%,#8b5cf640 90%,transparent)',backgroundSize:'300% 100%',animation:'navLine 4s ease-in-out infinite'}}/>
      {/* Diffuse glow bleeding below */}
      <div style={{position:'absolute',bottom:'-20px',left:'15%',right:'15%',height:20,background:'linear-gradient(180deg,rgba(139,92,246,.22),transparent)',filter:'blur(8px)',pointerEvents:'none'}}/>

      <div style={{maxWidth:1200,margin:'0 auto',height:'100%',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        {/* Logo */}
        <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#5b21b6,#8b5cf6,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',animation:'navLogoPulse 3s ease-in-out infinite'}}>$</div>
          <div>
            <div style={{color:'#fff',fontWeight:700,fontSize:15,letterSpacing:'-.01em',lineHeight:1.1}}>FinanceBudget</div>
            <div style={{fontSize:10,color:'rgba(139,92,246,.85)',fontWeight:600,letterSpacing:.5}}>SMART · SECURE · FREE</div>
          </div>
        </Link>

        {/* Links */}
        <div style={{display:'flex',gap:36,alignItems:'center'}}>
          {[['Features','#features'],['How It Works','#how-it-works'],['Analytics','#analytics']].map(([l,h])=>(
            <a key={l} href={h} className="lp-nav-link">{l}</a>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{padding:'1.2px',borderRadius:11,background:'linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4,#6366f1)',backgroundSize:'200% 200%',animation:'borderFlow 3.5s ease-in-out infinite'}}>
            <Link to="/login" style={{display:'block',textDecoration:'none',color:'rgba(220,230,245,.92)',fontSize:13.5,fontWeight:600,padding:'7px 18px',borderRadius:9.5,background:'rgba(4,6,26,.9)'}}>Sign In</Link>
          </div>
          <Link to="/register" style={{textDecoration:'none',fontSize:13.5,fontWeight:700,padding:'8px 22px',borderRadius:11,background:'linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4)',backgroundSize:'200% 200%',color:'#fff',animation:'btnPulse 2.8s ease-in-out infinite,gradShift 5s ease-in-out infinite',letterSpacing:'.01em'}}>Get Started →</Link>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',paddingTop:66}}>
      <Aurora/>
      <CyberGrid/>
      <LightBeams/>
      <ParticleField/>
      <div style={{position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',padding:'60px 32px',width:'100%',display:'flex',alignItems:'center',gap:52}}>
        {/* Text */}
        <div style={{flex:'0 0 480px',animation:'revLeft .9s ease-out both'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:24,padding:'6px 16px',borderRadius:99,border:'1px solid rgba(139,92,246,.55)',background:'rgba(109,40,217,.18)',backdropFilter:'blur(10px)'}}>
            <span style={{display:'block',width:7,height:7,borderRadius:'50%',background:'#10b981',animation:'badgeDot 2s ease-in-out infinite'}}/>
            <span style={{fontSize:12,color:'rgba(192,168,255,.98)',fontWeight:600}}>AI-Powered Personal Finance</span>
          </div>
          <h1 style={{fontSize:'clamp(2.4rem,5vw,3.7rem)',fontWeight:800,lineHeight:1.08,letterSpacing:'-.03em',color:'#fff',marginBottom:22}}>
            Manage Money<br/><span className="lp-grad-text">With Intelligence</span>
          </h1>
          <p style={{fontSize:17,lineHeight:1.72,color:'rgba(203,213,225,.85)',marginBottom:38,maxWidth:420}}>
            Track every transaction, set smart budgets, and unlock insights that transform how you handle money — all in real time.
          </p>
          <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
            {['✓ No credit card required','✓ Free forever plan','✓ 2-minute setup'].map(t=>(
              <span key={t} style={{fontSize:13,color:'rgba(192,168,255,.92)',fontWeight:500}}>{t}</span>
            ))}
          </div>
        </div>
        {/* 3D mockup */}
        <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',animation:'revRight .9s .15s ease-out both'}}>
          <DashboardMockup/>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATS
   ───────────────────────────────────────────────────────────────────────────── */
const GLOW_ANIMS = ['cardGlow0','cardGlow1','cardGlow2','cardGlow4'];

function Stats() {
  const [ref,vis] = useReveal(.2);
  const stats=[
    {n:50000,suf:'+',label:'Active Users',       icon:'👤',col:'#3b82f6'},
    {n:2,pre:'$',suf:'M+',label:'Tracked Monthly',icon:'💳',col:'#8b5cf6'},
    {n:127,suf:'',label:'Built-in Categories',    icon:'🏷️',col:'#f97316'},
    {n:99,suf:'.9%',label:'Uptime SLA',           icon:'⚡',col:'#10b981'},
  ];
  return (
    <section ref={ref} style={{padding:'0 32px 80px',position:'relative',zIndex:2}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22}}>
        {stats.map((s,i)=>(
          <div key={i} style={{
            padding:'1.5px',borderRadius:18,
            background:`linear-gradient(135deg,${s.col}77,${s.col}26,${s.col}60)`,
            backgroundSize:'200% 200%',
            animation:`borderFlow 5s ease-in-out infinite,${GLOW_ANIMS[i]} 4.5s ${i*.5}s ease-in-out infinite`,
            opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(30px)',
            transition:`opacity .6s ${i*.12}s ease,transform .6s ${i*.12}s ease`,
          }}>
            <div style={{background:'linear-gradient(148deg,rgba(6,9,30,.97),rgba(3,5,20,1))',borderRadius:16.5,padding:'24px 20px',backdropFilter:'blur(16px)',textAlign:'center',animation:'innerBreathe 5s ease-in-out infinite'}}>
              <div style={{fontSize:30,marginBottom:9,animation:'iconGlow 3s ease-in-out infinite'}}>{s.icon}</div>
              <div style={{fontSize:'1.95rem',fontWeight:800,color:'#fff',letterSpacing:'-.02em',lineHeight:1}}>
                {vis&&<CountUp to={s.n} prefix={s.pre||''} suffix={s.suf} dur={1400}/>}
              </div>
              <div style={{fontSize:12,color:'rgba(203,213,225,.88)',marginTop:7,fontWeight:500}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURE CARD  (visual only — motion handled by Card3D)
   ───────────────────────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, color, idx, extra }) {
  return (
    <div style={{
      padding:'1.5px',borderRadius:21,
      background:`linear-gradient(135deg,${color}90,${color}32,${color}70,${color}22,${color}80)`,
      backgroundSize:'300% 300%',
      animation:`borderFlow ${4.2+idx*.35}s ease-in-out infinite`,
      boxShadow:`0 0 45px ${color}50,0 24px 70px rgba(0,0,22,.85)`,
    }}>
      <div style={{
        background:'linear-gradient(148deg,rgba(7,11,38,.98),rgba(4,6,26,1))',
        borderRadius:19.5,padding:'32px 28px',height:'100%',
        backdropFilter:'blur(16px)',
        animation:'innerBreathe 7s ease-in-out infinite',
      }}>
        <div style={{
          width:58,height:58,borderRadius:16,marginBottom:22,
          background:`linear-gradient(135deg,${color}45,${color}20)`,
          border:`1.5px solid ${color}80`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:28,
          boxShadow:`0 0 30px ${color}60,0 0 60px ${color}28,inset 0 0 16px ${color}25`,
          animation:'iconGlow 4s ease-in-out infinite',
        }}>{icon}</div>
        <h3 style={{fontSize:18,fontWeight:700,color:'#f1f5f9',marginBottom:13,letterSpacing:'-.01em'}}>{title}</h3>
        <p style={{fontSize:14,lineHeight:1.72,color:'rgba(203,213,225,.9)'}}>{desc}</p>
        {extra&&(
          <div style={{marginTop:20,display:'flex',gap:8,flexWrap:'wrap'}}>
            {extra.map(t=>(
              <span key={t} style={{fontSize:11,padding:'4px 12px',borderRadius:99,fontWeight:600,background:`${color}28`,color,border:`1px solid ${color}70`,boxShadow:`0 0 12px ${color}30`}}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURES SECTION
   ───────────────────────────────────────────────────────────────────────────── */
function Features() {
  const [ref,vis] = useReveal(.08);
  const feats=[
    {icon:'🔐',title:'Secure User Accounts', color:'#3b82f6',desc:'Bank-grade AES-256 encryption protects every account. Multi-device sync with JWT authentication keeps your data safe across all platforms.',extra:['JWT Auth','Encrypted','Multi-device']},
    {icon:'💳',title:'Transaction Tracking',  color:'#8b5cf6',desc:'Log every income and expense instantly. Auto-categorize transactions with smart tagging and get a real-time picture of your cash flow.',extra:['Real-time','Auto-tag','CSV Import']},
    {icon:'🏷️',title:'Custom Categories',     color:'#f97316',desc:'Create unlimited spending categories that match your lifestyle. Color-code, nest, and filter them exactly how your brain works.',extra:['Unlimited','Color-coded','Filterable']},
    {icon:'📊',title:'Monthly Budgets',        color:'#06b6d4',desc:'Set per-category monthly budgets with visual ring charts. Get smart alerts before you overspend so you stay on track every month.',extra:['Ring charts','Alerts','Rollovers']},
    {icon:'📈',title:'Reports & Analytics',    color:'#10b981',desc:'Deep-dive into monthly summaries, category breakdowns, and trend analysis. Export to PDF or share with your accountant in one click.',extra:['PDF Export','Trend charts','Breakdown']},
  ];
  return (
    <section id="features" style={{padding:'80px 32px',position:'relative'}}>
      {/* Section glow pool */}
      <div style={{position:'absolute',left:'50%',top:'40%',transform:'translate(-50%,-50%)',width:'80%',height:'70%',background:'radial-gradient(ellipse,rgba(109,40,217,.08),transparent 65%)',filter:'blur(60px)',pointerEvents:'none'}}/>

      <div ref={ref} style={{textAlign:'center',marginBottom:58,opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(26px)',transition:'opacity .6s ease,transform .6s ease'}}>
        <div style={{display:'inline-block',padding:'5px 20px',borderRadius:99,marginBottom:18,border:'1px solid rgba(139,92,246,.55)',background:'rgba(109,40,217,.18)',fontSize:12,fontWeight:700,color:'rgba(192,168,255,.98)',letterSpacing:1}}>EVERYTHING YOU NEED</div>
        <h2 style={{fontSize:'clamp(1.9rem,4vw,2.9rem)',fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:16}}>
          Finance tools that actually<br/><span className="lp-grad-text">feel effortless</span>
        </h2>
        <p style={{fontSize:16,color:'rgba(203,213,225,.85)',maxWidth:500,margin:'0 auto'}}>Everything you need to take control of your financial life — beautifully designed and lightning fast.</p>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:28}}>
        {feats.slice(0,3).map((f,i)=>(
          <div key={i} style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(36px)',transition:`opacity .7s ${i*.12+.2}s ease,transform .7s ${i*.12+.2}s ease`}}>
            <Card3D idx={i} color={f.color}><FeatureCard {...f} idx={i}/></Card3D>
          </div>
        ))}
      </div>
      <div style={{maxWidth:760,margin:'28px auto 0',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:28}}>
        {feats.slice(3).map((f,i)=>(
          <div key={i} style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(36px)',transition:`opacity .7s ${(i+3)*.12+.2}s ease,transform .7s ${(i+3)*.12+.2}s ease`}}>
            <Card3D idx={i+3} color={f.color}><FeatureCard {...f} idx={i+3}/></Card3D>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PREVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function PreviewSection() {
  const [ref,vis] = useReveal(.1);
  return (
    <section id="analytics" style={{padding:'80px 32px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:'75%',height:'85%',background:'radial-gradient(ellipse,rgba(109,40,217,.14),transparent 65%)',filter:'blur(60px)',pointerEvents:'none'}}/>
      <div ref={ref} style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2,textAlign:'center',opacity:vis?1:0,transform:vis?'scale(1)':'scale(.93)',transition:'opacity .9s ease,transform .9s ease'}}>
        <div style={{display:'inline-block',padding:'5px 20px',borderRadius:99,marginBottom:18,border:'1px solid rgba(6,182,212,.55)',background:'rgba(6,182,212,.14)',fontSize:12,fontWeight:700,color:'rgba(34,211,238,.98)',letterSpacing:1}}>LIVE DASHBOARD PREVIEW</div>
        <h2 style={{fontSize:'clamp(1.9rem,4vw,2.8rem)',fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:16}}>Your entire financial life,<br/><span className="lp-grad-text">beautifully organized</span></h2>
        <p style={{fontSize:15,color:'rgba(203,213,225,.85)',marginBottom:48,maxWidth:480,margin:'0 auto 48px'}}>A real-time dashboard that puts every number you care about in one glance.</p>
        <div style={{display:'flex',justifyContent:'center'}}><DashboardMockup/></div>
        <div style={{display:'flex',justifyContent:'center',gap:22,marginTop:44,flexWrap:'wrap'}}>
          {[
            {label:'Avg. monthly savings',value:'$1,240',     color:'#10b981',icon:'💰',gi:4},
            {label:'Categories tracked',  value:'12 active',  color:'#8b5cf6',icon:'🏷️',gi:1},
            {label:'Budget adherence',    value:'87% on track',color:'#06b6d4',icon:'📊',gi:3},
          ].map((w,i)=>(
            <div key={i} style={{
              padding:'1.5px',borderRadius:15,
              background:`linear-gradient(135deg,${w.color}77,${w.color}30,${w.color}60)`,
              backgroundSize:'200% 200%',
              animation:`borderFlow ${4+i}s ease-in-out infinite,${GLOW_ANIMS[w.gi]} ${5+i}s ${i*.4}s ease-in-out infinite,floatWidget ${5+i}s ${i*.8}s ease-in-out infinite`,
            }}>
              <div style={{background:'rgba(6,9,32,.94)',borderRadius:13.5,padding:'16px 24px',display:'flex',alignItems:'center',gap:14,backdropFilter:'blur(14px)',animation:'innerBreathe 5s ease-in-out infinite'}}>
                <span style={{fontSize:24}}>{w.icon}</span>
                <div style={{textAlign:'left'}}>
                  <div style={{fontSize:11,color:'rgba(203,213,225,.82)',marginBottom:2}}>{w.label}</div>
                  <div style={{fontSize:17,fontWeight:700,color:w.color}}>{w.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOW IT WORKS
   ───────────────────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const [ref,vis] = useReveal(.1);
  const steps=[
    {n:'01',title:'Create Your Account',   desc:'Sign up in under 60 seconds — no credit card, no commitment. Your data is encrypted from day one.',        icon:'🔐',col:'#8b5cf6'},
    {n:'02',title:'Log Your Transactions', desc:'Add income and expenses manually or import from a CSV. Assign categories and notes to every entry.',       icon:'💳',col:'#06b6d4'},
    {n:'03',title:'Set Monthly Budgets',   desc:'Define spending limits per category. Visual ring charts show exactly how much headroom you have left.',    icon:'📊',col:'#f97316'},
    {n:'04',title:'Discover Smart Insights',desc:'Monthly reports reveal trends, category breakdowns, and savings opportunities tailored to your spending.',icon:'📈',col:'#10b981'},
  ];
  const CFLOATS=['cf0','cf1','cf2','cf3'];
  return (
    <section id="how-it-works" style={{padding:'80px 32px'}}>
      <div ref={ref} style={{maxWidth:1100,margin:'0 auto',opacity:vis?1:0,transition:'opacity .6s ease'}}>
        <div style={{textAlign:'center',marginBottom:58}}>
          <div style={{display:'inline-block',padding:'5px 20px',borderRadius:99,marginBottom:18,border:'1px solid rgba(16,185,129,.55)',background:'rgba(16,185,129,.14)',fontSize:12,fontWeight:700,color:'rgba(52,211,153,.98)',letterSpacing:1}}>HOW IT WORKS</div>
          <h2 style={{fontSize:'clamp(1.9rem,4vw,2.8rem)',fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:14}}>Up and running in<br/><span className="lp-grad-text">4 simple steps</span></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22}}>
          {steps.map((s,i)=>(
            <div key={i} style={{position:'relative',opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(30px)',transition:`opacity .6s ${i*.15+.1}s ease,transform .6s ${i*.15+.1}s ease`}}>
              {i<steps.length-1&&(
                <div style={{position:'absolute',top:36,left:'calc(100% - 10px)',width:'calc(100% - 22px)',height:2,zIndex:0,background:`linear-gradient(90deg,${s.col}70,${steps[i+1].col}70)`,boxShadow:`0 0 10px ${s.col}55`}}/>
              )}
              <div style={{
                padding:'1.5px',borderRadius:19,position:'relative',zIndex:1,
                background:`linear-gradient(135deg,${s.col}77,${s.col}26,${s.col}60)`,
                backgroundSize:'200% 200%',
                animation:`borderFlow ${5+i*.4}s ease-in-out infinite,${GLOW_ANIMS[i]||GLOW_ANIMS[0]} ${5.5+i*.5}s ${i*.3}s ease-in-out infinite,${CFLOATS[i]} ${6.5+i*.5}s ${i*.35}s ease-in-out infinite`,
              }}>
                <div style={{background:'linear-gradient(148deg,rgba(7,11,38,.98),rgba(4,6,26,1))',borderRadius:17.5,padding:'26px 20px',backdropFilter:'blur(16px)',textAlign:'center',animation:'innerBreathe 5s ease-in-out infinite'}}>
                  <div style={{width:62,height:62,borderRadius:99,margin:'0 auto 16px',background:`linear-gradient(135deg,${s.col}40,${s.col}18)`,border:`2px solid ${s.col}70`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:27,boxShadow:`0 0 28px ${s.col}55,inset 0 0 14px ${s.col}22`,animation:'iconGlow 4s ease-in-out infinite'}}>{s.icon}</div>
                  <div style={{fontSize:11,fontWeight:700,color:s.col,letterSpacing:1.2,marginBottom:9}}>{s.n}</div>
                  <h3 style={{fontSize:15,fontWeight:700,color:'#f1f5f9',marginBottom:10,lineHeight:1.3}}>{s.title}</h3>
                  <p style={{fontSize:12.5,color:'rgba(203,213,225,.87)',lineHeight:1.65}}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CTA
   ───────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  const [ref,vis] = useReveal(.2);
  return (
    <section style={{padding:'60px 32px 88px',position:'relative'}}>
      <div ref={ref} style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{
          padding:'1.5px',borderRadius:26,
          background:'linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4,#6366f1,#8b5cf6,#6d28d9)',
          backgroundSize:'300% 300%',
          animation:`borderFlow 4s ease-in-out infinite,cardGlow1 4s ease-in-out infinite`,
          opacity:vis?1:0,transform:vis?'scale(1)':'scale(.93)',
          transition:'opacity .8s ease,transform .8s ease',
        }}>
          <div style={{borderRadius:24.5,padding:'60px 52px',background:'linear-gradient(148deg,rgba(8,12,42,.97),rgba(4,6,26,.99))',backdropFilter:'blur(20px)',textAlign:'center',position:'relative',overflow:'hidden',animation:'innerBreathe 6s ease-in-out infinite'}}>
            <div style={{position:'absolute',top:'-35%',left:'50%',transform:'translateX(-50%)',width:'85%',height:'65%',background:'radial-gradient(ellipse,rgba(139,92,246,.25),transparent 70%)',filter:'blur(45px)',pointerEvents:'none'}}/>
            <div style={{fontSize:40,marginBottom:18,animation:'iconGlow 3s ease-in-out infinite'}}>🚀</div>
            <h2 style={{fontSize:'clamp(1.8rem,4vw,2.7rem)',fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:16}}>Start your financial journey<br/><span className="lp-grad-text">today — for free</span></h2>
            <p style={{fontSize:16,color:'rgba(203,213,225,.85)',maxWidth:460,margin:'0 auto 38px',lineHeight:1.72}}>Join thousands of people who've taken control of their money. No cost, no commitment.</p>
            <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none',padding:'15px 36px',borderRadius:14,fontWeight:700,fontSize:16,color:'#fff',background:'linear-gradient(135deg,#6d28d9,#8b5cf6,#06b6d4)',backgroundSize:'200% 200%',animation:'gradShift 4s ease-in-out infinite,btnPulse 2.8s ease-in-out infinite'}}>Create Free Account →</Link>
              <Link to="/login" style={{textDecoration:'none',padding:'15px 30px',borderRadius:14,fontWeight:600,fontSize:15,color:'rgba(220,230,245,.92)',border:'1px solid rgba(139,92,246,.55)',background:'rgba(109,40,217,.14)',backdropFilter:'blur(10px)'}}>Already have an account?</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{position:'relative',padding:'0 32px 36px'}}>
      <div style={{height:'1px',marginBottom:34,background:'linear-gradient(90deg,transparent,#8b5cf660,#06b6d460,#6366f160,transparent)',backgroundSize:'300% 100%',animation:'navLine 5s ease-in-out infinite'}}/>
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:22}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#6d28d9,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#fff',boxShadow:'0 0 16px rgba(139,92,246,.55)'}}>$</div>
          <div>
            <div style={{color:'rgba(220,230,245,.9)',fontWeight:700,fontSize:14}}>FinanceBudget</div>
            <div style={{fontSize:10,color:'rgba(139,92,246,.75)'}}>Smart money, effortlessly.</div>
          </div>
        </div>
        <div style={{display:'flex',gap:28}}>
          {['Features','How It Works','Privacy','Terms'].map(l=>(
            <a key={l} href="#" className="lp-nav-link" style={{fontSize:13}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:12,color:'rgba(100,116,139,.65)'}}>© {new Date().getFullYear()} FinanceBudget. Built with ❤️</div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="lp-scroll" style={{background:'#020914',minHeight:'100vh',color:'#fff',overflowX:'hidden',fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <style>{CSS}</style>
      <Nav/><Hero/><Stats/><Features/><PreviewSection/><HowItWorks/><CTASection/><Footer/>
    </div>
  );
}
