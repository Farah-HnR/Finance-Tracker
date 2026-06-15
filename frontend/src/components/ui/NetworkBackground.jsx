import { useEffect, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rand  = (a, b) => Math.random() * (b - a) + a;
const lerp  = (a, b, t) => a + (b - a) * t;
const rgba  = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
};
const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
};

// ─── Account Node ─────────────────────────────────────────────────────────────
const ACCOUNT_DEFS = [
  { label:"Savings",    icon:"⬡", color:"#0ea5e9", accent:"#38bdf8" },
  { label:"Income",     icon:"↑",  color:"#10b981", accent:"#34d399" },
  { label:"Checking",   icon:"⊞",  color:"#3b82f6", accent:"#60a5fa" },
  { label:"Investment", icon:"↗",  color:"#06b6d4", accent:"#22d3ee" },
  { label:"Credit",     icon:"▣",  color:"#8b5cf6", accent:"#a78bfa" },
  { label:"Expenses",   icon:"↓",  color:"#a855f7", accent:"#c084fc" },
];

class AccountNode {
  constructor(fx, fy, w, h, idx) {
    this.bx = fx * w; this.by = fy * h;
    this.x  = this.bx; this.y  = this.by;
    this.def = ACCOUNT_DEFS[idx];
    this.phase = rand(0, Math.PI*2);
    this.ps    = rand(0.008, 0.018);
    this.r     = 24;
    this.bal   = `₹${Math.round(rand(10,200))}K`;
  }
  update() {
    this.phase += this.ps;
    this.x = this.bx + Math.sin(this.phase * 0.7) * 9;
    this.y = this.by + Math.cos(this.phase * 0.5) * 7;
  }
  draw(ctx, ox, oy) {
    const x = this.x+ox, y = this.y+oy;
    const pulse = 0.55 + Math.sin(this.phase) * 0.45;
    const { color, accent, label, icon } = this.def;

    // Ambient rings
    [5,3,1.5].forEach((m,i) => {
      const gr = this.r * m * pulse;
      const g = ctx.createRadialGradient(x,y,0,x,y,gr);
      g.addColorStop(0, rgba(color, (0.055-i*0.012)*pulse));
      g.addColorStop(1, rgba(color, 0));
      ctx.beginPath(); ctx.arc(x,y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    });

    // Orbit dashes
    ctx.save();
    ctx.translate(x,y); ctx.rotate(this.phase*0.3);
    ctx.beginPath(); ctx.arc(0,0,this.r+9,0,Math.PI*2);
    ctx.strokeStyle = rgba(accent,0.18); ctx.lineWidth=1;
    ctx.setLineDash([3,9]); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();

    // Core disc
    const cg = ctx.createRadialGradient(x-this.r*.3, y-this.r*.3, 0, x, y, this.r);
    cg.addColorStop(0, rgba(accent,0.92));
    cg.addColorStop(1, rgba(color,0.75));
    ctx.beginPath(); ctx.arc(x,y,this.r,0,Math.PI*2);
    ctx.fillStyle=cg; ctx.fill();
    ctx.strokeStyle=rgba(accent,0.85); ctx.lineWidth=1.5; ctx.stroke();

    // Icon
    ctx.fillStyle="rgba(255,255,255,0.92)";
    ctx.font="bold 12px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(icon, x, y-1);

    // Labels
    ctx.font="bold 7.5px system-ui"; ctx.fillStyle=rgba(accent,0.95);
    ctx.textBaseline="top"; ctx.fillText(label, x, y+this.r+7);
    ctx.font="6.5px system-ui"; ctx.fillStyle="rgba(255,255,255,0.45)";
    ctx.fillText(this.bal, x, y+this.r+17);
    ctx.textBaseline="alphabetic";
  }
}

// ─── Transaction Pulse ────────────────────────────────────────────────────────
class Pulse {
  constructor(a, b, type) {
    this.a=a; this.b=b; this.type=type;
    this.t=0; this.speed=rand(0.003,0.008);
    this.done=false;
    const income  = ["#10b981","#06b6d4","#34d399"];
    const expense = ["#a855f7","#ef4444","#c026d3"];
    this.color=(type==="income" ? income : expense)[Math.floor(Math.random()*3)];
    this.size=rand(2.5,4.5);
  }
  update() { this.t+=this.speed; if(this.t>=1) this.done=true; }
  draw(ctx, ox, oy) {
    const ax=this.a.x+ox, ay=this.a.y+oy;
    const bx=this.b.x+ox, by=this.b.y+oy;
    const cpx=(ax+bx)/2+(by-ay)*0.22, cpy=(ay+by)/2-(bx-ax)*0.22;
    const m=1-this.t;
    const x=m*m*ax+2*m*this.t*cpx+this.t*this.t*bx;
    const y=m*m*ay+2*m*this.t*cpy+this.t*this.t*by;
    const fade=Math.sin(this.t*Math.PI);

    const g=ctx.createRadialGradient(x,y,0,x,y,this.size*5);
    g.addColorStop(0, rgba(this.color,0.75*fade));
    g.addColorStop(1, rgba(this.color,0));
    ctx.beginPath(); ctx.arc(x,y,this.size*5,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,this.size,0,Math.PI*2);
    ctx.fillStyle=rgba(this.color,0.95*fade); ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,this.size*.38,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${0.92*fade})`; ctx.fill();
  }
}

// ─── Floating Analytics Widget ────────────────────────────────────────────────
const CATS   = ["🛒 Food","🏠 Rent","🚗 Travel","💊 Health","🎯 Savings","🎬 Fun","💡 Bills"];
const MONTHS = ["J","F","M","A","M","J","J"];
const WCOLORS= ["#0ea5e9","#06b6d4","#8b5cf6","#6366f1","#10b981","#3b82f6","#a855f7"];

class AnalyticsWidget {
  constructor(x, y, type) {
    this.x=x; this.y=y; this.type=type;
    this.vx=rand(-0.07,0.07); this.vy=rand(-0.055,0.055);
    this.alpha=rand(0.38,0.7);
    this.phase=rand(0,Math.PI*2); this.ps=rand(0.006,0.014);
    this.color=WCOLORS[Math.floor(Math.random()*WCOLORS.length)];
    this.accent="#22d3ee";

    // Data
    this.progress = rand(0.28,0.94);
    this.targetP  = rand(0.28,0.94);
    this.bars     = Array.from({length:7},()=>rand(0.15,1));
    this.barTgt   = this.bars.map(()=>rand(0.15,1));
    this.line     = Array.from({length:9},()=>rand(0.1,0.9));
    this.lineTgt  = this.line.map(()=>rand(0.1,0.9));
    this.cat      = CATS[Math.floor(Math.random()*CATS.length)];
    this.amount   = `₹${Math.round(rand(5,95))}K`;

    // Dimensions per type
    const dims = { ring:[68,68], bar:[88,54], line:[90,50], bubble:[62,62], timeline:[104,40] };
    [this.w, this.h] = dims[type] || [70,50];
  }

  update(cw, ch) {
    this.phase += this.ps;
    this.x += this.vx; this.y += this.vy;
    if(this.x < -this.w-20) this.x=cw+20;
    if(this.x > cw+20) this.x=-this.w-20;
    if(this.y < -this.h-20) this.y=ch+20;
    if(this.y > ch+20) this.y=-this.h-20;

    this.progress = lerp(this.progress, this.targetP, 0.004);
    this.bars = this.bars.map((b,i)=>lerp(b,this.barTgt[i],0.003));
    this.line = this.line.map((p,i)=>lerp(p,this.lineTgt[i],0.002));
    if(Math.random()<0.003) this.targetP=rand(0.28,0.94);
    if(Math.random()<0.002) this.barTgt=this.barTgt.map(()=>rand(0.15,1));
    if(Math.random()<0.002) this.lineTgt=this.lineTgt.map(()=>rand(0.1,0.9));
  }

  draw(ctx) {
    const a = this.alpha*(0.8+Math.sin(this.phase)*0.2);
    const {x,y,w,h,type,color} = this;
    ctx.save(); ctx.globalAlpha=a;

    // Glass card
    rr(ctx,x,y,w,h,8);
    ctx.fillStyle="rgba(4,10,30,0.65)"; ctx.fill();
    rr(ctx,x,y,w,h,8);
    ctx.strokeStyle=rgba(color,0.32); ctx.lineWidth=0.8; ctx.stroke();

    // Corner accent line
    ctx.beginPath(); ctx.moveTo(x+8,y); ctx.lineTo(x+w*.45,y);
    ctx.strokeStyle=rgba(color,0.7); ctx.lineWidth=1.5; ctx.stroke();

    if(type==="ring")     this._ring(ctx);
    if(type==="bar")      this._bar(ctx);
    if(type==="line")     this._line(ctx);
    if(type==="bubble")   this._bubble(ctx);
    if(type==="timeline") this._timeline(ctx);

    ctx.restore();
  }

  _title(ctx, text) {
    ctx.fillStyle="rgba(148,196,255,0.75)";
    ctx.font="bold 7px system-ui"; ctx.textAlign="left"; ctx.textBaseline="top";
    ctx.fillText(text, this.x+7, this.y+8);
  }

  _ring(ctx) {
    this._title(ctx, "Budget");
    const cx=this.x+this.w/2, cy=this.y+this.h/2+5;
    const r=this.h*0.28;

    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle="rgba(20,40,90,0.5)"; ctx.lineWidth=r*.3; ctx.stroke();

    const sa=-Math.PI/2, ea=sa+this.progress*Math.PI*2;
    const lg=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
    lg.addColorStop(0,rgba(this.color,0.95));
    lg.addColorStop(1,rgba(this.accent,0.95));
    ctx.beginPath(); ctx.arc(cx,cy,r,sa,ea);
    ctx.strokeStyle=lg; ctx.lineWidth=r*.3; ctx.lineCap="round"; ctx.stroke(); ctx.lineCap="butt";

    ctx.fillStyle="rgba(255,255,255,0.92)";
    ctx.font=`bold ${r*.48}px system-ui`; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(`${Math.round(this.progress*100)}%`,cx,cy);
    ctx.fillStyle=rgba(this.color,0.7);
    ctx.font=`5.5px system-ui`;
    ctx.fillText(this.cat.split(" ")[1]||"",cx,cy+r*.75);
    ctx.textBaseline="alphabetic";
  }

  _bar(ctx) {
    this._title(ctx,"Monthly Spend");
    const pad=7, bw=(this.w-pad*2)/this.bars.length;
    const maxH=this.h-24, bY=this.y+this.h-6;
    this.bars.forEach((b,i)=>{
      const bh=b*maxH, bx=this.x+pad+i*bw;
      const g=ctx.createLinearGradient(bx,bY,bx,bY-maxH);
      g.addColorStop(0,rgba(this.color,0.25)); g.addColorStop(1,rgba(this.color,0.85));
      ctx.fillStyle=g; ctx.fillRect(bx+1,bY-bh,bw-2,bh);
      ctx.fillStyle=rgba(this.accent,0.7); ctx.fillRect(bx+1,bY-bh,bw-2,1.5);
      ctx.fillStyle="rgba(148,196,255,0.45)";
      ctx.font="5px system-ui"; ctx.textAlign="center"; ctx.textBaseline="top";
      ctx.fillText(MONTHS[i],bx+bw/2,bY+1);
    });
    ctx.textBaseline="alphabetic";
  }

  _line(ctx) {
    this._title(ctx,"Balance Trend");
    const pad=8, cW=this.w-pad*2, cH=this.h-22, bY=this.y+this.h-7;
    const pts=this.line;

    ctx.beginPath();
    pts.forEach((p,i)=>{ const px=this.x+pad+i/(pts.length-1)*cW, py=bY-p*cH; i?ctx.lineTo(px,py):ctx.moveTo(px,py); });
    ctx.lineTo(this.x+pad+cW,bY); ctx.lineTo(this.x+pad,bY); ctx.closePath();
    const ag=ctx.createLinearGradient(0,this.y+18,0,bY);
    ag.addColorStop(0,rgba(this.color,0.22)); ag.addColorStop(1,rgba(this.color,0));
    ctx.fillStyle=ag; ctx.fill();

    ctx.beginPath();
    pts.forEach((p,i)=>{ const px=this.x+pad+i/(pts.length-1)*cW, py=bY-p*cH; i?ctx.lineTo(px,py):ctx.moveTo(px,py); });
    ctx.strokeStyle=rgba(this.color,0.9); ctx.lineWidth=1.2; ctx.stroke();

    pts.forEach((p,i)=>{
      const px=this.x+pad+i/(pts.length-1)*cW, py=bY-p*cH;
      ctx.beginPath(); ctx.arc(px,py,1.5,0,Math.PI*2);
      ctx.fillStyle=rgba(this.accent,0.9); ctx.fill();
    });
  }

  _bubble(ctx) {
    const cx=this.x+this.w/2, cy=this.y+this.h/2+2;
    const r=Math.min(this.w,this.h)*.35;
    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.3,0,cx,cy,r);
    g.addColorStop(0,rgba(this.color,0.28)); g.addColorStop(1,rgba(this.color,0.06));
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle=rgba(this.color,0.45); ctx.lineWidth=0.8; ctx.stroke();

    ctx.fillStyle="rgba(255,255,255,0.88)";
    ctx.font="bold 7.5px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(this.cat,cx,cy-5);
    ctx.fillStyle=rgba(this.color,0.85); ctx.font="6.5px system-ui";
    ctx.fillText(this.amount,cx,cy+6);
    ctx.textBaseline="alphabetic";
  }

  _timeline(ctx) {
    this._title(ctx,"Transactions");
    const cy=this.y+this.h*.65, pad=10;
    const pts=["+₹85K","-₹2K","+₹12K","-₹5K","+₹9K"];
    const isIn=[true,false,true,false,true];

    ctx.beginPath(); ctx.moveTo(this.x+pad,cy); ctx.lineTo(this.x+this.w-pad,cy);
    ctx.strokeStyle=rgba(this.color,0.25); ctx.lineWidth=0.8; ctx.stroke();

    pts.forEach((amt,i)=>{
      const px=this.x+pad+i/(pts.length-1)*(this.w-pad*2);
      const c=isIn[i]?"#10b981":"#a855f7";
      ctx.beginPath(); ctx.arc(px,cy,3.5,0,Math.PI*2);
      ctx.fillStyle=rgba(c,0.9); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.4)"; ctx.lineWidth=0.5; ctx.stroke();
      ctx.fillStyle=rgba(c,0.85); ctx.font="5px system-ui";
      ctx.textAlign="center"; ctx.textBaseline=i%2?"top":"bottom";
      ctx.fillText(amt,px,i%2?cy+7:cy-5);
    });
    ctx.textBaseline="alphabetic";
  }
}

// ─── Ambient Data Particle ────────────────────────────────────────────────────
class DataParticle {
  constructor(w,h,col) {
    this.x=col; this.y=rand(0,h);
    this.vy=rand(0.3,0.9)*(Math.random()>.5?1:-1);
    this.r=rand(0.6,1.8);
    this.color=["#0ea5e9","#22d3ee","#3b82f6","#6366f1","#8b5cf6"][Math.floor(Math.random()*5)];
    this.a=rand(0.06,0.28);
    this.ph=rand(0,Math.PI*2); this.phs=rand(0.01,0.025);
    this.w=w; this.h=h;
  }
  update() {
    this.y+=this.vy; this.ph+=this.phs;
    if(this.y<-5) this.y=this.h+5;
    if(this.y>this.h+5) this.y=-5;
  }
  draw(ctx) {
    const a=this.a*(0.4+Math.sin(this.ph)*0.6);
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=rgba(this.color,a); ctx.fill();
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NetworkBackground() {
  const cvs=useRef(null), st=useRef({});

  useEffect(()=>{
    const canvas=cvs.current, ctx=canvas.getContext("2d");
    const s=st.current;

    const ROUTES=[
      [4,2,"income"],[2,0,"income"],[2,4,"expense"],
      [4,3,"expense"],[0,3,"income"],[4,0,"income"],
      [2,5,"expense"],[0,1,"income"],[3,5,"expense"],
    ];

    const init=()=>{
      const w=canvas.width, h=canvas.height;

      s.nodes=[
        new AccountNode(0.13,0.22,w,h,0), // Savings   TL
        new AccountNode(0.87,0.18,w,h,3), // Investment TR
        new AccountNode(0.91,0.58,w,h,2), // Checking  R
        new AccountNode(0.74,0.89,w,h,5), // Expenses  BR
        new AccountNode(0.14,0.80,w,h,1), // Income    BL
        new AccountNode(0.08,0.48,w,h,4), // Credit    L
      ];

      s.widgets=[
        new AnalyticsWidget(w*.02, h*.06,  "ring"),
        new AnalyticsWidget(w*.76, h*.03,  "bar"),
        new AnalyticsWidget(w*.03, h*.54,  "line"),
        new AnalyticsWidget(w*.80, h*.70,  "bubble"),
        new AnalyticsWidget(w*.32, h*.03,  "timeline"),
        new AnalyticsWidget(w*.58, h*.88,  "ring"),
        new AnalyticsWidget(w*.02, h*.36,  "bar"),
        new AnalyticsWidget(w*.79, h*.38,  "line"),
        new AnalyticsWidget(w*.52, h*.04,  "bubble"),
        new AnalyticsWidget(w*.20, h*.91,  "timeline"),
        new AnalyticsWidget(w*.68, h*.05,  "ring"),
        new AnalyticsWidget(w*.88, h*.48,  "bar"),
      ];

      const cols=[w*.02,w*.25,w*.5,w*.75,w*.97];
      s.streams=cols.flatMap(c=>Array.from({length:14},()=>new DataParticle(w,h,c+rand(-12,12))));

      s.bgDots=Array.from({length:80},()=>({
        x:rand(0,w), y:rand(0,h),
        vx:rand(-.04,.04), vy:rand(-.04,.04),
        r:rand(.4,1.6),
        color:["#1d6ef5","#0ea5e9","#22d3ee","#6366f1","#8b5cf6"][Math.floor(Math.random()*5)],
        a:rand(.04,.22), ph:rand(0,Math.PI*2),
      }));

      s.pulses=[];
    };

    const resize=()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; init(); };
    resize();
    window.addEventListener("resize",resize);

    s.mouse={x:0,y:0}; s.off={x:0,y:0}; s.frame=0;
    const onMouse=e=>{ s.mouse.x=(e.clientX/window.innerWidth-.5)*24; s.mouse.y=(e.clientY/window.innerHeight-.5)*24; };
    window.addEventListener("mousemove",onMouse);

    const loop=()=>{
      const w=canvas.width, h=canvas.height;
      s.frame++;
      s.off.x=lerp(s.off.x,s.mouse.x,.038);
      s.off.y=lerp(s.off.y,s.mouse.y,.038);
      const ox=s.off.x, oy=s.off.y;

      // ── background ──
      ctx.clearRect(0,0,w,h);
      const bg=ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,"#030912"); bg.addColorStop(.5,"#050d1f"); bg.addColorStop(1,"#04071a");
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

      // ambient area glows
      [
        {x:.15,y:.20,c:"#1d4ed8",r:.28},{x:.85,y:.25,c:"#7c3aed",r:.22},
        {x:.88,y:.65,c:"#0891b2",r:.20},{x:.12,y:.78,c:"#10b981",r:.18},
        {x:.50,y:.50,c:"#1e3a6e",r:.18},
      ].forEach(({x,y,c,r})=>{
        const g=ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,r*w);
        g.addColorStop(0,rgba(c,.09)); g.addColorStop(1,rgba(c,0));
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      });

      // hex grid
      const hs=48;
      ctx.strokeStyle="rgba(96,165,250,0.038)"; ctx.lineWidth=.6;
      const hcols=Math.ceil(w/(hs*1.5))+2, hrows=Math.ceil(h/(hs*Math.sqrt(3)))+2;
      for(let row=-1;row<hrows;row++) for(let col=-1;col<hcols;col++){
        const hx=col*hs*1.5, hy=row*hs*Math.sqrt(3)+(col%2?hs*Math.sqrt(3)/2:0);
        ctx.beginPath();
        for(let i=0;i<6;i++){ const a=(Math.PI/3)*i-Math.PI/6; ctx.lineTo(hx+hs*Math.cos(a),hy+hs*Math.sin(a)); }
        ctx.closePath(); ctx.stroke();
      }

      // data streams
      s.streams.forEach(p=>{ p.update(); p.draw(ctx); });

      // bg dots
      s.bgDots.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.ph+=.012;
        if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=rgba(p.color,p.a*(0.5+Math.sin(p.ph)*.5)); ctx.fill();
      });

      // floating widgets
      s.widgets.forEach(wg=>{ wg.update(w,h); wg.draw(ctx); });

      // update nodes
      s.nodes.forEach(n=>n.update());

      // route lines
      ROUTES.forEach(([ai,bi,type])=>{
        const a=s.nodes[ai], b=s.nodes[bi];
        const ax=a.x+ox,ay=a.y+oy, bx=b.x+ox,by=b.y+oy;
        const cpx=(ax+bx)/2+(by-ay)*.18, cpy=(ay+by)/2-(bx-ax)*.18;
        const c=type==="income"?"#10b981":"#8b5cf6";
        ctx.beginPath(); ctx.moveTo(ax,ay); ctx.quadraticCurveTo(cpx,cpy,bx,by);
        ctx.strokeStyle=rgba(c,.07); ctx.lineWidth=1;
        ctx.setLineDash([2,14]); ctx.stroke(); ctx.setLineDash([]);
      });

      // nodes
      s.nodes.forEach(n=>n.draw(ctx,ox,oy));

      // spawn pulses
      if(s.frame%30===0){
        const rt=ROUTES[Math.floor(Math.random()*ROUTES.length)];
        s.pulses.push(new Pulse(s.nodes[rt[0]],s.nodes[rt[1]],rt[2]));
      }
      s.pulses=s.pulses.filter(p=>!p.done);
      s.pulses.forEach(p=>{ p.update(); p.draw(ctx,ox,oy); });

      // soft center vignette for form readability
      const vg=ctx.createRadialGradient(w/2,h/2,h*.12,w/2,h/2,h*.7);
      vg.addColorStop(0,"rgba(3,9,18,0)");
      vg.addColorStop(.52,"rgba(3,9,18,0)");
      vg.addColorStop(1,"rgba(3,9,18,0.68)");
      ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);

      s.raf=requestAnimationFrame(loop);
    };
    s.raf=requestAnimationFrame(loop);

    return ()=>{ cancelAnimationFrame(s.raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMouse); };
  },[]);

  return <canvas ref={cvs} className="fixed inset-0 w-full h-full" style={{zIndex:0}} />;
}
