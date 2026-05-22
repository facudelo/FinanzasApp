import { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from "react";
import { supabase } from "./supabase";

const ICONS = {
  home:`<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  zap:`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  wifi:`<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`,
  cart:`<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>`,
  coffee:`<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>`,
  users:`<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>`,
  gift:`<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>`,
  music:`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
  film:`<rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>`,
  heart:`<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>`,
  activity:`<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  book:`<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>`,
  briefcase:`<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>`,
  dollar:`<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  card:`<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
  trend:`<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
  archive:`<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>`,
  sun:`<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>`,
  tool:`<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
  scissors:`<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/>`,
  smile:`<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>`,
  tv:`<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>`,
  flag:`<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
  pin:`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>`,
  pkg:`<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  plane:`<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>`,
  globe:`<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>`,
  logout:`<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
};

const ICON_KEYS = Object.keys(ICONS);
const COLORS = ["#4E9EF5","#34C88A","#F5A623","#E05C5C","#A78BFA","#F472B6","#FB923C","#2DD4BF","#FACC15","#94A3B8","#60A5FA","#4ADE80","#C084FC","#F87171","#38BDF8"];
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const now = new Date();

const MEDIOS_PAGO_BASE = [
  { id:"efectivo",      label:"Efectivo",            color:"#34C88A" },
  { id:"transferencia", label:"Transferencia",        color:"#38BDF8" },
  { id:"visa",          label:"Visa Crédito",         color:"#1A1F71" },
  { id:"mastercard",    label:"Mastercard Crédito",   color:"#EB001B" },
  { id:"debito",        label:"Débito",               color:"#4E9EF5" },
  { id:"uala",          label:"Ualá",                 color:"#7B2FBE" },
  { id:"mp_debito",     label:"MP Débito",            color:"#00B1EA" },
  { id:"mp_credito",    label:"MP Crédito",           color:"#009EE3" },
];
const MEDIOS_PAGO = MEDIOS_PAGO_BASE;

// ─── TIPOS DE INGRESO ─────────────────────────────────────────────────────────
const TIPOS_INGRESO_DEFAULT = [
  {id:"sueldo_ars",  label:"Sueldo ARS",     icon:"dollar",   grupo:"ingreso"},
  {id:"sueldo_usd",  label:"Sueldo USD",     icon:"dollar",   grupo:"ingreso"},
  {id:"bono",        label:"Bono",           icon:"gift",     grupo:"ingreso"},
  {id:"aguinaldo",   label:"Aguinaldo",      icon:"gift",     grupo:"ingreso"},
  {id:"freelance",   label:"Freelance",      icon:"briefcase",grupo:"ingreso"},
  {id:"ahorros_ars", label:"Ahorros Pesos",  icon:"archive",  grupo:"ahorro"},
  {id:"ahorros_usd", label:"Ahorros USD",    icon:"dollar",   grupo:"ahorro"},
  {id:"broker",      label:"Broker",         icon:"briefcase",grupo:"ahorro"},
  {id:"vacaciones",  label:"Vacaciones",     icon:"plane",    grupo:"ahorro"},
  {id:"otros",       label:"Otros",          icon:"pkg",      grupo:"ingreso"},
];

// ─── PLATAFORMAS DE INVERSIÓN ─────────────────────────────────────────────────
const PLATAFORMAS_BASE = [
  { id:"binance",   label:"Binance",       color:"#F0B90B", icon:"trend"     },
  { id:"iol",       label:"IOL",           color:"#1565C0", icon:"briefcase" },
  { id:"cocos",     label:"Cocos Capital", color:"#FF6B35", icon:"trend"     },
  { id:"mp_inv",    label:"Mercado Pago",  color:"#00B1EA", icon:"dollar"    },
  { id:"usd_cash",  label:"USD Efectivo",  color:"#34C88A", icon:"dollar"    },
  { id:"pesos",     label:"Pesos (caja)",  color:"#A78BFA", icon:"archive"   },
  { id:"lemon",     label:"Lemon",         color:"#FFD700", icon:"dollar"    },
  { id:"balanz",    label:"Balanz",        color:"#2DD4BF", icon:"briefcase" },
];

const DEFAULT_CATS = [
  { id:"vivienda", label:"Vivienda", color:"#4E9EF5", icon:"home", items:[
    {id:"alquiler",label:"Alquiler",icon:"home"},
    {id:"expensas",label:"Expensas",icon:"home"},
    {id:"abl",label:"ABL / Impuestos",icon:"flag"},
    {id:"gas",label:"Gas",icon:"zap"},
    {id:"luz",label:"Luz",icon:"sun"},
    {id:"internet",label:"Internet / Cable",icon:"wifi"},
    {id:"mantenimiento",label:"Mantenimiento",icon:"tool"},
    {id:"electrodomesticos",label:"Electrodomésticos",icon:"tv"},
  ]},
  { id:"alimentacion", label:"Alimentación", color:"#34C88A", icon:"coffee", items:[
    {id:"supermercado",label:"Supermercado",icon:"cart"},
    {id:"verduleria",label:"Verdulería / Carnicería",icon:"pkg"},
    {id:"restaurante",label:"Restaurante",icon:"coffee"},
    {id:"delivery",label:"Delivery",icon:"pkg"},
    {id:"cafeteria",label:"Cafetería",icon:"coffee"},
  ]},
  { id:"transporte", label:"Transporte", color:"#F5A623", icon:"plane", items:[
    {id:"colectivo",label:"Colectivo / Subte",icon:"globe"},
    {id:"taxi",label:"Taxi / Remis",icon:"pin"},
    {id:"nafta",label:"Nafta",icon:"zap"},
    {id:"peaje",label:"Peaje / Estacionamiento",icon:"flag"},
    {id:"mantenimiento-auto",label:"Mantenimiento Auto",icon:"tool"},
  ]},
  { id:"salud", label:"Salud", color:"#E05C5C", icon:"heart", items:[
    {id:"obra-social",label:"Obra Social / Prepaga",icon:"heart"},
    {id:"medicamentos",label:"Medicamentos",icon:"activity"},
    {id:"consultas",label:"Consultas Médicas",icon:"users"},
    {id:"gimnasio",label:"Gimnasio",icon:"activity"},
  ]},
  { id:"ocio", label:"Ocio & Personal", color:"#A78BFA", icon:"music", items:[
    {id:"entretenimiento",label:"Entretenimiento",icon:"film"},
    {id:"streaming",label:"Streaming",icon:"tv"},
    {id:"salidas",label:"Salidas / Social",icon:"music"},
    {id:"ropa",label:"Ropa / Calzado",icon:"gift"},
    {id:"cuidado-personal",label:"Cuidado Personal",icon:"smile"},
    {id:"educacion",label:"Educación / Cursos",icon:"book"},
  ]},
  { id:"financiero", label:"Financiero", color:"#F472B6", icon:"card", items:[
    {id:"tarjeta-credito",label:"Tarjeta de Crédito",icon:"card"},
    {id:"cuotas",label:"Cuotas / Préstamos",icon:"dollar"},
    {id:"cuota-usd",label:"Cuota en Dólares (TC variable)",icon:"dollar"},
    {id:"seguros",label:"Seguros",icon:"briefcase"},
    {id:"inversiones",label:"Inversiones",icon:"trend"},
  ]},
  { id:"ahorro", label:"Ahorro", color:"#2DD4BF", icon:"archive", items:[
    {id:"ahorro-pesos",label:"Ahorro en Pesos",icon:"archive"},
    {id:"ahorro-usd",label:"Ahorro en USD",icon:"dollar"},
    {id:"fondo-emergencia",label:"Fondo de Emergencia",icon:"archive"},
    {id:"vacaciones",label:"Vacaciones",icon:"plane"},
  ]},
  { id:"otros", label:"Otros", color:"#94A3B8", icon:"pkg", items:[
    {id:"mascotas",label:"Mascotas",icon:"heart"},
    {id:"regalos",label:"Regalos",icon:"gift"},
    {id:"donaciones",label:"Donaciones",icon:"dollar"},
    {id:"imprevistos",label:"Imprevistos",icon:"tool"},
  ]},
];

const C = {
  bg:"#0D0F14", bg2:"#13161E", bg3:"#1A1E2A", bg4:"#222638",
  bd:"rgba(255,255,255,0.07)", bd2:"rgba(255,255,255,0.12)",
  t:"#F0F2F8", t2:"#8B91A8", t3:"#555D75",
  green:"#34C88A", red:"#E05C5C", blue:"#4E9EF5", purple:"#A78BFA", amber:"#F5A623", warning:"#F5A623",
};

const C_LIGHT = {
  bg:"#F4F6FB", bg2:"#FFFFFF", bg3:"#EEF1F8", bg4:"#E3E8F0",
  bd:"rgba(0,0,0,0.08)", bd2:"rgba(0,0,0,0.13)",
  t:"#1A1E2A", t2:"#4A5068", t3:"#8891A8",
  green:"#1A9E5F", red:"#C0392B", blue:"#2563EB", purple:"#7C3AED", amber:"#D97706", warning:"#D97706",
};

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#C9A84C"/><stop offset="50%" stop-color="#F0C040"/><stop offset="100%" stop-color="#A0782A"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="#0D0F14"/><text x="50" y="68" text-anchor="middle" font-size="62" font-weight="900" fill="url(#g1)" font-family="Georgia,serif">$</text></svg>`;
const LOGO_URL = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`;

const gCSS = `*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg};color:${C.t};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.bd2};border-radius:4px}select option{background:${C.bg3}}@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes popIn{0%{opacity:0;transform:scale(0.92) translateY(6px)}100%{opacity:1;transform:scale(1) translateY(0)}}.card-anim{animation:fadeUp .35s ease both}.save-ok{animation:popIn .25s ease both}.fs-11{font-size:11px}.fs-13{font-size:13px}.fs-15{font-size:15px}.fs-18{font-size:18px}.fs-22{font-size:22px}@media(max-width:600px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}@media(min-width:601px){.show-mobile{display:none!important}}.skeleton{background:linear-gradient(90deg,${C.bg3} 25%,${C.bg4} 50%,${C.bg3} 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite;border-radius:8px}@keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes toastOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(0.95)}}.toast-enter{animation:toastIn .25s ease both}.toast-exit{animation:toastOut .2s ease both}@keyframes fabExpand{from{opacity:0;transform:scale(0.8) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}.fab-item{animation:fabExpand .2s ease both}`;


function Ic({ id, size=14, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[id]||ICONS.pkg }}/>;
}

function fmt(n, cur, tc) {
  const v = cur==="USD" ? n/tc : n;
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:cur==="USD"?"USD":"ARS",maximumFractionDigits:0}).format(v);
}

// Para transacciones individuales: usa el TC del momento si está disponible
function fmtTx(n, cur, tcNow, tcAtTime) {
  const tcToUse = cur==="USD" ? (tcAtTime||tcNow) : tcNow;
  const v = cur==="USD" ? n/tcToUse : n;
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:cur==="USD"?"USD":"ARS",maximumFractionDigits:0}).format(v);
}

const inp = {background:C.bg3,border:`1px solid ${C.bd2}`,color:C.t,borderRadius:7,padding:"8px 11px",fontSize:13,outline:"none",width:"100%"};
const sel = {...inp,cursor:"pointer"};

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
let _toastFn = null;
function useToast() {
  return _toastFn;
}
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastFn = (msg, type = "success", duration = 3000) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    };
    return () => { _toastFn = null; };
  }, []);
  const colors = { success: C.green, error: C.red, warning: C.warning, info: C.blue };
  const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
  return (
    <div style={{ position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-enter" style={{ background: C.bg2, border: `1px solid ${colors[t.type]}55`, borderRadius: 10, padding: "10px 18px", fontSize: 13, color: C.t, display: "flex", alignItems: "center", gap: 10, boxShadow: `0 4px 20px rgba(0,0,0,0.4)`, minWidth: 200, maxWidth: 340, pointerEvents: "auto" }}>
          <span style={{ color: colors[t.type], fontWeight: 600, fontSize: 15, lineHeight: 1 }}>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
function toast(msg, type = "success", duration = 3000) {
  if (_toastFn) _toastFn(msg, type, duration);
}

// ─── CONFIRM MODAL ─────────────────────────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel, danger }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div style={{ background: C.bg2, border: `1px solid ${C.bd2}`, borderRadius: 14, padding: 24, maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 14, color: C.t, marginBottom: 20, lineHeight: 1.6 }}>{msg}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn onClick={onCancel}>Cancelar</Btn>
          <Btn primary={!danger} danger={danger} onClick={onConfirm}>{danger ? "Eliminar" : "Confirmar"}</Btn>
        </div>
      </div>
    </div>
  );
}
function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = useCallback((msg, opts = {}) => new Promise(resolve => {
    setState({ msg, danger: opts.danger, resolve });
  }), []);
  const node = state ? (
    <ConfirmModal
      msg={state.msg}
      danger={state.danger}
      onConfirm={() => { state.resolve(true); setState(null); }}
      onCancel={() => { state.resolve(false); setState(null); }}
    />
  ) : null;
  return [confirm, node];
}

// ─── SKELETON CARD ─────────────────────────────────────────────────────────────
function SkeletonCard({ height = 80 }) {
  return <div className="skeleton" style={{ height, borderRadius: 14, border: `1px solid ${C.bd}` }} />;
}
function SkeletonMCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 18 }}>
      {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height={86} />)}
    </div>
  );
}


function Btn({ children, onClick, primary, small, danger, disabled, full }) {
  return <button onClick={onClick} disabled={disabled} style={{background:primary?C.blue:danger?C.red+"22":C.bg4,color:primary?"#fff":danger?C.red:C.t2,border:`1px solid ${primary?"transparent":danger?C.red+"44":C.bd2}`,borderRadius:7,padding:small?"5px 12px":"8px 18px",cursor:disabled?"not-allowed":"pointer",fontSize:small?12:13,fontWeight:500,whiteSpace:"nowrap",opacity:disabled?0.5:1,width:full?"100%":"auto"}}>{children}</button>;
}

function Pill({ color, icon, label }) {
  return <span style={{background:color+"22",color,fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>{icon&&<Ic id={icon} size={11} color={color}/>}{label}</span>;
}

function MCard({ label, value, color, accent, sub, icon, progress, progressMax, semaforo }) {
  const pct = (progress!=null&&progressMax>0) ? Math.min(Math.round((progress/progressMax)*100),100) : null;
  // semaforo: "green"|"amber"|"red"|null
  const semColor = semaforo==="green"?C.green:semaforo==="amber"?C.amber:semaforo==="red"?C.red:null;
  return <div className="card-anim" style={{background:`linear-gradient(135deg,${C.bg2} 60%,${color}0D 100%)`,borderRadius:14,padding:"18px 20px",flex:1,minWidth:130,border:`1px solid ${color}22`,position:"relative",overflow:"hidden",boxShadow:`0 4px 24px ${color}0A`}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color}00,${color},${color}00)`}}/>
    <div style={{position:"absolute",top:-30,right:-20,width:80,height:80,borderRadius:"50%",background:color+"08"}}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:500}}>{label}</div>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        {semColor&&<span style={{width:8,height:8,borderRadius:"50%",background:semColor,display:"inline-block",boxShadow:`0 0 6px ${semColor}88`,flexShrink:0}}/>}
        {icon&&<div style={{width:26,height:26,borderRadius:8,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={icon} size={13} color={color}/></div>}
      </div>
    </div>
    <div style={{fontSize:22,fontWeight:700,color,letterSpacing:"-0.02em",lineHeight:1}}>{value}</div>
    {pct!==null&&<div style={{marginTop:8}}>
      <div style={{height:3,borderRadius:3,background:C.bg4,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${color}88,${color})`,width:`${pct}%`,transition:"width .6s ease"}}/>
      </div>
      <div style={{fontSize:10,color:C.t3,marginTop:3}}>{pct}% del total</div>
    </div>}
    {sub&&<div style={{fontSize:11,color:C.t3,marginTop:pct!==null?4:6}}>{sub}</div>}
  </div>;
}

function Modal({ title, onClose, children, wide }) {
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}><div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:14,padding:24,width:"100%",maxWidth:wide?680:500,maxHeight:"88vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><span style={{fontWeight:600,fontSize:14}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",color:C.t2,cursor:"pointer",fontSize:22}}>×</button></div>{children}</div></div>;
}

function Donut({ data, size=130 }) {
  const total = data.reduce((s,x)=>s+x.val,0);
  if (!total) return <div style={{width:size,height:size,borderRadius:"50%",background:C.bg4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.t3}}>Sin datos</div>;
  let angle=-Math.PI/2;
  const r=size/2,ir=r*0.62,cx=r,cy=r;
  const slices=data.map(d=>{
    const a=(d.val/total)*2*Math.PI;
    const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);
    angle+=a;
    const x2=cx+r*Math.cos(angle),y2=cy+r*Math.sin(angle);
    const ix1=cx+ir*Math.cos(angle-a),iy1=cy+ir*Math.sin(angle-a);
    const ix2=cx+ir*Math.cos(angle),iy2=cy+ir*Math.sin(angle);
    return {...d,path:`M${x1},${y1} A${r},${r},0,${a>Math.PI?1:0},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${a>Math.PI?1:0},0,${ix1},${iy1} Z`};
  });
  return <svg width={size} height={size}>{slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={0.9}/>)}<circle cx={cx} cy={cy} r={ir-2} fill={C.bg3}/></svg>;
}

function IconPicker({ value, onChange }) {
  return <div><div style={{fontSize:11,color:C.t2,marginBottom:8}}>Ícono</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>{ICON_KEYS.map(k=><div key={k} onClick={()=>onChange(k)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:8,cursor:"pointer",border:`1px solid ${value===k?C.blue:"transparent"}`,background:value===k?C.blue+"22":"transparent"}}><Ic id={k} size={16} color={value===k?C.blue:C.t2}/></div>)}</div></div>;
}

function ColorPicker({ value, onChange }) {
  return <div><div style={{fontSize:11,color:C.t2,marginBottom:8}}>Color</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{COLORS.map(c=><div key={c} onClick={()=>onChange(c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${value===c?"#fff":"transparent"}`,transform:value===c?"scale(1.15)":"scale(1)",transition:"transform .15s"}}/>)}</div></div>;
}

function AuthScreen() {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  const handle=async()=>{
    setLoading(true);setError("");setSuccess("");
    if(mode==="login"){
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setError(error.message);
    } else {
      const {error}=await supabase.auth.signUp({email,password});
      if(error)setError(error.message);
      else setSuccess("¡Cuenta creada! Revisá tu email para confirmar y luego iniciá sesión.");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,overflow:"hidden",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 8px 32px rgba(201,168,76,0.25)"}}>
            <img src={LOGO_URL} alt="Logo" style={{width:"100%",height:"100%"}}/>
          </div>
          <div style={{fontWeight:700,fontSize:24,letterSpacing:"-0.03em",color:C.t}}>FinanzasApp</div>
          <div style={{color:C.t3,fontSize:13,marginTop:4}}>Tu gestor financiero personal</div>
        </div>
        <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:14,padding:28}}>
          <div style={{display:"flex",background:C.bg3,borderRadius:8,marginBottom:24,overflow:"hidden"}}>
            {["login","register"].map(m=><button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{flex:1,padding:"9px 0",fontSize:13,border:"none",cursor:"pointer",background:mode===m?C.blue:"transparent",color:mode===m?"#fff":C.t2,fontWeight:mode===m?500:400}}>{m==="login"?"Iniciar sesión":"Crear cuenta"}</button>)}
          </div>
          <div style={{marginBottom:14}}><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Email</div><input style={inp} type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          <div style={{marginBottom:20}}><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Contraseña</div><input style={inp} type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
          {error&&<div style={{background:C.red+"18",border:`1px solid ${C.red}44`,borderRadius:8,padding:"10px 12px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}
          {success&&<div style={{background:C.green+"18",border:`1px solid ${C.green}44`,borderRadius:8,padding:"10px 12px",fontSize:12,color:C.green,marginBottom:14}}>{success}</div>}
          <Btn primary full onClick={handle} disabled={loading}>{loading?"Cargando...":mode==="login"?"Entrar":"Crear cuenta"}</Btn>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session,setSession]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session));
    return ()=>subscription.unsubscribe();
  },[]);

  if(authLoading) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.t2}}>Cargando...</div>;
  if(!session) return <AuthScreen/>;
  return <Dashboard session={session}/>;
}

function QuickAddModal({quickType,setQuickType,cats,MEDIOS_PAGO,tiposTodos,todayISO,tc,C,inp,sel,quickSaving,quickError,quickOk,saveQuick,setQuickError,onClose}){
  const [gasto,setGasto]=useState({cat:cats[0]?.id||"",sub:cats[0]?.items[0]?.id||"",monto:"",desc:"",medio_pago:"efectivo",fecha:todayISO()});
  const [ingreso,setIngreso]=useState({tipo:"Sueldo ARS",monto:"",fecha:todayISO()});
  const catG=cats.find(c=>c.id===gasto.cat)||cats[0];
  const accentColor=quickType==="gasto"?C.red:C.green;
  const isMobile=typeof window!=="undefined"&&window.innerWidth<=600;
  const sheetStyle=isMobile
    ?{position:"fixed",left:0,right:0,bottom:0,background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:"18px 18px 0 0",padding:"20px 20px 32px",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",animation:"slideUp .28s cubic-bezier(.32,1,.48,1) both",zIndex:101}
    :{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:16,padding:24,width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"popIn .22s ease both"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",zIndex:100,padding:isMobile?0:20}}>
      <div style={sheetStyle}>
        {/* Handle bar en mobile */}
        {isMobile&&<div style={{width:40,height:4,borderRadius:4,background:C.bd2,margin:"-8px auto 16px",display:"block"}}/>}
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:600,fontSize:15,color:C.t}}>Carga rápida</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.t2,cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
        </div>
        {/* Toggle Gasto / Ingreso */}
        <div style={{display:"flex",background:C.bg3,borderRadius:10,padding:3,marginBottom:22,gap:3}}>
          {["gasto","ingreso"].map(t=>(
            <button key={t} onClick={()=>{setQuickType(t);setQuickError("");}}
              style={{flex:1,padding:"9px 0",fontSize:13,fontWeight:500,border:"none",cursor:"pointer",borderRadius:8,
                background:quickType===t?(t==="gasto"?C.red:C.green):"transparent",
                color:quickType===t?"#fff":C.t2,transition:"all .18s"}}>
              {t==="gasto"?"📤  Gasto":"📥  Ingreso"}
            </button>
          ))}
        </div>
        {/* Monto destacado */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:C.t3,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>Monto</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}>
            <span style={{fontSize:30,color:C.t3,fontWeight:300,lineHeight:1}}>$</span>
            <input
              autoFocus type="text" inputMode="decimal" placeholder="0"
              style={{fontSize:36,fontWeight:700,textAlign:"center",border:"none",background:"transparent",outline:"none",color:accentColor,width:220,padding:0}}
              value={quickType==="gasto"?gasto.monto:ingreso.monto}
              onChange={e=>quickType==="gasto"?setGasto(x=>({...x,monto:e.target.value})):setIngreso(x=>({...x,monto:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&saveQuick(quickType==="gasto"?gasto:ingreso)}
            />
          </div>
          <div style={{height:2,borderRadius:2,background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,marginTop:8,opacity:0.6}}/>
        </div>
        {/* Campos gasto */}
        {quickType==="gasto"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}} translate="no">
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Categoría</div>
            <select style={sel} value={gasto.cat} onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setGasto(x=>({...x,cat:e.target.value,sub:c?.items[0]?.id||""}));}}>
              {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Subcategoría</div>
            <select style={sel} value={gasto.sub} onChange={e=>setGasto(x=>({...x,sub:e.target.value}))}>
              {catG?.items.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Medio de pago</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {MEDIOS_PAGO.map(m=>(
                <button key={m.id} onClick={()=>setGasto(x=>({...x,medio_pago:m.id}))}
                  style={{padding:"6px 12px",fontSize:12,border:`1px solid ${gasto.medio_pago===m.id?m.color:C.bd}`,
                    borderRadius:20,cursor:"pointer",background:gasto.medio_pago===m.id?m.color+"22":"transparent",
                    color:gasto.medio_pago===m.id?m.color:C.t2,fontWeight:gasto.medio_pago===m.id?600:400,
                    whiteSpace:"nowrap",transition:"all .15s"}}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div>
            <input style={inp} type="date" value={gasto.fecha} onChange={e=>setGasto(x=>({...x,fecha:e.target.value}))}/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Descripción (opcional)</div>
            <input style={inp} placeholder="Ej: Almuerzo, nafta..." value={gasto.desc}
              onChange={e=>setGasto(x=>({...x,desc:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&saveQuick(gasto)}/>
          </div>
        </div>}
        {/* Campos ingreso */}
        {quickType==="ingreso"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Tipo</div>
            <select style={sel} value={ingreso.tipo} onChange={e=>setIngreso(x=>({...x,tipo:e.target.value}))}>
              {tiposTodos.map(t=><option key={t.id} value={t.label}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div>
            <input style={inp} type="date" value={ingreso.fecha} onChange={e=>setIngreso(x=>({...x,fecha:e.target.value}))}/>
          </div>
        </div>}
        {/* Error / Ok */}
        {quickError&&<div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:12}}>{quickError}</div>}
        {quickOk&&<div className="save-ok" style={{background:C.green+"22",border:`1px solid ${C.green}55`,borderRadius:10,padding:"14px 12px",fontSize:13,color:C.green,textAlign:"center",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:20}}>✓</span>
          <span>{quickType==="gasto"?"Gasto guardado":"Ingreso guardado"}</span>
        </div>}
        {/* Botón guardar */}
        {!quickOk&&<button
          onClick={()=>saveQuick(quickType==="gasto"?gasto:ingreso)}
          disabled={quickSaving}
          style={{width:"100%",background:`linear-gradient(135deg,${accentColor},${accentColor}BB)`,color:"#fff",border:"none",borderRadius:10,padding:"14px 0",fontSize:14,fontWeight:600,cursor:quickSaving?"not-allowed":"pointer",opacity:quickSaving?0.7:1,letterSpacing:"0.01em"}}>
          {quickSaving?"Guardando...":`Guardar ${quickType}`}
        </button>}
        <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.t3}}>TC al guardar: <b style={{color:C.t2}}>${tc.toLocaleString("es-AR")}</b> · Enter para guardar</div>
      </div>
    </div>
  );
}

function DupAlert({gastosDuplicados,fmtH,currency,tc,cats,delGasto,C}){
  const [open,setOpen]=useState(false);
  if(!gastosDuplicados.length)return null;
  return<div style={{background:C.amber+"10",border:`1px solid ${C.amber}33`,borderRadius:10,marginBottom:12,overflow:"hidden"}}>
    <button onClick={()=>setOpen(v=>!v)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Ic id="activity" size={13} color={C.amber}/>
        <span style={{fontSize:12,fontWeight:600,color:C.amber}}>⚠ {gastosDuplicados.length} posible{gastosDuplicados.length!==1?"s":""} duplicado{gastosDuplicados.length!==1?"s":""}</span>
        <span style={{fontSize:11,color:C.t3}}>— mismo monto, categoría y fecha</span>
      </div>
      <span style={{color:C.t3,fontSize:13}}>{open?"▴":"▾"}</span>
    </button>
    {open&&<div style={{padding:"0 14px 12px",display:"flex",flexDirection:"column",gap:6}}>
      {gastosDuplicados.map(d=>(
        <div key={d.key} style={{background:C.bg3,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:10,fontSize:12}}>
          <div style={{width:22,height:22,borderRadius:6,background:(d.cat?.color||C.amber)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic id={d.cat?.icon||"flag"} size={11} color={d.cat?.color||C.amber}/>
          </div>
          <div style={{flex:1}}>
            <span style={{color:C.t}}>{d.cat?.label}</span>
            <span style={{color:C.t3}}> · {fmtH(d.monto,currency,tc)} · {d.a.fecha}</span>
            {d.a.descripcion&&<span style={{color:C.t3}}> · {d.a.descripcion}</span>}
          </div>
          <button onClick={()=>delGasto(d.b.id)} style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:5,padding:"2px 8px",cursor:"pointer",color:C.red,fontSize:11}}>Eliminar uno</button>
        </div>
      ))}
    </div>}
  </div>;
}

function AlertsAccordion({ totalAlertas, onDismissAll, children }) {
  const [open, setOpen] = useState(false);
  return(
    <div style={{marginBottom:16,border:`1px solid ${C.red}33`,borderRadius:12,overflow:"hidden"}}>
      <button onClick={()=>setOpen(v=>!v)}
        style={{width:"100%",background:C.red+"10",border:"none",cursor:"pointer",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{width:22,height:22,borderRadius:6,background:C.red+"33",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
            <Ic id="flag" size={12} color={C.red}/>
          </span>
          <span style={{fontSize:12,fontWeight:600,color:C.red}}>{totalAlertas} {totalAlertas===1?"alerta activa":"alertas activas"}</span>
          <span style={{fontSize:11,color:C.t3}}>— {open?"click para ocultar":"click para ver"}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={e=>{e.stopPropagation();onDismissAll();}}
            style={{background:C.red+"22",border:`1px solid ${C.red}33`,borderRadius:6,padding:"3px 10px",cursor:"pointer",color:C.red,fontSize:11,fontWeight:500}}>
            Cerrar todas
          </button>
          <span style={{color:C.t3,fontSize:14,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
        </div>
      </button>
      {open&&<div style={{padding:"12px 14px 8px"}}>{children}</div>}
    </div>
  );
}

function Dashboard({ session }) {
  const [themeMode,setThemeMode]=useState(()=>localStorage.getItem("fa_theme")||"dark");
  // Paleta activa según tema
  const C=themeMode==="light"?C_LIGHT:{bg:"#0D0F14",bg2:"#13161E",bg3:"#1A1E2A",bg4:"#222638",bd:"rgba(255,255,255,0.07)",bd2:"rgba(255,255,255,0.12)",t:"#F0F2F8",t2:"#8B91A8",t3:"#555D75",green:"#34C88A",red:"#E05C5C",blue:"#4E9EF5",purple:"#A78BFA",amber:"#F5A623",warning:"#F5A623"};
  const toggleTheme=()=>setThemeMode(m=>{const next=m==="dark"?"light":"dark";localStorage.setItem("fa_theme",next);return next;});
  const userId=session.user.id;
  const [tab,setTab]=useState("dashboard");
  const [viewMode,setViewMode]=useState("month");
  // rango de meses: selMonth = inicio, selMonthEnd/selYearEnd = fin
  const [selMonthEnd,setSelMonthEnd]=useState(now.getMonth());
  const [selYearEnd,setSelYearEnd]=useState(now.getFullYear());
  const [currency,setCurrency]=useState("ARS");
  const [tcManual,setTcManual]=useState(null);
  const [tcAuto,setTcAuto]=useState(null);
  const [tcMode,setTcMode]=useState("auto");
  const [tcLoading,setTcLoading]=useState(false);
  const [selMonth,setSelMonth]=useState(now.getMonth());
  const [selYear,setSelYear]=useState(now.getFullYear());
  const [cats,setCats]=useState(DEFAULT_CATS);
  const [gastos,setGastos]=useState([]);
  const [ingresos,setIngresos]=useState([]);
  const [budgets,setBudgets]=useState({}); // keys: "cat_id" for cat-level OR "cat_id|sub_id" for sub-level
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const todayISO=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
  const [form,setForm]=useState({cat:"hogar",sub:"expensas",monto:"",desc:"",medio_pago:"efectivo",fecha:todayISO()});
  const [showIngForm,setShowIngForm]=useState(false);
  const [ingForm,setIngForm]=useState({tipo:"Sueldo ARS",monto:"",fecha:todayISO()});
  const [catModal,setCatModal]=useState(null);
  const [catDraft,setCatDraft]=useState({label:"",color:COLORS[0],icon:"pkg"});
  const [subDraft,setSubDraft]=useState({label:"",icon:"pkg"});
  const [editCatId,setEditCatId]=useState(null);
  const [editSubId,setEditSubId]=useState(null);
  const [budgetModal,setBudgetModal]=useState(false);
  const [budgetDraft,setBudgetDraft]=useState({});
  const [aiModal,setAiModal]=useState(false);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiResponse,setAiResponse]=useState("");
  const [aiQ,setAiQ]=useState("Análisis general");
  const [ayudaStep,setAyudaStep]=useState(0);
  const [ayudaQ,setAyudaQ]=useState("");
  const [ayudaResp,setAyudaResp]=useState("");
  const [ayudaLoading,setAyudaLoading]=useState(false);
  // Alertas descartadas — se resetean al recargar la página
  const [dismissedAlerts,setDismissedAlerts]=useState(()=>{
    try{return new Set(JSON.parse(sessionStorage.getItem("fa_dismissed_alerts")||"[]"));}catch{return new Set();}
  });
  const dismissAlert=(key)=>{
    setDismissedAlerts(prev=>{
      const next=new Set(prev);next.add(key);
      try{sessionStorage.setItem("fa_dismissed_alerts",JSON.stringify([...next]));}catch{}
      return next;
    });
  };

  // ── Medios de pago custom del usuario ─────────────────────────────────────
  const [mediosExtra,setMediosExtra]=useState([]); // [{id,label,color}] cargados de Supabase
  const [medioModal,setMedioModal]=useState(false);
  const [medioDraft,setMedioDraft]=useState({label:"",color:"#94A3B8"});
  const [medioSaving,setMedioSaving]=useState(false);

  // ── Tipos de ingreso custom del usuario ───────────────────────────────────
  const [tiposExtra,setTiposExtra]=useState([]); // [{id,label,icon,grupo}]
  const [tipoModal,setTipoModal]=useState(false);
  const [tipoDraft,setTipoDraft]=useState({label:"",grupo:"ingreso",icon:"dollar"});
  const [tipoSaving,setTipoSaving]=useState(false);

  // ─── INFLACIÓN ─────────────────────────────────────────────────────────────
  const [inflData,setInflData]=useState(null);
  const [inflLoading,setInflLoading]=useState(false);
  const [inflError,setInflError]=useState("");

  // ─── FILTROS GASTOS ────────────────────────────────────────────────────────
  const [filtroDesc,setFiltroDesc]=useState("");
  const [filtroMontoMin,setFiltroMontoMin]=useState("");
  const [filtroMontoMax,setFiltroMontoMax]=useState("");
  const [filtroCat,setFiltroCat]=useState("todas");
  const [filtroMedio,setFiltroMedio]=useState("todos");

  // ─── BÚSQUEDA RÁPIDA DASHBOARD ────────────────────────────────────────────
  const [dashSearch,setDashSearch]=useState("");

  // ─── IMPORTAR CSV ─────────────────────────────────────────────────────────
  const [csvModal,setCsvModal]=useState(false);
  const [csvRows,setCsvRows]=useState([]);
  const [csvMapped,setCsvMapped]=useState([]);
  const [csvLoading,setCsvLoading]=useState(false);
  const [csvError,setCsvError]=useState("");
  const [csvSaving,setCsvSaving]=useState(false);

  // ─── RECORDATORIO RECURRENTES ──────────────────────────────────────────────
  const [reminderDismissed,setReminderDismissed]=useState(()=>{
    try{return localStorage.getItem("fa_rec_reminder_"+new Date().toISOString().slice(0,7))==="1";}catch{return false;}
  });

  // ─── EDICIÓN INLINE ────────────────────────────────────────────────────────
  const [inlineEditId,setInlineEditId]=useState(null);
  const [inlineEditData,setInlineEditData]=useState({});

  // ─── HISTORIAL CAMBIOS ─────────────────────────────────────────────────────
  const [changeLog,setChangeLog]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("fa_changelog")||"[]");}catch{return[];}
  });
  const [changeLogModal,setChangeLogModal]=useState(false);
  const addChangeLog=(action,detail)=>{
    const entry={ts:new Date().toISOString(),action,detail};
    setChangeLog(prev=>{
      const next=[entry,...prev].slice(0,100);
      try{localStorage.setItem("fa_changelog",JSON.stringify(next));}catch{}
      return next;
    });
  };

  // ─── COMPARTIR MES ─────────────────────────────────────────────────────────
  const [shareModal,setShareModal]=useState(false);
  const [shareUrl,setShareUrl]=useState("");

  // ─── ONBOARDING ────────────────────────────────────────────────────────────
  const [onboardingStep,setOnboardingStep]=useState(()=>{
    try{return parseInt(localStorage.getItem("fa_onboarding")||"0");}catch{return 0;}
  });
  const [showOnboarding,setShowOnboarding]=useState(()=>{
    try{return localStorage.getItem("fa_onboarding_done")!=="1";}catch{return true;}
  });
  const completeOnboarding=()=>{
    try{localStorage.setItem("fa_onboarding_done","1");}catch{}
    setShowOnboarding(false);
  };

  // ─── GASTOS RECURRENTES ────────────────────────────────────────────────────
  const [recurrentesModal,setRecurrentesModal]=useState(false);
  const [recurrentes,setRecurrentes]=useState([]);
  const [recDraft,setRecDraft]=useState({cat:"",sub:"",monto:"",desc:"",medio_pago:"efectivo"});
  const [recSaving,setRecSaving]=useState(false);

  // ─── MODO CUOTAS ───────────────────────────────────────────────────────────
  const [cuotasMode,setCuotasMode]=useState(false);
  const [cuotasN,setCuotasN]=useState(3);
  const [cuotasUSD,setCuotasUSD]=useState(false);

  // ─── INVERSIONES ──────────────────────────────────────────────────────────
  const [inversiones,setInversiones]=useState([]);
  const [invModal,setInvModal]=useState(false);
  const [invDraft,setInvDraft]=useState({plataforma:"binance",monto:"",moneda:"ARS",descripcion:"",fecha:"",tipo:"deposito"});
  const [invSaving,setInvSaving]=useState(false);
  const [invError,setInvError]=useState("");
  const [invCustomPlat,setInvCustomPlat]=useState([]);
  const [invNewPlatModal,setInvNewPlatModal]=useState(false);
  const [invNewPlatDraft,setInvNewPlatDraft]=useState({label:"",color:"#94A3B8"});

  // ─── SALDOS (Opción A) ────────────────────────────────────────────────────
  const [invSaldos,setInvSaldos]=useState([]);
  const [saldoModal,setSaldoModal]=useState(false);
  const [saldoDraft,setSaldoDraft]=useState({plataforma:"cocos",saldo:"",moneda:"ARS",nota:"",fecha:""});
  const [saldoSaving,setSaldoSaving]=useState(false);
  const [saldoError,setSaldoError]=useState("");

  // ─── ACTIVOS (Opción B) ───────────────────────────────────────────────────
  const [invActivos,setInvActivos]=useState([]);
  const [activoModal,setActivoModal]=useState(false);
  const [activoDraft,setActivoDraft]=useState({plataforma:"iol",nombre:"",ticker:"",cantidad:"",precio_compra:"",moneda_compra:"ARS",precio_actual:"",moneda_actual:"ARS",fecha_compra:"",comision:""});
  const [activoSaving,setActivoSaving]=useState(false);
  const [activoError,setActivoError]=useState("");
  const [editActivoId,setEditActivoId]=useState(null);
  const [editPrecioActual,setEditPrecioActual]=useState("");
  const [editPrecioModal,setEditPrecioModal]=useState(false);
  const [invSubTab,setInvSubTab]=useState("saldos"); // "saldos" | "activos" | "historial" | "analisis" | "noticias"
  const [noticiasData,setNoticiasData]=useState(null);
  const [noticiasLoading,setNoticiasLoading]=useState(false);
  const [consejosData,setConsejosData]=useState("");
  const [consejosLoading,setConsejosLoading]=useState(false);

  // Array completo: fijos + custom. Se usa en todos los selects de la app.
  const mediosTodos=useMemo(()=>[...MEDIOS_PAGO_BASE,...mediosExtra],[mediosExtra]);
  const tiposTodos=useMemo(()=>[...TIPOS_INGRESO_DEFAULT,...tiposExtra],[tiposExtra]);

  const tc=(tcMode==="auto"&&tcAuto)?tcAuto:(tcManual||1500);

  const loadStaticData=useCallback(async()=>{
    const [{data:cData},{data:sData},{data:mData}]=await Promise.all([
      supabase.from("categorias").select("*").eq("user_id",userId).order("sort_order"),
      supabase.from("subcategorias").select("*").eq("user_id",userId).order("sort_order"),
      supabase.from("medios_pago_custom").select("*").eq("user_id",userId).order("created_at"),
    ]);
    if(mData) setMediosExtra(mData.map(m=>({id:m.id,label:m.label,color:m.color||"#94A3B8"})));
    if(cData&&cData.length>0){
      const rebuilt=cData.map(c=>({id:c.id,label:c.label,color:c.color,icon:c.icon,items:(sData||[]).filter(s=>s.cat_id===c.id).map(s=>({id:s.id,label:s.label,icon:s.icon}))}));
      setCats(rebuilt);
    } else {
      await seedDefaultCats(userId);
    }
  },[userId]);

  const loadData=useCallback(async()=>{
    setLoading(true);
    const [{data:gData},{data:iData},{data:invData},{data:saldosData},{data:activosData}]=await Promise.all([
      supabase.from("gastos").select("*").eq("user_id",userId),
      supabase.from("ingresos").select("*").eq("user_id",userId),
      supabase.from("inversiones").select("*").eq("user_id",userId),
      supabase.from("inv_saldos").select("*").eq("user_id",userId).order("anio").order("mes"),
      supabase.from("inv_activos").select("*").eq("user_id",userId).eq("activo",true).order("created_at"),
    ]);
    if(gData)setGastos(gData);
    if(iData)setIngresos(iData);
    if(invData)setInversiones(invData);
    if(saldosData)setInvSaldos(saldosData);
    if(activosData)setInvActivos(activosData);
    setLoading(false);
  },[userId]);

  const loadBudgets=useCallback(async(month,year)=>{
    // FIX: si Supabase devuelve error (timeout, RLS, red) no limpiamos el estado local
    const {data:bData,error:bError}=await supabase.from("presupuestos").select("*").eq("user_id",userId).eq("month",month).eq("year",year);
    if(bError){console.warn("loadBudgets error:",bError.message);return;}
    setBudgets(bData&&bData.length?Object.fromEntries(bData.map(b=>[b.sub_id&&b.sub_id!==''?`${b.cat_id}|${b.sub_id}`:b.cat_id,b.monto])):{});
  },[userId]);

  useEffect(()=>{loadStaticData();},[loadStaticData]);
  useEffect(()=>{loadData();},[loadData]);
  useEffect(()=>{loadBudgets(selMonth,selYear);},[loadBudgets,selMonth,selYear]);
  useEffect(()=>{fetchTC(true);},[]);// eslint-disable-line react-hooks/exhaustive-deps

  // ─── ATAJOS DE TECLADO ────────────────────────────────────────────────────
  useEffect(()=>{
    const handler=(e)=>{
      // No disparar si el foco está en un input/textarea/select
      const tag=document.activeElement?.tagName;
      if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT")return;
      if(e.key==="n"||e.key==="N"){e.preventDefault();setQuickModal(true);setQuickType("gasto");setQuickError("");setQuickOk(false);}
      if(e.key==="i"||e.key==="I"){e.preventDefault();setQuickModal(true);setQuickType("ingreso");setQuickError("");setQuickOk(false);}
      if(e.key==="Escape"){setQuickModal(false);setAiModal(false);setAiCargaModal(false);setFabOpen(false);}
      if(e.key==="ArrowLeft"&&!e.shiftKey){e.preventDefault();setSelMonth(m=>{if(m===0){setSelYear(y=>y-1);return 11;}return m-1;});}
      if(e.key==="ArrowRight"&&!e.shiftKey){e.preventDefault();setSelMonth(m=>{if(m===11){setSelYear(y=>y+1);return 0;}return m+1;});}
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[]);// eslint-disable-line react-hooks/exhaustive-deps

  const seedDefaultCats=async(uid)=>{
    const catRows=DEFAULT_CATS.map((c,i)=>({id:c.id,user_id:uid,label:c.label,color:c.color,icon:c.icon,sort_order:i}));
    const subRows=DEFAULT_CATS.flatMap(c=>c.items.map((s,i)=>({id:s.id,user_id:uid,cat_id:c.id,label:s.label,icon:s.icon,sort_order:i})));
    await supabase.from("categorias").insert(catRows);
    await supabase.from("subcategorias").insert(subRows);
    setCats(DEFAULT_CATS);
  };

  const [allTC,setAllTC]=useState([]);
  const [showTCPanel,setShowTCPanel]=useState(false);
  const [tcLastUpdate,setTcLastUpdate]=useState(null);

  const TC_TYPES=[
    {id:"oficial",    label:"Oficial BNA",  endpoint:"oficial",         color:"#4E9EF5"},
    {id:"blue",       label:"Blue",         endpoint:"blue",            color:"#34C88A"},
    {id:"bolsa",      label:"MEP / Bolsa",  endpoint:"bolsa",           color:"#A78BFA"},
    {id:"contadoconliqui",label:"CCL",      endpoint:"contadoconliqui", color:"#F5A623"},
    {id:"cripto",     label:"Cripto",       endpoint:"cripto",          color:"#F472B6"},
    {id:"mayorista",  label:"Mayorista",    endpoint:"mayorista",       color:"#2DD4BF"},
  ];

  const fetchTC=async(silent=false)=>{
    setTcLoading(true);
    try{
      const r=await fetch("https://dolarapi.com/v1/dolares/oficial");
      const j=await r.json();
      if(j.venta){
        setTcAuto(j.venta);
        setTcManual(j.venta);
        setTcMode("auto");
        saveTcHistory(j.venta);
      }
    }catch{
      if(!tcAuto&&!tcManual) setTcManual(1500);
      if(!silent) toast("No se pudo obtener el TC. Usá el campo manual.", "warning");
    }
    setTcLoading(false);
  };

  const fetchAllTC=async()=>{
    try{
      const results=await Promise.all(
        TC_TYPES.map(t=>fetch(`https://dolarapi.com/v1/dolares/${t.endpoint}`).then(r=>r.json()).catch(()=>null))
      );
      const data=TC_TYPES.map((t,i)=>({...t,compra:results[i]?.compra||null,venta:results[i]?.venta||null,fechaActualizacion:results[i]?.fechaActualizacion||null}));
      setAllTC(data);
      setTcLastUpdate(new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}));
    }catch{}
  };

  useEffect(()=>{if(showTCPanel){fetchAllTC();fetchTCHistorico();}},[showTCPanel]);// eslint-disable-line react-hooks/exhaustive-deps

  // ─── SPARKLINE TC histórico (últimos 30 días desde Supabase) ──────────────
  const [tcSparkData,setTcSparkData]=useState([]);
  useEffect(()=>{
    if(!showTCPanel)return;
    (async()=>{
      try{
        const {data}=await supabase.from("tc_historico").select("fecha,tc_blue").order("fecha",{ascending:true}).limit(30);
        if(data&&data.length>1) setTcSparkData(data);
      }catch{}
    })();
  },[showTCPanel]);// eslint-disable-line react-hooks/exhaustive-deps

  const buildSparklineSVG=(points,color,w=200,h=40)=>{
    if(!points||points.length<2)return null;
    const vals=points.map(p=>p.tc_blue||p.venta||0).filter(v=>v>0);
    if(vals.length<2)return null;
    const min=Math.min(...vals),max=Math.max(...vals);
    const range=max-min||1;
    const xs=vals.map((_,i)=>(i/(vals.length-1))*(w-4)+2);
    const ys=vals.map(v=>h-4-((v-min)/range)*(h-8));
    const d="M"+xs.map((x,i)=>`${x},${ys[i]}`).join("L");
    const lastVal=vals[vals.length-1];
    const firstVal=vals[0];
    const diff=((lastVal-firstVal)/firstVal*100).toFixed(1);
    const upColor=C.green,downColor=C.red;
    const lineColor=lastVal>=firstVal?upColor:downColor;
    return{svg:`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block"><path d="${d}" fill="none" stroke="${lineColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${xs[xs.length-1]}" cy="${ys[ys.length-1]}" r="2.5" fill="${lineColor}"/></svg>`,diff,lastVal,lineColor};
  };

  const monthGastos=gastos.filter(g=>g.year===selYear&&g.month===selMonth);
  const monthIngresos=ingresos.filter(i=>i.year===selYear&&i.month===selMonth);
  const yearGastos=gastos.filter(g=>g.year===selYear).map(g=>({...g,_m:g.month}));
  const yearIngresos=ingresos.filter(i=>i.year===selYear).map(i=>({...i,_m:i.month}));

  // Modo rango: filtra todos los meses entre selMonth/selYear y selMonthEnd/selYearEnd
  const rangeGastos=useMemo(()=>{
    if(viewMode!=="range")return[];
    const desde=selYear*12+selMonth;
    const hasta=selYearEnd*12+selMonthEnd;
    const [d,h]=desde<=hasta?[desde,hasta]:[hasta,desde];
    return gastos.filter(g=>{const t=g.year*12+g.month;return t>=d&&t<=h;}).map(g=>({...g,_m:g.month}));
  },[viewMode,gastos,selMonth,selYear,selMonthEnd,selYearEnd]);
  const rangeIngresos=useMemo(()=>{
    if(viewMode!=="range")return[];
    const desde=selYear*12+selMonth;
    const hasta=selYearEnd*12+selMonthEnd;
    const [d,h]=desde<=hasta?[desde,hasta]:[hasta,desde];
    return ingresos.filter(i=>{const t=i.year*12+i.month;return t>=d&&t<=h;}).map(i=>({...i,_m:i.month}));
  },[viewMode,ingresos,selMonth,selYear,selMonthEnd,selYearEnd]);

  // Label del período seleccionado
  const periodoLabel=useMemo(()=>{
    if(viewMode==="month") return `${MONTHS[selMonth]} ${selYear}`;
    if(viewMode==="year") return `Año ${selYear}`;
    const desde=selYear*12+selMonth;
    const hasta=selYearEnd*12+selMonthEnd;
    const [d,h]=desde<=hasta?[desde,hasta]:[hasta,desde];
    const mD=d%12,yD=Math.floor(d/12),mH=h%12,yH=Math.floor(h/12);
    if(yD===yH) return `${MONTHS[mD]}–${MONTHS[mH]} ${yH}`;
    return `${MONTHS[mD]} ${yD} – ${MONTHS[mH]} ${yH}`;
  },[viewMode,selMonth,selYear,selMonthEnd,selYearEnd]);

  const ad=viewMode==="year"?yearGastos:viewMode==="range"?rangeGastos:monthGastos;
  const ai=viewMode==="year"?yearIngresos:viewMode==="range"?rangeIngresos:monthIngresos;
  const totG=ad.reduce((s,x)=>s+Number(x.monto),0);
  const totI=ai.reduce((s,x)=>s+Number(x.monto),0);
  const bal=totI-totG;
  const savRate=totI>0?Math.round(((totI-totG)/totI)*100):0;

  // ─── INVERSIONES COMPUTED ────────────────────────────────────────────────
  const platTodasPlat=useMemo(()=>[...PLATAFORMAS_BASE,...invCustomPlat],[invCustomPlat]);
  const monthInversiones=inversiones.filter(i=>i.anio===selYear&&i.mes===selMonth);
  const yearInversionesAll=inversiones.filter(i=>i.anio===selYear);

  // totInvARS: depósitos netos del período seleccionado en ARS (retiros se descuentan)
  const totInvARS=(()=>{
    let inv;
    if(viewMode==="year") inv=yearInversionesAll;
    else if(viewMode==="range"){
      const desde=selYear*12+selMonth;
      const hasta=selYearEnd*12+selMonthEnd;
      const [d,h]=desde<=hasta?[desde,hasta]:[hasta,desde];
      inv=inversiones.filter(i=>{const t=i.anio*12+i.mes;return t>=d&&t<=h;});
    } else inv=monthInversiones;
    return inv.reduce((s,i)=>{
      const m=Number(i.monto);
      const esRetiro=(i.descripcion||"").startsWith("[RETIRO]");
      const montoARS=i.moneda==="USD"?m*(i.tc_at_time||tc):m;
      return s+(esRetiro?-montoARS:montoARS);
    },0);
  })();

  const byPlataforma=useMemo(()=>platTodasPlat.reduce((acc,p)=>{acc[p.id]=inversiones.filter(i=>i.plataforma===p.id).reduce((s,i)=>{const m=Number(i.monto);return s+(i.moneda==="USD"?m*(i.tc_at_time||tc):m);},0);return acc;},{}),[inversiones,platTodasPlat,tc]);
  const totalInvertidoHistorico=Object.values(byPlataforma).reduce((s,v)=>s+v,0);

  // ── Saldos/fondos reactivos ───────────────────────────────────────────────
  const ultimosPorPlatMemo=useMemo(()=>invSaldos.reduce((acc,s)=>{
    const p=s.plataforma;
    const prev=acc[p];
    const esNuevo=!prev||s.anio>prev.anio||(s.anio===prev.anio&&s.mes>prev.mes)||
      (s.anio===prev.anio&&s.mes===prev.mes&&(s.created_at||"")>(prev.created_at||""));
    if(esNuevo)acc[p]=s;
    return acc;
  },{}),[invSaldos]);
  const totalFondosMemo=useMemo(()=>Object.values(ultimosPorPlatMemo).reduce((s,x)=>{
    const v=Number(x.saldo);return s+(x.moneda==="USD"?v*(x.tc_at_time||tc):v);
  },0),[ultimosPorPlatMemo,tc]);
  // totalActivosMemo y totalCarteraMemo se calculan después de los helpers (línea ~1011)

  // ── Métricas "reales" descontando inversiones ─────────────────────────────
  // Disponible real = Ingresos - Gastos - Inversiones del período
  const balReal=totI-totG-totInvARS;
  // Tasa ahorro real = inversiones / ingresos (cuánto % del ingreso efectivamente ahorré/invertí)
  const savRateReal=totI>0?Math.round((totInvARS/totI)*100):0;
  // Plata disponible para gastar (ingresos menos gastos y menos inversiones ya alocadas)
  const dispGastar=totI-totG-totInvARS;
  const hayInversiones=totInvARS>0;

  // ─── ROLLOVER: disponible real del mes anterior ───────────────────────────
  // Fórmula idéntica a dispGastar: ingresos - gastos - inversiones del mes previo.
  // Si sobró disponible real → se arrastra al mes actual. Si hubo déficit → rollover = 0.
  const saldoRollover=useMemo(()=>{
    if(viewMode==="year") return 0;
    const prevMonth=selMonth===0?11:selMonth-1;
    const prevYear=selMonth===0?selYear-1:selYear;
    const gastosAnt=gastos.filter(g=>g.year===prevYear&&g.month===prevMonth)
      .reduce((s,g)=>s+Number(g.monto),0);
    const ingresosAnt=ingresos.filter(i=>i.year===prevYear&&i.month===prevMonth)
      .reduce((s,i)=>s+Number(i.monto),0);
    const invAnt=inversiones.filter(i=>i.anio===prevYear&&i.mes===prevMonth)
      .reduce((s,i)=>{const m=Number(i.monto);return s+(i.moneda==="USD"?m*(i.tc_at_time||tc):m);},0);
    const disponibleAnt=ingresosAnt-gastosAnt-invAnt;
    return disponibleAnt>0?disponibleAnt:0;
  },[gastos,ingresos,inversiones,selMonth,selYear,viewMode,tc]);

  // dispGastar enriquecido con el arrastre del mes anterior
  const dispGastarConRollover=viewMode==="month"?dispGastar+saldoRollover:dispGastar;

  // mTotals con inversiones por mes para gráfico anual
  const mInvTotals=useMemo(()=>MONTHS.map((_,m)=>({
    inv:inversiones.filter(x=>x.anio===selYear&&x.mes===m).reduce((s,x)=>{const mn=Number(x.monto);return s+(x.moneda==="USD"?mn*(x.tc_at_time||tc):mn);},0),
  })),[inversiones,selYear,tc]);

  const byCat=useMemo(()=>{const r={};cats.forEach(c=>{r[c.id]=ad.filter(x=>x.cat===c.id).reduce((s,x)=>s+Number(x.monto),0);});return r;},[ad,cats]);

  const bySub=useMemo(()=>{
    const r={};
    cats.forEach(c=>c.items.forEach(s=>{
      r[`${c.id}|${s.id}`]=ad.filter(x=>x.cat===c.id&&x.sub===s.id).reduce((acc,x)=>acc+Number(x.monto),0);
    }));
    return r;
  },[ad,cats]);

  const byMedio=useMemo(()=>{
    const r={};
    mediosTodos.forEach(m=>{r[m.id]=0;});
    ad.forEach(x=>{
      const raw=x.medio_pago;
      const mid=(!raw||raw==="")?"efectivo":raw;
      const conocido=mediosTodos.some(m=>m.id===mid);
      // Si el medio no está en la lista lo agrupamos en "otros"
      r[conocido?mid:"otros"]=(r[conocido?mid:"otros"]||0)+Number(x.monto);
    });
    return r;
  },[ad,mediosTodos]);

  const mTotals=useMemo(()=>MONTHS.map((_,m)=>({
    g:gastos.filter(x=>x.year===selYear&&x.month===m).reduce((s,x)=>s+Number(x.monto),0),
    i:ingresos.filter(x=>x.year===selYear&&x.month===m).reduce((s,x)=>s+Number(x.monto),0),
    inv:inversiones.filter(x=>x.anio===selYear&&x.mes===m).reduce((s,x)=>{const mn=Number(x.monto);return s+(x.moneda==="USD"?mn*(x.tc_at_time||tc):mn);},0),
  })),[gastos,ingresos,inversiones,selYear,tc]);

  const maxBar=Math.max(...mTotals.map(x=>Math.max(x.g,x.i)),1);

  const budAlerts=useMemo(()=>{
    const alerts=[];
    cats.forEach(c=>{
      // Alerta roja: solo si supera el 100% del presupuesto
      if(budgets[c.id]&&byCat[c.id]>budgets[c.id]){
        alerts.push({key:c.id,label:c.label,cat:c,sub:null,spent:byCat[c.id],budget:budgets[c.id],pct:Math.round((byCat[c.id]/budgets[c.id])*100)});
      }
      c.items.forEach(s=>{
        const key=`${c.id}|${s.id}`;
        const spent=bySub[key]||0;
        if(budgets[key]&&spent>budgets[key]){
          alerts.push({key,label:`${c.label} › ${s.label}`,cat:c,sub:s,spent,budget:budgets[key],pct:Math.round((spent/budgets[key])*100)});
        }
      });
    });
    return alerts;
  },[byCat,bySub,budgets,cats]);

  // ─── #3 PROYECCIÓN CIERRE DE MES ─────────────────────────────────────────
  // Dado el ritmo de gasto actual del mes, proyecta el total al fin de mes
  const proyeccionCierre=useMemo(()=>{
    if(viewMode!=="month")return null;
    const hoy=new Date();
    const esElMesActual=hoy.getFullYear()===selYear&&hoy.getMonth()===selMonth;
    if(!esElMesActual)return null; // Solo proyectar el mes en curso
    const diaActual=hoy.getDate();
    const diasEnMes=new Date(selYear,selMonth+1,0).getDate();
    if(diaActual===0||diasEnMes===0)return null;
    const ritmo=totG/diaActual; // ARS/día promedio hasta hoy
    const proyTotal=Math.round(ritmo*diasEnMes);
    const proyResto=Math.round(ritmo*(diasEnMes-diaActual));
    const pctMes=Math.round((diaActual/diasEnMes)*100);
    // Por categoría
    const porCat=cats.map(c=>{
      const gastadoHoy=byCat[c.id]||0;
      if(!gastadoHoy)return null;
      const proy=Math.round((gastadoHoy/diaActual)*diasEnMes);
      const bud=budgets[c.id]||null;
      return{catId:c.id,label:c.label,color:c.color,icon:c.icon,gastadoHoy,proy,bud,superaBudget:bud&&proy>bud};
    }).filter(Boolean);
    return{diaActual,diasEnMes,pctMes,ritmo,proyTotal,proyResto,porCat};
  },[viewMode,selYear,selMonth,totG,byCat,cats,budgets]);

  // ─── #4 DETECCIÓN DE GASTOS DUPLICADOS ───────────────────────────────────
  const gastosDuplicados=useMemo(()=>{
    if(!monthGastos.length)return[];
    const candidatos=[];
    for(let i=0;i<monthGastos.length;i++){
      for(let j=i+1;j<monthGastos.length;j++){
        const a=monthGastos[i],b=monthGastos[j];
        if(a.cat===b.cat&&a.sub===b.sub&&Number(a.monto)===Number(b.monto)){
          // Verificar que las fechas sean iguales o dentro de 1 día
          const fa=a.fecha?a.fecha.split("/").reverse().join("-"):"";
          const fb=b.fecha?b.fecha.split("/").reverse().join("-"):"";
          const diffDias=fa&&fb?Math.abs(new Date(fa)-new Date(fb))/(1000*60*60*24):0;
          if(diffDias<=1){
            const key=`${a.id}-${b.id}`;
            if(!candidatos.some(x=>x.key===key)){
              candidatos.push({key,a,b,monto:Number(a.monto),cat:cats.find(c=>c.id===a.cat),diffDias});
            }
          }
        }
      }
    }
    return candidatos;
  },[monthGastos,cats]);

  // ─── #2 PRESUPUESTO SUGERIDO — promedio últimos 3 meses ──────────────────
  const presupuestoSugerido=useMemo(()=>{
    const sugeridos={};
    cats.forEach(c=>{
      const totales=[];
      for(let i=1;i<=3;i++){
        const m=selMonth-i<0?selMonth-i+12:selMonth-i;
        const y=selMonth-i<0?selYear-1:selYear;
        const t=gastos.filter(g=>g.year===y&&g.month===m&&g.cat===c.id).reduce((s,g)=>s+Number(g.monto),0);
        if(t>0)totales.push(t);
      }
      if(totales.length>0){
        sugeridos[c.id]=Math.round(totales.reduce((s,x)=>s+x,0)/totales.length);
      }
      c.items.forEach(s=>{
        const key=`${c.id}|${s.id}`;
        const totSub=[];
        for(let i=1;i<=3;i++){
          const m=selMonth-i<0?selMonth-i+12:selMonth-i;
          const y=selMonth-i<0?selYear-1:selYear;
          const t=gastos.filter(g=>g.year===y&&g.month===m&&g.cat===c.id&&g.sub===s.id).reduce((ss,g)=>ss+Number(g.monto),0);
          if(t>0)totSub.push(t);
        }
        if(totSub.length>0){
          sugeridos[key]=Math.round(totSub.reduce((ss,x)=>ss+x,0)/totSub.length);
        }
      });
    });
    return sugeridos;
  },[cats,gastos,selMonth,selYear]);

  // ─── #7 AJUSTE POR INFLACIÓN ──────────────────────────────────────────────
  // Comparativa intermensual ajustada por IPC: cuánto subió mi gasto vs inflación
  const comparativaInflacion=useMemo(()=>{
    if(!inflData||viewMode!=="month")return null;
    const ipcMap={};
    inflData.forEach(x=>{ipcMap[x.fecha.slice(0,7)]=x.valor;});
    const prevM=selMonth===0?11:selMonth-1;
    const prevY=selMonth===0?selYear-1:selYear;
    const clavePrev=`${prevY}-${String(prevM+1).padStart(2,"0")}`;
    const ipcMes=ipcMap[clavePrev];
    if(ipcMes==null)return null;
    const gastoPrev=gastos.filter(g=>g.year===prevY&&g.month===prevM).reduce((s,g)=>s+Number(g.monto),0);
    if(!gastoPrev||!totG)return null;
    const varGasto=((totG-gastoPrev)/gastoPrev)*100;
    const gastoPrevAjustado=gastoPrev*(1+ipcMes/100);
    const superaInflacion=totG>gastoPrevAjustado;
    return{
      ipcMes,
      gastoPrev,
      gastoCurrent:totG,
      varGasto:varGasto.toFixed(1),
      gastoPrevAjustado:Math.round(gastoPrevAjustado),
      superaInflacion,
      diferencia:totG-gastoPrevAjustado,
      mesPrev:MONTHS[prevM],
      mesCurrent:MONTHS[selMonth],
    };
  },[inflData,viewMode,selMonth,selYear,gastos,totG]);

  const hormiga=useMemo(()=>{
    const counts={};
    monthGastos.forEach(x=>{const k=x.cat+"|"+x.sub;counts[k]=counts[k]||[];counts[k].push(Number(x.monto));});
    const minMonto=totG*0.01; // al menos 1% del total mensual para que valga la pena
    return Object.entries(counts)
      .filter(([,v])=>v.length>=5&&v.reduce((s,x)=>s+x,0)>=minMonto)
      .map(([k,v])=>{
        const [catId,subId]=k.split("|");
        const cat=cats.find(c=>c.id===catId);
        const sub=cat?.items.find(s=>s.id===subId);
        return{catId,subId,catLabel:cat?.label,subLabel:sub?.label,count:v.length,total:v.reduce((s,x)=>s+x,0),color:cat?.color,icon:sub?.icon};
      });
  },[monthGastos,cats,totG]);

  const addGasto=async()=>{
    if(!form.monto||isNaN(form.monto)||parseFloat(form.monto)<=0)return;
    const cat=cats.find(c=>c.id===form.cat);
    const sub=cat?.items.find(s=>s.id===form.sub);
    const d=new Date(form.fecha+"T12:00:00");
    const fYear=d.getFullYear(),fMonth=d.getMonth();
    const fechaFmt=d.toLocaleDateString("es-AR");
    const row={
      user_id:userId,year:fYear,month:fMonth,
      cat:form.cat,sub:form.sub,monto:parseFloat(form.monto),
      descripcion:form.desc||null,
      medio_pago:form.medio_pago||"efectivo",
      fecha:fechaFmt,
      tc_at_time:tc,
      cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon
    };
    const {data,error}=await supabase.from("gastos").insert(row).select().single();
    if(error){toast("Error al guardar: "+error.message,"error");return;}
    if(data)setGastos(gs=>[...gs,data]);
    toast(`Gasto guardado — ${fmt(row.monto,currency,tc)}`,"success");
    setForm(f=>({...f,monto:"",desc:"",fecha:todayISO()}));
    setShowForm(false);
    saveTcHistory(tc);
  };

  const delGasto=async(id)=>{
    await supabase.from("gastos").delete().eq("id",id).eq("user_id",userId);
    setGastos(gs=>gs.filter(g=>g.id!==id));
  };

  const openEditGasto=(g)=>{
    // Convertir fecha "DD/MM/YYYY" a "YYYY-MM-DD" para el input type=date
    let fechaISO=todayISO();
    if(g.fecha){
      const parts=g.fecha.split("/");
      if(parts.length===3) fechaISO=`${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
    }
    setEditGastoDraft({...g, fechaISO});
    setEditGastoError("");
    setEditGastoModal(true);
  };

  const saveEditGasto=async()=>{
    if(!editGastoDraft) return;
    if(!editGastoDraft.monto||isNaN(editGastoDraft.monto)||parseFloat(editGastoDraft.monto)<=0){setEditGastoError("El monto debe ser mayor a cero.");return;}
    setEditGastoLoading(true);setEditGastoError("");
    const cat=cats.find(c=>c.id===editGastoDraft.cat);
    const sub=cat?.items.find(s=>s.id===editGastoDraft.sub);
    const d=new Date(editGastoDraft.fechaISO+"T12:00:00");
    const fYear=d.getFullYear(), fMonth=d.getMonth();
    const fechaFmt=d.toLocaleDateString("es-AR");
    const updates={
      cat:editGastoDraft.cat, sub:editGastoDraft.sub,
      monto:parseFloat(editGastoDraft.monto),
      descripcion:editGastoDraft.descripcion||null,
      medio_pago:editGastoDraft.medio_pago||"efectivo",
      fecha:fechaFmt, year:fYear, month:fMonth,
      cat_label:cat?.label, sub_label:sub?.label,
      sub_icon:sub?.icon, cat_color:cat?.color, cat_icon:cat?.icon,
    };
    const {error}=await supabase.from("gastos").update(updates).eq("id",editGastoDraft.id).eq("user_id",userId);
    if(error){setEditGastoError("Error al guardar: "+error.message);setEditGastoLoading(false);return;}
    setGastos(gs=>gs.map(g=>g.id===editGastoDraft.id?{...g,...updates}:g));
    setEditGastoModal(false);
    setEditGastoDraft(null);
    setEditGastoLoading(false);
  };

  // ─── CARGA RÁPIDA ─────────────────────────────────────────────────────────
  const saveQuick=async(data)=>{
    setQuickSaving(true); setQuickError(""); setQuickOk(false);
    if(quickType==="gasto"){
      if(!data.monto||isNaN(data.monto)||parseFloat(data.monto)<=0){setQuickError("El monto debe ser mayor a cero.");setQuickSaving(false);return;}
      const cat=cats.find(c=>c.id===data.cat);
      const sub=cat?.items.find(s=>s.id===data.sub);
      const d=new Date(data.fecha+"T12:00:00");
      const row={user_id:userId,year:d.getFullYear(),month:d.getMonth(),cat:data.cat,sub:data.sub,
        monto:parseFloat(data.monto),descripcion:data.desc||null,medio_pago:data.medio_pago||"efectivo",
        fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,
        cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon};
      const {data:saved,error}=await supabase.from("gastos").insert(row).select().single();
      if(error){setQuickError("Error: "+error.message);setQuickSaving(false);return;}
      if(saved) setGastos(gs=>[...gs,saved]);
      saveTcHistory(tc);
    } else {
      if(!data.monto||isNaN(data.monto)||parseFloat(data.monto)<=0){setQuickError("El monto debe ser mayor a cero.");setQuickSaving(false);return;}
      const d=new Date(data.fecha+"T12:00:00");
      const row={user_id:userId,year:d.getFullYear(),month:d.getMonth(),tipo:data.tipo,monto:parseFloat(data.monto),tc_at_time:tc};
      const {data:saved,error}=await supabase.from("ingresos").insert(row).select().single();
      if(error){setQuickError("Error: "+error.message);setQuickSaving(false);return;}
      if(saved) setIngresos(is=>[...is,saved]);
      saveTcHistory(tc);
    }
    setQuickOk(true);
    setQuickSaving(false);
    setTimeout(()=>{setQuickModal(false);setQuickOk(false);},2500);
  };
  const fetchInflacion=async()=>{
    if(inflData) return;
    setInflLoading(true); setInflError("");
    try{
      const r=await fetch("https://api.argentinadatos.com/v1/finanzas/indices/inflacion");
      const j=await r.json();
      if(Array.isArray(j)&&j.length>0) setInflData(j);
      else setInflError("Sin datos de inflación disponibles.");
    }catch(e){ setInflError("Error al obtener IPC: "+e.message); }
    setInflLoading(false);
  };

  const fetchNoticias=async()=>{
    if(noticiasData) return;
    setNoticiasLoading(true);
    try{
      // 1. Datos reales de APIs argentinas
      const [rBlue,rOficial,rMerval]=await Promise.all([
        fetch("https://dolarapi.com/v1/dolares/blue").then(r=>r.json()).catch(()=>null),
        fetch("https://dolarapi.com/v1/dolares/oficial").then(r=>r.json()).catch(()=>null),
        fetch("https://api.argentinadatos.com/v1/finanzas/indices/inflacion").then(r=>r.json()).catch(()=>null),
      ]);
      const inflActual=Array.isArray(rMerval)?rMerval[rMerval.length-1]:null;
      const inflAnterior=Array.isArray(rMerval)&&rMerval.length>1?rMerval[rMerval.length-2]:null;
      const indicadores=[
        {nombre:"Dólar Blue",valor:rBlue?.venta?`$${rBlue.venta.toLocaleString("es-AR")}`:tcAuto?`$${tcAuto.toLocaleString("es-AR")}`:"—",variacion:rBlue?.venta&&rBlue?.compra?`Compra $${rBlue.compra.toLocaleString("es-AR")}`:"",positivo:true},
        {nombre:"Dólar Oficial BNA",valor:rOficial?.venta?`$${rOficial.venta.toLocaleString("es-AR")}`:tc?`$${tc.toLocaleString("es-AR")}`:"—",variacion:rOficial?.compra?`Compra $${rOficial.compra.toLocaleString("es-AR")}`:"",positivo:true},
        {nombre:"Inflación mensual",valor:inflActual?.valor!=null?`${inflActual.valor}%`:"—",variacion:inflActual&&inflAnterior?`Ant: ${inflAnterior.valor}% (${inflActual.fecha?.slice(0,7)||""})`:inflActual?.fecha?.slice(0,7)||"",positivo:inflActual?.valor!=null&&inflActual.valor<5},
        {nombre:"Brecha cambiaria",valor:rBlue?.venta&&rOficial?.venta?`${Math.round(((rBlue.venta/rOficial.venta)-1)*100)}%`:"—",variacion:"Blue vs Oficial",positivo:false},
      ];

      // 2. IA solo para noticias/análisis (no genera números)
      const prompt=`Sos un analista financiero de Argentina. Generá 5 noticias financieras recientes y relevantes de Argentina (${new Date().toLocaleDateString("es-AR")}).

IMPORTANTE: NO inventes cotizaciones, precios ni números específicos. Solo describí hechos, tendencias y contexto.

Respondé SOLO con JSON válido sin markdown:
{"noticias":[{"titulo":"...","resumen":"...","categoria":"Macro|Mercados|BCRA|Inversiones|Bonos|Sector","impacto":"positivo|negativo|neutral"},{"titulo":"...","resumen":"...","categoria":"...","impacto":"..."},{"titulo":"...","resumen":"...","categoria":"...","impacto":"..."},{"titulo":"...","resumen":"...","categoria":"...","impacto":"..."},{"titulo":"...","resumen":"...","categoria":"...","impacto":"..."}]}`;
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}],max_tokens:800,temperature:0.5})});
      const j=await r.json();
      const raw=j.choices?.[0]?.message?.content||"{}";
      const clean=raw.replace(/```json|```/g,"").trim();
      const aiData=JSON.parse(clean);
      setNoticiasData({indicadores,noticias:aiData.noticias||[]});
    }catch(e){setNoticiasData({error:"Error al cargar: "+e.message});}
    setNoticiasLoading(false);
  };

  const fetchConsejos=async()=>{
    if(consejosData) return;
    setConsejosLoading(true);
    try{
      const ultimosPorPlat=invSaldos.reduce((acc,s)=>{const p=s.plataforma;if(!acc[p]||acc[p].anio<s.anio||(acc[p].anio===s.anio&&acc[p].mes<s.mes))acc[p]=s;return acc;},{});
      const totalFondosARS=Object.values(ultimosPorPlat).reduce((s,x)=>{const v=Number(x.saldo);return s+(x.moneda==="USD"?v*(x.tc_at_time||tc):v);},0);
      const totalActivosARS=invActivos.reduce((s,a)=>s+valorActualARS(a),0);
      const carteraDesc=invActivos.length>0?invActivos.map(a=>`${a.nombre} (${a.ticker||""}) en ${a.plataforma}: ${a.cantidad} unidades`).join(", "):"Sin activos individuales";
      const fondosDesc=Object.entries(ultimosPorPlat).map(([p,s])=>`${p}: $${Number(s.saldo).toLocaleString("es-AR")} ${s.moneda}`).join(", ")||"Sin fondos cargados";
      const prompt=`Sos un asesor financiero especializado en Argentina. El usuario tiene la siguiente cartera:

Fondos/saldos: ${fondosDesc}
Total fondos (ARS): $${totalFondosARS.toLocaleString("es-AR")}
Activos individuales: ${carteraDesc}  
Total activos (ARS): $${totalActivosARS.toLocaleString("es-AR")}
Tasa inversión mensual: ${savRateReal}% de sus ingresos
TC actual: $${tc.toLocaleString("es-AR")}

Contexto Argentina ${new Date().getFullYear()}: inflación elevada, brecha cambiaria, tasas de interés reales negativas históricamente, CEDEARs como cobertura, bonos soberanos volátiles.

Dá 4 consejos de inversión concretos y accionables para Argentina en este momento. Sé directo, específico para el perfil mostrado. Mencioná instrumentos reales (plazos fijos UVA, FCI, CEDEARs, ON, T+1, etc). Máximo 200 palabras. Formato: 4 bullets concisos.`;
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}],max_tokens:500,temperature:0.6})});
      const j=await r.json();
      setConsejosData(j.choices?.[0]?.message?.content||"No se pudieron generar consejos.");
    }catch(e){setConsejosData("Error al obtener consejos: "+e.message);}
    setConsejosLoading(false);
  };

  // ─── FETCH TC HISTÓRICO (argentinadatos.com) ──────────────────────────────
  const fetchTCHistorico=async()=>{
    if(tcHistData) return;
    setTcHistLoading(true); setTcHistError("");
    try{
      const [rOf,rBl]=await Promise.all([
        fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial"),
        fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares/blue"),
      ]);
      const [jOf,jBl]=await Promise.all([rOf.json(),rBl.json()]);
      if(Array.isArray(jOf)&&Array.isArray(jBl)){
        setTcHistData({oficial:jOf,blue:jBl});
      } else {
        setTcHistError("No se pudieron obtener cotizaciones históricas.");
      }
    }catch(e){ setTcHistError("Error: "+e.message); }
    setTcHistLoading(false);
  };

  const addIngreso=async()=>{
    if(!ingForm.monto||isNaN(ingForm.monto))return;
    const d=new Date(ingForm.fecha+"T12:00:00");
    const fYear=d.getFullYear(),fMonth=d.getMonth();
    const row={user_id:userId,year:fYear,month:fMonth,tipo:ingForm.tipo,monto:parseFloat(ingForm.monto),tc_at_time:tc};
    const {data,error}=await supabase.from("ingresos").insert(row).select().single();
    if(error){toast("Error al guardar: "+error.message,"error");return;}
    if(data)setIngresos(is=>[...is,data]);
    setIngForm(f=>({...f,monto:"",fecha:todayISO()}));
    setShowIngForm(false);
    saveTcHistory(tc);
  };

  const delIngreso=async(id)=>{
    await supabase.from("ingresos").delete().eq("id",id).eq("user_id",userId);
    setIngresos(is=>is.filter(i=>i.id!==id));
  };

  // ─── INVERSIONES CRUD ────────────────────────────────────────────────────
  // Un movimiento (depósito o retiro) siempre:
  //   1. Se guarda en `inversiones` para el tracking mensual
  //   2. Actualiza `inv_saldos` sumando/restando al último saldo conocido
  const addInversion=async()=>{
    if(!invDraft.monto||isNaN(invDraft.monto)||parseFloat(invDraft.monto)<=0){setInvError("El monto debe ser mayor a cero.");return;}
    setInvSaving(true);setInvError("");
    const fechaUsar=invDraft.fecha||todayISO();
    const d=new Date(fechaUsar+"T12:00:00");
    const montoNum=parseFloat(invDraft.monto);
    const esRetiro=invDraft.tipo==="retiro";
    const delta=esRetiro?-montoNum:montoNum;

    // 1. Guardar movimiento
    const row={user_id:userId,plataforma:invDraft.plataforma,monto:montoNum,moneda:invDraft.moneda,
      descripcion:(esRetiro?"[RETIRO] ":"")+(invDraft.descripcion||""),
      mes:d.getMonth(),anio:d.getFullYear(),fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc};
    const {data,error}=await supabase.from("inversiones").insert(row).select().single();
    if(error){setInvError("Error: "+error.message);setInvSaving(false);return;}
    if(data)setInversiones(inv=>[...inv,data]);

    // 2. Calcular nuevo saldo: último saldo ± delta
    const platId=invDraft.plataforma;
    const monedaPlat=invDraft.moneda;
    const saldosPlat=[...invSaldos].filter(s=>s.plataforma===platId)
      .sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes!==b.mes?a.mes-b.mes:(a.created_at||"")>(b.created_at||"")?1:-1);
    const ultimoSaldo=saldosPlat[saldosPlat.length-1];
    const saldoBase=(ultimoSaldo&&ultimoSaldo.moneda===monedaPlat)?Number(ultimoSaldo.saldo):0;
    const nuevoSaldo=Math.max(0,saldoBase+delta);

    // 3. Insertar snapshot actualizado
    const saldoRow={user_id:userId,plataforma:platId,saldo:nuevoSaldo,moneda:monedaPlat,
      mes:d.getMonth(),anio:d.getFullYear(),fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,
      nota:invDraft.descripcion||(esRetiro?"Retiro":null)};
    const {data:sData}=await supabase.from("inv_saldos").insert(saldoRow).select().single();
    if(sData)setInvSaldos(s=>[...s,sData].sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes-b.mes));

    toast(`${esRetiro?"Retiro":"Depósito"} registrado en ${platTodasPlat.find(p=>p.id===platId)?.label||platId} — Nuevo saldo: ${nuevoSaldo.toLocaleString("es-AR")} ${monedaPlat}`,"success");
    setInvDraft(d=>({...d,monto:"",descripcion:"",tipo:"deposito"}));
    setInvModal(false);setInvSaving(false);
  };
  const delInversion=async(id)=>{
    if(!await confirm("¿Eliminar esta inversión?",{danger:true}))return;
    await supabase.from("inversiones").delete().eq("id",id).eq("user_id",userId);
    setInversiones(inv=>inv.filter(i=>i.id!==id));
  };

  // ─── SALDOS CRUD (Opción A) ───────────────────────────────────────────────
  const addSaldo=async()=>{
    if(!saldoDraft.saldo||isNaN(saldoDraft.saldo)||parseFloat(saldoDraft.saldo)<0){setSaldoError("Ingresá un saldo válido.");return;}
    setSaldoSaving(true);setSaldoError("");
    const fechaUsar=saldoDraft.fecha||todayISO();
    const d=new Date(fechaUsar+"T12:00:00");
    const row={user_id:userId,plataforma:saldoDraft.plataforma,saldo:parseFloat(saldoDraft.saldo),moneda:saldoDraft.moneda,mes:d.getMonth(),anio:d.getFullYear(),fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,nota:saldoDraft.nota||null};
    const {data,error}=await supabase.from("inv_saldos").insert(row).select().single();
    if(error){setSaldoError("Error: "+error.message);setSaldoSaving(false);return;}
    if(data)setInvSaldos(s=>[...s,data].sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes-b.mes));
    setSaldoDraft({plataforma:"cocos",saldo:"",moneda:"ARS",nota:"",fecha:""});
    setSaldoModal(false);setSaldoSaving(false);
  };
  const delSaldo=async(id)=>{
    if(!await confirm("¿Eliminar este saldo?",{danger:true}))return;
    await supabase.from("inv_saldos").delete().eq("id",id).eq("user_id",userId);
    setInvSaldos(s=>s.filter(x=>x.id!==id));
  };

  // Calcula ganancia/pérdida de una plataforma comparando saldo actual vs anterior
  const calcGananciaSaldo=(plat)=>{
    const historial=[...invSaldos].filter(s=>s.plataforma===plat).sort((a,b)=>{
      if(a.anio!==b.anio)return a.anio-b.anio;
      if(a.mes!==b.mes)return a.mes-b.mes;
      return(a.created_at||"")>(b.created_at||"")?1:-1;
    });
    if(historial.length<2)return null;
    const ultimo=historial[historial.length-1];
    const penultimo=historial[historial.length-2];
    const saldoActualARS=ultimo.moneda==="USD"?Number(ultimo.saldo)*(ultimo.tc_at_time||tc):Number(ultimo.saldo);
    const saldoAnteriorARS=penultimo.moneda==="USD"?Number(penultimo.saldo)*(penultimo.tc_at_time||tc):Number(penultimo.saldo);
    const diff=saldoActualARS-saldoAnteriorARS;
    const pct=saldoAnteriorARS>0?Math.round((diff/saldoAnteriorARS)*100):0;
    return{diff,pct,saldoActualARS,saldoAnteriorARS,ultimo,penultimo};
  };

  // ─── ACTIVOS CRUD (Opción B) ──────────────────────────────────────────────
  const addActivo=async()=>{
    if(!activoDraft.nombre.trim()){setActivoError("Ingresá el nombre del activo.");return;}
    if(!activoDraft.cantidad||isNaN(activoDraft.cantidad)||parseFloat(activoDraft.cantidad)<=0){setActivoError("La cantidad debe ser mayor a cero.");return;}
    if(!activoDraft.precio_compra||isNaN(activoDraft.precio_compra)||parseFloat(activoDraft.precio_compra)<=0){setActivoError("El precio de compra es obligatorio.");return;}
    setActivoSaving(true);setActivoError("");
    const fechaUsar=activoDraft.fecha_compra||todayISO();
    const row={
      user_id:userId,plataforma:activoDraft.plataforma,nombre:activoDraft.nombre.trim(),
      ticker:activoDraft.ticker.trim()||null,cantidad:parseFloat(activoDraft.cantidad),
      precio_compra:parseFloat(activoDraft.precio_compra),moneda_compra:activoDraft.moneda_compra,
      precio_actual:activoDraft.precio_actual?parseFloat(activoDraft.precio_actual):parseFloat(activoDraft.precio_compra),
      moneda_actual:activoDraft.moneda_actual,
      fecha_compra:new Date(fechaUsar+"T12:00:00").toLocaleDateString("es-AR"),
      tc_compra:tc,tc_actual:tc,activo:true,
      comision:activoDraft.comision?parseFloat(activoDraft.comision):0,
    };
    const {data,error}=await supabase.from("inv_activos").insert(row).select().single();
    if(error){setActivoError("Error: "+error.message);setActivoSaving(false);return;}
    if(data)setInvActivos(a=>[...a,data]);
    setActivoDraft({plataforma:"iol",nombre:"",ticker:"",cantidad:"",precio_compra:"",moneda_compra:"ARS",precio_actual:"",moneda_actual:"ARS",fecha_compra:"",comision:""});
    setActivoModal(false);setActivoSaving(false);
  };

  const updatePrecioActual=async()=>{
    if(!editActivoId||!editPrecioActual||isNaN(editPrecioActual))return;
    const {error}=await supabase.from("inv_activos").update({precio_actual:parseFloat(editPrecioActual),tc_actual:tc,updated_at:new Date().toISOString()}).eq("id",editActivoId).eq("user_id",userId);
    if(error){alert("Error: "+error.message);return;}
    setInvActivos(a=>a.map(x=>x.id===editActivoId?{...x,precio_actual:parseFloat(editPrecioActual),tc_actual:tc}:x));
    setEditPrecioModal(false);setEditActivoId(null);setEditPrecioActual("");
  };

  const delActivo=async(id)=>{
    if(!await confirm("¿Eliminar este activo?",{danger:true}))return;
    await supabase.from("inv_activos").update({activo:false}).eq("id",id).eq("user_id",userId);
    setInvActivos(a=>a.filter(x=>x.id!==id));
  };

  // Helpers para activos
  const costoEntradaARS=(a)=>{
    const base=a.cantidad*a.precio_compra;
    const comisionFactor=1+(Number(a.comision||0)/100);
    const baseConComision=base*comisionFactor;
    return a.moneda_compra==="USD"?baseConComision*(a.tc_compra||tc):baseConComision;
  };
  const valorActualARS=(a)=>{
    const base=a.cantidad*(a.precio_actual||a.precio_compra);
    return a.moneda_actual==="USD"?base*(a.tc_actual||tc):base;
  };
  const rendimientoActivo=(a)=>{
    const costo=costoEntradaARS(a),actual=valorActualARS(a);
    const diff=actual-costo;
    const pct=costo>0?((diff/costo)*100):0;
    return{diff,pct,costo,actual};
  };

  // Calculados después de helpers para evitar referencia antes de definición
  const totalActivosMemo=invActivos.reduce((s,a)=>s+valorActualARS(a),0);
  const gananciaActivosMemo=invActivos.reduce((s,a)=>s+rendimientoActivo(a).diff,0);
  const totalCarteraMemo=totalFondosMemo+totalActivosMemo;

  const saveTcHistory=async(tcValue)=>{
    const today=new Date().toISOString().slice(0,10);
    await supabase.from("tc_historico").upsert({fecha:today,tc_blue:tcValue},{onConflict:"fecha"});
  };

  const saveNewCat=async()=>{if(!catDraft.label.trim())return;const id="cat-"+Date.now();await supabase.from("categorias").insert({id,user_id:userId,label:catDraft.label.trim(),color:catDraft.color,icon:catDraft.icon,sort_order:cats.length});setCats(cs=>[...cs,{id,label:catDraft.label.trim(),color:catDraft.color,icon:catDraft.icon,items:[]}]);setCatModal(null);};
  const saveEditCat=async()=>{if(!catDraft.label.trim())return;await supabase.from("categorias").update({label:catDraft.label.trim(),color:catDraft.color,icon:catDraft.icon}).eq("id",editCatId).eq("user_id",userId);setCats(cs=>cs.map(c=>c.id===editCatId?{...c,label:catDraft.label.trim(),color:catDraft.color,icon:catDraft.icon}:c));setCatModal(null);};
  const delCat=async(id)=>{if(!await confirm("¿Eliminar categoría? También se eliminarán sus subcategorías.",{danger:true}))return;await supabase.from("categorias").delete().eq("id",id).eq("user_id",userId);await supabase.from("subcategorias").delete().eq("cat_id",id).eq("user_id",userId);setCats(cs=>cs.filter(c=>c.id!==id));toast("Categoría eliminada","success");};
  const saveNewSub=async()=>{if(!subDraft.label.trim())return;const id="sub-"+Date.now();const cat=cats.find(c=>c.id===editCatId);await supabase.from("subcategorias").insert({id,user_id:userId,cat_id:editCatId,label:subDraft.label.trim(),icon:subDraft.icon,sort_order:cat?.items.length||0});setCats(cs=>cs.map(c=>c.id===editCatId?{...c,items:[...c.items,{id,label:subDraft.label.trim(),icon:subDraft.icon}]}:c));setCatModal(null);};
  const saveEditSub=async()=>{if(!subDraft.label.trim())return;await supabase.from("subcategorias").update({label:subDraft.label.trim(),icon:subDraft.icon}).eq("id",editSubId).eq("user_id",userId);setCats(cs=>cs.map(c=>c.id===editCatId?{...c,items:c.items.map(s=>s.id===editSubId?{...s,label:subDraft.label.trim(),icon:subDraft.icon}:s)}:c));setCatModal(null);};
  const delSub=async(catId,subId)=>{await supabase.from("subcategorias").delete().eq("id",subId).eq("user_id",userId);setCats(cs=>cs.map(c=>c.id===catId?{...c,items:c.items.filter(s=>s.id!==subId)}:c));};

  // ── Medios de pago custom ─────────────────────────────────────────────────
  const saveNewMedio=async()=>{
    if(!medioDraft.label.trim()){return;}
    setMedioSaving(true);
    const id="medio-"+Date.now();
    const newMedio={id,label:medioDraft.label.trim(),color:medioDraft.color||"#94A3B8"};
    const {error}=await supabase.from("medios_pago_custom").insert({...newMedio,user_id:userId});
    if(error){
      // Si la tabla no existe todavía, igual agregamos en memoria para que funcione en la sesión
      console.warn("medios_pago_custom error (¿tabla creada?):",error.message);
      if(!error.message.includes("does not exist")){
        toast("Error al guardar: "+error.message,"error");
        setMedioSaving(false);
        return;
      }
    }
    setMediosExtra(ms=>[...ms,newMedio]);
    setMedioDraft({label:"",color:"#94A3B8"});
    setMedioModal(false);
    setMedioSaving(false);
  };
  const delMedio=async(id)=>{
    if(!await confirm("¿Eliminar este medio de pago?",{danger:true}))return;
    await supabase.from("medios_pago_custom").delete().eq("id",id).eq("user_id",userId);
    setMediosExtra(ms=>ms.filter(m=>m.id!==id));
  };

  // ── Tipos de ingreso CRUD ─────────────────────────────────────────────────
  const saveNewTipo=async()=>{
    if(!tipoDraft.label.trim())return;
    setTipoSaving(true);
    const id="tipo-"+Date.now();
    const nuevo={id,label:tipoDraft.label.trim(),grupo:tipoDraft.grupo,icon:tipoDraft.icon||"dollar"};
    // Guardar en medios_pago_custom reutilizando tabla (campo color = grupo)
    const {error}=await supabase.from("tipos_ingreso_custom").insert({...nuevo,user_id:userId}).catch(()=>({error:{message:"no table"}}));
    if(error){
      // Si la tabla no existe, igual funciona en memoria
      console.warn("tipos_ingreso_custom:",error.message);
    }
    setTiposExtra(ts=>[...ts,nuevo]);
    setTipoDraft({label:"",grupo:"ingreso",icon:"dollar"});
    setTipoModal(false);
    setTipoSaving(false);
  };
  const delTipo=async(id)=>{
    // Solo se pueden eliminar los custom, no los default
    if(!await confirm("¿Eliminar este tipo de ingreso?",{danger:true}))return;
    await supabase.from("tipos_ingreso_custom").delete().eq("id",id).eq("user_id",userId).catch(()=>{});
    setTiposExtra(ts=>ts.filter(t=>t.id!==id));
  };

  // Cargar tipos custom de Supabase
  useEffect(()=>{
    supabase.from("tipos_ingreso_custom").select("*").eq("user_id",userId)
      .then(({data})=>{if(data&&data.length>0)setTiposExtra(data.map(t=>({id:t.id,label:t.label,grupo:t.grupo||"ingreso",icon:t.icon||"dollar"})));})
      .catch(()=>{});
  },[userId]);// eslint-disable-line react-hooks/exhaustive-deps

  const saveBudgets=async()=>{
    const rows=Object.entries(budgetDraft).filter(([,v])=>v).map(([key,monto])=>{
      const parts=key.split("|");
      return parts.length===2
        ?{cat_id:parts[0],sub_id:parts[1],monto:Number(monto)}
        :{cat_id:parts[0],sub_id:'',monto:Number(monto)};
    });
    // Usar función RPC que hace DELETE + INSERT en una sola transacción SQL
    // Evita race conditions y problemas de PK compuesta con sub_id null
    const {error}=await supabase.rpc("guardar_presupuesto",{
      p_user_id:userId,
      p_month:selMonth,
      p_year:selYear,
      p_rows:rows
    });
    if(error){toast("Error al guardar: "+error.message,"error");return;}
    // Actualizar estado local
    const newBudgets={};
    rows.forEach(r=>{newBudgets[r.sub_id&&r.sub_id!==''?`${r.cat_id}|${r.sub_id}`:r.cat_id]=r.monto;});
    setBudgets(newBudgets);
    setBudgetModal(false);
    toast("Presupuesto guardado","success");
  };

  const replicarPresupuesto=async()=>{
    if(!Object.keys(budgets).length){toast("No hay presupuesto en este mes para copiar.","warning");return;}
    const nextMonth=selMonth===11?0:selMonth+1;
    const nextYear=selMonth===11?selYear+1:selYear;

    // Calcular factor de inflación del mes origen para ajustar al mes siguiente
    let inflFactor=1;
    let inflPct=null;
    if(inflData){
      const claveOrigen=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
      const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);
      const mesInfl=sorted.find(d=>d.fecha.slice(0,7)===claveOrigen);
      if(mesInfl){inflFactor=1+(mesInfl.valor/100);inflPct=mesInfl.valor;}
    }
    const aplicarInfl=inflData&&inflPct!==null;
    const msg=aplicarInfl
      ? `¿Copiar el presupuesto de ${MONTHS[selMonth]} ${selYear} a ${MONTHS[nextMonth]} ${nextYear} ajustado por inflación de ${MONTHS[selMonth]} (${inflPct}%)?`
      : `¿Copiar el presupuesto de ${MONTHS[selMonth]} ${selYear} a ${MONTHS[nextMonth]} ${nextYear}?`;
    if(!await confirm(msg))return;

    // Construir filas con montos ajustados
    const rows=Object.entries(budgets)
      .filter(([,monto])=>monto!=null&&Number(monto)>0)
      .map(([key,monto])=>{
        const montoAjustado=aplicarInfl?Math.round(Number(monto)*inflFactor):Number(monto);
        const parts=key.split("|");
        return parts.length===2
          ?{user_id:userId,cat_id:parts[0],sub_id:parts[1],monto:montoAjustado,month:nextMonth,year:nextYear}
          :{user_id:userId,cat_id:parts[0],sub_id:'',monto:montoAjustado,month:nextMonth,year:nextYear};
      });

    if(!rows.length){toast("No hay reglas de presupuesto con monto para copiar.","warning");return;}

    // Borrar destino e insertar
    const {error:delErr}=await supabase.from("presupuestos").delete().eq("user_id",userId).eq("month",nextMonth).eq("year",nextYear);
    if(delErr){toast("Error al preparar copia: "+delErr.message,"error");return;}

    const {data:inserted,error:insErr}=await supabase.from("presupuestos").insert(rows).select();
    if(insErr){toast("Error al copiar: "+insErr.message,"error");return;}
    if(!inserted||!inserted.length){toast("No se guardaron datos. Revisá la conexión.","error");return;}

    // Actualizar estado local directamente con los datos insertados confirmados
    // y navegar al mes destino — sin depender de loadData
    const newBudgets=Object.fromEntries(inserted.map(b=>[b.sub_id?`${b.cat_id}|${b.sub_id}`:b.cat_id,b.monto]));
    setBudgets(newBudgets);
    setSelMonth(nextMonth);
    setSelYear(nextYear);

    toast(`✓ Presupuesto copiado a ${MONTHS[nextMonth]} ${nextYear}${aplicarInfl?` (+${inflPct}% IPC ${MONTHS[selMonth]})`:""}  (${inserted.length} reglas)`,"success");
  };

  // ─── PRESUPUESTO INDEXADO POR IPC ─────────────────────────────────────────
  // Calcula el monto del presupuesto original ajustado a inflación acumulada
  // Lógica: si el presupuesto es de enero y estoy en marzo,
  // se ajusta por inflación de enero y febrero (los meses que ya pasaron entre origen y destino).
  // Si copio de abril a mayo, solo ajusta por inflación de abril.
  const calcBudgetIndexado=(montoOriginal,mesOrigen,anioOrigen)=>{
    if(!inflData||!montoOriginal)return montoOriginal;
    const claveOrigen=`${anioOrigen}-${String(mesOrigen+1).padStart(2,"0")}`;
    const claveActual=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
    if(claveOrigen>=claveActual)return montoOriginal;
    let factor=1;
    const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);
    for(const d of sorted){
      const ym=d.fecha.slice(0,7);
      // Incluir meses desde el origen (inclusive) hasta antes del mes actual (exclusive)
      // Ej: origen=enero, actual=marzo → incluir enero y febrero
      if(ym>=claveOrigen&&ym<claveActual) factor*=(1+(d.valor/100));
    }
    return Math.round(montoOriginal*factor);
  };

  // IPC acumulado desde enero del año hasta el mes anterior al actual
  // (mismo criterio que calcBudgetIndexado: meses ya transcurridos)
  const ipcAcumuladoPresupuesto=useMemo(()=>{
    if(!inflData)return null;
    const claveOrigen=`${selYear}-01`;
    const claveActual=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
    if(claveOrigen>=claveActual)return null;
    let factor=1;
    const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);
    for(const d of sorted){
      const ym=d.fecha.slice(0,7);
      // Igual criterio: desde enero inclusive hasta antes del mes actual
      if(ym>=claveOrigen&&ym<claveActual) factor*=(1+(d.valor/100));
    }
    return Math.round((factor-1)*100);
  },[inflData,selMonth,selYear]);

  // ─── PODER ADQUISITIVO PERDIDO ────────────────────────────────────────────
  const poderAdquisitivo=useMemo(()=>{
    if(!inflData||viewMode!=="month")return null;
    const claveMes=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
    const claveHoy=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    if(claveMes>=claveHoy)return null; // ya es el mes actual, no hay diferencia
    let factor=1;
    const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);
    for(const d of sorted){
      const ym=d.fecha.slice(0,7);
      if(ym>claveMes&&ym<=claveHoy) factor*=(1+(d.valor/100));
    }
    const gastosHoy=Math.round(totG*factor);
    const perdida=gastosHoy-totG;
    const pct=Math.round((factor-1)*100);
    return{gastosHoy,perdida,pct,factor};
  },[inflData,totG,selMonth,selYear,viewMode]);

  // ─── GASTOS RECURRENTES ────────────────────────────────────────────────────
  const loadRecurrentes=useCallback(async()=>{
    try{
      const {data}=await supabase.from("gastos_recurrentes").select("*").eq("user_id",userId);
      if(data)setRecurrentes(data);
    }catch{}
  },[userId]);

  useEffect(()=>{loadRecurrentes();},[loadRecurrentes]);

  const saveRecurrente=async()=>{
    if(!recDraft.cat||!recDraft.monto||parseFloat(recDraft.monto)<=0)return;
    setRecSaving(true);
    const cat=cats.find(c=>c.id===recDraft.cat);
    const sub=cat?.items.find(s=>s.id===recDraft.sub);
    const row={
      user_id:userId,cat:recDraft.cat,sub:recDraft.sub,monto:parseFloat(recDraft.monto),
      descripcion:recDraft.desc||null,medio_pago:recDraft.medio_pago||"efectivo",
      cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon,
      activo:true
    };
    const {data,error}=await supabase.from("gastos_recurrentes").insert(row).select().single();
    if(error){
      // Si la tabla no existe, guardar en memoria
      if(error.message.includes("does not exist")){
        setRecurrentes(rs=>[...rs,{...row,id:"rec-"+Date.now()}]);
      } else {toast("Error: "+error.message,"error");}
    } else if(data){setRecurrentes(rs=>[...rs,data]);}
    setRecDraft({cat:cats[0]?.id||"",sub:cats[0]?.items[0]?.id||"",monto:"",desc:"",medio_pago:"efectivo"});
    setRecSaving(false);
  };

  const delRecurrente=async(id)=>{
    if(!await confirm("¿Eliminar gasto recurrente?",{danger:true}))return;
    await supabase.from("gastos_recurrentes").delete().eq("id",id).eq("user_id",userId);
    setRecurrentes(rs=>rs.filter(r=>r.id!==id));
  };

  const aplicarRecurrentesMes=async()=>{
    if(!recurrentes.length){toast("No hay gastos recurrentes definidos.","warning");return;}
    const existentes=monthGastos.filter(g=>g.recurrente_id);
    const yaAplicados=new Set(existentes.map(g=>g.recurrente_id));
    const pendientes=recurrentes.filter(r=>r.activo&&!yaAplicados.has(r.id));
    if(!pendientes.length){toast(`Todos los recurrentes ya fueron aplicados en ${MONTHS[selMonth]} ${selYear}.`,"info");return;}
    if(!await confirm(`¿Aplicar ${pendientes.length} gasto(s) recurrente(s) a ${MONTHS[selMonth]} ${selYear}?`))return;
    const rows=pendientes.map(r=>{
      const d=new Date(selYear,selMonth,1);
      return{
        user_id:userId,year:selYear,month:selMonth,
        cat:r.cat,sub:r.sub,monto:r.monto,descripcion:r.descripcion,
        medio_pago:r.medio_pago||"efectivo",
        fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,
        cat_label:r.cat_label,sub_label:r.sub_label,sub_icon:r.sub_icon,
        cat_color:r.cat_color,cat_icon:r.cat_icon,
        recurrente_id:r.id
      };
    });
    const {data:saved,error}=await supabase.from("gastos").insert(rows).select();
    if(error){toast("Error: "+error.message,"error");return;}
    if(saved)setGastos(gs=>[...gs,...saved]);
    toast(`✓ ${saved.length} gasto(s) recurrente(s) aplicados a ${MONTHS[selMonth]} ${selYear}`,"success");
    saveTcHistory(tc);
  };

  // ─── MODO CUOTAS ───────────────────────────────────────────────────────────
  // Guarda un gasto en N cuotas distribuyendo en meses consecutivos
  const saveGastoCuotas=async(formData,nCuotas,esUSD)=>{
    if(!formData.monto||parseFloat(formData.monto)<=0)return;
    const montoTotal=parseFloat(formData.monto);
    const montoCuota=esUSD ? montoTotal : Math.round(montoTotal/nCuotas);
    const baseDate=new Date(formData.fecha+"T12:00:00");
    const cat=cats.find(c=>c.id===formData.cat);
    const subId=esUSD?"cuota-usd":formData.sub;
    const catId=esUSD?"financiero":formData.cat;
    const catFinal=esUSD?cats.find(c=>c.id==="financiero"):cat;
    const subFinal=catFinal?.items.find(s=>s.id===subId);
    const rows=Array.from({length:nCuotas},(_,i)=>{
      const d=new Date(baseDate.getFullYear(),baseDate.getMonth()+i,1);
      const montoRow=esUSD ? Math.round(montoTotal*tc/nCuotas) : montoCuota;
      return{
        user_id:userId,year:d.getFullYear(),month:d.getMonth(),
        cat:catId,sub:subId,
        monto:montoRow,
        descripcion:`${formData.desc||"Cuota"} ${i+1}/${nCuotas}${esUSD?` (USD ${(montoTotal/nCuotas).toFixed(0)})`:""}`,
        medio_pago:formData.medio_pago||"efectivo",
        fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,
        cat_label:catFinal?.label,sub_label:subFinal?.label||"Cuota",
        sub_icon:subFinal?.icon||"dollar",cat_color:catFinal?.color,cat_icon:catFinal?.icon,
        cuota_grupo:formData.fecha+"-"+Date.now(),cuota_num:i+1,cuota_total:nCuotas
      };
    });
    const {data:saved,error}=await supabase.from("gastos").insert(rows).select();
    if(error){toast("Error al guardar cuotas: "+error.message,"error");return;}
    if(saved)setGastos(gs=>[...gs,...saved]);

    // ── Agregar cuotas al presupuesto de cada mes ───────────────────────────
    // Por cada mes de cuota, hacemos upsert sumando al presupuesto existente
    try{
      for(let i=0;i<nCuotas;i++){
        const d=new Date(baseDate.getFullYear(),baseDate.getMonth()+i,1);
        const mY=d.getFullYear(),mM=d.getMonth();
        const montoRow=esUSD ? Math.round(montoTotal*tc/nCuotas) : montoCuota;
        const budKey=subId?`${catId}|${subId}`:catId;
        // Buscar si ya existe presupuesto para esa cat/sub en ese mes
        const {data:existing}=await supabase.from("presupuestos")
          .select("*").eq("user_id",userId).eq("month",mM).eq("year",mY)
          .eq("cat_id",catId).eq("sub_id",subId||null).maybeSingle();
        if(existing){
          await supabase.from("presupuestos").update({monto:existing.monto+montoRow})
            .eq("id",existing.id).eq("user_id",userId);
        } else {
          await supabase.from("presupuestos").insert({
            user_id:userId,cat_id:catId,sub_id:subId||null,
            monto:montoRow,month:mM,year:mY
          });
        }
      }
    }catch(e){console.warn("No se pudo actualizar presupuesto de cuotas:",e);}

    toast(`✓ ${nCuotas} cuotas guardadas desde ${MONTHS[baseDate.getMonth()]} ${baseDate.getFullYear()}`,"success");
    saveTcHistory(tc);
    setCuotasMode(false);setCuotasN(3);setCuotasUSD(false);
    setShowForm(false);
  };

  // ─── EXPORTAR XLSX ────────────────────────────────────────────────────────
  const exportarXLSX=async()=>{
    const data=viewMode==="year"?yearGastos:monthGastos;
    if(!data.length){toast("No hay datos para exportar.","warning");return;}
    try{
      const XLSX=await loadSheetJS();
      // Hoja 1: gastos detalle
      const wsData=[
        ["Fecha","Año","Mes","Categoría","Subcategoría","Descripción","Monto ARS","Medio de Pago","TC al momento","Monto USD (aprox)"],
        ...data.map(g=>{const tcR=g.tc_at_time||tc;return[g.fecha||"",g.year||"",MONTHS[g.month]||"",g.cat_label||g.cat||"",g.sub_label||g.sub||"",g.descripcion||"",Number(g.monto),g.medio_pago||"efectivo",tcR,+(g.monto/tcR).toFixed(2)];})
      ];
      // Hoja 2: resumen por categoría
      const resData=[
        ["Categoría","Total ARS","% del total","Presupuesto","Diferencia"],
        ...cats.filter(c=>byCat[c.id]>0).sort((a,b)=>(byCat[b.id]||0)-(byCat[a.id]||0)).map(c=>{
          const v=byCat[c.id]||0;const b=budgets[c.id]||null;
          return[c.label,v,totG>0?+(v/totG*100).toFixed(1):0,b||"",b?b-v:""];
        }),
        ["TOTAL",totG,"100%","",""]
      ];
      const wb=XLSX.utils.book_new();
      const ws1=XLSX.utils.aoa_to_sheet(wsData);
      const ws2=XLSX.utils.aoa_to_sheet(resData);
      XLSX.utils.book_append_sheet(wb,ws1,"Gastos");
      XLSX.utils.book_append_sheet(wb,ws2,"Resumen");
      XLSX.writeFile(wb,`finanzas_${viewMode==="year"?selYear:`${MONTHS[selMonth]}_${selYear}`}.xlsx`);
      toast("✓ XLSX exportado","success");
    }catch(e){toast("Error al exportar: "+e.message,"error");}
  };

  // ─── IMPORTAR CSV BANCARIO ────────────────────────────────────────────────
  // Detecta formato BNA, BBVA, Galicia por columnas
  const parsearCSVBanco=async(file)=>{
    setCsvLoading(true);setCsvError("");setCsvRows([]);setCsvMapped([]);
    try{
      const text=await file.text();
      const lines=text.split(/\r?\n/).filter(l=>l.trim());
      if(lines.length<2){setCsvError("Archivo vacío o sin datos.");setCsvLoading(false);return;}
      // Detectar separador
      const sep=lines[0].includes(";")?";":",";
      const headers=lines[0].split(sep).map(h=>h.trim().replace(/"/g,"").toLowerCase());
      const rows=lines.slice(1).map(l=>{
        const vals=l.split(sep).map(v=>v.trim().replace(/"/g,""));
        const obj={};headers.forEach((h,i)=>{obj[h]=vals[i]||"";});
        return obj;
      }).filter(r=>Object.values(r).some(v=>v));
      // Detectar banco por columnas
      let banco="generico";
      if(headers.some(h=>h.includes("débito")||h.includes("debito"))) banco="bna";
      else if(headers.some(h=>h.includes("importe"))) banco="bbva";
      else if(headers.some(h=>h.includes("monto"))) banco="galicia";
      // Mapear filas a formato gasto
      const mapped=rows.map((r,i)=>{
        let monto=0,fecha="",desc="";
        if(banco==="bna"){
          monto=parseFloat((r["débito"]||r["debito"]||"0").replace(/\./g,"").replace(",","."))||0;
          fecha=r["fecha"]||r["fecha valor"]||"";
          desc=r["descripción"]||r["descripcion"]||r["concepto"]||"";
        } else if(banco==="bbva"){
          monto=parseFloat((r["importe"]||"0").replace(/\./g,"").replace(",","."))||0;
          fecha=r["fecha"]||r["f. valor"]||"";
          desc=r["concepto"]||r["descripción"]||"";
        } else if(banco==="galicia"){
          monto=parseFloat((r["monto"]||"0").replace(/\./g,"").replace(",","."))||0;
          fecha=r["fecha"]||"";
          desc=r["descripción"]||r["descripcion"]||r["comercio"]||"";
        } else {
          // genérico: buscar columnas más comunes
          const kMonto=headers.find(h=>h.includes("monto")||h.includes("importe")||h.includes("débito")||h.includes("debito")||h.includes("amount"));
          const kFecha=headers.find(h=>h.includes("fecha")||h.includes("date"));
          const kDesc=headers.find(h=>h.includes("desc")||h.includes("concepto")||h.includes("comercio")||h.includes("detail"));
          monto=parseFloat((r[kMonto]||"0").replace(/\./g,"").replace(",","."))||0;
          fecha=r[kFecha]||"";
          desc=r[kDesc]||"";
        }
        if(monto<0) monto=-monto; // normalizar negativos
        // Auto-asignar categoría básica por palabras clave
        const dl=desc.toLowerCase();
        let cat="otros",sub="imprevistos";
        if(dl.includes("super")||dl.includes("coto")||dl.includes("dia")||dl.includes("carrefour")||dl.includes("jumbo")){cat="alimentacion";sub="supermercado";}
        else if(dl.includes("farmacia")||dl.includes("drogueria")){cat="salud";sub="medicamentos";}
        else if(dl.includes("nafta")||dl.includes("ypf")||dl.includes("shell")||dl.includes("axion")){cat="transporte";sub="nafta";}
        else if(dl.includes("netflix")||dl.includes("spotify")||dl.includes("disney")||dl.includes("hbo")){cat="ocio";sub="streaming";}
        else if(dl.includes("peaje")){cat="transporte";sub="peaje";}
        else if(dl.includes("restaur")||dl.includes("mcdo")||dl.includes("burger")||dl.includes("pizza")){cat="alimentacion";sub="restaurante";}
        else if(dl.includes("delivery")||dl.includes("pedidos ya")||dl.includes("rappi")){cat="alimentacion";sub="delivery";}
        return{_id:i,monto,fecha,desc,cat,sub,seleccionado:monto>0};
      }).filter(r=>r.monto>0);
      setCsvRows(rows);setCsvMapped(mapped);
      toast(`✓ ${mapped.length} movimientos detectados (banco: ${banco})`,"success");
    }catch(e){setCsvError("Error al parsear: "+e.message);}
    setCsvLoading(false);
  };

  const guardarCSVImportados=async()=>{
    const seleccionados=csvMapped.filter(r=>r.seleccionado);
    if(!seleccionados.length){toast("No hay filas seleccionadas.","warning");return;}
    setCsvSaving(true);
    const filas=seleccionados.map(r=>{
      const cat=cats.find(c=>c.id===r.cat)||cats[cats.length-1];
      const sub=cat?.items.find(s=>s.id===r.sub)||cat?.items[0];
      // parsear fecha DD/MM/AAAA o AAAA-MM-DD
      let fechaFmt=todayISO();
      if(r.fecha){
        const parts=r.fecha.includes("/")?r.fecha.split("/"):r.fecha.split("-");
        if(parts.length===3){
          fechaFmt=parts[0].length===4?r.fecha:`${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
        }
      }
      const d=new Date(fechaFmt+"T12:00:00");
      return{user_id:userId,year:d.getFullYear(),month:d.getMonth(),cat:cat.id,sub:sub?.id||"",monto:r.monto,descripcion:r.desc||"Importado CSV",medio_pago:"transferencia",fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon};
    });
    const {data:saved,error}=await supabase.from("gastos").insert(filas).select();
    if(error){toast("Error: "+error.message,"error");setCsvSaving(false);return;}
    if(saved)setGastos(gs=>[...gs,...saved]);
    addChangeLog("Importación CSV",`${saved.length} gastos importados`);
    toast(`✓ ${saved.length} gastos importados`,"success");
    setCsvModal(false);setCsvRows([]);setCsvMapped([]);setCsvSaving(false);
  };

  // ─── COMPARTIR MES ────────────────────────────────────────────────────────
  const generarShareUrl=()=>{
    const resumen={
      mes:MONTHS[selMonth],anio:selYear,
      ingresos:totI,gastos:totG,disponible:dispGastarConRollover,
      categorias:cats.filter(c=>byCat[c.id]>0).map(c=>({label:c.label,total:byCat[c.id],pct:totG>0?Math.round((byCat[c.id]/totG)*100):0})).sort((a,b)=>b.total-a.total)
    };
    const b64=btoa(unescape(encodeURIComponent(JSON.stringify(resumen))));
    const url=`${window.location.origin}${window.location.pathname}?share=${b64}`;
    setShareUrl(url);setShareModal(true);
  };

  // ─── RECORDATORIO RECURRENTES ─────────────────────────────────────────────
  const hayRecurrentesSinAplicar=useMemo(()=>{
    if(!recurrentes.length)return false;
    // Si hay recurrentes definidos y ningún gasto del mes actual viene de recurrente
    const gastosMesConRec=monthGastos.filter(g=>g.recurrente_id).length;
    return gastosMesConRec===0&&recurrentes.length>0;
  },[recurrentes,monthGastos]);

  // ─── GUARDAR INLINE EDIT ──────────────────────────────────────────────────
  const saveInlineEdit=async(gastoId)=>{
    if(!inlineEditData.monto||parseFloat(inlineEditData.monto)<=0)return;
    const cat=cats.find(c=>c.id===inlineEditData.cat);
    const sub=cat?.items.find(s=>s.id===inlineEditData.sub);
    const updates={monto:parseFloat(inlineEditData.monto),cat:inlineEditData.cat,sub:inlineEditData.sub,cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon,descripcion:inlineEditData.descripcion||null};
    const {error}=await supabase.from("gastos").update(updates).eq("id",gastoId).eq("user_id",userId);
    if(error){toast("Error: "+error.message,"error");return;}
    setGastos(gs=>gs.map(g=>g.id===gastoId?{...g,...updates}:g));
    addChangeLog("Edición gasto",`ID ${gastoId} → $${updates.monto} (${cat?.label})`);
    setInlineEditId(null);setInlineEditData({});
    toast("✓ Gasto actualizado","success");
  };

  // ─── EXPORTAR CSV ─────────────────────────────────────────────────────────
  const exportarCSV=()=>{
    const data=viewMode==="year"?yearGastos:monthGastos;
    if(!data.length){toast("No hay datos para exportar.","warning");return;}
    const headers=["Fecha","Año","Mes","Categoría","Subcategoría","Descripción","Monto ARS","Medio de Pago","TC al momento","Monto USD (aprox)"];
    const rows=data.map(g=>{
      const tcRow=g.tc_at_time||tc;
      return[
        g.fecha||"",g.year||"",MONTHS[g.month]||"",
        g.cat_label||g.cat||"",g.sub_label||g.sub||"",
        (g.descripcion||"").replace(/,/g,";"),
        g.monto,g.medio_pago||"efectivo",
        tcRow,
        (g.monto/tcRow).toFixed(2)
      ].join(",");
    });
    const csv="\uFEFF"+[headers.join(","),...rows].join("\n"); // BOM para Excel en español
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`gastos_${viewMode==="year"?selYear:`${MONTHS[selMonth]}_${selYear}`}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarIngresos=()=>{
    const data=viewMode==="year"?yearIngresos:monthIngresos;
    if(!data.length){toast("No hay ingresos para exportar.","warning");return;}
    const headers=["Año","Mes","Tipo","Monto ARS","TC al momento","Monto USD (aprox)"];
    const rows=data.map(i=>{
      const tcRow=i.tc_at_time||tc;
      return[i.year||"",MONTHS[i.month]||"",i.tipo||"",(i.monto||0),tcRow,((i.monto||0)/tcRow).toFixed(2)].join(",");
    });
    const csv="\uFEFF"+[headers.join(","),...rows].join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download=`ingresos_${viewMode==="year"?selYear:`${MONTHS[selMonth]}_${selYear}`}.csv`;
    a.click();URL.revokeObjectURL(url);
  };

  const buildCtx=()=>{
    const lines=[
      `Período: ${viewMode==="year"?`Año ${selYear}`:`${MONTHS[selMonth]} ${selYear}`}`,
      `Ingresos: $${totI.toLocaleString("es-AR")}`,`Gastos: $${totG.toLocaleString("es-AR")}`,
      `Balance: $${bal.toLocaleString("es-AR")}`,`Tasa de ahorro: ${savRate}%`,`\nGastos por categoría:`,
    ];
    cats.forEach(c=>{
      const v=byCat[c.id]||0;
      if(v>0){
        lines.push(`  - ${c.label}: $${v.toLocaleString("es-AR")} (${totG>0?Math.round((v/totG)*100):0}%)`);
        const b=budgets[c.id];
        if(b)lines.push(`    Presupuesto cat: $${b.toLocaleString("es-AR")} | ${Math.round((v/b)*100)}%`);
        c.items.forEach(s=>{
          const key=`${c.id}|${s.id}`;
          const sv=bySub[key]||0;
          const sb=budgets[key];
          if(sv>0||sb){lines.push(`    · ${s.label}: $${sv.toLocaleString("es-AR")}${sb?` / presup $${sb.toLocaleString("es-AR")} (${Math.round((sv/sb)*100)}%)`:""}`);}
        });
      }
    });
    if(hormiga.length>0){lines.push(`\nGastos hormiga:`);hormiga.forEach(h=>lines.push(`  - ${h.subLabel}: ${h.count} txs, $${h.total.toLocaleString("es-AR")}`));}
    const medioTop=mediosTodos.filter(m=>byMedio[m.id]>0).sort((a,b)=>byMedio[b.id]-byMedio[a.id]);
    if(medioTop.length>0){lines.push(`\nMedios de pago más usados:`);medioTop.forEach(m=>lines.push(`  - ${m.label}: $${byMedio[m.id].toLocaleString("es-AR")}`));}
    return lines.join("\n");
  };

  const [aiChart,setAiChart]=useState(null);
  const [aiCargaModal,setAiCargaModal]=useState(false);
  const [aiCargaTab,setAiCargaTab]=useState("texto"); // "texto" | "imagen" | "bulk" | "excel"
  const [aiCargaText,setAiCargaText]=useState("");
  const [aiCargaBulk,setAiCargaBulk]=useState("");
  const [aiCargaLoading,setAiCargaLoading]=useState(false);
  const [aiCargaResult,setAiCargaResult]=useState(null); // objeto o array
  const [aiCargaImageB64,setAiCargaImageB64]=useState(null);
  const [aiCargaImageName,setAiCargaImageName]=useState("");
  const [aiCargaExcelName,setAiCargaExcelName]=useState("");
  const [aiCargaExcelPreview,setAiCargaExcelPreview]=useState([]); // filas crudas para preview

  // ─── EDITAR GASTO ─────────────────────────────────────────────────────────
  const [editGasto,setEditGasto]=useState({open:false,draft:null,loading:false,error:""});
  const editGastoModal=editGasto.open;
  const editGastoDraft=editGasto.draft;
  const editGastoLoading=editGasto.loading;
  const editGastoError=editGasto.error;
  const setEditGastoModal=(v)=>setEditGasto(s=>({...s,open:v}));
  const setEditGastoDraft=(v)=>setEditGasto(s=>({...s,draft:typeof v==="function"?v(s.draft):v}));
  const setEditGastoLoading=(v)=>setEditGasto(s=>({...s,loading:v}));
  const setEditGastoError=(v)=>setEditGasto(s=>({...s,error:v}));

  // ─── TC HISTÓRICO ──────────────────────────────────────────────────────────
  const [tcHistData,setTcHistData]=useState(null); // {oficial:[],blue:[]}
  const [tcHistLoading,setTcHistLoading]=useState(false);
  const [tcHistError,setTcHistError]=useState("");

  // ─── CARGA RÁPIDA DASHBOARD ────────────────────────────────────────────────
  const [quickModal,setQuickModal]=useState(false);   // abre el modal
  const [quickType,setQuickType]=useState("gasto");   // "gasto" | "ingreso"
  const [quickSaving,setQuickSaving]=useState(false);
  const [quickError,setQuickError]=useState("");
  const [quickOk,setQuickOk]=useState(false);
  const [fabOpen,setFabOpen]=useState(false);

  // OR_KEY removida del frontend — las llamadas a Gemini van a /api/ai (proxy seguro)

  // ─── AI CARGA INTELIGENTE ──────────────────────────────────────────────────
  const buildCargaPrompt=(text)=>{
    const catList=cats.map(c=>`${c.id} (${c.label}): ${c.items.map(s=>`${s.id} (${s.label})`).join(", ")}`).join("\n");
    const mediosList=mediosTodos.map(m=>`${m.id} (${m.label})`).join(", ");
    return `Sos un asistente de finanzas personales para Argentina. El usuario describe un gasto y vos lo clasificás automáticamente.\n\nCategorías disponibles:\n${catList}\n\nMedios de pago disponibles: ${mediosList}\n\nTexto del usuario: "${text}"\n\nRespondé SOLO con JSON válido, sin markdown ni texto extra:\n{"monto":0,"descripcion":"","cat":"","cat_label":"","sub":"","sub_label":"","medio_pago":"efectivo","medio_label":"","confianza":0.9,"nota":""}`;
  };

  const buildBulkPrompt=(text)=>{
    const catList=cats.map(c=>`${c.id} (${c.label}): ${c.items.map(s=>`${s.id} (${s.label})`).join(", ")}`).join("\n");
    return `Sos un asistente de finanzas personales para Argentina. Interpretá cada línea como un gasto separado.\n\nCategorías disponibles:\n${catList}\nMedios de pago disponibles: ${mediosTodos.map(m=>`${m.id} (${m.label})`).join(", ")}\n\nLista de gastos (una por línea):\n${text}\n\nRespondé SOLO con JSON array válido (sin markdown ni texto extra):\n[{"monto":0,"descripcion":"","cat":"","cat_label":"","sub":"","sub_label":"","medio_pago":"efectivo","medio_label":"","confianza":0.9}]`;
  };

  const buildImagePrompt=()=>{
    const catList=cats.map(c=>`${c.id} (${c.label}): ${c.items.map(s=>`${s.id} (${s.label})`).join(", ")}`).join("\n");
    return `Analizá este ticket, factura o imagen de gasto. Si hay múltiples ítems o rubros claramente distintos (ej: supermercado con carnes, lácteos, limpieza), separá cada uno en un objeto distinto. Si es un gasto único o no se puede separar con claridad, devolvé un array de un solo elemento.\n\nCategorías disponibles:\n${catList}\nMedios de pago disponibles: ${mediosTodos.map(m=>`${m.id} (${m.label})`).join(", ")}\n\nRespondé SOLO con JSON array válido (sin markdown ni texto extra), un objeto por gasto:\n[{"monto":0,"descripcion":"","cat":"","cat_label":"","sub":"","sub_label":"","medio_pago":"efectivo","medio_label":"","confianza":0.9,"comercio":"","nota":""}]`;
  };

  const buildExcelPrompt=(rows)=>{
    const catList=cats.map(c=>`${c.id} (${c.label}): ${c.items.map(s=>`${s.id} (${s.label})`).join(", ")}`).join("\n");
    const mediosList=mediosTodos.map(m=>`${m.id} (${m.label})`).join(", ");
    const rowsText=rows.map((r,i)=>`Fila ${i+1}: ${Object.entries(r).map(([k,v])=>`${k}=${v}`).join(" | ")}`).join("\n");
    return `Sos un asistente de finanzas personales para Argentina. Analizá estas filas de una planilla de gastos y clasificá cada una.\n\nIMPORTANTE sobre fechas: Intentá detectar la columna de fecha (puede llamarse "fecha", "date", "día", "Fecha", etc.) y preservá el valor exacto. Si la fecha está en formato Excel numérico (ej: 45678), convertila a DD/MM/AAAA. Si no hay fecha, usá null.\n\nCategorías disponibles:\n${catList}\n\nMedios de pago disponibles: ${mediosList}\n\nFilas de la planilla:\n${rowsText}\n\nRespondé SOLO con JSON array válido (sin markdown ni texto extra), una fila = un objeto:\n[{"monto":0,"descripcion":"","cat":"","cat_label":"","sub":"","sub_label":"","medio_pago":"efectivo","medio_label":"","fecha":"DD/MM/AAAA","confianza":0.9}]`;
  };

  const loadSheetJS=()=>new Promise((res,rej)=>{
    if(window.XLSX){res(window.XLSX);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload=()=>res(window.XLSX);
    s.onerror=rej;
    document.head.appendChild(s);
  });

  const parseExcel=async(file)=>{
    if(!file)return;
    setAiCargaExcelName(file.name);
    setAiCargaResult(null);
    setAiCargaLoading(true);
    try{
      const XLSX=await loadSheetJS();
      const ab=await file.arrayBuffer();
      const wb=XLSX.read(ab,{type:"array",cellDates:true});
      const sheetName=wb.SheetNames[0];
      const ws=wb.Sheets[sheetName];
      const rows=XLSX.utils.sheet_to_json(ws,{defval:""});
      if(!rows.length){setAiCargaResult({error:"El archivo no tiene datos."});setAiCargaLoading(false);return;}
      // Limitar a 100 filas para no exceder tokens
      const limited=rows.slice(0,100);
      setAiCargaExcelPreview(limited.slice(0,5));
      // Limpiar filas: convertir fechas JS a string legible
      const cleaned=limited.map(row=>{
        const out={};
        Object.entries(row).forEach(([k,v])=>{
          if(v instanceof Date){
            out[k]=`${String(v.getDate()).padStart(2,"0")}/${String(v.getMonth()+1).padStart(2,"0")}/${v.getFullYear()}`;
          } else {
            out[k]=String(v).trim();
          }
        });
        return out;
      }).filter(r=>Object.values(r).some(v=>v&&v!==""));

      // Si hay más de 30 filas, procesar en batches de 30
      const BATCH=30;
      const allResults=[];
      for(let i=0;i<cleaned.length;i+=BATCH){
        const batch=cleaned.slice(i,i+BATCH);
        const raw=await callGeminiCarga([{role:"user",content:buildExcelPrompt(batch)}]);
        const clean2=raw.replace(/```json|```/g,"").trim();
        const parsed=JSON.parse(clean2);
        allResults.push(...(Array.isArray(parsed)?parsed:[parsed]));
      }
      setAiCargaResult(allResults);
    }catch(e){setAiCargaResult({error:"Error al procesar archivo: "+e.message});}
    setAiCargaLoading(false);
  };

  // ✅ Proxy seguro: OR_KEY vive en el servidor (api/ai.js), nunca en el frontend
  const callGeminiCarga=async(messages)=>{
    const r=await fetch("/api/ai",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages,max_tokens:2000,temperature:0.1})
    });
    const j=await r.json();
    if(j.error)throw new Error(j.error.message);
    return j.choices?.[0]?.message?.content||"";
  };

  const parseGastoTexto=async()=>{
    if(!aiCargaText.trim())return;
    setAiCargaLoading(true);setAiCargaResult(null);
    try{
      const raw=await callGeminiCarga([{role:"user",content:buildCargaPrompt(aiCargaText)}]);
      const clean=raw.replace(/```json|```/g,"").trim();
      setAiCargaResult(JSON.parse(clean));
    }catch(e){setAiCargaResult({error:"Error al interpretar: "+e.message});}
    setAiCargaLoading(false);
  };

  const parseGastoBulk=async()=>{
    if(!aiCargaBulk.trim())return;
    setAiCargaLoading(true);setAiCargaResult(null);
    try{
      const raw=await callGeminiCarga([{role:"user",content:buildBulkPrompt(aiCargaBulk)}]);
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setAiCargaResult(Array.isArray(parsed)?parsed:[parsed]);
    }catch(e){setAiCargaResult({error:"Error al interpretar: "+e.message});}
    setAiCargaLoading(false);
  };

  const parseGastoImagen=async()=>{
    if(!aiCargaImageB64)return;
    setAiCargaLoading(true);setAiCargaResult(null);
    try{
      const messages=[{role:"user",content:[
        {type:"image_url",image_url:{url:`data:image/jpeg;base64,${aiCargaImageB64}`}},
        {type:"text",text:buildImagePrompt()}
      ]}];
      const raw=await callGeminiCarga(messages);
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      // Siempre array — si Gemini devuelve objeto único lo normalizamos
      setAiCargaResult(Array.isArray(parsed)?parsed:[parsed]);
    }catch(e){setAiCargaResult({error:"Error al analizar imagen: "+e.message});}
    setAiCargaLoading(false);
  };

  const confirmarGastoCargaIA=(item)=>{
    const cat=cats.find(c=>c.id===item.cat)||cats[0];
    const sub=cat?.items.find(s=>s.id===item.sub)||cat?.items[0];
    setForm(f=>({...f,cat:cat?.id||f.cat,sub:sub?.id||f.sub,monto:String(item.monto||""),desc:item.descripcion||"",medio_pago:item.medio_pago||"efectivo"}));
    setAiCargaModal(false);setAiCargaResult(null);setAiCargaText("");setAiCargaImageB64(null);setAiCargaImageName("");
    setTab("gastos");setShowForm(true);
  };

  const guardarGastoCargaIA=async(item)=>{
    const cat=cats.find(c=>c.id===item.cat)||cats[0];
    const sub=cat?.items.find(s=>s.id===item.sub)||cat?.items[0];
    const d=new Date(todayISO()+"T12:00:00");
    const row={user_id:userId,year:d.getFullYear(),month:d.getMonth(),cat:cat?.id,sub:sub?.id,monto:parseFloat(item.monto),descripcion:item.descripcion||null,medio_pago:item.medio_pago||"efectivo",fecha:d.toLocaleDateString("es-AR"),tc_at_time:tc,cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon};
    const {data,error}=await supabase.from("gastos").insert(row).select().single();
    if(error){toast("Error al guardar: "+error.message,"error");return;}
    if(data)setGastos(gs=>[...gs,data]);
    setAiCargaModal(false);setAiCargaResult(null);setAiCargaText("");setAiCargaImageB64(null);setAiCargaImageName("");
    saveTcHistory(tc);
  };

  const confirmarTodosGastosIA=async(items)=>{
    setAiCargaLoading(true);
    // ✅ FIX: insert de array único — si falla, ningún registro queda guardado a medias
    const rows=items.map(item=>{
      const cat=cats.find(c=>c.id===item.cat)||cats[0];
      const sub=cat?.items.find(s=>s.id===item.sub)||cat?.items[0];
      let fechaFmt=new Date(todayISO()+"T12:00:00").toLocaleDateString("es-AR");
      let fYear=new Date().getFullYear(), fMonth=new Date().getMonth();
      if(item.fecha&&item.fecha!=="null"&&item.fecha.includes("/")){
        const parts=item.fecha.split("/");
        if(parts.length===3){
          const day=parseInt(parts[0]),month=parseInt(parts[1])-1,year=parseInt(parts[2]);
          if(!isNaN(day)&&!isNaN(month)&&!isNaN(year)){
            const fd=new Date(year,month,day,12,0,0);
            fechaFmt=fd.toLocaleDateString("es-AR");
            fYear=fd.getFullYear(); fMonth=fd.getMonth();
          }
        }
      }
      return{user_id:userId,year:fYear,month:fMonth,cat:cat?.id,sub:sub?.id,monto:parseFloat(item.monto),descripcion:item.descripcion||null,medio_pago:item.medio_pago||"efectivo",fecha:fechaFmt,tc_at_time:tc,cat_label:cat?.label,sub_label:sub?.label,sub_icon:sub?.icon,cat_color:cat?.color,cat_icon:cat?.icon};
    });
    const {data:saved,error}=await supabase.from("gastos").insert(rows).select();
    if(error){
      toast("Error al guardar: "+error.message+" — Ningún gasto fue guardado.","error");
      setAiCargaLoading(false);
      return;
    }
    if(saved)setGastos(gs=>[...gs,...saved]);
    setAiCargaLoading(false);
    setAiCargaModal(false);setAiCargaResult(null);setAiCargaBulk("");setAiCargaExcelName("");setAiCargaExcelPreview([]);
    saveTcHistory(tc);
  };
  // ──────────────────────────────────────────────────────────────────────────

  const buildChartSVG=(chart)=>{
    if(!chart||!chart.data||!chart.data.length)return null;
    const W=560,H=260,PAD={t:36,r:20,b:56,l:70};
    const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
    if(chart.type==="bar"||chart.type==="bars"){
      const max=Math.max(...chart.data.map(d=>d.value),1);
      const bW=Math.max(18,Math.floor(cW/chart.data.length)-8);
      return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:10px;background:${C.bg3}">
        <text x="${W/2}" y="22" text-anchor="middle" fill="${C.t}" font-size="13" font-family="sans-serif">${chart.title||""}</text>
        ${[0,0.25,0.5,0.75,1].map(f=>{
          const y=PAD.t+cH*(1-f);
          const v=Math.round(max*f);
          return`<line x1="${PAD.l}" y1="${y}" x2="${W-PAD.r}" y2="${y}" stroke="${C.bd}" stroke-width="1"/>
          <text x="${PAD.l-6}" y="${y+4}" text-anchor="end" fill="${C.t3}" font-size="10" font-family="sans-serif">${v>=1000?Math.round(v/1000)+"K":v}</text>`;
        }).join("")}
        ${chart.data.map((d,i)=>{
          const x=PAD.l+(cW/chart.data.length)*i+(cW/chart.data.length-bW)/2;
          const bH=Math.max(2,(d.value/max)*cH);
          const y=PAD.t+cH-bH;
          const color=d.color||COLORS[i%COLORS.length];
          return`<rect x="${x}" y="${y}" width="${bW}" height="${bH}" fill="${color}" rx="3" opacity="0.9"/>
          <text x="${x+bW/2}" y="${H-PAD.b+14}" text-anchor="middle" fill="${C.t2}" font-size="9" font-family="sans-serif">${d.label.length>8?d.label.slice(0,7)+"…":d.label}</text>
          <text x="${x+bW/2}" y="${y-4}" text-anchor="middle" fill="${color}" font-size="9" font-family="sans-serif" font-weight="bold">${d.value>=1000?Math.round(d.value/1000)+"K":d.value}</text>`;
        }).join("")}
      </svg>`;
    }
    if(chart.type==="donut"||chart.type==="pie"){
      const total=chart.data.reduce((s,d)=>s+d.value,0);
      let angle=-Math.PI/2;
      const cx=W/2,cy=H/2,r=Math.min(cW,cH)/2-10,ir=r*0.55;
      const slices=chart.data.map((d,i)=>{
        const a=(d.value/total)*2*Math.PI;
        const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);
        angle+=a;
        const x2=cx+r*Math.cos(angle),y2=cy+r*Math.sin(angle);
        const ix1=cx+ir*Math.cos(angle-a),iy1=cy+ir*Math.sin(angle-a);
        const ix2=cx+ir*Math.cos(angle),iy2=cy+ir*Math.sin(angle);
        const color=d.color||COLORS[i%COLORS.length];
        const pct=Math.round((d.value/total)*100);
        return`<path d="M${x1},${y1} A${r},${r},0,${a>Math.PI?1:0},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${a>Math.PI?1:0},0,${ix1},${iy1} Z" fill="${color}" opacity="0.9"/>
        <text x="${cx+((r+ir)/2+8)*Math.cos(angle-a/2)}" y="${cy+((r+ir)/2+8)*Math.sin(angle-a/2)+4}" text-anchor="middle" fill="${color}" font-size="9" font-family="sans-serif">${pct>5?pct+"%":""}</text>`;
      });
      const legendY=H-PAD.b+10;
      const legItems=chart.data.slice(0,6).map((d,i)=>{
        const x=PAD.l+(i*(cW/Math.min(chart.data.length,6)));
        const color=d.color||COLORS[i%COLORS.length];
        return`<rect x="${x}" y="${legendY}" width="8" height="8" fill="${color}" rx="2"/>
        <text x="${x+11}" y="${legendY+8}" fill="${C.t2}" font-size="9" font-family="sans-serif">${d.label.length>7?d.label.slice(0,6)+"…":d.label}</text>`;
      });
      return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:10px;background:${C.bg3}">
        <text x="${W/2}" y="22" text-anchor="middle" fill="${C.t}" font-size="13" font-family="sans-serif">${chart.title||""}</text>
        ${slices.join("")}
        <circle cx="${cx}" cy="${cy}" r="${ir-2}" fill="${C.bg3}"/>
        <text x="${cx}" y="${cy+5}" text-anchor="middle" fill="${C.t}" font-size="11" font-family="sans-serif" font-weight="bold">Total</text>
        ${legendY>0?legItems.join(""):""}
      </svg>`;
    }
    if(chart.type==="line"){
      const max=Math.max(...chart.data.map(d=>d.value),1);
      const pts=chart.data.map((d,i)=>{
        const x=PAD.l+(i/(chart.data.length-1||1))*cW;
        const y=PAD.t+cH*(1-d.value/max);
        return{x,y,d};
      });
      const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
      const area=`M${pts[0].x},${PAD.t+cH} ${pts.map(p=>`L${p.x},${p.y}`).join(" ")} L${pts[pts.length-1].x},${PAD.t+cH} Z`;
      return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:10px;background:${C.bg3}">
        <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.blue}" stop-opacity="0.3"/><stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/></linearGradient></defs>
        <text x="${W/2}" y="22" text-anchor="middle" fill="${C.t}" font-size="13" font-family="sans-serif">${chart.title||""}</text>
        ${[0,0.25,0.5,0.75,1].map(f=>{
          const y=PAD.t+cH*(1-f);
          const v=Math.round(max*f);
          return`<line x1="${PAD.l}" y1="${y}" x2="${W-PAD.r}" y2="${y}" stroke="${C.bd}" stroke-width="1"/>
          <text x="${PAD.l-6}" y="${y+4}" text-anchor="end" fill="${C.t3}" font-size="10" font-family="sans-serif">${v>=1000?Math.round(v/1000)+"K":v}</text>`;
        }).join("")}
        <path d="${area}" fill="url(#lg)"/>
        <path d="${path}" fill="none" stroke="${C.blue}" stroke-width="2" stroke-linejoin="round"/>
        ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${C.blue}"/>
        <text x="${p.x}" y="${H-PAD.b+14}" text-anchor="middle" fill="${C.t3}" font-size="9" font-family="sans-serif">${p.d.label.length>4?p.d.label.slice(0,4):p.d.label}</text>`).join("")}
      </svg>`;
    }
    return null;
  };

  const askAI=async(q)=>{
    setAiLoading(true);setAiResponse("");setAiChart(null);
    const ctx=buildCtx();
    const prompt=`Sos un asesor financiero personal experto. El usuario vive en Argentina (contexto: alta inflación, tipo de cambio blue relevante, economía volátil).
Pregunta: ${q||"Hacé un análisis completo"}.

DATOS FINANCIEROS:
${ctx}

INSTRUCCIONES DE RESPUESTA:
1. Respondé en español, directo, con bullets y números reales.
2. Máximo 300 palabras de texto.
3. Si la pregunta o los datos se prestan para un gráfico, incluí AL FINAL un bloque JSON con este formato exacto (sin markdown, sin backticks):
CHART_JSON:{"type":"bar","title":"Título del gráfico","data":[{"label":"Nombre","value":1234,"color":"#4E9EF5"},...]}
   - type puede ser: "bar", "donut", "line"
   - Para "line" los datos deben ser series temporales (ej: meses)
   - Para "donut" son proporciones (ej: gastos por categoría)
   - Para "bar" son comparaciones
   - Solo incluí CHART_JSON si realmente aporta valor al análisis
4. No incluyas CHART_JSON si no hay datos suficientes para graficarlo.`;

    try{
      const r=await fetch("/api/ai",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:prompt}],max_tokens:1200,temperature:0.7})
      });
      const j=await r.json();
      if(j.error){setAiResponse("Error de API: "+j.error.message);setAiLoading(false);return;}
      const raw=j.choices?.[0]?.message?.content||"Sin respuesta.";
      const chartIdx=raw.indexOf("CHART_JSON:");
      if(chartIdx!==-1){
        const textPart=raw.slice(0,chartIdx).trim();
        const jsonStr=raw.slice(chartIdx+11).trim();
        try{
          const parsed=JSON.parse(jsonStr);
          // Inyectar colores de categorías si coinciden
          if(parsed.data){
            parsed.data=parsed.data.map(d=>{
              const matchCat=cats.find(c=>c.label.toLowerCase()===d.label.toLowerCase());
              return matchCat?{...d,color:matchCat.color}:d;
            });
          }
          setAiChart(parsed);
        }catch{}
        setAiResponse(textPart||"Gráfico generado.");
      } else {
        setAiResponse(raw);
      }
    }catch(e){setAiResponse("Error de conexión: "+e.message);}
    setAiLoading(false);
  };

  const AYUDA_STEPS=[
    {icon:"trend",   title:"Dashboard",      desc:"El Dashboard es tu pantalla principal. Muestra un resumen de ingresos, gastos y balance del período seleccionado. Usá los botones Mes/Año arriba para cambiar la vista."},
    {icon:"cart",    title:"Cargar gastos",   desc:"En la solapa Gastos, hacé click en '+ Nuevo gasto'. Elegí la categoría, subcategoría, monto, medio de pago y fecha. El gasto se asigna automáticamente al mes de la fecha que ponés."},
    {icon:"dollar",  title:"Registrar ingresos", desc:"En la solapa Ingresos podés registrar sueldos, freelance, ahorros y más. Igual que los gastos, usá la fecha real del ingreso y quedará en el mes correcto."},
    {icon:"archive", title:"Presupuesto",     desc:"En Presupuesto podés definir límites por categoría y subcategoría para cada mes. Cuando superás el 80% aparece una alerta en amarillo; al superarlo, en rojo. Podés copiar el presupuesto al mes siguiente con un click."},
    {icon:"home",    title:"Categorías",      desc:"En Categorías podés personalizar todas las categorías y subcategorías. Agregá, editá o eliminá según tus gastos reales. Los cambios aplican a todos los meses."},
    {icon:"card",    title:"Tipo de cambio",  desc:"La barra de TC muestra el valor oficial BNA actualizado automáticamente. Hacé click en '▼ Cotizaciones' para ver todos los tipos de cambio y elegir cuál usar. También podés ingresar un TC manual."},
    {icon:"activity",title:"Análisis IA",     desc:"El botón '✦ Análisis IA' en la barra superior abre un chat con inteligencia artificial que analiza tus datos reales. Podés pedir análisis, consejos de ahorro o que genere gráficos de tus finanzas."},
    {icon:"flag",    title:"Gastos hormiga",  desc:"La app detecta automáticamente los 'gastos hormiga': subcategorías con 3 o más transacciones en el mes. Aparecen como alertas en violeta en el dashboard para que los tengas en cuenta."},
  ];

  const askAyuda=async(q)=>{
    if(!q.trim())return;
    setAyudaLoading(true);setAyudaResp("");
    try{
      const r=await fetch("/api/ai",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:`Sos el asistente de soporte de FinanzasApp, una app de gestión de gastos personales para Argentina. Respondé en español, de forma clara y amigable, en máximo 150 palabras. Pregunta del usuario: ${q}`}],max_tokens:400,temperature:0.5})
      });
      const j=await r.json();
      setAyudaResp(j.choices?.[0]?.message?.content||"No pude responder, intentá de nuevo.");
    }catch{setAyudaResp("Error de conexión.");}
    setAyudaLoading(false);
  };

  const [confirm, confirmNode] = useConfirm();

  const catForForm=cats.find(c=>c.id===form.cat)||cats[0];
  const donutData=cats.map(c=>({color:c.color,val:byCat[c.id]||0,label:c.label})).filter(x=>x.val>0);
  const signOut=()=>supabase.auth.signOut();
  const [hideAmounts,setHideAmounts]=useState(false);
  const fmtH=(n,cur,tcArg)=>hideAmounts?"••••":fmt(n,cur,tcArg);

  // ─── useDeferredValue para filtros ────────────────────────────────────────
  const deferredFiltroDesc = useDeferredValue(filtroDesc);

  if(loading) return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",fontSize:13,color:C.t,padding:20}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg}}.skeleton{background:linear-gradient(90deg,${C.bg3} 25%,${C.bg4} 50%,${C.bg3} 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite;border-radius:8px}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      <div style={{background:C.bg2,borderRadius:14,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <div className="skeleton" style={{width:32,height:32,borderRadius:9}}/>
        <div className="skeleton" style={{width:120,height:18,borderRadius:6}}/>
      </div>
      <SkeletonMCards/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <SkeletonCard height={200}/>
        <SkeletonCard height={200}/>
      </div>
      <SkeletonCard height={140}/>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",fontSize:13,color:C.t}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg};color:${C.t};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.bd2};border-radius:4px}select option{background:${C.bg3}}@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes popIn{0%{opacity:0;transform:scale(0.92) translateY(6px)}100%{opacity:1;transform:scale(1) translateY(0)}}.card-anim{animation:fadeUp .35s ease both}.save-ok{animation:popIn .25s ease both}.fs-11{font-size:11px}.fs-13{font-size:13px}.fs-15{font-size:15px}.fs-18{font-size:18px}.fs-22{font-size:22px}@media(max-width:600px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}@media(min-width:601px){.show-mobile{display:none!important}}.skeleton{background:linear-gradient(90deg,${C.bg3} 25%,${C.bg4} 50%,${C.bg3} 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite;border-radius:8px}@keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes toastOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(0.95)}}.toast-enter{animation:toastIn .25s ease both}.toast-exit{animation:toastOut .2s ease both}@keyframes fabExpand{from{opacity:0;transform:scale(0.8) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}.fab-item{animation:fabExpand .2s ease both}`}</style>
      <ToastContainer/>
      {confirmNode}

      {/* HEADER */}
      <div translate="no" style={{background:C.bg2,borderBottom:`1px solid ${C.bd}`,padding:"0 12px"}}>
        {/* Fila 1: logo + acciones */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:44}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:8,overflow:"hidden",flexShrink:0,boxShadow:"0 2px 12px rgba(201,168,76,0.3)"}}>
              <img src={LOGO_URL} alt="Logo" style={{width:"100%",height:"100%"}}/>
            </div>
            <span style={{fontWeight:700,fontSize:14,letterSpacing:"-0.01em"}}>FinanzasApp</span>
            <span title="Atajos: N=nuevo gasto · I=ingreso · ←→=cambiar mes · ESC=cerrar" style={{fontSize:10,color:C.t3,background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:5,padding:"2px 6px",cursor:"default",display:"none"}} className="hide-mobile">⌨ Atajos</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {/* Toggle tema */}
            <button onClick={toggleTheme} title={themeMode==="dark"?"Modo claro":"Modo oscuro"}
              style={{background:themeMode==="light"?C.amber+"22":"none",border:`1px solid ${themeMode==="light"?C.amber+"66":C.bd}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",color:themeMode==="light"?C.amber:C.t2,display:"flex",alignItems:"center",transition:"all .2s"}}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {themeMode==="dark"
                  ?<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
                  :<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
              </svg>
            </button>
            {/* Ocultar montos */}
            <button onClick={()=>setHideAmounts(h=>!h)}
              style={{background:hideAmounts?C.amber+"22":"none",border:`1px solid ${hideAmounts?C.amber+"66":C.bd}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",color:hideAmounts?C.amber:C.t2,display:"flex",alignItems:"center",transition:"all .2s"}}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {hideAmounts
                  ?<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  :<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
              </svg>
            </button>
            <button onClick={signOut} title="Cerrar sesión" style={{background:"none",border:`1px solid ${C.bd}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.t2,display:"flex",alignItems:"center"}}><Ic id="logout" size={14} color={C.t2}/></button>
          </div>
        </div>
        {/* Fila 2: controles de período y moneda — ancho completo */}
        <div style={{display:"flex",alignItems:"center",gap:6,paddingBottom:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:6,overflow:"hidden",flexShrink:0}}>
            {[{v:"month",l:"Mes"},{v:"range",l:"Rango"},{v:"year",l:"Año"}].map(({v,l})=>(
              <button key={v} onClick={()=>{setViewMode(v);if(v==="range"&&selMonthEnd===selMonth&&selYearEnd===selYear){const end=(selMonth+2)%12;setSelMonthEnd(end);if(selMonth+2>11)setSelYearEnd(y=>y);} }} style={{padding:"5px 10px",fontSize:12,border:"none",cursor:"pointer",background:viewMode===v?C.bg4:"transparent",color:viewMode===v?C.t:C.t2,whiteSpace:"nowrap"}}>{l}</button>
            ))}
          </div>
          {/* Mes/año inicio — siempre visible en month y range */}
          {viewMode!=="year"&&<>
            <select value={selMonth} onChange={e=>setSelMonth(+e.target.value)} style={{...sel,padding:"5px 6px",fontSize:12,flex:viewMode==="range"?0:1,minWidth:0,width:viewMode==="range"?84:undefined}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{...sel,padding:"5px 6px",fontSize:12,width:68,flexShrink:0}}>
              {(()=>{const minY=gastos.length>0?Math.min(...gastos.map(g=>g.year)):now.getFullYear();const maxY=now.getFullYear()+1;const years=[];for(let y=minY;y<=maxY;y++)years.push(y);return years.map(y=><option key={y}>{y}</option>);})()}
            </select>
          </>}
          {/* Año (modo año) */}
          {viewMode==="year"&&<select value={selYear} onChange={e=>setSelYear(+e.target.value)} style={{...sel,padding:"5px 6px",fontSize:12,width:72,flexShrink:0}}>{(()=>{const minY=gastos.length>0?Math.min(...gastos.map(g=>g.year)):now.getFullYear();const maxY=now.getFullYear()+1;const years=[];for(let y=minY;y<=maxY;y++)years.push(y);return years.map(y=><option key={y}>{y}</option>);})()}</select>}
          {/* Fin de rango */}
          {viewMode==="range"&&<>
            <span style={{fontSize:11,color:C.t3,flexShrink:0}}>→</span>
            <select value={selMonthEnd} onChange={e=>setSelMonthEnd(+e.target.value)} style={{...sel,padding:"5px 6px",fontSize:12,width:84,flexShrink:0}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selYearEnd} onChange={e=>setSelYearEnd(+e.target.value)} style={{...sel,padding:"5px 6px",fontSize:12,width:68,flexShrink:0}}>
              {(()=>{const minY=gastos.length>0?Math.min(...gastos.map(g=>g.year)):now.getFullYear();const maxY=now.getFullYear()+1;const years=[];for(let y=minY;y<=maxY;y++)years.push(y);return years.map(y=><option key={y}>{y}</option>);})()}
            </select>
          </>}
          <div style={{display:"flex",background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:6,overflow:"hidden",flexShrink:0}}>
            {["ARS","USD"].map(c=><button key={c} onClick={()=>setCurrency(c)} style={{padding:"5px 10px",fontSize:12,border:"none",cursor:"pointer",background:currency===c?C.blue:"transparent",color:currency===c?"#fff":C.t2}}>{c}</button>)}
          </div>
        </div>
        {/* FILA 1 — grupos principales */}
        <div style={{display:"flex",overflowX:"auto",gap:0}}>
          {[
            {id:"dashboard",label:"Dashboard",labelMobile:"Inicio",icon:"home",tabs:["dashboard"]},
            {id:"cargar",label:"Cargar",labelMobile:"Cargar",icon:"zap",tabs:["gastos","ingresos"]},
            {id:"inversiones",label:"Inversiones",labelMobile:"Inversiones",icon:"trend",tabs:["inversiones"]},
            {id:"reportes",label:"Reportes",labelMobile:"Reportes",icon:"activity",tabs:["reporte","gráficos","inflación","dólar"]},
            {id:"config",label:"Config",labelMobile:"Config",icon:"tool",tabs:["categorías","presupuesto","medios","tipos","ayuda"]},
          ].map(group=>{
            const isActive=group.tabs.includes(tab);
            const budgeCount=group.tabs.includes("presupuesto")?budAlerts.filter(a=>a.pct>=100&&!dismissedAlerts.has("bud_"+a.key)).length:0;
            return(
              <button key={group.id}
                onClick={()=>{
                  const dest=group.tabs[0];
                  setTab(dest);
                  if(dest==="inflación")fetchInflacion();
                  if(dest==="dólar"){fetchInflacion();fetchTCHistorico();}
                }}
                style={{flex:1,minWidth:0,padding:"8px 4px",fontSize:11,border:"none",cursor:"pointer",background:"transparent",
                  color:isActive?C.t:C.t2,fontWeight:isActive?600:400,
                  borderBottom:isActive?`2px solid ${C.blue}`:"2px solid transparent",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3}}
              >
                <Ic id={group.icon} size={16} color={isActive?C.blue:C.t3}/>
                <span style={{fontSize:10,lineHeight:1.2,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>
                  {group.label}
                </span>
                {budgeCount>0&&<span style={{background:C.red,color:"#fff",borderRadius:9,fontSize:9,padding:"1px 5px"}}>{budgeCount}</span>}
              </button>
            );
          })}
        </div>
        {/* FILA 2 — subtabs del grupo activo */}
        {(()=>{
          const groups=[
            {id:"dashboard",tabs:["dashboard"]},
            {id:"cargar",tabs:["gastos","ingresos"]},
            {id:"inversiones",tabs:["inversiones"]},
            {id:"reportes",tabs:["reporte","gráficos","inflación","dólar"]},
            {id:"config",tabs:["categorías","presupuesto","medios","tipos","ayuda"]},
          ];
          const activeGroup=groups.find(g=>g.tabs.includes(tab));
          if(!activeGroup||activeGroup.tabs.length<=1)return null;
          const TAB_LABELS={
            "gráficos":"📊 Gráficos","inflación":"📈 Inflación","dólar":"💵 Dólar",
            "medios":"💳 Medios","tipos":"📋 Tipos ingreso","ayuda":"❓ Ayuda",
            "reporte":"Reporte","gastos":"Gastos","ingresos":"Ingresos",
            "categorías":"Categorías","presupuesto":"Presupuesto","inversiones":"💰 Inversiones"
          };
          return(
            <div style={{display:"flex",overflowX:"auto",borderTop:`1px solid ${C.bd}`,background:C.bg3}}>
              {activeGroup.tabs.map(t=>(
                <button key={t}
                  onClick={()=>{setTab(t);if(t==="inflación")fetchInflacion();if(t==="dólar"){fetchInflacion();fetchTCHistorico();}}}
                  style={{padding:"7px 14px",fontSize:12,border:"none",cursor:"pointer",background:"transparent",
                    color:tab===t?C.t:C.t2,fontWeight:tab===t?500:400,
                    borderBottom:tab===t?`2px solid ${C.blue}`:"2px solid transparent",
                    whiteSpace:"nowrap",flexShrink:0}}
                >
                  {TAB_LABELS[t]||t}
                  {t==="presupuesto"&&budAlerts.filter(a=>a.pct>=100&&!dismissedAlerts.has("bud_"+a.key)).length>0&&
                    <span style={{marginLeft:5,background:C.red,color:"#fff",borderRadius:9,fontSize:10,padding:"1px 5px"}}>
                      {budAlerts.filter(a=>a.pct>=100&&!dismissedAlerts.has("bud_"+a.key)).length}
                    </span>}
                </button>
              ))}
            </div>
          );
        })()}
      </div>

      {/* TC BAR */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.bd}`,padding:"7px 20px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>TC Oficial BNA</span>
        {/* API value — primary */}
        <div style={{display:"flex",alignItems:"center",gap:6,background:tcMode==="auto"?C.green+"15":C.bg3,border:`1px solid ${tcMode==="auto"?C.green+"44":C.bd}`,borderRadius:7,padding:"4px 10px",cursor:"pointer"}} onClick={()=>tcAuto&&setTcMode("auto")}>
          <span style={{fontSize:11,color:tcMode==="auto"?C.green:C.t3,fontWeight:600}}>
            {tcLoading?"···":tcAuto?`$${tcAuto.toLocaleString("es-AR")}`:"Sin dato"}
          </span>
          <span style={{fontSize:10,color:tcMode==="auto"?C.green:C.t3}}>API {tcMode==="auto"?"✓":""}</span>
        </div>
        <button onClick={()=>fetchTC(false)} style={{background:"none",border:`1px solid ${C.bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",color:C.t3,fontSize:11}}>{tcLoading?"...":"↻"}</button>
        {/* Separator */}
        <span style={{color:C.bd2,fontSize:14}}>|</span>
        {/* Manual input — secondary */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:10,color:C.t3}}>Manual:</span>
          <input type="text" inputMode="decimal" value={tcManual} onChange={e=>{setTcManual(+e.target.value);setTcMode("manual");}} style={{...inp,width:80,padding:"3px 7px",fontSize:12,border:`1px solid ${tcMode==="manual"?C.amber+"66":C.bd}`}}/>
          {tcMode==="manual"&&<span style={{fontSize:10,color:C.amber}}>activo</span>}
        </div>
        <span style={{fontSize:11,color:C.t3,marginLeft:2}}>Usando <b style={{color:tcMode==="auto"?C.green:C.amber}}>${tc.toLocaleString("es-AR")}</b></span>
        <button onClick={()=>setShowTCPanel(v=>!v)} style={{background:showTCPanel?C.blue+"22":"none",border:`1px solid ${showTCPanel?C.blue+"44":C.bd}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",color:showTCPanel?C.blue:C.t3,fontSize:11,marginLeft:4}}>
          {showTCPanel?"▲ Cotizaciones":"▼ Cotizaciones"}
        </button>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <Btn small onClick={generarShareUrl} title="Compartir resumen del mes">↗ Compartir</Btn>
          <Btn small onClick={()=>setChangeLogModal(true)} title="Historial de cambios">📋 Historial</Btn>
          <Btn small onClick={()=>{setAiCargaModal(true);setAiCargaResult(null);setAiCargaText("");setAiCargaBulk("");setAiCargaImageB64(null);setAiCargaImageName("");}}>⚡ Cargar con IA</Btn>
          <Btn small primary onClick={()=>{setAiResponse("");setAiModal(true);}}>✦ Análisis IA</Btn>
        </div>
      </div>

      {/* PANEL COTIZACIONES */}
      {showTCPanel&&<div style={{background:C.bg2,borderBottom:`1px solid ${C.bd}`,padding:"14px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:11,fontWeight:600,color:C.t2,textTransform:"uppercase",letterSpacing:"0.06em"}}>Cotizaciones en tiempo real</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {tcLastUpdate&&<span style={{fontSize:10,color:C.t3}}>Actualizado: {tcLastUpdate}</span>}
            <button onClick={fetchAllTC} style={{background:"none",border:`1px solid ${C.bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",color:C.t3,fontSize:11}}>↻ Actualizar</button>
          </div>
        </div>
        {allTC.length===0&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"10px 0"}}>Cargando cotizaciones...</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
          {allTC.map(t=>(
            <div key={t.id} style={{background:C.bg3,border:`1px solid ${tcMode==="auto"&&tcAuto===t.venta?t.color+"44":C.bd}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",transition:"border .2s"}}
              onClick={()=>{if(t.venta){setTcAuto(t.venta);setTcMode("auto");saveTcHistory(t.venta);}}}
            >
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:t.color,display:"inline-block",flexShrink:0}}/>
                <span style={{fontSize:11,fontWeight:600,color:C.t}}>{t.label}</span>
                {tcAuto===t.venta&&tcMode==="auto"&&<span style={{fontSize:9,color:t.color,marginLeft:"auto"}}>✓ activo</span>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <div>
                  <div style={{fontSize:9,color:C.t3,marginBottom:2}}>COMPRA</div>
                  <div style={{fontWeight:500,color:C.t2}}>{t.compra?`$${t.compra.toLocaleString("es-AR")}`:"—"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:9,color:C.t3,marginBottom:2}}>VENTA</div>
                  <div style={{fontWeight:700,color:t.color}}>{t.venta?`$${t.venta.toLocaleString("es-AR")}`:"—"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:C.t3,marginTop:10}}>Click en cualquier cotización para usarla como TC activo · Fuente: dolarapi.com</div>
        {/* SPARKLINE TC HISTÓRICO */}
        {tcSparkData.length>1&&(()=>{
          const spark=buildSparklineSVG(tcSparkData,C.green,220,40);
          if(!spark)return null;
          return<div style={{marginTop:14,background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:16}}>
            <div>
              <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>TC Blue — últimos {tcSparkData.length} días</div>
              <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontSize:18,fontWeight:700,color:spark.lineColor}}>${spark.lastVal.toLocaleString("es-AR")}</span>
                <span style={{fontSize:12,color:spark.lineColor,fontWeight:500}}>{spark.diff>0?"+":""}{spark.diff}%</span>
              </div>
            </div>
            <div style={{flex:1,minWidth:120}} dangerouslySetInnerHTML={{__html:spark.svg}}/>
          </div>;
        })()}
      </div>}

      <div style={{padding:20,paddingBottom:96}}>

        {/* FAB — Speed Dial */}
        {(()=>{
          const fabItems=[
            {icon:"zap",label:"Cargar con IA",color:C.purple,action:()=>{setAiCargaModal(true);setAiCargaResult(null);setAiCargaText("");setAiCargaBulk("");setAiCargaImageB64(null);setAiCargaImageName("");setFabOpen(false);}},
            {icon:"activity",label:"Gasto rápido",color:C.blue,action:()=>{setQuickModal(true);setQuickType("gasto");setQuickError("");setQuickOk(false);setFabOpen(false);}},
            {icon:"dollar",label:"Ingreso",color:C.green,action:()=>{setQuickModal(true);setQuickType("ingreso");setQuickError("");setQuickOk(false);setFabOpen(false);}},
          ];
          return(
            <div style={{position:"fixed",bottom:28,right:24,zIndex:90,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
              {fabOpen&&fabItems.map((item,i)=>(
                <div key={item.label} className="fab-item" style={{display:"flex",alignItems:"center",gap:10,animationDelay:`${i*0.05}s`}}>
                  <span style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:7,padding:"4px 10px",fontSize:12,color:C.t2,whiteSpace:"nowrap"}}>{item.label}</span>
                  <button onClick={item.action} style={{width:40,height:40,borderRadius:"50%",background:item.color+"22",border:`1px solid ${item.color}55`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic id={item.icon} size={16} color={item.color}/>
                  </button>
                </div>
              ))}
              <button
                onClick={()=>setFabOpen(v=>!v)}
                title="Cargar gasto o ingreso"
                style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${C.blue}55`,color:"#fff",fontSize:22,fontWeight:300,transition:"transform .2s",transform:fabOpen?"rotate(45deg)":"rotate(0deg)"}}
              >+</button>
            </div>
          );
        })()}

        {/* RECORDATORIO RECURRENTES */}
        {viewMode==="month"&&hayRecurrentesSinAplicar&&!reminderDismissed&&(
          <div style={{background:C.amber+"12",border:`1px solid ${C.amber}44`,borderRadius:10,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Ic id="flag" size={14} color={C.amber}/>
              <span style={{fontSize:12,color:C.t2}}>Tenés <b style={{color:C.amber}}>{recurrentes.length} gasto{recurrentes.length!==1?"s":""} recurrente{recurrentes.length!==1?"s":""}</b> sin aplicar en {MONTHS[selMonth]}.</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setRecurrentesModal(true)} style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:6,padding:"4px 12px",cursor:"pointer",color:C.amber,fontSize:11,fontWeight:600}}>Aplicar ahora</button>
              <button onClick={()=>{setReminderDismissed(true);try{localStorage.setItem("fa_rec_reminder_"+new Date().toISOString().slice(0,7),"1");}catch{}}} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16}}>×</button>
            </div>
          </div>
        )}

        {/* ALERTAS DUPLICADOS */}
        {viewMode==="month"&&<DupAlert gastosDuplicados={gastosDuplicados} fmtH={fmtH} currency={currency} tc={tc} cats={cats} delGasto={delGasto} C={C}/>}

        {/* BÚSQUEDA RÁPIDA DASHBOARD */}
        {tab==="dashboard"&&<div style={{marginBottom:12}}>
          <div style={{position:"relative"}}>
            <input
              style={{...inp,paddingLeft:34,fontSize:12}}
              placeholder="🔍 Buscar gasto rápido en el dashboard..."
              value={dashSearch}
              onChange={e=>setDashSearch(e.target.value)}
            />
            {dashSearch&&<button onClick={()=>setDashSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16}}>×</button>}
          </div>
          {dashSearch&&(()=>{
            const dl=dashSearch.toLowerCase();
            const matches=monthGastos.filter(g=>
              (g.descripcion||"").toLowerCase().includes(dl)||
              (g.sub_label||"").toLowerCase().includes(dl)||
              (g.cat_label||"").toLowerCase().includes(dl)||
              String(g.monto).includes(dl)
            ).slice(0,8);
            if(!matches.length) return<div style={{fontSize:12,color:C.t3,padding:"8px 12px"}}>Sin resultados para "{dashSearch}"</div>;
            return<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,marginTop:4,overflow:"hidden"}}>
              {matches.map(g=>{
                const cat=cats.find(c=>c.id===g.cat);
                return<div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:`1px solid ${C.bd}`,fontSize:12}}>
                  <div style={{width:24,height:24,borderRadius:6,background:(cat?.color||C.blue)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic id={g.sub_icon||cat?.icon||"cart"} size={11} color={cat?.color||C.blue}/>
                  </div>
                  <span style={{flex:1,color:C.t2}}>{g.sub_label||g.sub} {g.descripcion?<span style={{color:C.t3}}>· {g.descripcion}</span>:null}</span>
                  <span style={{fontSize:11,color:C.t3}}>{g.fecha}</span>
                  <span style={{fontWeight:600,color:cat?.color||C.blue}}>{fmtH(g.monto,currency,tc)}</span>
                </div>;
              })}
            </div>;
          })()}
        </div>}

        {/* ALERTS — acordeón colapsable */}
        {viewMode==="month"&&(budAlerts.length>0||hormiga.length>0)&&(()=>{
          const visibleBudOver=budAlerts.filter(a=>!dismissedAlerts.has("bud_"+a.key));
          const visibleHormiga=hormiga.filter(h=>!dismissedAlerts.has("hrm_"+h.catId+h.subId));
          if(!visibleBudOver.length&&!visibleHormiga.length)return null;
          const totalAlertas=visibleBudOver.length+visibleHormiga.length;
          const AlertRow=({id,color,icon,children})=>(
            <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:9,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
              <Ic id={icon} size={15} color={color}/>
              <span style={{fontSize:12,flex:1}}>{children}</span>
              <button onClick={()=>dismissAlert(id)} title="Cerrar" style={{background:"none",border:"none",cursor:"pointer",color:color,fontSize:16,lineHeight:1,padding:"0 2px",opacity:0.7,flexShrink:0}}>×</button>
            </div>
          );
          return<AlertsAccordion totalAlertas={totalAlertas} onDismissAll={()=>{
            visibleBudOver.forEach(a=>dismissAlert("bud_"+a.key));
            visibleHormiga.forEach(h=>dismissAlert("hrm_"+h.catId+h.subId));
          }}>
            {visibleBudOver.map(a=><AlertRow key={a.key} id={"bud_"+a.key} color={C.red} icon={a.sub?a.sub.icon:a.cat.icon}>
              <b style={{color:C.red}}>Presupuesto excedido:</b> {a.label} — {fmtH(a.spent,currency,tc)} de {fmtH(a.budget,currency,tc)} ({a.pct}%)
            </AlertRow>)}
            {visibleHormiga.map(h=><AlertRow key={h.catId+h.subId} id={"hrm_"+h.catId+h.subId} color={C.purple} icon={h.icon||"activity"}>
              <b style={{color:C.purple}}>Gasto hormiga:</b> {h.subLabel} ({h.catLabel}) — {h.count} transacciones por {fmtH(h.total,currency,tc)} este mes
            </AlertRow>)}
          </AlertsAccordion>;
        })()}

        {/* DASHBOARD */}
        {tab==="dashboard"&&<>
          {(()=>{
            // Semáforo financiero: basado en disponible real vs ingresos
            const pctDisp=totI>0?Math.round((dispGastarConRollover/totI)*100):0;
            const semDisp=dispGastarConRollover<0?"red":pctDisp<10?"amber":"green";
            const pctGastos=totI>0?Math.min(Math.round((totG/totI)*100),100):0;
            const colorGastos=pctGastos>100?C.red:pctGastos>85?C.amber:C.red;
            return<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:hayInversiones?10:18}}>
              <MCard label="Ingresos" value={fmtH(totI,currency,tc)} color={C.green} icon="trend" sub={periodoLabel}/>
              <MCard label="Gastos" value={fmtH(totG,currency,tc)} color={colorGastos} icon="cart" sub={`${ad.length} transacciones`} progress={totG} progressMax={totI}/>
              <MCard label="Invertido" value={fmtH(totInvARS,currency,tc)} color={C.purple} icon="briefcase" sub={hayInversiones?"Alocado · no disponible":"Sin inversiones este período"} progress={totInvARS} progressMax={totI}/>
              <MCard label="Disponible real" value={fmtH(dispGastarConRollover,currency,tc)} color={dispGastarConRollover>=0?C.blue:C.red} icon="dollar" semaforo={semDisp} sub={viewMode==="month"&&saldoRollover>0?"Incluye arrastre de "+MONTHS[selMonth===0?11:selMonth-1]:(dispGastarConRollover>=0?"Lo que realmente te sobra":"Gastaste más de lo que ingresó")}/>
            </div>;
          })()}
          {/* ROLLOVER: arrastre del disponible real del mes anterior */}
          {viewMode==="month"&&saldoRollover>0&&<div style={{background:C.green+"10",border:"1px solid "+C.green+"33",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:7,background:C.green+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id="archive" size={13} color={C.green}/></div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.t}}>↩ Arrastre de {MONTHS[selMonth===0?11:selMonth-1]} {selMonth===0?selYear-1:selYear}</div>
                <div style={{fontSize:11,color:C.t3,marginTop:1}}>Disponible real del mes anterior que no gastaste</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:16,fontWeight:700,color:C.green}}>+{fmtH(saldoRollover,currency,tc)}</div>
              <div style={{fontSize:11,color:C.t3}}>Disponible total este mes: <b style={{color:dispGastarConRollover>=0?C.green:C.red}}>{fmtH(dispGastarConRollover,currency,tc)}</b></div>
            </div>
          </div>}

          {/* ── #7 COMPARATIVA VS INFLACIÓN ────────────────────────────── */}
          {comparativaInflacion&&<div style={{background:comparativaInflacion.superaInflacion?C.red+"0D":C.green+"0D",border:`1px solid ${comparativaInflacion.superaInflacion?C.red:C.green}33`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:(comparativaInflacion.superaInflacion?C.red:C.green)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic id="trend" size={14} color={comparativaInflacion.superaInflacion?C.red:C.green}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.t}}>
                  {comparativaInflacion.superaInflacion?"⚠ Tus gastos superan la inflación":"✓ Tus gastos están por debajo de la inflación"}
                </div>
                <div style={{fontSize:11,color:C.t3,marginTop:2}}>
                  vs {comparativaInflacion.mesPrev}: variaste <b style={{color:Number(comparativaInflacion.varGasto)>=0?C.red:C.green}}>{Number(comparativaInflacion.varGasto)>=0?"+":""}{comparativaInflacion.varGasto}%</b>
                  · IPC {comparativaInflacion.mesPrev}: <b style={{color:C.amber}}>{comparativaInflacion.ipcMes}%</b>
                </div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:700,color:comparativaInflacion.superaInflacion?C.red:C.green}}>
                {comparativaInflacion.superaInflacion?"+":"-"}{fmtH(Math.abs(comparativaInflacion.diferencia),"ARS",tc)}
              </div>
              <div style={{fontSize:10,color:C.t3}}>
                {comparativaInflacion.superaInflacion?"sobre":"bajo"} el nivel ajustado por IPC
              </div>
            </div>
          </div>}
          {/* BARRA RESUMEN REAL */}
          {hayInversiones&&viewMode==="month"&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Tasa de inversión</div>
              <div style={{fontSize:22,fontWeight:700,color:savRateReal>=0?C.purple:C.red}}>{savRateReal}%</div>
              <div style={{fontSize:10,color:C.t3}}>inversiones ÷ ingresos</div>
            </div>
            <div style={{flex:"1 1 200px",minWidth:160}}>
              <div style={{display:"flex",height:12,borderRadius:8,overflow:"hidden",gap:1}}>
                {totI>0&&<>
                  <div title={`Gastos: ${Math.round((totG/totI)*100)}%`} style={{width:`${Math.min(Math.round((totG/totI)*100),100)}%`,background:C.red,transition:"width .4s"}}/>
                  <div title={`Inversiones: ${Math.round((totInvARS/totI)*100)}%`} style={{width:`${Math.min(Math.round((totInvARS/totI)*100),100)}%`,background:C.purple,transition:"width .4s"}}/>
                  <div title={`Disponible: ${Math.max(0,Math.round((dispGastar/totI)*100))}%`} style={{flex:1,background:C.blue+"55",borderRadius:"0 8px 8px 0"}}/>
                </>}
              </div>
              <div style={{display:"flex",gap:12,marginTop:6,fontSize:10,color:C.t3}}>
                <span><span style={{display:"inline-block",width:8,height:8,background:C.red,borderRadius:2,marginRight:3}}/>Gastos {totI>0?Math.round((totG/totI)*100):0}%</span>
                <span><span style={{display:"inline-block",width:8,height:8,background:C.purple,borderRadius:2,marginRight:3}}/>Inversiones {totI>0?Math.round((totInvARS/totI)*100):0}%</span>
                <span><span style={{display:"inline-block",width:8,height:8,background:C.blue,borderRadius:2,marginRight:3}}/>Libre {Math.max(0,totI>0?Math.round((dispGastar/totI)*100):0)}%</span>
              </div>
            </div>
          </div>}
          {/* PODER ADQUISITIVO PERDIDO */}
          {poderAdquisitivo&&<div style={{background:C.bg2,border:`1px solid ${C.amber}33`,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:C.amber+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id="trend" size={15} color={C.amber}/></div>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:C.t}}>Poder adquisitivo perdido desde {MONTHS[selMonth]} {selYear}</div>
                <div style={{fontSize:11,color:C.t3,marginTop:2}}>Esos {fmtH(totG,currency,tc)} de gastos equivalen hoy a <b style={{color:C.amber}}>{fmtH(poderAdquisitivo.gastosHoy,currency,tc)}</b> — inflación acumulada: <b style={{color:C.amber}}>{poderAdquisitivo.pct}%</b></div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:600,color:C.amber}}>+{fmtH(poderAdquisitivo.perdida,currency,tc)}</div>
              <div style={{fontSize:10,color:C.t3}}>diferencia en pesos actuales</div>
            </div>
          </div>}
          {!inflData&&viewMode==="month"&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <span style={{fontSize:11,color:C.t3}}>💡 Activá el IPC para ver el poder adquisitivo perdido</span>
            <button onClick={fetchInflacion} style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.amber,fontSize:11}}>{inflLoading?"...":"Cargar IPC"}</button>
          </div>}
          {/* ✅ NUEVO: mini-gráfico nominal vs real — aparece si hay datos de inflación */}
          {inflData&&viewMode==="year"&&(()=>{
            const ipcMap2={};
            inflData.forEach(x=>{const k=x.fecha.slice(0,7);ipcMap2[k]=x.valor;});
            const hoyClave2=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
            const mesesDash=MONTHS.map((_,m)=>{
              const clave=`${selYear}-${String(m+1).padStart(2,"0")}`;
              const gNom=gastos.filter(g=>g.year===selYear&&g.month===m).reduce((s,x)=>s+Number(x.monto),0);
              let factor=1;
              if(inflData){const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);for(const d of sorted){const ym=d.fecha.slice(0,7);if(ym>clave&&ym<=hoyClave2)factor*=(1+d.valor/100);}}
              return{m,gNom,gReal:gNom*factor,ipc:ipcMap2[clave]||null};
            }).filter(x=>x.gNom>0);
            if(mesesDash.length===0)return null;
            // ── Barras agrupadas: funciona con 1, 2 o 12 meses ──────────────────
            const W=560,PL=50,PR=12,PT=24,PB=28,cW=W-PL-PR,cH=100,H=PT+cH+PB;
            const maxV=Math.max(...mesesDash.map(x=>Math.max(x.gNom,x.gReal)),1);
            const toY=v=>PT+cH*(1-(v/maxV));
            const slotW=cW/mesesDash.length;
            const gap=Math.max(2,slotW*0.08);
            const bW=Math.max(8,Math.min(30,(slotW-gap*3)/2));
            return<div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"16px 20px",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:600,color:C.t}}>Gastos nominales vs pesos de hoy · {selYear}</div>
                <button onClick={()=>setTab("inflación")} style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:6,padding:"3px 8px",cursor:"pointer",color:C.green,fontSize:10}}>Ver análisis completo →</button>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxHeight:160,display:"block"}} xmlns="http://www.w3.org/2000/svg">
                {[0,0.5,1].map((f,i)=>{const v=Math.round(maxV*f);const y=PT+cH*(1-f);return<g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/><text x={PL-4} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v}</text></g>;})}
                {mesesDash.map((d,i)=>{
                  const slotX=PL+i*slotW;
                  const cx=slotX+slotW/2;
                  const xNom=cx-bW-gap/2;
                  const xReal=cx+gap/2;
                  const hNom=Math.max(2,(d.gNom/maxV)*cH);
                  const hReal=Math.max(2,(d.gReal/maxV)*cH);
                  const pct=d.gNom>0?Math.round(((d.gReal-d.gNom)/d.gNom)*100):0;
                  const isActive=d.m===selMonth;
                  return<g key={i}>
                    {/* Barra nominal */}
                    <rect x={xNom} y={toY(d.gNom)} width={bW} height={hNom} fill={C.red} rx="2" opacity={isActive?1:0.65}/>
                    {/* Barra real ajustada */}
                    <rect x={xReal} y={toY(d.gReal)} width={bW} height={hReal} fill={C.green} rx="2" opacity={isActive?1:0.65}/>
                    {/* IPC del mes arriba */}
                    {d.ipc&&<text x={cx} y={PT-6} textAnchor="middle" fill={C.amber} fontSize="7" fontFamily="sans-serif">{d.ipc}%</text>}
                    {/* Diferencia % entre nominal y real */}
                    {Math.abs(pct)>0&&<text x={cx} y={Math.min(toY(d.gReal),toY(d.gNom))-3} textAnchor="middle" fill={pct>0?C.amber:C.green} fontSize="7" fontFamily="sans-serif">{pct>0?"+":""}{pct}%</text>}
                    {/* Label mes */}
                    <text x={cx} y={H-4} textAnchor="middle" fill={isActive?C.blue:C.t3} fontSize="8" fontFamily="sans-serif" fontWeight={isActive?"700":"400"}>{MONTHS[d.m]}</text>
                  </g>;
                })}
              </svg>
              <div style={{display:"flex",gap:14,fontSize:10,color:C.t2,marginTop:4,flexWrap:"wrap"}}>
                <span><span style={{display:"inline-block",width:10,height:10,background:C.red,borderRadius:2,marginRight:4,verticalAlign:"middle",opacity:0.8}}/>Nominal</span>
                <span><span style={{display:"inline-block",width:10,height:10,background:C.green,borderRadius:2,marginRight:4,verticalAlign:"middle"}}/>Pesos de hoy (ajustado IPC)</span>
                <span style={{color:C.amber}}><span style={{display:"inline-block",width:7,height:7,background:C.amber,borderRadius:2,marginRight:4,verticalAlign:"middle"}}/>IPC mes · % = diferencia real vs nominal</span>
              </div>
            </div>;
          })()}
          {/* Si no hay inflData cargada todavía, mostrar botón para activar */}
          {!inflData&&viewMode==="year"&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <span style={{fontSize:12,color:C.t3}}>📈 Activá el gráfico de <b style={{color:C.t2}}>gastos vs inflación</b> para este año</span>
            <button onClick={()=>{fetchInflacion();}} style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:7,padding:"5px 12px",cursor:"pointer",color:C.green,fontSize:12}}>{inflLoading?"Cargando...":"Cargar IPC"}</button>
          </div>}
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            {/* Donut distribución */}
            <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"20px 22px",display:"flex",gap:20,alignItems:"center",flex:"2 1 300px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{flexShrink:0}}><Donut data={donutData} size={140}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Distribución de gastos</div>
                {donutData.length===0&&<div style={{fontSize:12,color:C.t3}}>Sin datos este período</div>}
                {donutData.map(d=>{const pct=totG>0?Math.round((d.val/totG)*100):0;return<div key={d.label} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8,alignItems:"center"}}>
                  <span style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0,display:"inline-block",boxShadow:`0 0 6px ${d.color}66`}}/>
                    <span style={{color:C.t2}}>{d.label}</span>
                  </span>
                  <span style={{color:d.color,fontWeight:600,fontSize:12}}>{pct}%</span>
                </div>;})}
              </div>
            </div>
            {/* Medios de pago */}
            <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"20px 22px",flex:"1 1 220px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Medios de pago</div>
              {mediosTodos.filter(m=>byMedio[m.id]>0).sort((a,b)=>byMedio[b.id]-byMedio[a.id]).map(m=>{
                const pct=totG>0?Math.round((byMedio[m.id]/totG)*100):0;
                return<div key={m.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,alignItems:"center"}}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:m.color,display:"inline-block"}}/>
                      <span style={{color:C.t}}>{m.label}</span>
                    </span>
                    <span style={{color:C.t2,fontWeight:500}}>{fmtH(byMedio[m.id],currency,tc)} <span style={{color:C.t3,fontSize:10}}>{pct}%</span></span>
                  </div>
                  <div style={{height:5,borderRadius:4,background:C.bg4,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${m.color}88,${m.color})`,width:`${pct}%`,transition:"width .5s ease"}}/>
                  </div>
                </div>;
              })}
              {(byMedio["otros"]||0)>0&&(()=>{const op=totG>0?Math.round((byMedio["otros"]/totG)*100):0;return<div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,alignItems:"center"}}>
                  <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"#94A3B8",display:"inline-block"}}/><span style={{color:C.t2}}>Otros / sin clasificar</span></span>
                  <span style={{color:C.t2,fontWeight:500}}>{fmtH(byMedio["otros"],currency,tc)} <span style={{color:C.t3,fontSize:10}}>{op}%</span></span>
                </div>
                <div style={{height:5,borderRadius:4,background:C.bg4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,background:"#94A3B8",width:`${op}%`,transition:"width .5s ease"}}/></div>
              </div>;})()}
              {mediosTodos.every(m=>!byMedio[m.id])&&!(byMedio["otros"]>0)&&<div style={{fontSize:12,color:C.t3}}>Sin datos</div>}
            </div>
          </div>
          {viewMode==="year"&&<div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"20px 22px",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Evolución {selYear}</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:110}}>
              {MONTHS.map((m,i)=>{
                const g=mTotals[i].g,ing=mTotals[i].i,inv=mTotals[i].inv||0;
                const maxBarExt=Math.max(...mTotals.map(x=>Math.max(x.g,x.i,x.inv||0)),1);
                const isActive=i===selMonth;
                return<div key={i} onClick={()=>{setSelMonth(i);setViewMode("month");}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"}}>
                  <div style={{width:"100%",display:"flex",gap:1,alignItems:"flex-end",height:88}}>
                    <div style={{flex:1,height:`${Math.round((ing/maxBarExt)*100)}%`,background:isActive?C.green:`${C.green}55`,borderRadius:"3px 3px 0 0",minHeight:ing>0?2:0,transition:"height .4s ease"}}/>
                    <div style={{flex:1,height:`${Math.round((g/maxBarExt)*100)}%`,background:isActive?C.red:`${C.red}55`,borderRadius:"3px 3px 0 0",minHeight:g>0?2:0,transition:"height .4s ease"}}/>
                    {inv>0&&<div style={{flex:1,height:`${Math.round((inv/maxBarExt)*100)}%`,background:isActive?C.purple:`${C.purple}55`,borderRadius:"3px 3px 0 0",minHeight:2,transition:"height .4s ease"}}/>}
                  </div>
                  <div style={{fontSize:9,color:isActive?C.blue:C.t3,fontWeight:isActive?600:400}}>{m}</div>
                </div>;
              })}
            </div>
            <div style={{display:"flex",gap:16,marginTop:10,fontSize:11,color:C.t2,flexWrap:"wrap"}}>
              <span><span style={{display:"inline-block",width:8,height:8,background:C.green,borderRadius:2,marginRight:4}}/>Ingresos</span>
              <span><span style={{display:"inline-block",width:8,height:8,background:C.red,borderRadius:2,marginRight:4}}/>Gastos</span>
              <span><span style={{display:"inline-block",width:8,height:8,background:C.purple,borderRadius:2,marginRight:4}}/>Inversiones</span>
              <span style={{marginLeft:"auto",color:C.t3,fontSize:10}}>Click en un mes para ver detalle</span>
            </div>
          </div>}
          <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"20px 22px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Gastos por categoría</div>
              <div style={{fontSize:11,color:C.t3}}>{fmtH(totG,currency,tc)} total</div>
            </div>
            {totG===0&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"20px 0"}}>Sin gastos este período</div>}
            {[...cats]
              .map(c=>({...c,total:byCat[c.id]||0}))
              .filter(c=>c.total>0)
              .sort((a,b)=>b.total-a.total)
              .map((c,ci)=>{
                const pct=totG>0?Math.round((c.total/totG)*100):0;
                const subs=[...c.items]
                  .map(s=>({...s,val:bySub[`${c.id}|${s.id}`]||0}))
                  .filter(s=>s.val>0)
                  .sort((a,b)=>b.val-a.val);
                return<div key={c.id} style={{marginBottom:ci<cats.length-1?14:0}}>
                  {/* Categoría row */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.t3,width:18,textAlign:"right",flexShrink:0}}>{ci+1}</span>
                    <span style={{width:28,height:28,borderRadius:8,background:c.color+"18",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={c.icon} size={13} color={c.color}/></span>
                    <span style={{flex:1,fontWeight:600,fontSize:13,color:C.t}}>{c.label}</span>
                    <span style={{fontWeight:700,color:c.color,fontSize:13}}>{fmtH(c.total,currency,tc)}</span>
                    <span style={{fontSize:11,color:C.t3,minWidth:32,textAlign:"right"}}>{pct}%</span>
                  </div>
                  {/* Barra categoría */}
                  <div style={{marginLeft:56,marginBottom:subs.length?8:0}}>
                    <div style={{height:5,borderRadius:4,background:C.bg4,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${c.color}66,${c.color})`,width:`${pct}%`,transition:"width .5s ease"}}/>
                    </div>
                  </div>
                  {/* Subcategorías */}
                  {subs.map(s=>{
                    const spct=c.total>0?Math.round((s.val/c.total)*100):0;
                    return<div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginLeft:56,marginBottom:4}}>
                      <span style={{width:20,height:20,borderRadius:5,background:c.color+"12",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={s.icon} size={10} color={c.color}/></span>
                      <span style={{flex:1,fontSize:11,color:C.t2}}>{s.label}</span>
                      <span style={{fontSize:11,fontWeight:500,color:C.t}}>{fmtH(s.val,currency,tc)}</span>
                      <span style={{fontSize:10,color:C.t3,minWidth:28,textAlign:"right"}}>{spct}%</span>
                    </div>;
                  })}
                </div>;
              })}
          </div>
        </>}

        {/* GASTOS */}
        {tab==="gastos"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:14,fontWeight:500}}>Gastos — {periodoLabel} <span style={{fontSize:12,color:C.red,marginLeft:8}}>{fmtH(totG,currency,tc)}</span></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn small onClick={exportarCSV}>⬇ CSV</Btn>
              <Btn small onClick={exportarXLSX}>⬇ XLSX</Btn>
              <Btn small onClick={()=>setCsvModal(true)}>⬆ Importar CSV</Btn>
              <Btn small onClick={()=>setRecurrentesModal(true)}>↻ Recurrentes</Btn>
              <Btn primary onClick={()=>setShowForm(!showForm)}>+ Nuevo gasto</Btn>
            </div>
          </div>
          {/* BARRA DE FILTROS */}
          <div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <input style={{...inp,flex:"2 1 160px",padding:"6px 10px",fontSize:12}} placeholder="🔍 Buscar descripción..." value={filtroDesc} onChange={e=>setFiltroDesc(e.target.value)}/>
            <select style={{...sel,flex:"1 1 130px",padding:"6px 8px",fontSize:12}} value={filtroCat} onChange={e=>setFiltroCat(e.target.value)}>
              <option value="todas">Todas las categorías</option>
              {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select style={{...sel,flex:"1 1 120px",padding:"6px 8px",fontSize:12}} value={filtroMedio} onChange={e=>setFiltroMedio(e.target.value)}>
              <option value="todos">Todos los medios</option>
              {mediosTodos.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <input style={{...inp,width:100,padding:"6px 8px",fontSize:12}} type="number" placeholder="Min $" value={filtroMontoMin} onChange={e=>setFiltroMontoMin(e.target.value)}/>
            <input style={{...inp,width:100,padding:"6px 8px",fontSize:12}} type="number" placeholder="Max $" value={filtroMontoMax} onChange={e=>setFiltroMontoMax(e.target.value)}/>
            {(filtroDesc||filtroCat!=="todas"||filtroMedio!=="todos"||filtroMontoMin||filtroMontoMax)&&
              <button onClick={()=>{setFiltroDesc("");setFiltroCat("todas");setFiltroMedio("todos");setFiltroMontoMin("");setFiltroMontoMax("");}} style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:7,padding:"6px 10px",cursor:"pointer",color:C.red,fontSize:11,whiteSpace:"nowrap"}}>✕ Limpiar</button>}
          </div>
          {showForm&&(
            <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:18,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Cargar gasto</div>
              <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:130}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div><input style={inp} type="date" value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}/></div>
                <div style={{flex:1,minWidth:140}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Categoría</div><select style={sel} value={form.cat} onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setForm(f=>({...f,cat:e.target.value,sub:c?.items[0]?.id||""}));}}>{cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                <div style={{flex:1,minWidth:140}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Subcategoría</div><select style={sel} value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}>{catForForm?.items.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                <div style={{flex:1,minWidth:100}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Monto ($)</div><input style={inp} type="text" inputMode="decimal" placeholder="0" value={form.monto} onChange={e=>setForm(f=>({...f,monto:e.target.value}))}/></div>
                <div style={{flex:1,minWidth:160}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Medio de pago</div><select style={sel} value={form.medio_pago} onChange={e=>setForm(f=>({...f,medio_pago:e.target.value}))}>{mediosTodos.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
                <div style={{flex:2,minWidth:160}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Descripción</div><input style={inp} placeholder="Opcional..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></div>
              </div>
              {/* MODO CUOTAS */}
              <div style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:8,padding:"10px 14px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:C.t2}}>
                    <input type="checkbox" checked={cuotasMode} onChange={e=>setCuotasMode(e.target.checked)} style={{accentColor:C.purple}}/>
                    <span style={{color:cuotasMode?C.purple:C.t2,fontWeight:cuotasMode?500:400}}>Pagar en cuotas</span>
                  </label>
                  {cuotasMode&&<>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:11,color:C.t3}}>Cuotas:</span>
                      <select style={{...sel,width:70,padding:"4px 6px",fontSize:12}} value={cuotasN} onChange={e=>setCuotasN(+e.target.value)}>
                        {[2,3,6,9,12,18,24,36].map(n=><option key={n} value={n}>{n}x</option>)}
                      </select>
                    </div>
                    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:C.t2}}>
                      <input type="checkbox" checked={cuotasUSD} onChange={e=>setCuotasUSD(e.target.checked)} style={{accentColor:C.amber}}/>
                      <span style={{color:cuotasUSD?C.amber:C.t2}}>Cuota en USD (TC variable)</span>
                    </label>
                    {form.monto&&parseFloat(form.monto)>0&&<span style={{fontSize:11,color:C.t3}}>
                      {cuotasUSD
                        ? `≈ USD ${(parseFloat(form.monto)/cuotasN).toFixed(0)}/mes × ${cuotasN} meses (a TC actual)`
                        : `${fmtH(Math.round(parseFloat(form.monto)/cuotasN),currency,tc)}/mes × ${cuotasN} meses`}
                    </span>}
                  </>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:8}}>
                  <Btn primary onClick={cuotasMode?()=>saveGastoCuotas(form,cuotasN,cuotasUSD):addGasto}>
                    {cuotasMode?`Guardar ${cuotasN} cuotas`:"Guardar"}
                  </Btn>
                  <Btn onClick={()=>{setShowForm(false);setCuotasMode(false);}}>Cancelar</Btn>
                </div>
                <span style={{fontSize:11,color:C.t3}}>TC al guardar: <b style={{color:C.t2}}>${tc.toLocaleString("es-AR")}</b></span>
              </div>
            </div>
          )}
          {(()=>{
            // Aplicar filtros
            const gastosFiltered=ad.filter(g=>{
              if(deferredFiltroDesc&&!(g.descripcion||"").toLowerCase().includes(deferredFiltroDesc.toLowerCase())&&
                 !(g.sub_label||"").toLowerCase().includes(deferredFiltroDesc.toLowerCase()))return false;
              if(filtroCat!=="todas"&&g.cat!==filtroCat)return false;
              if(filtroMedio!=="todos"&&(g.medio_pago||"efectivo")!==filtroMedio)return false;
              if(filtroMontoMin&&Number(g.monto)<parseFloat(filtroMontoMin))return false;
              if(filtroMontoMax&&Number(g.monto)>parseFloat(filtroMontoMax))return false;
              return true;
            });
            const hayFiltro=filtroDesc||filtroCat!=="todas"||filtroMedio!=="todos"||filtroMontoMin||filtroMontoMax;
            if(hayFiltro&&gastosFiltered.length===0)return<div style={{fontSize:13,color:C.t3,padding:"20px 0",textAlign:"center"}}>Sin resultados para los filtros aplicados.</div>;
            const gastosAgrupados=cats.map(cat=>({cat,items:gastosFiltered.filter(x=>x.cat===cat.id)})).filter(x=>x.items.length>0);
            return gastosAgrupados.map(({cat,items})=>{
              const total=items.reduce((s,x)=>s+Number(x.monto),0);
              return<div key={cat.id} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${C.bd}`,background:cat.color+"0D"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:7,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={cat.icon} size={14} color={cat.color}/></div><span style={{fontWeight:500,fontSize:13}}>{cat.label}</span></div>
                  <span style={{fontWeight:600,color:cat.color,fontSize:13}}>{fmtH(total,currency,tc)}</span>
                </div>
                <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>
                    {["Subcategoría","Medio",viewMode==="year"?"Mes":"Descripción","Fecha","Monto",""].map((h,i)=>(
                      <th key={i} style={{padding:"8px 12px",textAlign:i>=4?"right":"left",fontSize:11,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{items.map(g=>{
                    const mp=mediosTodos.find(m=>m.id===(g.medio_pago||"efectivo"))||mediosTodos[0];
                    return<tr key={g.id} style={{borderBottom:`1px solid ${C.bd}`}}>
                      <td style={{padding:"8px 12px",maxWidth:140}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                          <Pill color={cat.color} icon={g.sub_icon} label={g.sub_label||g.sub}/>
                          {g.cuota_total&&<span style={{fontSize:10,color:C.purple,background:C.purple+"18",borderRadius:4,padding:"1px 5px",whiteSpace:"nowrap"}}>c{g.cuota_num}/{g.cuota_total}</span>}
                          {g.recurrente_id&&<span style={{fontSize:10,color:C.blue,background:C.blue+"18",borderRadius:4,padding:"1px 5px"}}>↻</span>}
                        </div>
                      </td>
                      <td style={{padding:"8px 12px",whiteSpace:"nowrap"}}>{mp?<Pill color={mp.color} label={mp.label}/>:<span style={{color:C.t3,fontSize:11}}>—</span>}</td>
                      <td style={{padding:"8px 12px",color:C.t2,fontSize:11,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewMode==="year"&&g._m!==undefined?MONTHS[g._m]:(g.descripcion||"—")}</td>
                      <td style={{padding:"8px 12px",color:C.t3,fontSize:11,whiteSpace:"nowrap"}}>
                        <div>{g.fecha}</div>
                        {g.tc_at_time&&<div style={{fontSize:10,color:C.t3}}>TC ${g.tc_at_time.toLocaleString("es-AR")}</div>}
                      </td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:600,whiteSpace:"nowrap",color:cat.color}}>{hideAmounts?"••••":`-${fmtTx(g.monto,currency,tc,g.tc_at_time)}`}</td>
                      <td style={{padding:"8px 12px",textAlign:"right"}}>
                        {viewMode==="month"&&<div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                          <button onClick={()=>{setInlineEditId(g.id);setInlineEditData({monto:String(g.monto),cat:g.cat,sub:g.sub,descripcion:g.descripcion||""});}} title="Edición rápida" style={{background:C.green+"18",border:`1px solid ${C.green}33`,borderRadius:6,cursor:"pointer",color:C.green,fontSize:11,padding:"3px 8px"}}>✎</button>
                          <button onClick={()=>openEditGasto(g)} title="Editar completo" style={{background:C.blue+"18",border:`1px solid ${C.blue}33`,borderRadius:6,cursor:"pointer",color:C.blue,fontSize:11,padding:"3px 8px"}}>⊞</button>
                          <button onClick={()=>delGasto(g.id)} title="Eliminar" style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16}}>×</button>
                        </div>}
                      </td>
                    </tr>
                    {/* EDICIÓN INLINE */}
                    {inlineEditId===g.id&&<tr style={{background:C.bg3}}>
                      <td colSpan={6} style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                          <input type="text" inputMode="decimal" placeholder="Monto"
                            style={{...inp,width:110,padding:"5px 8px",fontSize:12}}
                            value={inlineEditData.monto}
                            onChange={e=>setInlineEditData(d=>({...d,monto:e.target.value}))}
                            autoFocus
                          />
                          <select style={{...sel,padding:"5px 8px",fontSize:12,width:130}}
                            value={inlineEditData.cat}
                            onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setInlineEditData(d=>({...d,cat:e.target.value,sub:c?.items[0]?.id||""}));}}
                          >
                            {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                          </select>
                          <select style={{...sel,padding:"5px 8px",fontSize:12,width:130}}
                            value={inlineEditData.sub}
                            onChange={e=>setInlineEditData(d=>({...d,sub:e.target.value}))}
                          >
                            {(cats.find(c=>c.id===inlineEditData.cat)?.items||[]).map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                          <input type="text" placeholder="Descripción"
                            style={{...inp,flex:1,minWidth:100,padding:"5px 8px",fontSize:12}}
                            value={inlineEditData.descripcion}
                            onChange={e=>setInlineEditData(d=>({...d,descripcion:e.target.value}))}
                          />
                          <button onClick={()=>saveInlineEdit(g.id)} style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 12px",cursor:"pointer",color:C.green,fontSize:12,fontWeight:600}}>✓ Guardar</button>
                          <button onClick={()=>{setInlineEditId(null);setInlineEditData({});}} style={{background:"none",border:`1px solid ${C.bd}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",color:C.t3,fontSize:12}}>Cancelar</button>
                        </div>
                      </td>
                    </tr>}
                    
                  })}</tbody>
                  <tfoot><tr style={{background:C.bg3}}>
                    <td colSpan={4} style={{padding:"8px 12px",fontSize:12,color:C.t2,fontWeight:500}}>Subtotal</td>
                    <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,color:cat.color}}>-{fmtH(total,currency,tc)}</td>
                    <td/>
                  </tr></tfoot>
                </table>
                </div>
              </div>;
            });
          })()}
          {ad.length===0&&<div style={{fontSize:13,color:C.t3,marginTop:20}}>No hay gastos para este período.</div>}
        </>}

        {/* INGRESOS */}
        {tab==="ingresos"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:14,fontWeight:500}}>Ingresos & Ahorros — {periodoLabel}</div>
            <div style={{display:"flex",gap:8}}>
              <Btn small onClick={exportarIngresos}>⬇ CSV</Btn>
              <Btn primary onClick={()=>setShowIngForm(!showIngForm)}>+ Agregar</Btn>
            </div>
          </div>
          {showIngForm&&(
            <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:18,marginBottom:16}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:130}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div><input style={inp} type="date" value={ingForm.fecha} onChange={e=>setIngForm(f=>({...f,fecha:e.target.value}))}/></div>
                <div style={{flex:1,minWidth:140}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Tipo</div><select style={sel} value={ingForm.tipo} onChange={e=>setIngForm(f=>({...f,tipo:e.target.value}))}>{tiposTodos.map(t=><option key={t.id} value={t.label}>{t.label}</option>)}</select></div>
                <div style={{flex:1,minWidth:100}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Monto ($)</div><input style={inp} type="text" inputMode="decimal" placeholder="0" value={ingForm.monto} onChange={e=>setIngForm(f=>({...f,monto:e.target.value}))}/></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:8}}><Btn primary onClick={addIngreso}>Guardar</Btn><Btn onClick={()=>setShowIngForm(false)}>Cancelar</Btn></div>
                <span style={{fontSize:11,color:C.t3}}>TC al guardar: <b style={{color:C.t2}}>${tc.toLocaleString("es-AR")}</b></span>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <MCard label="Total ingresos" value={fmtH(totI,currency,tc)} color={C.green} accent={C.green}/>
            <MCard label="Total gastos" value={fmtH(totG,currency,tc)} color={C.red} accent={C.red}/>
            <MCard label="Invertido" value={fmtH(totInvARS,currency,tc)} color={C.purple} accent={C.purple}/>
            <MCard label="Disponible real" value={fmtH(dispGastarConRollover,currency,tc)} color={dispGastarConRollover>=0?C.blue:C.red} sub={viewMode==="month"&&saldoRollover>0?"Con arrastre de "+MONTHS[selMonth===0?11:selMonth-1]:undefined}/>
            <MCard label="Tasa inversión" value={`${savRateReal}%`} color={savRateReal>=10?C.purple:C.blue}/>
            {viewMode==="month"&&saldoRollover>0&&<MCard label={"↩ Arrastre "+MONTHS[selMonth===0?11:selMonth-1]} value={fmtH(saldoRollover,currency,tc)} color={C.green} icon="archive" sub="Disponible real del mes anterior"/>}
          </div>
          {tiposTodos.map(({label:tipo,grupo,icon:iconTipoRaw})=>{
            const items=ai.filter(x=>x.tipo===tipo);
            if(!items.length)return null;
            const total=items.reduce((s,x)=>s+Number(x.monto),0);
            const isSav=grupo==="ahorro";
            const color=isSav?C.purple:C.green;
            const iconId=iconTipoRaw||"dollar";
            return<div key={tipo} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${C.bd}`,background:color+"0D"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:7,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={iconId} size={14} color={color}/></div><span style={{fontWeight:500,fontSize:13}}>{tipo}</span><Pill color={color} label={isSav?"Ahorro":"Ingreso"}/></div>
                <span style={{fontWeight:600,color,fontSize:13}}>{fmtH(total,currency,tc)}</span>
              </div>
              {items.map(x=><div key={x.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 16px",borderBottom:`1px solid ${C.bd}`,fontSize:12}}><span style={{color:C.t2}}>{tipo}{viewMode==="year"&&x._m!==undefined?` — ${MONTHS[x._m]}`:""}</span><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontWeight:500,color}}>{fmtH(x.monto,currency,tc)}</span>{viewMode==="month"&&<button onClick={()=>delIngreso(x.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16}}>×</button>}</div></div>)}
            </div>;
          })}
          {ai.length===0&&<div style={{fontSize:13,color:C.t3}}>No hay registros para este período.</div>}
        </>}

        {/* ───────── INVERSIONES ───────── */}
        {tab==="inversiones"&&<>
          {/* HEADER */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>💰 Inversiones & Ahorro — {MONTHS[selMonth]} {selYear}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:3}}>Separado de gastos e ingresos · No modifica tu balance mensual</div>
            </div>
            <Btn primary onClick={()=>{setInvDraft(d=>({...d,monto:"",descripcion:"",fecha:todayISO(),tipo:"deposito"}));setInvError("");setInvModal(true);}}>+ Nuevo movimiento</Btn>
          </div>

          {/* SUMMARY CARDS */}
          {(()=>{
            const hayDatos=totalFondosMemo>0||invActivos.length>0;
            return<>
              {/* Fila 1: 3 cards separadas */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:10}}>
                <MCard label="💼 Fondos / Saldos" value={fmtH(totalFondosMemo,currency,tc)} color={C.blue} icon="briefcase"
                  sub={totalFondosMemo>0?`${Object.keys(ultimosPorPlatMemo).length} plataforma${Object.keys(ultimosPorPlatMemo).length!==1?"s":" "}· último snapshot`:"Sin saldos cargados"}/>
                <MCard label="📊 Activos individuales" value={fmtH(totalActivosMemo,currency,tc)} color={C.purple} icon="activity"
                  sub={invActivos.length>0?`${invActivos.length} activo${invActivos.length!==1?"s":" "}· valor de mercado`:"Sin activos cargados"}/>
                <MCard label="📈 Rendimiento activos" value={invActivos.length>0?fmtH(gananciaActivosMemo,currency,tc):"—"}
                  color={gananciaActivosMemo>=0?C.green:C.red} icon="trend"
                  sub={invActivos.length>0?(gananciaActivosMemo>=0?"Ganancia sobre costo":"Pérdida sobre costo"):"Cargá activos para ver"}/>
              </div>
              {/* Fila 2: card total combinado */}
              {hayDatos&&<div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.amber}33`,borderRadius:14,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",boxShadow:`0 4px 20px ${C.amber}08`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:9,background:C.amber+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${C.amber}33`}}>
                    <Ic id="dollar" size={17} color={C.amber}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:500}}>Cartera total</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:1}}>Fondos + Activos al valor actual</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
                  {totalFondosMemo>0&&<div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,marginBottom:2}}>Fondos</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.blue}}>{fmtH(totalFondosMemo,currency,tc)}</div>
                    {totalCarteraMemo>0&&<div style={{fontSize:10,color:C.t3}}>{Math.round((totalFondosMemo/totalCarteraMemo)*100)}%</div>}
                  </div>}
                  {totalFondosMemo>0&&totalActivosMemo>0&&<div style={{color:C.t3,fontSize:16}}>+</div>}
                  {totalActivosMemo>0&&<div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,marginBottom:2}}>Activos</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.purple}}>{fmtH(totalActivosMemo,currency,tc)}</div>
                    {totalCarteraMemo>0&&<div style={{fontSize:10,color:C.t3}}>{Math.round((totalActivosMemo/totalCarteraMemo)*100)}%</div>}
                  </div>}
                  <div style={{width:1,height:36,background:C.bd2}}/>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,marginBottom:2}}>Total cartera</div>
                    <div style={{fontSize:20,fontWeight:700,color:C.amber}}>{fmtH(totalCarteraMemo,currency,tc)}</div>
                    <div style={{fontSize:10,color:C.t3}}>≈ USD {hideAmounts?"••••":Math.round(totalCarteraMemo/tc).toLocaleString("es-AR")}</div>
                  </div>
                </div>
              </div>}
            </>;
          })()}

          {/* SUB-TABS */}
          <div style={{display:"flex",background:C.bg3,borderRadius:10,padding:3,marginBottom:16,gap:2,flexWrap:"wrap"}}>
            {[
              {id:"saldos",label:"💼 Fondos"},
              {id:"activos",label:"📊 Activos"},
              {id:"analisis",label:"📈 Análisis"},
              {id:"noticias",label:"🌐 Noticias"},
              {id:"historial",label:"📋 Historial"},
            ].map(t=>(
              <button key={t.id} onClick={()=>{
                setInvSubTab(t.id);
                if(t.id==="noticias"){fetchNoticias();fetchConsejos();}
              }}
                style={{flex:"1 1 80px",padding:"8px 4px",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",borderRadius:8,
                  background:invSubTab===t.id?C.bg4:"transparent",
                  color:invSubTab===t.id?C.t:C.t2,transition:"all .18s",whiteSpace:"nowrap"}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── SUB-TAB: SALDOS ── */}
          {invSubTab==="saldos"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:C.t2}}>El saldo se actualiza automáticamente al registrar movimientos. Podés corregirlo manualmente si es necesario.</div>
              <Btn small onClick={()=>{setSaldoDraft({plataforma:"cocos",saldo:"",moneda:"ARS",nota:"",fecha:todayISO()});setSaldoError("");setSaldoModal(true);}}>✎ Corregir saldo</Btn>
            </div>
            {(()=>{
              // Agrupar por plataforma → último saldo de cada una
              const platsSaldos=[...new Set(invSaldos.map(s=>s.plataforma))];
              if(platsSaldos.length===0)return<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"32px 0"}}>
                <div style={{fontSize:28,marginBottom:8}}>💼</div>
                <div>Sin saldos cargados todavía.</div>
                <div style={{fontSize:11,marginTop:4}}>Usá "+ Actualizar saldo" para cargar el balance de Cocos, MP, Lemon, etc.</div>
              </div>;
              return platsSaldos.map(platId=>{
                const plat=platTodasPlat.find(p=>p.id===platId)||{label:platId,color:"#94A3B8",icon:"dollar"};
                const historial=[...invSaldos].filter(s=>s.plataforma===platId).sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes-b.mes);
                const ultimo=historial[historial.length-1];
                const gan=calcGananciaSaldo(platId);
                const saldoARS=ultimo.moneda==="USD"?ultimo.saldo*(ultimo.tc_at_time||tc):ultimo.saldo;
                return<div key={platId} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:historial.length>1?`1px solid ${C.bd}`:"none",background:plat.color+"08"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:plat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${plat.color}33`}}>
                      <Ic id={plat.icon||"trend"} size={16} color={plat.color}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:C.t}}>{plat.label}</div>
                      <div style={{fontSize:11,color:C.t3}}>Último: {ultimo.fecha} {ultimo.nota?`· ${ultimo.nota}`:""}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:700,color:plat.color}}>
                        {ultimo.moneda==="USD"?`USD ${Number(ultimo.saldo).toLocaleString("es-AR")}`:fmtH(saldoARS,currency,tc)}
                      </div>
                      {gan&&<div style={{fontSize:11,color:gan.diff>=0?C.green:C.red,fontWeight:500}}>
                        {gan.diff>=0?"+":""}{fmtH(gan.diff,currency,tc)} ({gan.pct>=0?"+":""}{gan.pct}%) vs anterior
                      </div>}
                    </div>
                    <button onClick={()=>{setInvDraft(d=>({...d,plataforma:platId,moneda:ultimo.moneda,monto:"",descripcion:"",fecha:todayISO(),tipo:"deposito"}));setInvError("");setInvModal(true);}} style={{background:C.green+"22",border:`1px solid ${C.green}33`,borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.green,fontSize:11,flexShrink:0,marginRight:4}}>+ Mover</button>
                    <button onClick={()=>{setSaldoDraft({plataforma:platId,saldo:"",moneda:ultimo.moneda,nota:"",fecha:todayISO()});setSaldoError("");setSaldoModal(true);}} style={{background:C.blue+"22",border:`1px solid ${C.blue}33`,borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.blue,fontSize:11,flexShrink:0}}>✎ Corregir</button>
                  </div>
                  {/* Mini historial */}
                  {historial.length>1&&<div style={{padding:"8px 18px",display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[...historial].reverse().slice(0,6).map((s,i)=>{
                      const sARS=s.moneda==="USD"?s.saldo*(s.tc_at_time||tc):s.saldo;
                      return<div key={s.id} style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:7,padding:"5px 10px",fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:80}}>
                        <span style={{color:C.t3}}>{MONTHS[s.mes]} {s.anio}</span>
                        <span style={{fontWeight:600,color:i===0?plat.color:C.t2}}>{fmtH(sARS,currency,tc)}</span>
                        <button onClick={()=>delSaldo(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:12,padding:0,lineHeight:1}}>×</button>
                      </div>;
                    })}
                  </div>}
                </div>;
              });
            })()}
          </>}

          {/* ── SUB-TAB: ACTIVOS ── */}
          {invSubTab==="activos"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:11,color:C.t2}}>CEDEARs, acciones, cripto. Actualizá el precio actual para ver el rendimiento.</div>
              <Btn small primary onClick={()=>{setActivoDraft({plataforma:"iol",nombre:"",ticker:"",cantidad:"",precio_compra:"",moneda_compra:"ARS",precio_actual:"",moneda_actual:"ARS",fecha_compra:""});setActivoError("");setActivoModal(true);}}>+ Nuevo activo</Btn>
            </div>
            {invActivos.length===0&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:28,marginBottom:8}}>📊</div>
              <div>Sin activos individuales cargados.</div>
              <div style={{fontSize:11,marginTop:4}}>Usá "+ Nuevo activo" para trackear CEDEARs, acciones, cripto, etc.</div>
            </div>}
            {invActivos.map(a=>{
              const plat=platTodasPlat.find(p=>p.id===a.plataforma)||{label:a.plataforma,color:"#94A3B8",icon:"dollar"};
              const rend=rendimientoActivo(a);
              const sinPrecioActual=!a.precio_actual||a.precio_actual===a.precio_compra;
              return<div key={a.id} style={{background:C.bg2,border:`1px solid ${rend.diff>0?C.green+"44":rend.diff<0?C.red+"44":C.bd}`,borderRadius:12,marginBottom:10,padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:plat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${plat.color}33`}}>
                    <Ic id={plat.icon||"trend"} size={16} color={plat.color}/>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:600,color:C.t}}>{a.nombre}</span>
                      {a.ticker&&<span style={{fontSize:10,background:plat.color+"22",color:plat.color,padding:"1px 7px",borderRadius:10,fontWeight:600}}>{a.ticker}</span>}
                      <span style={{fontSize:10,color:C.t3}}>{plat.label}</span>
                    </div>
                    <div style={{fontSize:11,color:C.t3,marginTop:3}}>
                      {a.cantidad} unidades · Compra: {a.moneda_compra==="USD"?`USD ${Number(a.precio_compra).toLocaleString("es-AR")}`:`$${Number(a.precio_compra).toLocaleString("es-AR")}`} · {a.fecha_compra}
                      {Number(a.comision||0)>0&&<span style={{marginLeft:6,color:C.amber,background:C.amber+"18",padding:"1px 6px",borderRadius:8,fontSize:10}}>comisión {a.comision}%</span>}
                    </div>
                    {/* Barra de rendimiento */}
                    {!sinPrecioActual&&<div style={{marginTop:8,height:5,borderRadius:4,background:C.bg4,overflow:"hidden",width:"100%",maxWidth:300}}>
                      <div style={{height:"100%",borderRadius:4,background:rend.diff>=0?C.green:C.red,width:`${Math.min(Math.abs(rend.pct),100)}%`,transition:"width .4s"}}/>
                    </div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.t}}>{fmtH(rend.actual,currency,tc)}</div>
                    <div style={{fontSize:11,color:C.t3}}>costo: {fmtH(rend.costo,currency,tc)}</div>
                    <div style={{fontSize:13,fontWeight:600,color:rend.diff>=0?C.green:C.red,marginTop:2}}>
                      {rend.diff>=0?"+":""}{fmt(rend.diff,currency,tc)} ({rend.pct>=0?"+":""}{rend.pct.toFixed(1)}%)
                    </div>
                    {sinPrecioActual&&<div style={{fontSize:10,color:C.amber,marginTop:2}}>Sin precio actual</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                    <button onClick={()=>{setEditActivoId(a.id);setEditPrecioActual(String(a.precio_actual||a.precio_compra));setEditPrecioModal(true);}}
                      style={{background:C.purple+"22",border:`1px solid ${C.purple}44`,borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.purple,fontSize:11,whiteSpace:"nowrap"}}>
                      {sinPrecioActual?"+ Precio actual":"↻ Actualizar precio"}
                    </button>
                    <button onClick={()=>delActivo(a.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:11,textAlign:"center"}}>Eliminar</button>
                  </div>
                </div>
              </div>;
            })}
            {invActivos.length>0&&(()=>{
              const totalCosto=invActivos.reduce((s,a)=>s+rendimientoActivo(a).costo,0);
              const totalActual=invActivos.reduce((s,a)=>s+rendimientoActivo(a).actual,0);
              const totalGan=totalActual-totalCosto;
              const totalPct=totalCosto>0?(totalGan/totalCosto)*100:0;
              return<div style={{background:C.bg3,border:`1px solid ${totalGan>=0?C.green+"44":C.red+"44"}`,borderRadius:10,padding:"12px 18px",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div style={{fontSize:12,color:C.t2,fontWeight:500}}>Total cartera de activos</div>
                <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.t3}}>Invertido</div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{fmtH(totalCosto,currency,tc)}</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.t3}}>Valor actual</div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{fmtH(totalActual,currency,tc)}</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.t3}}>Ganancia</div><div style={{fontSize:14,fontWeight:700,color:totalGan>=0?C.green:C.red}}>{totalGan>=0?"+":""}{fmt(totalGan,currency,tc)} ({totalPct>=0?"+":""}{totalPct.toFixed(1)}%)</div></div>
                </div>
              </div>;
            })()}
          </>}

          {/* ── SUB-TAB: HISTORIAL DEPÓSITOS ── */}
          {invSubTab==="historial"&&<>
            <div style={{fontSize:11,color:C.t2,marginBottom:12}}>Todos los depósitos y movimientos registrados.</div>
            {(()=>{
              const todos=[...inversiones].sort((a,b)=>b.anio!==a.anio?b.anio-a.anio:b.mes-a.mes);
              if(todos.length===0)return<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"32px 0"}}>Sin movimientos registrados.</div>;
              return todos.map(inv=>{
                const plat=platTodasPlat.find(p=>p.id===inv.plataforma)||{label:inv.plataforma,color:"#94A3B8",icon:"dollar"};
                const montoARS=inv.moneda==="USD"?Number(inv.monto)*(inv.tc_at_time||tc):Number(inv.monto);
                const esRetiro=(inv.descripcion||"").startsWith("[RETIRO]");
                const movColor=esRetiro?C.red:C.green;
                return<div key={inv.id} style={{display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.bd}`,paddingBottom:10,marginBottom:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:movColor+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${movColor}33`}}>
                    <Ic id={esRetiro?"logout":"dollar"} size={14} color={movColor}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{fontSize:12,fontWeight:500,color:C.t}}>{plat.label}</div>
                      <span style={{fontSize:10,padding:"1px 6px",borderRadius:6,background:movColor+"18",color:movColor,fontWeight:600}}>{esRetiro?"RETIRO":"DEPÓSITO"}</span>
                    </div>
                    <div style={{fontSize:11,color:C.t3}}>{inv.fecha}{inv.descripcion&&!esRetiro?` · ${inv.descripcion}`:inv.descripcion?` · ${inv.descripcion.replace("[RETIRO] ","")}`:""}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:movColor}}>
                      {esRetiro?"-":""}{inv.moneda==="USD"?`USD ${Number(inv.monto).toLocaleString("es-AR")}`:fmtH(inv.monto,currency,tc)}
                    </div>
                    {inv.moneda==="USD"&&<div style={{fontSize:10,color:C.t3}}>≈ {fmtH(montoARS,currency,tc)}</div>}
                  </div>
                  <span style={{fontSize:10,padding:"2px 6px",borderRadius:8,background:inv.moneda==="USD"?C.amber+"22":C.blue+"22",color:inv.moneda==="USD"?C.amber:C.blue,fontWeight:600,flexShrink:0}}>{inv.moneda}</span>
                  <button onClick={()=>delInversion(inv.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16,padding:"0 2px",flexShrink:0}}>×</button>
                </div>;
              });
            })()}
          </>}

          {/* ── SUB-TAB: ANÁLISIS ── */}
          {invSubTab==="analisis"&&(()=>{
            const mesesSaldos=[...new Set(invSaldos.map(s=>`${s.anio}-${String(s.mes+1).padStart(2,"0")}`))].sort();
            const hayAnalisis=Object.keys(ultimosPorPlatMemo).length>0||invActivos.length>0;
            if(!hayAnalisis)return<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"48px 0"}}>
              <div style={{fontSize:32,marginBottom:10}}>📈</div>
              <div>Sin datos para analizar todavía.</div>
              <div style={{fontSize:11,marginTop:4}}>Cargá saldos y activos para ver gráficos.</div>
            </div>;

            // Evolución total cartera por mes (fondos + activos al costo como proxy)
            const evolucionMeses=mesesSaldos.map(ym=>{
              const [a,m]=ym.split("-").map(Number);
              const platsSaldos=[...new Set(invSaldos.map(s=>s.plataforma))];
              const totalMes=platsSaldos.reduce((sum,plat)=>{
                const saldosMes=invSaldos.filter(s=>s.plataforma===plat&&(s.anio<a||(s.anio===a&&s.mes<=m-1)));
                if(!saldosMes.length)return sum;
                const ult=saldosMes.sort((x,y)=>x.anio!==y.anio?x.anio-y.anio:x.mes!==y.mes?x.mes-y.mes:(x.created_at||"")>(y.created_at||"")?1:-1)[saldosMes.length-1];
                const v=Number(ult.saldo);
                return sum+(ult.moneda==="USD"?v*(ult.tc_at_time||tc):v);
              },0);
              return{ym,label:`${MONTHS[m-1]} ${a.toString().slice(2)}`,total:totalMes};
            }).filter(x=>x.total>0);

            const maxEvol=Math.max(...evolucionMeses.map(x=>x.total),totalFondosMemo,1);
            const W=560,PL=60,PR=16,PT=20,PB=32,cH=100;
            const cW=W-PL-PR;

            // Distribución completa: fondos + activos
            const donutItems=[
              ...Object.entries(ultimosPorPlatMemo).map(([pid,s])=>{
                const plat=platTodasPlat.find(p=>p.id===pid)||{label:pid,color:"#4E9EF5"};
                const v=Number(s.saldo);
                return{label:plat.label,val:s.moneda==="USD"?v*(s.tc_at_time||tc):v,color:plat.color,tipo:"fondo"};
              }),
              ...invActivos.map(a=>{
                const plat=platTodasPlat.find(p=>p.id===a.plataforma)||{color:C.purple};
                return{label:a.nombre+(a.ticker?` (${a.ticker})`:""),val:valorActualARS(a),color:plat.color,tipo:"activo"};
              }),
            ].filter(x=>x.val>0);

            return<div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Distribución */}
              {totalCarteraMemo>0&&donutItems.length>0&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Distribución cartera completa — {fmtH(totalCarteraMemo,currency,tc)}</div>
                <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
                  <Donut size={130} data={donutItems}/>
                  <div style={{flex:1,minWidth:160}}>
                    {donutItems.sort((a,b)=>b.val-a.val).map((d,i)=>{
                      const pct=totalCarteraMemo>0?Math.round((d.val/totalCarteraMemo)*100):0;
                      return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,marginBottom:7}}>
                        <span style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:8,height:8,borderRadius:"50%",background:d.color,display:"inline-block",flexShrink:0}}/>
                          <span style={{color:C.t2}}>{d.label}</span>
                          <span style={{fontSize:9,color:C.t3,background:d.tipo==="fondo"?C.blue+"22":C.purple+"22",padding:"1px 5px",borderRadius:4}}>{d.tipo==="fondo"?"fondo":"activo"}</span>
                        </span>
                        <span style={{color:d.color,fontWeight:600}}>{fmtH(d.val,currency,tc)} <span style={{color:C.t3,fontSize:10}}>{pct}%</span></span>
                      </div>;
                    })}
                  </div>
                </div>
              </div>}

              {/* Evolución saldos */}
              {evolucionMeses.length>=2&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Evolución fondos / saldos histórico</div>
                <svg viewBox={`0 0 ${W} ${PT+cH+PB}`} style={{width:"100%",display:"block"}}>
                  {[0,0.5,1].map((f,i)=>{
                    const y=PT+cH*(1-f);
                    const v=Math.round(maxEvol*f);
                    return<g key={i}>
                      <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                      <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="9" fontFamily="sans-serif">{v>=1000000?`${(v/1000000).toFixed(1)}M`:v>=1000?`${Math.round(v/1000)}K`:v}</text>
                    </g>;
                  })}
                  {(()=>{
                    const pts=evolucionMeses.map((d,i)=>({x:PL+(i/(evolucionMeses.length-1||1))*cW,y:PT+cH*(1-d.total/maxEvol),d}));
                    const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                    const area=`M${pts[0].x},${PT+cH} ${pts.map(p=>`L${p.x},${p.y}`).join(" ")} L${pts[pts.length-1].x},${PT+cH} Z`;
                    return<>
                      <path d={area} fill={C.blue} opacity="0.12"/>
                      <path d={path} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round"/>
                      {pts.map((p,i)=><g key={i}>
                        <circle cx={p.x} cy={p.y} r="3.5" fill={C.blue}/>
                        <text x={p.x} y={PT+cH+PB-4} textAnchor="middle" fill={C.t3} fontSize="9" fontFamily="sans-serif">{p.d.label}</text>
                      </g>)}
                    </>;
                  })()}
                </svg>
              </div>}

              {/* Rendimiento por activo */}
              {invActivos.length>0&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Rendimiento activos individuales</div>
                {invActivos.map(a=>{
                  const rend=rendimientoActivo(a);
                  const plat=platTodasPlat.find(p=>p.id===a.plataforma)||{color:"#94A3B8"};
                  const barW=Math.min(Math.abs(rend.pct),100);
                  return<div key={a.id} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5,alignItems:"center"}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:plat.color,display:"inline-block"}}/>
                        <span style={{color:C.t}}>{a.nombre}{a.ticker?` (${a.ticker})`:""}</span>
                      </span>
                      <span style={{fontWeight:600,color:rend.diff>=0?C.green:C.red}}>
                        {rend.diff>=0?"+":""}{rend.pct.toFixed(1)}% · {rend.diff>=0?"+":""}{fmtH(rend.diff,currency,tc)}
                      </span>
                    </div>
                    <div style={{height:6,borderRadius:4,background:C.bg4,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:4,background:rend.diff>=0?C.green:C.red,width:`${barW}%`,transition:"width .4s"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.t3,marginTop:3}}>
                      <span>Costo: {fmtH(rend.costo,currency,tc)}</span>
                      <span>Valor actual: {fmtH(rend.actual,currency,tc)}</span>
                    </div>
                  </div>;
                })}
                <div style={{borderTop:`1px solid ${C.bd}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:C.t2}}>Ganancia total activos</span>
                  <span style={{fontWeight:700,color:gananciaActivosMemo>=0?C.green:C.red}}>{gananciaActivosMemo>=0?"+":""}{fmtH(gananciaActivosMemo,currency,tc)}</span>
                </div>
              </div>}
            </div>;
          })()}

          {/* ── SUB-TAB: NOTICIAS ── */}
          {invSubTab==="noticias"&&<>
            {noticiasLoading&&<div style={{display:"flex",alignItems:"center",gap:10,color:C.t2,fontSize:12,padding:"32px 0",justifyContent:"center"}}>
              <div style={{width:18,height:18,border:`2px solid ${C.blue}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              Cargando noticias financieras...
            </div>}
            {noticiasData&&!noticiasData.error&&!noticiasLoading&&<>
              {/* Indicadores */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:16}}>
                {noticiasData.indicadores?.map((ind,i)=>(
                  <div key={i} style={{background:C.bg2,border:`1px solid ${ind.positivo?C.green+"33":C.red+"33"}`,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:C.t3,marginBottom:4}}>{ind.nombre}</div>
                    <div style={{fontSize:15,fontWeight:700,color:C.t}}>{hideAmounts&&ind.nombre.includes("Dólar")?"••••":ind.valor}</div>
                    <div style={{fontSize:11,color:ind.positivo?C.green:C.red,marginTop:2}}>{ind.variacion}</div>
                  </div>
                ))}
              </div>
              {/* Noticias */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Últimas noticias financieras Argentina</div>
                {noticiasData.noticias?.map((n,i)=>{
                  const impColor=n.impacto==="positivo"?C.green:n.impacto==="negativo"?C.red:C.amber;
                  return<div key={i} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,padding:"14px 18px",marginBottom:8,borderLeft:`3px solid ${impColor}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,background:impColor+"22",color:impColor,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{n.categoria}</span>
                      <span style={{fontSize:10,color:impColor}}>{n.impacto==="positivo"?"↑ Positivo":n.impacto==="negativo"?"↓ Negativo":"→ Neutral"}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:500,color:C.t,marginBottom:5}}>{n.titulo}</div>
                    <div style={{fontSize:11,color:C.t2,lineHeight:1.7}}>{n.resumen}</div>
                  </div>;
                })}
              </div>
              {/* Consejos IA */}
              <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.purple}33`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:C.t}}>✦ Consejos de inversión para tu perfil</div>
                    <div style={{fontSize:11,color:C.t3,marginTop:2}}>Basado en tu cartera actual y el contexto económico de Argentina</div>
                  </div>
                  {consejosData&&<button onClick={()=>{setConsejosData("");setTimeout(fetchConsejos,100);}} style={{background:"none",border:`1px solid ${C.bd}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.t3,fontSize:11}}>↻ Regenerar</button>}
                </div>
                {consejosLoading&&<div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.t3,padding:"8px 0"}}>
                  <div style={{display:"flex",gap:4}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.purple,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
                  Analizando tu cartera...
                </div>}
                {consejosData&&!consejosLoading&&<div style={{fontSize:12,color:C.t2,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{consejosData}</div>}
                {!consejosData&&!consejosLoading&&<div style={{fontSize:11,color:C.t3,textAlign:"center",padding:"12px 0"}}>Cargando consejos personalizados...</div>}
              </div>
              <div style={{fontSize:10,color:C.t3,marginTop:10,textAlign:"center"}}>⚠ Información generada por IA con fines educativos. No es asesoramiento financiero. Consultá a un profesional antes de invertir.</div>
            </>}
            {noticiasData?.error&&!noticiasLoading&&<div style={{background:C.red+"12",border:`1px solid ${C.red}33`,borderRadius:10,padding:"16px",fontSize:12,color:C.red}}>{noticiasData.error}</div>}
            {!noticiasData&&!noticiasLoading&&<div style={{textAlign:"center",padding:"32px 0"}}>
              <button onClick={()=>{fetchNoticias();fetchConsejos();}} style={{background:C.blue,color:"#fff",border:"none",borderRadius:9,padding:"10px 24px",cursor:"pointer",fontSize:13,fontWeight:500}}>🌐 Cargar noticias y análisis</button>
            </div>}
          </>}
        </>}
        {tab==="reporte"&&<>
          <div style={{fontSize:14,fontWeight:500,marginBottom:16}}>Reporte — {viewMode==="year"?selYear:`${MONTHS[selMonth]} ${selYear}`}</div>
          {viewMode==="year"&&<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bd}`,fontSize:11,fontWeight:500,color:C.t2,textTransform:"uppercase",letterSpacing:"0.05em"}}>Resumen mensual {selYear}</div>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:480}}>
              <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>{["Mes","Ingresos","Gastos","Inversiones","Disponible real","Ahorro real %"].map((h,i)=><th key={i} style={{padding:"7px 12px",textAlign:i===0?"left":"right",fontSize:11,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{MONTHS.map((m,i)=>{
                const g=mTotals[i].g,ing=mTotals[i].i,inv=mTotals[i].inv||0;
                const disp=ing-g-inv,rate=ing>0?Math.round((inv/ing)*100):0;
                if(g===0&&ing===0&&inv===0)return null;
                return<tr key={i} style={{borderBottom:`1px solid ${C.bd}`}}>
                  <td style={{padding:"9px 12px",color:C.t2,whiteSpace:"nowrap"}}>{m} {selYear}</td>
                  <td style={{padding:"9px 12px",textAlign:"right",color:C.green,whiteSpace:"nowrap"}}>{fmtH(ing,currency,tc)}</td>
                  <td style={{padding:"9px 12px",textAlign:"right",color:C.red,whiteSpace:"nowrap"}}>-{fmtH(g,currency,tc)}</td>
                  <td style={{padding:"9px 12px",textAlign:"right",color:C.purple,whiteSpace:"nowrap"}}>{inv>0?`-${fmtH(inv,currency,tc)}`:<span style={{color:C.t3}}>—</span>}</td>
                  <td style={{padding:"9px 12px",textAlign:"right",color:disp>=0?C.blue:C.red,fontWeight:500,whiteSpace:"nowrap"}}>{fmtH(disp,currency,tc)}</td>
                  <td style={{padding:"9px 12px",textAlign:"right",color:rate>=20?C.purple:rate>=10?C.blue:C.t2,whiteSpace:"nowrap"}}>{rate}%</td>
                </tr>;
              })}
              </tbody>
              <tfoot><tr style={{background:C.bg3,borderTop:`1px solid ${C.bd2}`}}>
                <td style={{padding:"9px 12px",fontWeight:500,whiteSpace:"nowrap"}}>Total {selYear}</td>
                <td style={{padding:"9px 12px",textAlign:"right",fontWeight:600,color:C.green,whiteSpace:"nowrap"}}>{fmtH(totI,currency,tc)}</td>
                <td style={{padding:"9px 12px",textAlign:"right",fontWeight:600,color:C.red,whiteSpace:"nowrap"}}>-{fmtH(totG,currency,tc)}</td>
                <td style={{padding:"9px 12px",textAlign:"right",fontWeight:600,color:C.purple,whiteSpace:"nowrap"}}>{totInvARS>0?`-${fmtH(totInvARS,currency,tc)}`:"—"}</td>
                <td style={{padding:"9px 12px",textAlign:"right",fontWeight:600,color:balReal>=0?C.blue:C.red,whiteSpace:"nowrap"}}>{fmtH(balReal,currency,tc)}</td>
                <td style={{padding:"9px 12px",textAlign:"right",fontWeight:600,color:savRateReal>=20?C.purple:C.blue,whiteSpace:"nowrap"}}>{savRateReal}%</td>
              </tr></tfoot>
            </table>
            </div>
          </div>}
          <div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bd}`,fontSize:11,fontWeight:500,color:C.t2,textTransform:"uppercase",letterSpacing:"0.05em"}}>Desglose por categoría</div>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:320}}>
              <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>{["Categoría","Subcategoría","Total","% total"].map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:i>=2?"right":"left",fontSize:11,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>
                {cats.map(cat=>{const ci=ad.filter(x=>x.cat===cat.id);if(!ci.length)return null;const ct=ci.reduce((s,x)=>s+Number(x.monto),0);const subs=cat.items.map(sub=>({sub,val:ci.filter(x=>x.sub===sub.id).reduce((s,x)=>s+Number(x.monto),0)})).filter(x=>x.val>0);return subs.map((s,si)=><tr key={cat.id+s.sub.id} style={{borderBottom:`1px solid ${C.bd}`,background:si===0?cat.color+"08":"transparent"}}><td style={{padding:"8px 12px"}}>{si===0&&<div style={{display:"flex",alignItems:"center",gap:6}}><Ic id={cat.icon} size={13} color={cat.color}/><span style={{fontWeight:500,whiteSpace:"nowrap"}}>{cat.label}</span><span style={{color:cat.color,fontSize:11,marginLeft:4,whiteSpace:"nowrap"}}>{fmtH(ct,currency,tc)}</span></div>}</td><td style={{padding:"8px 12px"}}><Pill color={cat.color} icon={s.sub.icon} label={s.sub.label}/></td><td style={{padding:"8px 12px",textAlign:"right",fontWeight:500,whiteSpace:"nowrap"}}>-{fmtH(s.val,currency,tc)}</td><td style={{padding:"8px 12px",textAlign:"right",color:C.t2,whiteSpace:"nowrap"}}>{Math.round((s.val/(totG||1))*100)}%</td></tr>);})}
                <tr style={{background:C.bg3,borderTop:`1px solid ${C.bd2}`}}><td colSpan={2} style={{padding:"10px 12px",fontWeight:500}}>Total gastos</td><td style={{padding:"10px 12px",textAlign:"right",fontWeight:600,color:C.red,whiteSpace:"nowrap"}}>-{fmtH(totG,currency,tc)}</td><td style={{padding:"10px 12px",textAlign:"right",color:C.t3}}>100%</td></tr>
              </tbody>
            </table>
            </div>
          </div>
          {/* Reporte por medio de pago */}
          <div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bd}`,fontSize:11,fontWeight:500,color:C.t2,textTransform:"uppercase",letterSpacing:"0.05em"}}>Gastos por medio de pago</div>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:260}}>
              <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>{["Medio de pago","Total","% total"].map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:i>=1?"right":"left",fontSize:11,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>
                {mediosTodos.filter(m=>byMedio[m.id]>0).sort((a,b)=>byMedio[b.id]-byMedio[a.id]).map(m=>(
                  <tr key={m.id} style={{borderBottom:`1px solid ${C.bd}`}}>
                    <td style={{padding:"9px 12px"}}><Pill color={m.color} label={m.label}/></td>
                    <td style={{padding:"9px 12px",textAlign:"right",fontWeight:500,whiteSpace:"nowrap"}}>-{fmtH(byMedio[m.id],currency,tc)}</td>
                    <td style={{padding:"9px 12px",textAlign:"right",color:C.t2,whiteSpace:"nowrap"}}>{Math.round((byMedio[m.id]/(totG||1))*100)}%</td>
                  </tr>
                ))}
                {(byMedio["otros"]||0)>0&&<tr><td style={{padding:"9px 12px"}}><span style={{fontSize:12,background:"#94A3B822",color:"#94A3B8",padding:"2px 8px",borderRadius:20,fontWeight:500}}>Otros</span></td><td style={{padding:"9px 12px",textAlign:"right",fontWeight:500,whiteSpace:"nowrap"}}>-{fmtH(byMedio["otros"],currency,tc)}</td><td style={{padding:"9px 12px",textAlign:"right",color:C.t2,whiteSpace:"nowrap"}}>{Math.round((byMedio["otros"]/(totG||1))*100)}%</td></tr>}
                {mediosTodos.every(m=>!byMedio[m.id])&&!(byMedio["otros"]>0)&&<tr><td colSpan={3} style={{padding:"12px 12px",color:C.t3}}>Sin datos</td></tr>}
              </tbody>
            </table>
            </div>
          </div>
        </>}

        {/* CATEGORÍAS */}
        {tab==="categorías"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:500}}>Categorías &amp; Subcategorías</div>
            <Btn primary onClick={()=>{setCatDraft({label:"",color:COLORS[0],icon:"pkg"});setCatModal("new-cat");}}>+ Nueva categoría</Btn>
          </div>
          {cats.map(cat=>(
            <div key={cat.id} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:cat.color+"0D",borderBottom:`1px solid ${C.bd}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:9,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${cat.color}44`}}><Ic id={cat.icon} size={17} color={cat.color}/></div>
                  <div><div style={{fontWeight:600,fontSize:13}}>{cat.label}</div><div style={{fontSize:11,color:C.t3}}>{cat.items.length} subcategorías</div></div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn small onClick={()=>{setEditCatId(cat.id);setSubDraft({label:"",icon:"pkg"});setCatModal("new-sub");}}>+ Sub</Btn>
                  <Btn small onClick={()=>{setEditCatId(cat.id);setCatDraft({label:cat.label,color:cat.color,icon:cat.icon});setCatModal("edit-cat");}}>Editar</Btn>
                  <Btn small danger onClick={()=>delCat(cat.id)}>Eliminar</Btn>
                </div>
              </div>
              <div style={{padding:"12px 18px",display:"flex",flexWrap:"wrap",gap:8}}>
                {cat.items.map(sub=>(
                  <div key={sub.id} style={{display:"flex",alignItems:"center",gap:6,background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:8,padding:"6px 10px"}}>
                    <div style={{width:24,height:24,borderRadius:6,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={sub.icon} size={12} color={cat.color}/></div>
                    <span style={{fontSize:12}}>{sub.label}</span>
                    <button onClick={()=>{setEditCatId(cat.id);setEditSubId(sub.id);setSubDraft({label:sub.label,icon:sub.icon});setCatModal("edit-sub");}} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:11}}>✎</button>
                    <button onClick={()=>delSub(cat.id,sub.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:14}}>×</button>
                  </div>
                ))}
                {cat.items.length===0&&<span style={{fontSize:12,color:C.t3}}>Sin subcategorías</span>}
              </div>
            </div>
          ))}

        </>}

        {/* PRESUPUESTO */}
        {tab==="presupuesto"&&(()=>{
          const totalPresupuestado=Object.entries(budgets).filter(([k])=>!k.includes("|")).reduce((s,[,v])=>s+v,0);
          const gastadoEnCatsConBudget=cats.filter(c=>budgets[c.id]).reduce((s,c)=>s+(byCat[c.id]||0),0);
          const sobrante=totalPresupuestado-gastadoEnCatsConBudget;
          const pctGlobalUsado=totalPresupuestado>0?Math.round((gastadoEnCatsConBudget/totalPresupuestado)*100):null;
          const colorGlobal=pctGlobalUsado>=100?C.red:pctGlobalUsado>=80?C.amber:C.green;
          const catsBudgetadas=cats.filter(c=>budgets[c.id]||(c.items.some(s=>budgets[`${c.id}|${s.id}`])));
          const catsExcedidas=cats.filter(c=>{
            if(budgets[c.id]) return (byCat[c.id]||0)>budgets[c.id];
            return c.items.some(s=>{const k=`${c.id}|${s.id}`;return budgets[k]&&(bySub[k]||0)>budgets[k];});
          });
          return<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>Presupuesto — {MONTHS[selMonth]} {selYear}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:2}}>Los límites son específicos por mes · Podés copiarlos al siguiente</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn small onClick={replicarPresupuesto}>↻ Copiar a {MONTHS[selMonth===11?0:selMonth+1]}</Btn>
              <Btn primary onClick={()=>{setBudgetDraft({...budgets});setBudgetModal(true);}}>Editar presupuestos</Btn>
            </div>
          </div>

          {/* ── RESUMEN GLOBAL ─────────────────────────────────────────────── */}
          {Object.keys(budgets).length>0&&totalPresupuestado>0&&<div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${colorGlobal}44`,borderRadius:14,padding:"18px 20px",marginBottom:16,boxShadow:`0 4px 20px ${colorGlobal}0A`}}>
            <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Resumen global — {MONTHS[selMonth]} {selYear}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:16}}>
              <div style={{background:C.bg4,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Presupuestado</div>
                <div style={{fontSize:17,fontWeight:700,color:C.blue}}>{fmtH(totalPresupuestado,currency,tc)}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>{catsBudgetadas.length} categorías</div>
              </div>
              <div style={{background:C.bg4,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Gastado</div>
                <div style={{fontSize:17,fontWeight:700,color:colorGlobal}}>{fmtH(gastadoEnCatsConBudget,currency,tc)}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>{pctGlobalUsado!==null?`${pctGlobalUsado}% del límite`:""}</div>
              </div>
              <div style={{background:sobrante>=0?C.green+"12":C.red+"12",border:`1px solid ${sobrante>=0?C.green:C.red}33`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{sobrante>=0?"Disponible":"Excedido"}</div>
                <div style={{fontSize:17,fontWeight:700,color:sobrante>=0?C.green:C.red}}>{fmtH(Math.abs(sobrante),currency,tc)}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>{sobrante>=0?"Margen restante":"Sobre el límite"}</div>
              </div>
              <div style={{background:catsExcedidas.length>0?C.red+"12":C.green+"12",border:`1px solid ${catsExcedidas.length>0?C.red:C.green}33`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Excedidas</div>
                <div style={{fontSize:17,fontWeight:700,color:catsExcedidas.length>0?C.red:C.green}}>{catsExcedidas.length}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>de {catsBudgetadas.length}</div>
              </div>
            </div>
            {pctGlobalUsado!==null&&<>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:11,color:C.t2}}>Uso global del presupuesto</span>
                <span style={{fontSize:12,fontWeight:600,color:colorGlobal}}>{pctGlobalUsado}%</span>
              </div>
              <div style={{height:10,borderRadius:6,background:C.bg4,overflow:"hidden",marginBottom:14}}>
                <div style={{height:"100%",borderRadius:6,background:`linear-gradient(90deg,${colorGlobal}88,${colorGlobal})`,width:`${Math.min(pctGlobalUsado,100)}%`,transition:"width .6s ease"}}/>
              </div>
            </>}
            {/* Tabla comparativa */}
            <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Comparativo por categoría</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:360}}>
                <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>
                  {["Categoría","Gastado","Límite","Uso","Diferencia"].map((h,i)=>(
                    <th key={i} style={{padding:"6px 10px",textAlign:i===0?"left":"right",fontSize:10,fontWeight:500,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {cats.filter(c=>budgets[c.id]||(byCat[c.id]>0)).map(c=>{
                    const gastado=byCat[c.id]||0;
                    const bud=budgets[c.id]||null;
                    const pct=bud?Math.round((gastado/bud)*100):null;
                    const over=pct&&pct>=100,warn=pct&&pct>=80&&!over;
                    const diff=bud!==null?bud-gastado:null;
                    const rc=over?C.red:warn?C.amber:C.t;
                    return<tr key={c.id} style={{borderBottom:`1px solid ${C.bd}`,background:over?C.red+"06":warn?C.amber+"06":"transparent"}}>
                      <td style={{padding:"7px 10px"}}><div style={{display:"flex",alignItems:"center",gap:7}}>
                        <span style={{width:20,height:20,borderRadius:5,background:c.color+"22",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={c.icon} size={10} color={c.color}/></span>
                        <span style={{color:C.t,fontWeight:500}}>{c.label}</span>
                        {!bud&&<span style={{fontSize:9,color:C.t3,background:C.bg4,padding:"1px 5px",borderRadius:4}}>sin límite</span>}
                      </div></td>
                      <td style={{padding:"7px 10px",textAlign:"right",fontWeight:600,color:rc,whiteSpace:"nowrap"}}>{fmtH(gastado,currency,tc)}</td>
                      <td style={{padding:"7px 10px",textAlign:"right",color:C.t2,whiteSpace:"nowrap"}}>{bud?fmtH(bud,currency,tc):"—"}</td>
                      <td style={{padding:"7px 10px",textAlign:"right",whiteSpace:"nowrap"}}>
                        {pct!==null?<><span style={{color:rc,fontWeight:600}}>{pct}%</span>
                          <div style={{width:55,height:4,background:C.bg4,borderRadius:3,overflow:"hidden",marginTop:3,marginLeft:"auto"}}>
                            <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:over?C.red:warn?C.amber:C.green,borderRadius:3}}/>
                          </div></>:<span style={{color:C.t3}}>—</span>}
                      </td>
                      <td style={{padding:"7px 10px",textAlign:"right",fontWeight:500,color:diff===null?C.t3:diff>=0?C.green:C.red,whiteSpace:"nowrap"}}>
                        {diff!==null?(diff>=0?"+":"")+fmtH(Math.abs(diff),currency,tc):"—"}
                      </td>
                    </tr>;
                  })}
                  <tr style={{borderTop:`2px solid ${C.bd2}`,background:C.bg4}}>
                    <td style={{padding:"9px 10px",fontWeight:700,color:C.t}}>TOTAL</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:colorGlobal,whiteSpace:"nowrap"}}>{fmtH(gastadoEnCatsConBudget,currency,tc)}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:C.t2,whiteSpace:"nowrap"}}>{fmtH(totalPresupuestado,currency,tc)}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:colorGlobal,whiteSpace:"nowrap"}}>{pctGlobalUsado}%</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:sobrante>=0?C.green:C.red,whiteSpace:"nowrap"}}>{sobrante>=0?"+":""}{fmtH(Math.abs(sobrante),currency,tc)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>}

          {ipcAcumuladoPresupuesto!==null&&<div style={{background:C.amber+"0D",border:`1px solid ${C.amber}33`,borderRadius:9,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
            <div style={{fontSize:12,color:C.t2}}>📈 Inflación acumulada desde enero {selYear}: <b style={{color:C.amber}}>{ipcAcumuladoPresupuesto}%</b></div>
            <div style={{fontSize:11,color:C.t3}}>
              Un presupuesto de {fmtH(100000,"ARS",tc)} de enero equivale hoy a <b style={{color:C.amber}}>{fmtH(Math.round(100000*(1+ipcAcumuladoPresupuesto/100)),"ARS",tc)}</b>
              {!inflData&&<button onClick={fetchInflacion} style={{marginLeft:10,background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:5,padding:"2px 8px",cursor:"pointer",color:C.amber,fontSize:10}}>Cargar IPC</button>}
            </div>
          </div>}
          {Object.keys(budgets).length===0&&<div style={{background:C.amber+"11",border:`1px solid ${C.amber}22`,borderRadius:9,padding:"10px 14px",marginBottom:16,fontSize:12,color:C.t2}}>
            ⚠️ No hay presupuesto definido para <b style={{color:C.t}}>{MONTHS[selMonth]} {selYear}</b>. Podés crearlo o copiarlo de un mes anterior.
          </div>}
          {Object.keys(budgets).length>0&&<div style={{background:C.green+"0D",border:`1px solid ${C.green}22`,borderRadius:9,padding:"10px 14px",marginBottom:16,fontSize:12,color:C.t2}}>
            ✓ Presupuesto activo para <b style={{color:C.t}}>{MONTHS[selMonth]} {selYear}</b> · {Object.keys(budgets).length} reglas definidas
            {ipcAcumuladoPresupuesto&&inflData&&<span style={{marginLeft:8,color:C.amber}}>· Indexar al IPC: multiplicar límites por <b>{(1+ipcAcumuladoPresupuesto/100).toFixed(2)}x</b></span>}
          </div>}

          {cats.map(cat=>{
            const val=byCat[cat.id]||0;
            const bud=budgets[cat.id];
            const pct=bud?Math.min(Math.round((val/bud)*100),150):null;
            const over=pct&&pct>=100,warn=pct&&pct>=80&&pct<100;
            const subsWithBudget=cat.items.filter(s=>budgets[`${cat.id}|${s.id}`]||bySub[`${cat.id}|${s.id}`]>0);
            return<div key={cat.id} style={{background:C.bg2,border:`1px solid ${over?C.red+"44":warn?C.amber+"44":C.bd}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
              <div style={{padding:"16px 18px",borderBottom:subsWithBudget.length?`1px solid ${C.bd}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:bud?10:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={cat.icon} size={15} color={cat.color}/></div>
                    <div>
                      <div style={{fontWeight:500,fontSize:13}}>{cat.label}</div>
                      <div style={{fontSize:11,color:C.t3}}>{bud?`Límite categoría: ${fmtH(bud,currency,tc)}`:"Sin presupuesto de categoría"}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:600,color:over?C.red:warn?C.amber:C.t}}>{fmtH(val,currency,tc)}</div>
                    {bud&&<div style={{fontSize:11,color:over?C.red:warn?C.amber:C.t3}}>{pct}% usado</div>}
                  </div>
                </div>
                {bud&&<>
                  <div style={{height:6,borderRadius:4,background:C.bg4}}><div style={{height:"100%",borderRadius:4,background:over?C.red:warn?C.amber:cat.color,width:`${Math.min(pct,100)}%`,transition:"width .4s"}}/></div>
                  <div style={{fontSize:11,color:over?C.red:warn?C.amber:C.t3,marginTop:6}}>{over?`Excedido por ${fmtH(val-bud,currency,tc)}`:warn?`Quedan ${fmtH(bud-val,currency,tc)}`:`Disponible: ${fmtH(bud-val,currency,tc)}`}</div>
                </>}
                {!bud&&<div style={{fontSize:11,color:C.t3,marginTop:4}}>Sin límite de categoría definido</div>}
              </div>
              {subsWithBudget.length>0&&<div style={{padding:"12px 18px",display:"flex",flexDirection:"column",gap:10}}>
                {subsWithBudget.map(sub=>{
                  const key=`${cat.id}|${sub.id}`;
                  const sv=bySub[key]||0;
                  const sb=budgets[key];
                  const sp=sb?Math.min(Math.round((sv/sb)*100),150):null;
                  const sover=sp&&sp>=100,swarn=sp&&sp>=80&&sp<100;
                  return<div key={sub.id} style={{background:C.bg3,borderRadius:8,padding:"10px 12px",border:`1px solid ${sover?C.red+"33":swarn?C.amber+"33":C.bd}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sb?6:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:24,height:24,borderRadius:6,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={sub.icon} size={12} color={cat.color}/></div>
                        <span style={{fontSize:12}}>{sub.label}</span>
                        {!sb&&<span style={{fontSize:10,color:C.t3,marginLeft:4}}>sin límite</span>}
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:12,fontWeight:500,color:sover?C.red:swarn?C.amber:C.t}}>{fmtH(sv,currency,tc)}</span>
                        {sb&&<span style={{fontSize:11,color:C.t3}}> / {fmtH(sb,currency,tc)}</span>}
                      </div>
                    </div>
                    {sb&&<>
                      <div style={{height:4,borderRadius:4,background:C.bg4}}><div style={{height:"100%",borderRadius:4,background:sover?C.red:swarn?C.amber:cat.color,width:`${Math.min(sp,100)}%`,transition:"width .4s"}}/></div>
                      <div style={{fontSize:10,color:sover?C.red:swarn?C.amber:C.t3,marginTop:4}}>{sp}% — {sover?`excedido ${fmtH(sv-sb,currency,tc)}`:swarn?`quedan ${fmtH(sb-sv,currency,tc)}`:`disponible ${fmtH(sb-sv,currency,tc)}`}</div>
                    </>}
                  </div>;
                })}
              </div>}
            </div>;
          })}
          </>;
        })()}

        {/* GRÁFICOS */}
        {tab==="gráficos"&&(()=>{
          // ---- datos calculados para gráficos ----
          const W=560,PL=58,PR=16,PT=28,PB=36;
          const cW=W-PL-PR, cH=130;
          const H=PT+cH+PB;
          const svgStyle={width:"100%",maxHeight:200,display:"block"};

          // 1. Evolución mensual — líneas ingresos vs gastos
          const mMax=Math.max(...mTotals.map(x=>Math.max(x.g,x.i)),1);
          const mPts=mTotals.map((m,i)=>({
            x:PL+(i/(11))*cW, yg:PT+cH*(1-m.g/mMax), yi:PT+cH*(1-m.i/mMax), g:m.g, i:m.i, bal:m.i-m.g
          }));
          const pathG=mPts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.yg}`).join(" ");
          const pathI=mPts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.yi}`).join(" ");
          const areaG=`M${mPts[0].x},${PT+cH} ${mPts.map(p=>`L${p.x},${p.yg}`).join(" ")} L${mPts[11].x},${PT+cH} Z`;
          const areaI=`M${mPts[0].x},${PT+cH} ${mPts.map(p=>`L${p.x},${p.yi}`).join(" ")} L${mPts[11].x},${PT+cH} Z`;
          const gridY=[0,0.25,0.5,0.75,1];

          // 2. Donut categorías
          const catData=[...cats].map(c=>({...c,val:byCat[c.id]||0})).filter(c=>c.val>0).sort((a,b)=>b.val-a.val);
          const catTotal=catData.reduce((s,c)=>s+c.val,0);

          // 3. Barras subcategorías top 10
          const subData=[];
          cats.forEach(c=>c.items.forEach(s=>{
            const v=bySub[`${c.id}|${s.id}`]||0;
            if(v>0)subData.push({label:s.label,val:v,color:c.color,icon:s.icon,catLabel:c.label});
          }));
          subData.sort((a,b)=>b.val-a.val);
          const top10=subData.slice(0,10);
          const subMax=Math.max(...top10.map(s=>s.val),1);

          // 4. Balance mensual — barras positivas/negativas
          const balMax=Math.max(...mTotals.map(x=>Math.abs(x.i-x.g)),1);

          // 5. Medios de pago — donut
          const otrosVal=byMedio["otros"]||0;
          const medioData=[...mediosTodos.map(m=>({...m,val:byMedio[m.id]||0})).filter(m=>m.val>0),...(otrosVal>0?[{id:"otros",label:"Otros",color:"#94A3B8",val:otrosVal}]:[])].sort((a,b)=>b.val-a.val);

          // 6. Ahorro acumulado año
          let cumAhorro=0;
          const ahorroMeses=mTotals.map((m,i)=>{cumAhorro+=m.i-m.g;return{m:i,val:cumAhorro,g:m.g,i:m.i};});

          const Card=({title,subtitle,children})=>(
            <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t}}>{title}</div>
                {subtitle&&<div style={{fontSize:10,color:C.t3}}>{subtitle}</div>}
              </div>
              {children}
            </div>
          );

          const YAxis=({max,h,pl,pt,steps=5})=><>{[...Array(steps)].map((_,i)=>{
            const f=i/(steps-1);
            const v=Math.round(max*f);
            const y=pt+h*(1-f);
            return<g key={i}>
              <line x1={pl} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="1"/>
              <text x={pl-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="9" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v}</text>
            </g>;
          })}</>;

          return <>
            <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>📊 Gráficos</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:20}}>{viewMode==="month"?`${MONTHS[selMonth]} ${selYear}`:`Año ${selYear}`} · Todos los montos en {currency}</div>

            {/* 1 — Evolución mensual líneas */}
            <Card title={`Ingresos vs Gastos — ${selYear}`} subtitle="Evolución mensual">
              <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.25"/><stop offset="100%" stopColor={C.green} stopOpacity="0"/></linearGradient>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity="0.2"/><stop offset="100%" stopColor={C.red} stopOpacity="0"/></linearGradient>
                </defs>
                <YAxis max={mMax} h={cH} pl={PL} pt={PT}/>
                <path d={areaI} fill="url(#gi)"/>
                <path d={areaG} fill="url(#gg)"/>
                <path d={pathI} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/>
                <path d={pathG} fill="none" stroke={C.red} strokeWidth="2.5" strokeLinejoin="round"/>
                {mPts.map((p,i)=><g key={i}>
                  <circle cx={p.x} cy={p.yi} r="3.5" fill={C.green}/>
                  <circle cx={p.x} cy={p.yg} r="3.5" fill={C.red}/>
                  <text x={p.x} y={H-6} textAnchor="middle" fill={i===selMonth?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={i===selMonth?"700":"400"}>{MONTHS[i]}</text>
                </g>)}
              </svg>
              <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                <span><span style={{display:"inline-block",width:10,height:3,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Ingresos</span>
                <span><span style={{display:"inline-block",width:10,height:3,background:C.red,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Gastos</span>
              </div>
            </Card>

            {/* 2+5 — Donuts lado a lado */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:16}}>
              {/* Donut categorías */}
              <div style={{flex:"1 1 260px",background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t,marginBottom:14}}>Distribución por categoría</div>
                {catTotal===0?<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"30px 0"}}>Sin datos</div>:(()=>{
                  let ang=-Math.PI/2;
                  const r=80,ir=52,cx=100,cy=95;
                  return<svg viewBox="0 0 340 170" style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                    {catData.map((c,i)=>{
                      const a=(c.val/catTotal)*2*Math.PI;
                      const x1=cx+r*Math.cos(ang),y1=cy+r*Math.sin(ang);
                      ang+=a;
                      const x2=cx+r*Math.cos(ang),y2=cy+r*Math.sin(ang);
                      const ix1=cx+ir*Math.cos(ang-a),iy1=cy+ir*Math.sin(ang-a);
                      const ix2=cx+ir*Math.cos(ang),iy2=cy+ir*Math.sin(ang);
                      return<path key={i} d={`M${x1},${y1} A${r},${r},0,${a>Math.PI?1:0},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${a>Math.PI?1:0},0,${ix1},${iy1} Z`} fill={c.color} opacity="0.92"/>;
                    })}
                    <circle cx={cx} cy={cy} r={ir-2} fill={C.bg3}/>
                    <text x={cx} y={cy-6} textAnchor="middle" fill={C.t3} fontSize="9" fontFamily="sans-serif">Total</text>
                    <text x={cx} y={cy+8} textAnchor="middle" fill={C.t} fontSize="11" fontFamily="sans-serif" fontWeight="700">{fmtH(catTotal,currency,tc)}</text>
                    {catData.slice(0,6).map((c,i)=>{
                      const row=Math.floor(i/2), col=i%2;
                      const lx=200+col*72, ly=20+row*30;
                      return<g key={i}>
                        <rect x={lx} y={ly} width="8" height="8" rx="2" fill={c.color}/>
                        <text x={lx+11} y={ly+8} fill={C.t2} fontSize="9" fontFamily="sans-serif">{c.label.length>10?c.label.slice(0,9)+"…":c.label}</text>
                        <text x={lx+11} y={ly+18} fill={c.color} fontSize="8" fontFamily="sans-serif" fontWeight="700">{Math.round((c.val/catTotal)*100)}%</text>
                      </g>;
                    })}
                  </svg>;
                })()}
              </div>
              {/* Donut medios de pago */}
              <div style={{flex:"1 1 260px",background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t,marginBottom:14}}>Medios de pago</div>
                {medioData.length===0?<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"30px 0"}}>Sin datos</div>:(()=>{
                  const mTotal=medioData.reduce((s,m)=>s+m.val,0);
                  let ang2=-Math.PI/2;
                  const r=80,ir=52,cx=100,cy=95;
                  return<svg viewBox="0 0 340 170" style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                    {medioData.map((m,i)=>{
                      const a=(m.val/mTotal)*2*Math.PI;
                      const x1=cx+r*Math.cos(ang2),y1=cy+r*Math.sin(ang2);
                      ang2+=a;
                      const x2=cx+r*Math.cos(ang2),y2=cy+r*Math.sin(ang2);
                      const ix1=cx+ir*Math.cos(ang2-a),iy1=cy+ir*Math.sin(ang2-a);
                      const ix2=cx+ir*Math.cos(ang2),iy2=cy+ir*Math.sin(ang2);
                      return<path key={i} d={`M${x1},${y1} A${r},${r},0,${a>Math.PI?1:0},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${a>Math.PI?1:0},0,${ix1},${iy1} Z`} fill={m.color} opacity="0.92"/>;
                    })}
                    <circle cx={cx} cy={cy} r={ir-2} fill={C.bg3}/>
                    <text x={cx} y={cy-6} textAnchor="middle" fill={C.t3} fontSize="9" fontFamily="sans-serif">Total</text>
                    <text x={cx} y={cy+8} textAnchor="middle" fill={C.t} fontSize="11" fontFamily="sans-serif" fontWeight="700">{fmtH(mTotal,currency,tc)}</text>
                    {medioData.map((m,i)=>{
                      const row=Math.floor(i/2), col=i%2;
                      const lx=200+col*72, ly=10+row*26;
                      return<g key={i}>
                        <rect x={lx} y={ly} width="8" height="8" rx="2" fill={m.color}/>
                        <text x={lx+11} y={ly+8} fill={C.t2} fontSize="9" fontFamily="sans-serif">{m.label.length>9?m.label.slice(0,8)+"…":m.label}</text>
                        <text x={lx+11} y={ly+17} fill={m.color} fontSize="8" fontFamily="sans-serif" fontWeight="700">{fmtH(m.val,currency,tc)}</text>
                      </g>;
                    })}
                  </svg>;
                })()}
              </div>
            </div>

            {/* 3 — Top subcategorías barras horizontales */}
            {top10.length>0&&<Card title="Top subcategorías por gasto" subtitle={`${viewMode==="month"?MONTHS[selMonth]+" "+selYear:"Año "+selYear}`}>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {top10.map((s,i)=>{
                  const pct=Math.round((s.val/subMax)*100);
                  const pctTotal=catTotal>0?Math.round((s.val/catTotal)*100):0;
                  return<div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:11,color:C.t3,width:16,textAlign:"right",flexShrink:0}}>{i+1}</span>
                    <span style={{fontSize:11,color:C.t2,width:100,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                    <div style={{flex:1,height:18,background:C.bg4,borderRadius:4,overflow:"hidden",position:"relative"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${s.color}66,${s.color})`,borderRadius:4,transition:"width .5s ease"}}/>
                      <span style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",fontSize:9,color:C.t3}}>{pctTotal}%</span>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:s.color,width:72,textAlign:"right",flexShrink:0}}>{fmtH(s.val,currency,tc)}</span>
                  </div>;
                })}
              </div>
            </Card>}

            {/* 4 — Balance mensual barras */}
            <Card title={`Balance mensual — ${selYear}`} subtitle="Verde = superávit · Rojo = déficit">
              <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                <line x1={PL} y1={PT+cH/2} x2={W-PR} y2={PT+cH/2} stroke={C.bd2} strokeWidth="1.5" strokeDasharray="4,3"/>
                {gridY.map((f,i)=>{
                  const v=Math.round((balMax*2)*f-balMax);
                  const y=PT+cH*(1-f);
                  return<g key={i}>
                    <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                    <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v>=0?v:v}</text>
                  </g>;
                })}
                {mTotals.map((m,i)=>{
                  const bal2=m.i-m.g;
                  const bW=Math.max(14,(cW/12)-4);
                  const x=PL+(cW/12)*i+(cW/12-bW)/2;
                  const midY=PT+cH/2;
                  const bH=Math.abs(bal2/balMax)*(cH/2);
                  const isPos=bal2>=0;
                  const y=isPos?midY-bH:midY;
                  return<g key={i}>
                    <rect x={x} y={y} width={bW} height={Math.max(bH,1)} fill={isPos?C.green:C.red} rx="3" opacity="0.85"/>
                    <text x={x+bW/2} y={H-6} textAnchor="middle" fill={i===selMonth?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={i===selMonth?"700":"400"}>{MONTHS[i]}</text>
                  </g>;
                })}
              </svg>
            </Card>

            {/* 5 — Ahorro acumulado */}
            <Card title={`Ahorro acumulado — ${selYear}`} subtitle="Suma del balance mes a mes">
              {(()=>{
                const hasData=ahorroMeses.some(m=>m.i>0||m.g>0);
                if(!hasData)return<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"20px 0"}}>Sin datos de ingresos/gastos este año</div>;
                const aMin=Math.min(...ahorroMeses.map(x=>x.val));
                const aMax2=Math.max(...ahorroMeses.map(x=>x.val));
                const range=Math.max(Math.abs(aMin),Math.abs(aMax2),1);
                const pts2=ahorroMeses.map((m,i)=>({
                  x:PL+(i/11)*cW,
                  y:PT+cH*(1-(m.val+range)/(range*2)),
                  val:m.val
                }));
                const path2=pts2.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                const midY2=PT+cH*(1-(0+range)/(range*2));
                return<svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.purple} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={C.purple} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <line x1={PL} y1={midY2} x2={W-PR} y2={midY2} stroke={C.bd2} strokeWidth="1" strokeDasharray="4,3"/>
                  {[0,0.25,0.5,0.75,1].map((f,i)=>{
                    const v=Math.round((range*2)*f-range);
                    const y=PT+cH*(1-f);
                    return<g key={i}>
                      <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                      <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v<=-1000?Math.round(v/1000)+"K":v}</text>
                    </g>;
                  })}
                  <path d={`M${pts2[0].x},${midY2} ${pts2.map(p=>`L${p.x},${p.y}`).join(" ")} L${pts2[11].x},${midY2} Z`} fill="url(#ga)"/>
                  <path d={path2} fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinejoin="round"/>
                  {pts2.map((p,i)=><g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill={p.val>=0?C.purple:C.red}/>
                    <text x={p.x} y={H-6} textAnchor="middle" fill={i===selMonth?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={i===selMonth?"700":"400"}>{MONTHS[i]}</text>
                  </g>)}
                </svg>;
              })()}
              <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                <span><span style={{display:"inline-block",width:10,height:3,background:C.purple,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Acumulado</span>
                <span style={{marginLeft:"auto",color:ahorroMeses[ahorroMeses.length-1]?.val>=0?C.green:C.red,fontWeight:600}}>
                  Final: {fmtH(ahorroMeses[ahorroMeses.length-1]?.val||0,currency,tc)}
                </span>
              </div>
            </Card>

            {/* 6 — TENDENCIA DE AHORRO % mes a mes */}
            {(()=>{
              const tasaMeses=mTotals.map((m,i)=>({
                m:i,
                rate:m.i>0?Math.round(((m.i-m.g)/m.i)*100):null,
                g:m.g, i:m.i
              }));
              const conDatos=tasaMeses.filter(x=>x.rate!==null);
              if(conDatos.length<2)return null;
              const rates=conDatos.map(x=>x.rate);
              const rMin=Math.min(...rates,-20);
              const rMax=Math.max(...rates,20);
              const range2=Math.max(Math.abs(rMin),Math.abs(rMax),1);
              const toY2=(v)=>PT+cH*(1-(v+range2)/(range2*2));
              const midY3=toY2(0);
              const pts3=tasaMeses.map((m,i)=>m.rate!==null?{x:PL+(i/11)*cW,y:toY2(m.rate),rate:m.rate,i}:null);
              const validPts=pts3.filter(Boolean);
              const path3=validPts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
              const avgRate=conDatos.length>0?Math.round(conDatos.reduce((s,x)=>s+x.rate,0)/conDatos.length):0;
              return<Card title={`Tendencia de ahorro — ${selYear}`} subtitle={`Promedio anual: ${avgRate}%`}>
                <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={C.green} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Zona objetivo 20% */}
                  {toY2(20)<PT+cH&&<rect x={PL} y={toY2(Math.min(rMax,100))} width={cW} height={Math.max(0,toY2(20)-toY2(Math.min(rMax,100)))} fill={C.green} opacity="0.05"/>}
                  <line x1={PL} y1={midY3} x2={W-PR} y2={midY3} stroke={C.bd2} strokeWidth="1" strokeDasharray="4,3"/>
                  {/* Línea objetivo 20% */}
                  {toY2(20)>PT&&toY2(20)<PT+cH&&<>
                    <line x1={PL} y1={toY2(20)} x2={W-PR} y2={toY2(20)} stroke={C.green} strokeWidth="0.8" strokeDasharray="3,4" opacity="0.5"/>
                    <text x={W-PR+2} y={toY2(20)+4} fill={C.green} fontSize="8" fontFamily="sans-serif" opacity="0.7">20%</text>
                  </>}
                  {/* Línea promedio */}
                  {avgRate!==0&&<line x1={PL} y1={toY2(avgRate)} x2={W-PR} y2={toY2(avgRate)} stroke={C.amber} strokeWidth="1" strokeDasharray="5,3" opacity="0.7"/>}
                  {[...new Set([-range2,-Math.round(range2/2),0,Math.round(range2/2),range2])].map((v,i)=>{
                    const y=toY2(v);
                    if(y<PT-5||y>PT+cH+5)return null;
                    return<g key={i}>
                      <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                      <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v}%</text>
                    </g>;
                  })}
                  {validPts.length>1&&<>
                    <path d={`M${validPts[0].x},${midY3} ${validPts.map(p=>`L${p.x},${p.y}`).join(" ")} L${validPts[validPts.length-1].x},${midY3} Z`} fill="url(#gah)"/>
                    <path d={path3} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/>
                  </>}
                  {tasaMeses.map((m,i)=>{
                    const p=pts3[i];
                    const isActive=i===selMonth;
                    return<g key={i}>
                      {p&&<>
                        <circle cx={p.x} cy={p.y} r={isActive?5:3.5} fill={m.rate>=20?C.green:m.rate>=0?C.amber:C.red} stroke={isActive?C.t:"none"} strokeWidth="1.5"/>
                        {isActive&&<text x={p.x} y={p.y-8} textAnchor="middle" fill={m.rate>=20?C.green:m.rate>=0?C.amber:C.red} fontSize="9" fontFamily="sans-serif" fontWeight="700">{m.rate}%</text>}
                      </>}
                      <text x={PL+(i/11)*cW} y={H-6} textAnchor="middle" fill={isActive?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={isActive?"700":"400"}>{MONTHS[i]}</text>
                    </g>;
                  })}
                </svg>
                <div style={{display:"flex",gap:14,fontSize:11,color:C.t2,marginTop:4,flexWrap:"wrap"}}>
                  <span><span style={{display:"inline-block",width:10,height:3,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Tasa de ahorro mensual</span>
                  <span style={{color:C.amber}}>— Promedio: {avgRate}%</span>
                  <span style={{color:C.green,opacity:0.6}}>— — Meta: 20%</span>
                  <span style={{marginLeft:"auto",fontWeight:600,color:savRate>=20?C.green:savRate>=0?C.amber:C.red}}>{MONTHS[selMonth]}: {savRate}%</span>
                </div>
              </Card>;
            })()}

            {/* 7 — COMPARACIÓN MES A MES POR CATEGORÍA */}
            {viewMode==="month"&&(()=>{
              const prevMonth=selMonth===0?11:selMonth-1;
              const prevYear=selMonth===0?selYear-1:selYear;
              const gastosPrev=gastos.filter(g=>g.year===prevYear&&g.month===prevMonth);
              const comparacion=cats.map(cat=>{
                const actual=monthGastos.filter(g=>g.cat===cat.id).reduce((s,x)=>s+Number(x.monto),0);
                const anterior=gastosPrev.filter(g=>g.cat===cat.id).reduce((s,x)=>s+Number(x.monto),0);
                const diff=actual-anterior;
                const pctDiff=anterior>0?Math.round((diff/anterior)*100):actual>0?100:0;
                return{cat,actual,anterior,diff,pctDiff};
              }).filter(x=>x.actual>0||x.anterior>0).sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff));
              if(comparacion.length===0)return null;
              const hasPrev=comparacion.some(x=>x.anterior>0);
              const maxVal=Math.max(...comparacion.map(x=>Math.max(x.actual,x.anterior)),1);
              return<Card title={`Comparación: ${MONTHS[selMonth]} vs ${MONTHS[prevMonth]}`} subtitle={hasPrev?"Variación por categoría":""}>
                {!hasPrev&&<div style={{fontSize:12,color:C.t3,marginBottom:12}}>Sin datos del mes anterior para comparar.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {comparacion.slice(0,8).map(({cat,actual,anterior,diff,pctDiff})=>{
                    const barActPct=Math.round((actual/maxVal)*100);
                    const barPrevPct=Math.round((anterior/maxVal)*100);
                    const subio=diff>0,bajo=diff<0;
                    return<div key={cat.id}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <div style={{width:22,height:22,borderRadius:6,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={cat.icon} size={11} color={cat.color}/></div>
                        <span style={{fontSize:12,fontWeight:500,flex:1}}>{cat.label}</span>
                        {hasPrev&&anterior>0&&<span style={{fontSize:11,fontWeight:600,color:subio?C.red:bajo?C.green:C.t3,background:(subio?C.red:bajo?C.green:C.t3)+"18",borderRadius:5,padding:"2px 7px"}}>
                          {subio?"+":""}{pctDiff}%
                        </span>}
                        {hasPrev&&anterior===0&&actual>0&&<span style={{fontSize:10,color:C.amber,background:C.amber+"18",borderRadius:5,padding:"2px 7px"}}>Nuevo</span>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:3,paddingLeft:30}}>
                        {/* Barra mes actual */}
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,color:C.t2,width:28,flexShrink:0}}>{MONTHS[selMonth].slice(0,3)}</span>
                          <div style={{flex:1,height:10,background:C.bg4,borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${barActPct}%`,background:cat.color,borderRadius:3,opacity:0.9,transition:"width .4s"}}/>
                          </div>
                          <span style={{fontSize:11,fontWeight:600,color:cat.color,width:68,textAlign:"right",flexShrink:0}}>{fmtH(actual,currency,tc)}</span>
                        </div>
                        {/* Barra mes anterior */}
                        {anterior>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,color:C.t3,width:28,flexShrink:0}}>{MONTHS[prevMonth].slice(0,3)}</span>
                          <div style={{flex:1,height:10,background:C.bg4,borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${barPrevPct}%`,background:cat.color,borderRadius:3,opacity:0.4,transition:"width .4s"}}/>
                          </div>
                          <span style={{fontSize:11,color:C.t3,width:68,textAlign:"right",flexShrink:0}}>{fmtH(anterior,currency,tc)}</span>
                        </div>}
                      </div>
                    </div>;
                  })}
                </div>
                {hasPrev&&<div style={{fontSize:11,color:C.t3,marginTop:12,borderTop:`1px solid ${C.bd}`,paddingTop:10,display:"flex",gap:16,flexWrap:"wrap"}}>
                  {comparacion.filter(x=>x.diff>0).slice(0,3).map(x=><span key={x.cat.id} style={{color:C.red}}>↑ {x.cat.label} +{x.pctDiff}%</span>)}
                  {comparacion.filter(x=>x.diff<0).slice(0,3).map(x=><span key={x.cat.id} style={{color:C.green}}>↓ {x.cat.label} {x.pctDiff}%</span>)}
                </div>}
              </Card>;
            })()}

            {/* 8 — RATIO GASTOS FIJOS VS VARIABLES */}
            {(()=>{
              // Fijos = categoría vivienda (hogar). Todo lo demás = variable.
              const FIJOS_CATS=new Set(["vivienda","hogar"]);
              const data=viewMode==="year"?yearGastos:monthGastos;
              let totalFijo=0,totalVariable=0;
              const detalleFijo=[],detalleVariable=[];
              cats.forEach(cat=>{
                cat.items.forEach(sub=>{
                  const val=data.filter(g=>g.cat===cat.id&&g.sub===sub.id).reduce((s,x)=>s+Number(x.monto),0);
                  if(!val)return;
                  if(FIJOS_CATS.has(cat.id)){totalFijo+=val;detalleFijo.push({cat,sub,val});}
                  else{totalVariable+=val;detalleVariable.push({cat,sub,val});}
                });
              });
              const total=totalFijo+totalVariable;
              if(!total)return null;
              const pctFijo=Math.round((totalFijo/total)*100);
              const pctVar=100-pctFijo;
              const segmentos=[
                {label:"Fijos",val:totalFijo,pct:pctFijo,color:C.red,desc:"Vivienda: alquiler, expensas, servicios",detalle:detalleFijo},
                {label:"Variables",val:totalVariable,pct:pctVar,color:C.green,desc:"Alimentación, transporte, ocio, otros",detalle:detalleVariable},
              ];
              return<Card title="Gastos fijos vs variables" subtitle={viewMode==="month"?`${MONTHS[selMonth]} ${selYear}`:`Año ${selYear}`}>
                {/* Barra stacked */}
                <div style={{height:28,borderRadius:8,overflow:"hidden",display:"flex",marginBottom:14}}>
                  {segmentos.map((s,i)=>s.pct>0&&<div key={i} style={{width:`${s.pct}%`,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",transition:"width .5s",opacity:0.88}}>
                    {s.pct>8&&<span style={{fontSize:10,fontWeight:700,color:"#fff"}}>{s.pct}%</span>}
                  </div>)}
                </div>
                {/* Leyenda + totales */}
                <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                  {segmentos.map((s,i)=><div key={i} style={{flex:"1 1 140px",background:s.color+"0F",border:`1px solid ${s.color}33`,borderRadius:9,padding:"10px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{width:10,height:10,borderRadius:3,background:s.color,display:"inline-block",flexShrink:0}}/>
                      <span style={{fontSize:12,fontWeight:600,color:s.color}}>{s.label}</span>
                      <span style={{fontSize:11,color:s.color,marginLeft:"auto",fontWeight:700}}>{s.pct}%</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.t,marginBottom:2}}>{fmtH(s.val,currency,tc)}</div>
                    <div style={{fontSize:10,color:C.t3}}>{s.desc}</div>
                  </div>)}
                </div>
                {/* Insight automático */}
                <div style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.t2}}>
                  {pctFijo>=70&&<span>⚠️ <b style={{color:C.red}}>Alta rigidez presupuestaria</b> — el {pctFijo}% son gastos que no podés reducir fácilmente.</span>}
                  {pctFijo>=50&&pctFijo<70&&<span>📊 <b style={{color:C.amber}}>Estructura típica argentina</b> — {pctFijo}% fijos. Margen de ajuste limitado al {pctVar}% variable.</span>}
                  {pctFijo<50&&<span>✅ <b style={{color:C.green}}>Buena flexibilidad</b> — el {pctVar}% son gastos variables, donde podés recortar si es necesario.</span>}
                  <span style={{color:C.t3,marginLeft:8,fontSize:11}}>· Potencial de ahorro inmediato: {fmtH(totalVariable,currency,tc)}</span>
                </div>
                {/* Top variables (donde se puede recortar) */}
                {detalleVariable.length>0&&<div style={{marginTop:12}}>
                  <div style={{fontSize:11,fontWeight:500,color:C.t3,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Top gastos variables — dónde recortar</div>
                  {[...detalleVariable].sort((a,b)=>b.val-a.val).slice(0,5).map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:11,color:C.t3,width:16,textAlign:"right"}}>{i+1}</span>
                    <div style={{width:20,height:20,borderRadius:5,background:d.cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={d.sub.icon} size={10} color={d.cat.color}/></div>
                    <span style={{fontSize:12,color:C.t2,flex:1}}>{d.sub.label}</span>
                    <div style={{width:80,height:6,background:C.bg4,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.round((d.val/totalVariable)*100)}%`,background:d.cat.color,borderRadius:3,opacity:0.8}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:d.cat.color,width:72,textAlign:"right"}}>{fmtH(d.val,currency,tc)}</span>
                  </div>)}
                </div>}
              </Card>;
            })()}

            {/* GRÁFICO: SUELDO NOMINAL VS PODER ADQUISITIVO REAL */}
            {inflData&&(()=>{
              const ipcMapLocal={};
              inflData.forEach(x=>{ipcMapLocal[x.fecha.slice(0,7)]=x.valor;});

              // Sueldo nominal por mes — SOLO "Sueldo ARS" para análisis de poder adquisitivo
              const mesesConSueldo=MONTHS.map((_,m)=>{
                const nom=ingresos
                  .filter(x=>x.year===selYear&&x.month===m&&x.tipo==="Sueldo ARS")
                  .reduce((s,x)=>s+Number(x.monto),0);
                return{m,nom};
              }).filter(x=>x.nom>0);

              if(mesesConSueldo.length===0)return<Card title="Sueldo nominal vs poder adquisitivo real" subtitle="Requiere IPC cargado y sueldos en Ingresos">
                <div style={{fontSize:12,color:C.t3,padding:"12px 0"}}>Sin datos de "Sueldo ARS" en {selYear}. Bonos, aguinaldo y otros tipos de ingreso no se incluyen en este análisis.</div>
              </Card>;

              // ── Lógica (equivale a la tabla de la imagen) ─────────────────────
              // Mes base = primer mes con sueldo
              // Sueldo real de cada mes = sueldo_base × IPC_acumulado_hasta_ese_mes
              //   Ene: base × (1+ipc_ene)
              //   Feb: base × (1+ipc_ene) × (1+ipc_feb)
              //   Mar: base × (1+ipc_ene) × (1+ipc_feb) × (1+ipc_mar)  ...
              // La línea verde (real) sube con la inflación.
              // La línea azul (nominal) muestra lo que realmente cobró.
              // La brecha = poder adquisitivo perdido.
              const mesBase=mesesConSueldo[0].m;
              const sueldoBase=mesesConSueldo[0].nom;

              // Factor IPC acumulado desde mesBase hasta mesDestino INCLUSIVE
              const factorHasta=(mesDestino)=>{
                let f=1;
                for(let m=mesBase;m<=mesDestino;m++){
                  const ym=`${selYear}-${String(m+1).padStart(2,"0")}`;
                  if(ipcMapLocal[ym]!=null) f*=(1+ipcMapLocal[ym]/100);
                }
                return f;
              };

              const ultimoMes=mesesConSueldo[mesesConSueldo.length-1].m;

              // Generar puntos para todos los meses desde base hasta el último con sueldo
              // nom  = lo que realmente cobró (0 si no hay sueldo ese mes)
              // real = sueldoBase × factor_ipc_acumulado (lo que debería ganar)
              const puntos=[];
              for(let m=mesBase;m<=ultimoMes;m++){
                const nom=mesesConSueldo.find(x=>x.m===m)?.nom||0;
                const factor=factorHasta(m);
                const real=Math.round(sueldoBase*factor);
                const ipcMes=ipcMapLocal[`${selYear}-${String(m+1).padStart(2,"0")}`];
                puntos.push({m,nom,real,factor,ipcMes});
              }

              // ── Punto del mes seleccionado ─────────────────────────────────────
              const puntoSel=puntos.find(p=>p.m===selMonth);
              const factorSel=selMonth>=mesBase&&selMonth<=ultimoMes
                ?factorHasta(selMonth)
                :factorHasta(ultimoMes);
              const realMesSel=Math.round(sueldoBase*factorSel);
              const nomMesSel=puntoSel?.nom||mesesConSueldo[mesesConSueldo.length-1].nom;
              const brechaMesSel=realMesSel-nomMesSel;
              const pctBrechaSel=sueldoBase>0?Math.round(((realMesSel/sueldoBase)-1)*100):0;
              const labelSel=puntoSel?MONTHS[selMonth]:`${MONTHS[selMonth]} (últ. sueldo)`;

              // ── Métricas ──────────────────────────────────────────────────────
              const factorUlt=puntos[puntos.length-1].factor;
              const inflAcum=Math.round((factorUlt-1)*100);
              const ultNom=mesesConSueldo[mesesConSueldo.length-1].nom;
              const ultReal=puntos[puntos.length-1].real;
              const brechaTotal=ultReal-ultNom;
              const perdio=brechaTotal>0; // si real > nominal, perdiste poder adquisitivo

              // ── SVG ────────────────────────────────────────────────────────────
              const n=puntos.length;
              // Solo incluir puntos nominales con sueldo real para escala
              const nomVals=puntos.filter(p=>p.nom>0).map(p=>p.nom);
              const allVals=[...nomVals,...puntos.map(p=>p.real)];
              const maxV=Math.max(...allVals)*1.08;
              const minV=Math.min(...allVals)*0.90;
              const range=maxV-minV||1;
              const xOf=(i)=>PL+(n===1?cW/2:i/(n-1)*cW);
              const yOf=(v)=>PT+cH*(1-(v-minV)/range);
              const pathReal=puntos.map((p,i)=>`${i===0?"M":"L"}${xOf(i)},${yOf(p.real)}`).join(" ");
              const pathNomSegs=puntos.filter(p=>p.nom>0).map(p=>{
                const i=puntos.findIndex(x=>x.m===p.m);
                return`${i===0||!puntos[i-1]?.nom?"M":"L"}${xOf(i)},${yOf(p.nom)}`;
              }).join(" ");

              return<Card
                title={`Sueldo nominal vs indexado por inflación — ${selYear}`}
                subtitle={`Verde = sueldo base proyectado por IPC · Azul = sueldo cobrado · Inflación acumulada: +${inflAcum}%`}>

                {/* Cards métricas */}
                <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:110,background:C.red+"0D",border:`1px solid ${C.red}22`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Poder adquisitivo perdido</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.red}}>{fmtH(brechaTotal,currency,tc)}</div>
                    <div style={{fontSize:11,color:C.t3}}>diferencia al {MONTHS[ultimoMes]}</div>
                  </div>
                  <div style={{flex:1,minWidth:110,background:C.purple+"0D",border:`1px solid ${C.purple}22`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>IPC acumulado</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.purple}}>+{inflAcum}%</div>
                    <div style={{fontSize:11,color:C.t3}}>{MONTHS[mesBase]}→{MONTHS[ultimoMes]}</div>
                  </div>
                  <div style={{flex:1,minWidth:110,background:C.green+"0D",border:`1px solid ${C.green}22`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Sueldo indexado</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.green}}>{fmtH(ultReal,currency,tc)}</div>
                    <div style={{fontSize:11,color:C.t3}}>lo que deberías cobrar</div>
                  </div>
                  <div style={{flex:1,minWidth:110,background:C.amber+"0D",border:`2px solid ${C.amber}55`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.amber,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,fontWeight:600}}>📍 {labelSel}</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.amber}}>{fmtH(realMesSel,currency,tc)}</div>
                    <div style={{fontSize:11,color:C.red}}>brecha: {fmtH(brechaMesSel,currency,tc)}</div>
                  </div>
                </div>

                {/* Tabla resumen por mes */}
                <div style={{overflowX:"auto",marginBottom:14}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:400}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${C.bd}`}}>
                        {["Mes","Sueldo nominal","IPC mensual","IPC acumulado","Sueldo indexado","Brecha"].map((h,i)=>(
                          <th key={i} style={{padding:"5px 10px",textAlign:i===0?"left":"right",fontSize:10,fontWeight:500,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {puntos.map((p,i)=>{
                        const nomShow=p.nom>0?p.nom:null;
                        const brecha=p.real-(nomShow||ultNom);
                        const isSelMes=p.m===selMonth;
                        return<tr key={i} style={{borderBottom:`1px solid ${C.bd}`,background:isSelMes?C.amber+"0A":"transparent"}}>
                          <td style={{padding:"6px 10px",color:isSelMes?C.amber:C.t2,fontWeight:isSelMes?600:400}}>{MONTHS[p.m]}{isSelMes?" 📍":""}</td>
                          <td style={{padding:"6px 10px",textAlign:"right",color:C.blue}}>{nomShow?fmtH(nomShow,currency,tc):<span style={{color:C.t3}}>—</span>}</td>
                          <td style={{padding:"6px 10px",textAlign:"right",color:C.amber}}>{p.ipcMes!=null?`${p.ipcMes}%`:"—"}</td>
                          <td style={{padding:"6px 10px",textAlign:"right",color:C.purple}}>{p.factor?`${p.factor.toFixed(6)}`:"—"}</td>
                          <td style={{padding:"6px 10px",textAlign:"right",color:C.green,fontWeight:500}}>{fmtH(p.real,currency,tc)}</td>
                          <td style={{padding:"6px 10px",textAlign:"right",color:C.red,fontWeight:500}}>{nomShow?fmtH(brecha,currency,tc):<span style={{color:C.t3}}>—</span>}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>

                {/* SVG */}
                <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle}>
                  {[0,0.25,0.5,0.75,1].map((f,gi)=>{
                    const v=Math.round(minV+range*f);
                    const y=PT+cH*(1-f);
                    return<g key={gi}>
                      <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                      <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="9" fontFamily="sans-serif">
                        {v>=1000000?`${(v/1000000).toFixed(1)}M`:v>=1000?`${Math.round(v/1000)}K`:v}
                      </text>
                    </g>;
                  })}
                  {/* Área roja = brecha perdida */}
                  {n>1&&(()=>{
                    const nomPts=puntos.filter(p=>p.nom>0);
                    if(nomPts.length<1)return null;
                    const fwd=puntos.map((p,i)=>`L${xOf(i)},${yOf(p.real)}`).join(" ");
                    const bwd=[...nomPts].reverse().map(p=>`L${xOf(puntos.findIndex(x=>x.m===p.m))},${yOf(p.nom)}`).join(" ");
                    return<path d={`M${xOf(0)},${yOf(puntos[0].real)} ${fwd} ${bwd} Z`} fill={C.red} opacity="0.08"/>;
                  })()}
                  {/* Línea verde: indexado (sube con inflación) */}
                  <path d={pathReal} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/>
                  {/* Línea azul: nominal (lo cobrado) */}
                  {pathNomSegs&&<path d={pathNomSegs} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round"/>}
                  {/* Puntos y anotaciones */}
                  {puntos.map((p,i)=>{
                    const isSel=p.m===selMonth;
                    return<g key={i}>
                      {isSel&&<line x1={xOf(i)} y1={PT} x2={xOf(i)} y2={PT+cH} stroke={C.amber} strokeWidth="1" strokeDasharray="3 2" opacity="0.7"/>}
                      <circle cx={xOf(i)} cy={yOf(p.real)} r={isSel?5:3} fill={isSel?C.amber:C.green}/>
                      {p.nom>0&&<circle cx={xOf(i)} cy={yOf(p.nom)} r={isSel?4.5:2.5} fill={isSel?C.amber:C.blue}/>}
                      {p.ipcMes!=null&&<text x={xOf(i)} y={PT-5} textAnchor="middle" fill={C.amber} fontSize="8" fontFamily="sans-serif">+{p.ipcMes}%</text>}
                      <text x={xOf(i)} y={H-4} textAnchor="middle" fill={isSel?C.amber:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={isSel?"bold":"normal"}>{MONTHS[p.m]}</text>
                    </g>;
                  })}
                </svg>

                <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,color:C.t2,flexWrap:"wrap"}}>
                  <span><span style={{display:"inline-block",width:14,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Sueldo indexado por IPC (lo que deberías ganar)</span>
                  <span><span style={{display:"inline-block",width:14,height:2,background:C.blue,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Sueldo nominal cobrado</span>
                  <span style={{color:C.red}}>Área roja = poder adquisitivo perdido</span>
                </div>
              </Card>;
            })()}

          </>;
        })()}

        {/* INFLACIÓN */}
        {tab==="inflación"&&(()=>{
          // ── Helpers ──────────────────────────────────────────────────────────
          // inflData = [{fecha:"2024-01-01", valor:20.6}, ...]
          // Construimos un mapa {YYYY-MM: pct} para lookups rápidos
          const ipcMap={};
          if(inflData) inflData.forEach(x=>{const k=x.fecha.slice(0,7);ipcMap[k]=x.valor;});

          // Factor acumulado desde un mes base hasta un mes destino
          // para "llevar" montos históricos a pesos de hoy
          const factorAcum=(fromYM, toYM)=>{
            if(!inflData) return 1;
            let factor=1;
            const sorted=[...inflData].sort((a,b)=>a.fecha>b.fecha?1:-1);
            for(const d of sorted){
              const ym=d.fecha.slice(0,7);
              if(ym>fromYM && ym<=toYM) factor*=(1+d.valor/100);
            }
            return factor;
          };

          // Mes actual como "YYYY-MM"
          const hoyClave=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;

          // ── Datos por mes para el año seleccionado ───────────────────────────
          const meses=MONTHS.map((_,m)=>{
            const clave=`${selYear}-${String(m+1).padStart(2,"0")}`;
            const gastoNominal=gastos.filter(g=>g.year===selYear&&g.month===m).reduce((s,x)=>s+Number(x.monto),0);
            const ingresoNominal=ingresos.filter(i=>i.year===selYear&&i.month===m).reduce((s,x)=>s+Number(x.monto),0);
            const ipcMes=ipcMap[clave]||null;
            // Factor para traer ese mes a "pesos de hoy" (mes seleccionado)
            const factor=factorAcum(clave, hoyClave);
            return{m, clave, gastoNominal, ingresoNominal, ipcMes, gastoReal:gastoNominal*factor, ingresoReal:ingresoNominal*factor, factor};
          });

          // ── Inflación acumulada del año ──────────────────────────────────────
          const ipcAnual=meses.reduce((acc,mes)=>{
            if(mes.ipcMes!==null) return acc*(1+mes.ipcMes/100);
            return acc;
          },1);
          const inflAcumAnual=Math.round((ipcAnual-1)*100);

          // ── Variación nominal de gastos por categoría vs mes anterior ────────
          const gastosCatActual={}, gastosCatAnterior={};
          const prevM=selMonth===0?11:selMonth-1;
          const prevY=selMonth===0?selYear-1:selYear;
          cats.forEach(c=>{
            gastosCatActual[c.id]=gastos.filter(g=>g.year===selYear&&g.month===selMonth&&g.cat===c.id).reduce((s,x)=>s+Number(x.monto),0);
            gastosCatAnterior[c.id]=gastos.filter(g=>g.year===prevY&&g.month===prevM&&g.cat===c.id).reduce((s,x)=>s+Number(x.monto),0);
          });

          // ── Inflación real sobre tus propios gastos ─────────────────────────
          // Comparamos gasto nominal actual vs gasto real (ajustado) del mes anterior
          const prevClave=`${prevY}-${String(prevM+1).padStart(2,"0")}`;
          const factorMes=ipcMap[hoyClave]?1+ipcMap[hoyClave]/100:null;
          const inflPropia=cats.map(c=>{
            const act=gastosCatActual[c.id]||0;
            const prev=gastosCatAnterior[c.id]||0;
            if(prev===0||act===0) return{...c,act,prev,varNom:null,varReal:null};
            const varNom=((act-prev)/prev)*100;
            // inflación real = variación nominal - IPC del mes
            const ipcM=ipcMap[hoyClave]||null;
            const varReal=ipcM!==null?varNom-ipcM:null;
            return{...c,act,prev,varNom,varReal};
          }).filter(c=>c.act>0||c.prev>0);

          // ── SVG helpers ──────────────────────────────────────────────────────
          const W=560,PL=58,PR=16,PT=28,PB=36;
          const cW=W-PL-PR, cH=130;
          const H=PT+cH+PB;
          const svgStyle={width:"100%",maxHeight:200,display:"block"};

          const mesesConDatos=meses.filter(x=>x.gastoNominal>0||x.ingresoNominal>0);
          const maxReal=Math.max(...meses.map(x=>Math.max(x.gastoReal,x.ingresoReal)),1);
          const maxNom=Math.max(...meses.map(x=>Math.max(x.gastoNominal,x.ingresoNominal)),1);

          const Card=({title,subtitle,badge,children})=>(
            <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:C.t}}>{title}</div>
                  {subtitle&&<div style={{fontSize:11,color:C.t3,marginTop:2}}>{subtitle}</div>}
                </div>
                {badge&&<div style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:badge.bg,color:badge.color,fontWeight:600}}>{badge.label}</div>}
              </div>
              {children}
            </div>
          );

          return <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>📈 Inflación & Poder Adquisitivo</div>
                <div style={{fontSize:12,color:C.t3,marginTop:2}}>Tus gastos e ingresos en pesos constantes · Año {selYear}</div>
              </div>
              <button onClick={()=>{setInflData(null);fetchInflacion();}} style={{background:C.bg3,border:`1px solid ${C.bd2}`,borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.t3,fontSize:11}}>↻ Actualizar IPC</button>
            </div>

            {inflLoading&&<div style={{textAlign:"center",padding:"40px 0",color:C.t3,fontSize:13}}>
              <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:10}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
              Obteniendo datos de IPC desde argentinadatos.com...
            </div>}

            {inflError&&<div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:C.red}}>{inflError}</div>}

            {!inflLoading&&<>
              {/* ── Cards resumen ── */}
              <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                <MCard label={`Inflación acumulada ${selYear}`} value={inflData?`${inflAcumAnual}%`:"—"} color={C.amber} icon="trend" sub="Datos IPC INDEC"/>
                <MCard label="IPC último mes disponible" value={inflData?(()=>{const last=[...inflData].filter(x=>x.fecha.startsWith(selYear)||x.fecha.startsWith(selYear-1)).sort((a,b)=>b.fecha>a.fecha?1:-1);return last[0]?`${last[0].valor}%`:"—";})():"—"} color={C.red} icon="activity" sub={inflData?(()=>{const last=[...inflData].sort((a,b)=>b.fecha>a.fecha?1:-1);return last[0]?last[0].fecha.slice(0,7):"";})():""}/>
                <MCard label="Var. gastos nom. vs mes ant." value={(()=>{const tA=Object.values(gastosCatActual).reduce((s,x)=>s+x,0);const tP=Object.values(gastosCatAnterior).reduce((s,x)=>s+x,0);if(!tP) return"—";const v=((tA-tP)/tP)*100;return(v>=0?"+":"")+v.toFixed(1)+"%";})()}  color={C.blue} icon="dollar" sub={`vs ${MONTHS[prevM]} ${prevY}`}/>
                <MCard label="Inflación real de tus gastos" value={(()=>{const tA=Object.values(gastosCatActual).reduce((s,x)=>s+x,0);const tP=Object.values(gastosCatAnterior).reduce((s,x)=>s+x,0);if(!tP||!ipcMap[hoyClave]) return"—";const varNom=((tA-tP)/tP)*100;const varReal=varNom-ipcMap[hoyClave];return(varReal>=0?"+":"")+varReal.toFixed(1)+"%";})()}  color={C.purple} icon="flag" sub="Var. real = var. nominal − IPC"/>
              </div>

              {/* ── Gráfico 1: gastos nominales vs reales ── */}
              <Card title={`Gastos nominales vs en pesos de ${MONTHS[selMonth]} ${selYear}`} subtitle="Los puntos sólidos son meses con datos. La línea verde muestra el equivalente en pesos de hoy ajustado por IPC acumulado." badge={inflData?{label:"IPC INDEC",bg:C.green+"22",color:C.green}:null}>
                {!inflData?<div style={{fontSize:12,color:C.t3,padding:"20px 0",textAlign:"center"}}>Cargando datos de inflación...</div>:(()=>{
                  // Solo meses CON datos para trazar las líneas — sin huecos
                  const mesConDatos=meses.filter(m2=>m2.gastoNominal>0);
                  if(mesConDatos.length===0) return<div style={{fontSize:12,color:C.t3,padding:"20px 0",textAlign:"center"}}>Sin gastos registrados en {selYear}.</div>;
                  const maxV=Math.max(...mesConDatos.map(m2=>Math.max(m2.gastoNominal,m2.gastoReal)),1);
                  const toY=(v)=>PT+cH*(1-(v/maxV));
                  const pts=mesConDatos.map(m2=>({
                    x:PL+((m2.m)/11)*cW,
                    yNom:toY(m2.gastoNominal),
                    yReal:toY(m2.gastoReal),
                    ...m2
                  }));
                  const pathNom=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.yNom}`).join(" ");
                  const pathReal=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.yReal}`).join(" ");
                  const floorY=PT+cH;
                  const areaNom=`M${pts[0].x},${floorY} ${pts.map(p=>`L${p.x},${p.yNom}`).join(" ")} L${pts[pts.length-1].x},${floorY} Z`;
                  const areaReal=`M${pts[0].x},${floorY} ${pts.map(p=>`L${p.x},${p.yReal}`).join(" ")} L${pts[pts.length-1].x},${floorY} Z`;
                  return<>
                    <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="gnR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.2"/><stop offset="100%" stopColor={C.green} stopOpacity="0"/></linearGradient>
                        <linearGradient id="gnN" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity="0.15"/><stop offset="100%" stopColor={C.red} stopOpacity="0"/></linearGradient>
                      </defs>
                      {[0,0.25,0.5,0.75,1].map((f,i)=>{
                        const v=Math.round(maxV*f);
                        const y=PT+cH*(1-f);
                        return<g key={i}>
                          <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                          <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="9" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v}</text>
                        </g>;
                      })}
                      <path d={areaNom} fill="url(#gnN)"/>
                      <path d={areaReal} fill="url(#gnR)"/>
                      <path d={pathNom} fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round" strokeDasharray="5,3"/>
                      <path d={pathReal} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/>
                      {pts.map((p,i)=><g key={i}>
                        <circle cx={p.x} cy={p.yNom} r="3" fill={C.red}/>
                        <circle cx={p.x} cy={p.yReal} r="3.5" fill={C.green}/>
                        {p.ipcMes&&<text x={p.x} y={PT-6} textAnchor="middle" fill={C.amber} fontSize="8" fontFamily="sans-serif">{p.ipcMes}%</text>}
                        <text x={p.x} y={H-6} textAnchor="middle" fill={p.m===selMonth?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={p.m===selMonth?"700":"400"}>{MONTHS[p.m]}</text>
                      </g>)}
                    </svg>
                    <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4,flexWrap:"wrap"}}>
                      <span><span style={{display:"inline-block",width:16,height:2,background:C.red,borderRadius:2,marginRight:5,verticalAlign:"middle",opacity:0.7}}/>Gasto nominal</span>
                      <span><span style={{display:"inline-block",width:16,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Gasto en pesos de hoy</span>
                      <span style={{color:C.amber}}><span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:C.amber,marginRight:5,verticalAlign:"middle"}}/>IPC del mes (arriba de cada punto)</span>
                    </div>
                  </>;
                })()}
              </Card>

              {/* ── Gráfico 2: ingreso real vs gasto real ── */}
              <Card title="Ingreso real vs Gasto real" subtitle="Ambos ajustados por IPC — muestra si tu poder adquisitivo sube o baja">
                {(()=>{
                  const mesIG=meses.filter(m2=>m2.ingresoNominal>0||m2.gastoNominal>0);
                  if(mesIG.length===0) return<div style={{fontSize:12,color:C.t3,padding:"20px 0",textAlign:"center"}}>Sin datos de ingresos o gastos para este año.</div>;
                  const maxIG=Math.max(...mesIG.map(x=>Math.max(x.ingresoReal,x.gastoReal)),1);
                  const toYIG=(v)=>PT+cH*(1-(v/maxIG));
                  const ptsI=mesIG.filter(m2=>m2.ingresoReal>0).map(m2=>({x:PL+(m2.m/11)*cW, y:toYIG(m2.ingresoReal), m:m2.m}));
                  const ptsG=mesIG.filter(m2=>m2.gastoReal>0).map(m2=>({x:PL+(m2.m/11)*cW, y:toYIG(m2.gastoReal), m:m2.m, exc:m2.gastoReal>m2.ingresoReal&&m2.ingresoReal>0}));
                  const pI=ptsI.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  const pG=ptsG.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  const floorIG=PT+cH;
                  return<>
                    <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="giR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.25"/><stop offset="100%" stopColor={C.green} stopOpacity="0"/></linearGradient>
                        <linearGradient id="ggR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity="0.18"/><stop offset="100%" stopColor={C.red} stopOpacity="0"/></linearGradient>
                      </defs>
                      {[0,0.25,0.5,0.75,1].map((f,i)=>{
                        const v=Math.round(maxIG*f);
                        const y=PT+cH*(1-f);
                        return<g key={i}>
                          <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                          <text x={PL-5} y={y+4} textAnchor="end" fill={C.t3} fontSize="9" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v}</text>
                        </g>;
                      })}
                      {pG.length>0&&<><path d={`M${ptsG[0].x},${floorIG} ${ptsG.map(p=>`L${p.x},${p.y}`).join(" ")} L${ptsG[ptsG.length-1].x},${floorIG} Z`} fill="url(#ggR)"/><path d={pG} fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/></>}
                      {pI.length>0&&<><path d={`M${ptsI[0].x},${floorIG} ${ptsI.map(p=>`L${p.x},${p.y}`).join(" ")} L${ptsI[ptsI.length-1].x},${floorIG} Z`} fill="url(#giR)"/><path d={pI} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/></>}
                      {ptsI.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3.5" fill={C.green}/>)}
                      {ptsG.map((p,i)=><g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill={C.red} opacity={p.exc?1:0.6}/>
                        {p.exc&&<text x={p.x} y={PT-6} textAnchor="middle" fill={C.red} fontSize="10" fontFamily="sans-serif">⚠</text>}
                        <text x={p.x} y={H-6} textAnchor="middle" fill={p.m===selMonth?C.blue:C.t3} fontSize="9" fontFamily="sans-serif" fontWeight={p.m===selMonth?"700":"400"}>{MONTHS[p.m]}</text>
                      </g>)}
                    </svg>
                    <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Ingreso real</span>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.red,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Gasto real</span>
                      <span style={{color:C.red}}>⚠ = gastos superan ingresos en pesos constantes</span>
                    </div>
                  </>;
                })()}
              </Card>

              {/* ── Tabla: inflación real por categoría ── */}
              <Card title={`Inflación real de tus gastos por categoría — ${MONTHS[selMonth]} ${selYear} vs ${MONTHS[prevM]} ${prevY}`} subtitle="Variación nominal de tus gastos menos el IPC del mes = inflación real propia">
                {inflPropia.length===0?<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"20px 0"}}>No hay datos para comparar con el mes anterior.</div>:(
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${C.bd}`}}>
                        {["Categoría","Gasto anterior","Gasto actual","Var. nominal","IPC mes","Inflación real"].map((h,i)=>(
                          <th key={i} style={{padding:"7px 10px",textAlign:i>=1?"right":"left",fontSize:10,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {inflPropia.sort((a,b)=>(b.varNom||0)-(a.varNom||0)).map(c=>{
                        const ipc=ipcMap[hoyClave];
                        const color=c.varReal===null?"#888":c.varReal>5?C.red:c.varReal>0?C.amber:C.green;
                        return<tr key={c.id} style={{borderBottom:`1px solid ${C.bd}`}}>
                          <td style={{padding:"8px 10px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:22,height:22,borderRadius:6,background:c.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={c.icon} size={11} color={c.color}/></div>
                              <span style={{color:C.t,fontSize:12}}>{c.label}</span>
                            </div>
                          </td>
                          <td style={{padding:"8px 10px",textAlign:"right",color:C.t3}}>{c.prev>0?fmtH(c.prev,"ARS",tc):"—"}</td>
                          <td style={{padding:"8px 10px",textAlign:"right",color:C.t,fontWeight:500}}>{c.act>0?fmtH(c.act,"ARS",tc):"—"}</td>
                          <td style={{padding:"8px 10px",textAlign:"right",fontWeight:600,color:c.varNom===null?C.t3:c.varNom>0?C.red:C.green}}>{c.varNom===null?"—":(c.varNom>0?"+":"")+c.varNom.toFixed(1)+"%"}</td>
                          <td style={{padding:"8px 10px",textAlign:"right",color:C.amber}}>{ipc!=null?`${ipc}%`:"—"}</td>
                          <td style={{padding:"8px 10px",textAlign:"right"}}>
                            <span style={{background:color+"22",color,fontWeight:600,fontSize:11,padding:"2px 8px",borderRadius:12}}>
                              {c.varReal===null?"—":(c.varReal>0?"+":"")+c.varReal.toFixed(1)+"%"}
                            </span>
                          </td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                )}
                <div style={{marginTop:12,fontSize:11,color:C.t3,lineHeight:1.7,background:C.bg4,borderRadius:8,padding:"10px 12px"}}>
                  <b style={{color:C.t2}}>¿Cómo leer esto?</b> Si tu gasto en Alimentación subió 30% y la inflación del mes fue 8%, tu inflación real en ese rubro es +22%: gastás más de lo que justifica la inflación. En cambio, si subió 5%, tu gasto real <i>bajó</i> −3%, lo que significa que ajustaste ese rubro.
                </div>
              </Card>

              {/* ── Tabla IPC mensual ── */}
              {inflData&&<Card title={`IPC mensual — ${selYear}`} subtitle="Fuente: INDEC via argentinadatos.com">
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {MONTHS.map((mn,m)=>{
                    const clave=`${selYear}-${String(m+1).padStart(2,"0")}`;
                    const ipc=ipcMap[clave];
                    const color=ipc===undefined?C.t3:ipc>10?C.red:ipc>5?C.amber:C.green;
                    return<div key={m} style={{flex:"1 1 60px",background:C.bg4,borderRadius:8,padding:"10px 8px",textAlign:"center",border:`1px solid ${ipc!==undefined?color+"33":C.bd}`}}>
                      <div style={{fontSize:10,color:C.t3,marginBottom:4}}>{mn}</div>
                      <div style={{fontSize:16,fontWeight:600,color}}>{ipc!==undefined?`${ipc}%`:"—"}</div>
                    </div>;
                  })}
                </div>
              </Card>}

              {/* ── PROYECCIÓN CIERRE DE MES ── */}
              {proyeccionCierre&&totG>0&&<Card title="📈 Proyección cierre de mes" subtitle={`Día ${proyeccionCierre.diaActual} de ${proyeccionCierre.diasEnMes} · ritmo ${fmtH(Math.round(proyeccionCierre.ritmo),"ARS",tc)}/día`}>
                {/* Métricas */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:16}}>
                  <div style={{background:C.bg4,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Gastado hoy</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.red}}>{fmtH(totG,"ARS",tc)}</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:2}}>{proyeccionCierre.pctMes}% del mes</div>
                  </div>
                  <div style={{background:C.blue+"0D",border:`1px solid ${C.blue}22`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Proyección total</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.blue}}>{fmtH(proyeccionCierre.proyTotal,"ARS",tc)}</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:2}}>al cierre del mes</div>
                  </div>
                  <div style={{background:C.amber+"0D",border:`1px solid ${C.amber}22`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Resta gastar</div>
                    <div style={{fontSize:17,fontWeight:700,color:C.amber}}>{fmtH(proyeccionCierre.proyResto,"ARS",tc)}</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:2}}>{proyeccionCierre.diasEnMes-proyeccionCierre.diaActual} días restantes</div>
                  </div>
                </div>
                {/* Barra progreso */}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.t3}}>Progreso del mes</span>
                  <span style={{fontSize:11,fontWeight:600,color:C.blue}}>{proyeccionCierre.pctMes}%</span>
                </div>
                <div style={{height:8,borderRadius:5,background:C.bg4,overflow:"hidden",marginBottom:16}}>
                  <div style={{height:"100%",borderRadius:5,background:`linear-gradient(90deg,${C.blue}88,${C.blue})`,width:`${proyeccionCierre.pctMes}%`,transition:"width .5s"}}/>
                </div>
                {/* Tabla por categoría */}
                <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Proyección por categoría</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:320}}>
                    <thead><tr style={{borderBottom:`1px solid ${C.bd}`}}>
                      {["Categoría","Gastado","Proyección","Presupuesto","Estado"].map((h,i)=>(
                        <th key={i} style={{padding:"5px 8px",textAlign:i===0?"left":"right",fontSize:10,fontWeight:500,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {proyeccionCierre.porCat.sort((a,b)=>b.proy-a.proy).map(c=>(
                        <tr key={c.catId} style={{borderBottom:`1px solid ${C.bd}`,background:c.superaBudget?C.red+"06":"transparent"}}>
                          <td style={{padding:"6px 8px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{width:18,height:18,borderRadius:5,background:c.color+"22",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <Ic id={c.icon} size={9} color={c.color}/>
                              </span>
                              <span style={{color:C.t,fontWeight:500}}>{c.label}</span>
                            </div>
                          </td>
                          <td style={{padding:"6px 8px",textAlign:"right",color:C.t2,whiteSpace:"nowrap"}}>{fmtH(c.gastadoHoy,"ARS",tc)}</td>
                          <td style={{padding:"6px 8px",textAlign:"right",fontWeight:600,color:c.superaBudget?C.red:C.blue,whiteSpace:"nowrap"}}>{fmtH(c.proy,"ARS",tc)}</td>
                          <td style={{padding:"6px 8px",textAlign:"right",color:C.t3,whiteSpace:"nowrap"}}>{c.bud?fmtH(c.bud,"ARS",tc):"—"}</td>
                          <td style={{padding:"6px 8px",textAlign:"right",whiteSpace:"nowrap"}}>
                            {c.bud
                              ?<span style={{background:c.superaBudget?C.red+"22":C.green+"22",color:c.superaBudget?C.red:C.green,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8}}>
                                {c.superaBudget?"⚠ Excede":"✓ OK"}
                              </span>
                              :<span style={{color:C.t3,fontSize:10}}>sin límite</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{marginTop:10,fontSize:11,color:C.t3,background:C.bg4,borderRadius:7,padding:"8px 12px"}}>
                  Proyección basada en el ritmo promedio de {proyeccionCierre.diaActual} días. Puede variar si tus gastos no son uniformes durante el mes.
                </div>
              </Card>}
            </>}
          </>;
        })()}

        {/* DÓLAR */}
        {tab==="dólar"&&(()=>{
          // ── Agrupamos TC histórico por mes ──────────────────────────────────
          // tcHistData = { oficial:[{fecha,compra,venta},...], blue:[...] }
          const agruparPorMes=(arr)=>{
            const map={};
            if(!arr) return map;
            arr.forEach(x=>{
              const ym=x.fecha.slice(0,7); // "YYYY-MM"
              if(!map[ym]) map[ym]={sum:0,count:0,max:0,min:Infinity};
              const v=x.venta||0;
              map[ym].sum+=v; map[ym].count++; map[ym].max=Math.max(map[ym].max,v); map[ym].min=Math.min(map[ym].min,v);
            });
            Object.keys(map).forEach(k=>{map[k].avg=Math.round(map[k].sum/map[k].count);});
            return map;
          };
          const ofMap=agruparPorMes(tcHistData?.oficial);
          const blMap=agruparPorMes(tcHistData?.blue);

          // IPC mensual
          const ipcMap2={};
          if(inflData) inflData.forEach(x=>{ipcMap2[x.fecha.slice(0,7)]=x.valor;});

          // Construir serie de meses con datos (últimos 24 meses max)
          const hoy=new Date();
          const serieYM=[];
          for(let i=23;i>=0;i--){
            const d=new Date(hoy.getFullYear(),hoy.getMonth()-i,1);
            serieYM.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
          }
          const serieFilt=serieYM.filter(ym=>ofMap[ym]||blMap[ym]);

          // Brecha cambiaria por mes
          const brecha=serieFilt.map(ym=>{
            const of=ofMap[ym]?.avg||null;
            const bl=blMap[ym]?.avg||null;
            const gap=of&&bl?Math.round(((bl-of)/of)*100):null;
            return{ym,of,bl,gap,ipc:ipcMap2[ym]||null,label:ym.slice(5,7)+"/"+ym.slice(2,4)};
          });

          // Gasto mensual del usuario en USD equivalente (usando TC oficial)
          const gastoEnUSD=serieFilt.map(ym=>{
            const [y,m]=ym.split("-").map(Number);
            const gNom=gastos.filter(g=>g.year===y&&g.month===m-1).reduce((s,x)=>s+Number(x.monto),0);
            const iNom=ingresos.filter(i=>i.year===y&&i.month===m-1).reduce((s,x)=>s+Number(x.monto),0);
            const tcOf=ofMap[ym]?.avg||null;
            const tcBl=blMap[ym]?.avg||null;
            return{ym,label:ym.slice(5,7)+"/"+ym.slice(2,4),gNom,iNom,gUSDOf:tcOf?Math.round(gNom/tcOf):null,iUSDOf:tcOf?Math.round(iNom/tcOf):null,gUSDBl:tcBl?Math.round(gNom/tcBl):null,iUSDBl:tcBl?Math.round(iNom/tcBl):null};
          }).filter(x=>x.gNom>0||x.iNom>0);

          const W2=560,PL2=52,PR2=12,PT2=24,PB2=32;
          const cW2=W2-PL2-PR2, cH2=120;
          const H2=PT2+cH2+PB2;
          const svgS={width:"100%",maxHeight:190,display:"block"};
          const CardD=({title,subtitle,children})=>(
            <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t}}>{title}</div>
                {subtitle&&<div style={{fontSize:11,color:C.t3,marginTop:2}}>{subtitle}</div>}
              </div>
              {children}
            </div>
          );

          // Último mes disponible
          const last=brecha[brecha.length-1];
          const prev=brecha[brecha.length-2];

          return <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>💵 Dólar & Brecha Cambiaria</div>
                <div style={{fontSize:12,color:C.t3,marginTop:2}}>Evolución histórica · Comparativa con IPC · Tus gastos en USD</div>
              </div>
              <button onClick={()=>{setTcHistData(null);setInflData(null);fetchTCHistorico();fetchInflacion();}} style={{background:C.bg3,border:`1px solid ${C.bd2}`,borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.t3,fontSize:11}}>↻ Actualizar</button>
            </div>

            {(tcHistLoading||inflLoading)&&<div style={{textAlign:"center",padding:"40px 0",color:C.t3,fontSize:13}}>
              <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:10}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.blue,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
              Cargando cotizaciones históricas...
            </div>}

            {(tcHistError||inflError)&&<div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:C.red}}>{tcHistError||inflError}</div>}

            {!tcHistLoading&&tcHistData&&<>
              {/* Cards resumen */}
              <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                <MCard label="Oficial hoy" value={last?.of?`$${last.of.toLocaleString("es-AR")}`:allTC.find(t=>t.id==="oficial")?.venta?`$${allTC.find(t=>t.id==="oficial").venta.toLocaleString("es-AR")}`:tc?`$${tc.toLocaleString("es-AR")}`:"—"} color={C.blue} icon="dollar" sub="Promedio último mes"/>
                <MCard label="Blue hoy" value={last?.bl?`$${last.bl.toLocaleString("es-AR")}`:allTC.find(t=>t.id==="blue")?.venta?`$${allTC.find(t=>t.id==="blue").venta.toLocaleString("es-AR")}`:"-"} color={C.green} icon="trend" sub="Promedio último mes"/>
                <MCard label="Brecha" value={last?.gap!=null?`${last.gap}%`:"—"} color={last?.gap>100?C.red:last?.gap>50?C.amber:C.green} icon="activity" sub={prev?.gap!=null?`Mes ant: ${prev.gap}%`:""}/>
                <MCard label="IPC último mes" value={last?.ipc!=null?`${last.ipc}%`:"—"} color={C.amber} icon="flag" sub={last?.ym||""}/>
              </div>

              {/* Gráfico 1: Oficial vs Blue histórico */}
              {serieFilt.length>1&&<CardD title="Dólar Oficial vs Blue — últimos 24 meses" subtitle="Promedio mensual de cotización venta">
                {(()=>{
                  const maxTC=Math.max(...brecha.map(x=>Math.max(x.of||0,x.bl||0)),1);
                  const n=brecha.length;
                  const xOf=brecha.filter(x=>x.of).map((x,i)=>({x:PL2+(brecha.indexOf(x)/(n-1||1))*cW2,y:PT2+cH2*(1-x.of/maxTC),v:x.of,lb:x.label}));
                  const xBl=brecha.filter(x=>x.bl).map((x,i)=>({x:PL2+(brecha.indexOf(x)/(n-1||1))*cW2,y:PT2+cH2*(1-x.bl/maxTC),v:x.bl,lb:x.label}));
                  const pOf=xOf.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  const pBl=xBl.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  return<>
                    <svg viewBox={`0 0 ${W2} ${H2}`} style={svgS} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="tcOf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity="0.2"/><stop offset="100%" stopColor={C.blue} stopOpacity="0"/></linearGradient>
                        <linearGradient id="tcBl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.2"/><stop offset="100%" stopColor={C.green} stopOpacity="0"/></linearGradient>
                      </defs>
                      {[0,0.25,0.5,0.75,1].map((f,i)=>{
                        const v=Math.round(maxTC*f);
                        const y=PT2+cH2*(1-f);
                        return<g key={i}>
                          <line x1={PL2} y1={y} x2={W2-PR2} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                          <text x={PL2-4} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v>=1000?Math.round(v/1000)+"K":v}</text>
                        </g>;
                      })}
                      {pBl&&<><path d={`M${xBl[0].x},${PT2+cH2} ${xBl.map(p=>`L${p.x},${p.y}`).join(" ")} L${xBl[xBl.length-1].x},${PT2+cH2} Z`} fill="url(#tcBl)"/><path d={pBl} fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round"/></>}
                      {pOf&&<><path d={`M${xOf[0].x},${PT2+cH2} ${xOf.map(p=>`L${p.x},${p.y}`).join(" ")} L${xOf[xOf.length-1].x},${PT2+cH2} Z`} fill="url(#tcOf)"/><path d={pOf} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round"/></>}
                      {brecha.map((b,i)=>{
                        const x=PL2+(i/(n-1||1))*cW2;
                        const showLbl=i===0||i===n-1||(n>8&&i%Math.ceil(n/6)===0);
                        return<g key={i}>
                          {b.of&&<circle cx={x} cy={PT2+cH2*(1-b.of/maxTC)} r="2.5" fill={C.blue}/>}
                          {b.bl&&<circle cx={x} cy={PT2+cH2*(1-b.bl/maxTC)} r="2.5" fill={C.green}/>}
                          {showLbl&&<text x={x} y={H2-4} textAnchor="middle" fill={C.t3} fontSize="8" fontFamily="sans-serif">{b.label}</text>}
                        </g>;
                      })}
                    </svg>
                    <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.blue,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Oficial</span>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Blue</span>
                    </div>
                  </>;
                })()}
              </CardD>}

              {/* Gráfico 2: Brecha + IPC comparados */}
              {serieFilt.length>1&&<CardD title="Brecha cambiaria vs IPC mensual" subtitle="Verde = brecha (%), Ámbar = IPC del mes (%). Permiten ver si el dólar corre más o menos que la inflación">
                {(()=>{
                  const brechaConIPC=brecha.filter(x=>x.gap!=null||x.ipc!=null);
                  if(brechaConIPC.length<2) return<div style={{fontSize:12,color:C.t3,padding:"16px 0",textAlign:"center"}}>Insuficientes datos para comparar.</div>;
                  const maxBI=Math.max(...brechaConIPC.map(x=>Math.max(x.gap||0,x.ipc||0)),1);
                  const nb=brechaConIPC.length;
                  return<>
                    <svg viewBox={`0 0 ${W2} ${H2}`} style={svgS} xmlns="http://www.w3.org/2000/svg">
                      {[0,0.5,1].map((f,i)=>{
                        const v=Math.round(maxBI*f);
                        const y=PT2+cH2*(1-f);
                        return<g key={i}>
                          <line x1={PL2} y1={y} x2={W2-PR2} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                          <text x={PL2-4} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">{v}%</text>
                        </g>;
                      })}
                      {/* Barras IPC */}
                      {brechaConIPC.map((b,i)=>{
                        if(!b.ipc) return null;
                        const x=PL2+(i/(nb-1||1))*cW2;
                        const bW=Math.max(6,cW2/nb-4);
                        const bH=(b.ipc/maxBI)*cH2;
                        return<rect key={i} x={x-bW/2} y={PT2+cH2-bH} width={bW} height={bH} fill={C.amber} opacity="0.5" rx="2"/>;
                      })}
                      {/* Línea brecha */}
                      {(()=>{
                        const pts=brechaConIPC.filter(x=>x.gap!=null).map((x,i)=>({x:PL2+(brechaConIPC.indexOf(x)/(nb-1||1))*cW2, y:PT2+cH2*(1-(x.gap/maxBI))}));
                        if(pts.length<2) return null;
                        const p=pts.map((pt,i)=>`${i===0?"M":"L"}${pt.x},${pt.y}`).join(" ");
                        return<><path d={p} fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round"/>{pts.map((pt,i)=><circle key={i} cx={pt.x} cy={pt.y} r="3" fill={C.green}/>)}</>;
                      })()}
                      {brechaConIPC.map((b,i)=>{
                        const x=PL2+(i/(nb-1||1))*cW2;
                        const showLbl=i===0||i===nb-1||(nb>8&&i%Math.ceil(nb/6)===0);
                        return showLbl?<text key={i} x={x} y={H2-4} textAnchor="middle" fill={C.t3} fontSize="8" fontFamily="sans-serif">{b.label}</text>:null;
                      })}
                    </svg>
                    <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Brecha cambiaria %</span>
                      <span><span style={{display:"inline-block",width:10,height:10,background:C.amber,borderRadius:2,marginRight:5,verticalAlign:"middle",opacity:0.7}}/>IPC mensual %</span>
                    </div>
                  </>;
                })()}
              </CardD>}

              {/* Gráfico 3: Tus gastos en USD */}
              {gastoEnUSD.length>0&&<CardD title="Tus gastos mensuales en USD" subtitle="Convertidos al tipo de cambio oficial promedio de cada mes — muestra tu poder adquisitivo real en dólares">
                {(()=>{
                  const maxUSD=Math.max(...gastoEnUSD.map(x=>Math.max(x.gUSDOf||0,x.iUSDOf||0)),1);
                  const ng=gastoEnUSD.length;
                  const ptsGU=gastoEnUSD.filter(x=>x.gUSDOf).map(x=>({x:PL2+(gastoEnUSD.indexOf(x)/(ng-1||1))*cW2,y:PT2+cH2*(1-x.gUSDOf/maxUSD),v:x.gUSDOf,lb:x.label}));
                  const ptsIU=gastoEnUSD.filter(x=>x.iUSDOf).map(x=>({x:PL2+(gastoEnUSD.indexOf(x)/(ng-1||1))*cW2,y:PT2+cH2*(1-x.iUSDOf/maxUSD),v:x.iUSDOf,lb:x.label}));
                  const pG2=ptsGU.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  const pI2=ptsIU.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
                  return<>
                    <svg viewBox={`0 0 ${W2} ${H2}`} style={svgS} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="guG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity="0.2"/><stop offset="100%" stopColor={C.red} stopOpacity="0"/></linearGradient>
                        <linearGradient id="guI" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.2"/><stop offset="100%" stopColor={C.green} stopOpacity="0"/></linearGradient>
                      </defs>
                      {[0,0.25,0.5,0.75,1].map((f,i)=>{
                        const v=Math.round(maxUSD*f);
                        const y=PT2+cH2*(1-f);
                        return<g key={i}>
                          <line x1={PL2} y1={y} x2={W2-PR2} y2={y} stroke={C.bd} strokeWidth="0.5"/>
                          <text x={PL2-4} y={y+4} textAnchor="end" fill={C.t3} fontSize="8" fontFamily="sans-serif">U$D {v}</text>
                        </g>;
                      })}
                      {pG2&&<><path d={`M${ptsGU[0].x},${PT2+cH2} ${ptsGU.map(p=>`L${p.x},${p.y}`).join(" ")} L${ptsGU[ptsGU.length-1].x},${PT2+cH2} Z`} fill="url(#guG)"/><path d={pG2} fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/></>}
                      {pI2&&<><path d={`M${ptsIU[0].x},${PT2+cH2} ${ptsIU.map(p=>`L${p.x},${p.y}`).join(" ")} L${ptsIU[ptsIU.length-1].x},${PT2+cH2} Z`} fill="url(#guI)"/><path d={pI2} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round"/></>}
                      {ptsGU.map((p,i)=><g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill={C.red}/>
                        <text x={p.x} y={H2-4} textAnchor="middle" fill={C.t3} fontSize="8" fontFamily="sans-serif">{p.lb}</text>
                      </g>)}
                      {ptsIU.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={C.green}/>)}
                    </svg>
                    <div style={{display:"flex",gap:16,fontSize:11,color:C.t2,marginTop:4}}>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.green,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Ingreso en USD</span>
                      <span><span style={{display:"inline-block",width:14,height:2,background:C.red,borderRadius:2,marginRight:5,verticalAlign:"middle"}}/>Gasto en USD</span>
                      <span style={{color:C.t3}}>TC oficial promedio mensual</span>
                    </div>
                  </>;
                })()}
              </CardD>}

              {/* Tabla resumen mensual */}
              {brecha.length>0&&<CardD title="Tabla histórica mensual" subtitle="Oficial · Blue · Brecha · IPC">
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:480}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${C.bd}`}}>
                        {["Mes","Oficial","Blue","Brecha","IPC","Dólar vs IPC"].map((h,i)=>(
                          <th key={i} style={{padding:"7px 10px",textAlign:i>=1?"right":"left",fontSize:10,fontWeight:400,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...brecha].reverse().slice(0,18).map((b,i)=>{
                        // Dólar vs IPC: si el dólar subió más que el IPC ese mes, "ganó" el dólar
                        const varOf=i<brecha.length-1?(()=>{
                          const prev2=[...brecha].reverse()[i+1];
                          if(!prev2?.of||!b.of) return null;
                          return((b.of-prev2.of)/prev2.of)*100;
                        })():null;
                        const dVsIPC=varOf!=null&&b.ipc!=null?varOf-b.ipc:null;
                        const col=dVsIPC===null?C.t3:dVsIPC>5?C.blue:dVsIPC>0?C.blue:C.red;
                        return<tr key={i} style={{borderBottom:`1px solid ${C.bd}`}}>
                          <td style={{padding:"7px 10px",color:C.t2,fontWeight:500}}>{b.label}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:C.blue}}>{b.of?`$${b.of.toLocaleString("es-AR")}`:"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:C.green}}>{b.bl?`$${b.bl.toLocaleString("es-AR")}`:"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:b.gap>100?C.red:b.gap>50?C.amber:C.t2}}>{b.gap!=null?`${b.gap}%`:"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:C.amber}}>{b.ipc!=null?`${b.ipc}%`:"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right"}}>
                            <span style={{background:col+"22",color:col,fontWeight:600,fontSize:11,padding:"2px 8px",borderRadius:12}}>
                              {dVsIPC===null?"—":(dVsIPC>0?"📈":"📉")+" "+(dVsIPC>0?"+":"")+dVsIPC.toFixed(1)+"%"}
                            </span>
                          </td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{marginTop:10,fontSize:11,color:C.t3}}>
                  "Dólar vs IPC" = variación mensual del dólar oficial menos el IPC de ese mes. Positivo = el dólar corrió más que la inflación.
                </div>
              </CardD>}
            </>}
          </>;
        })()}

        {/* AYUDA */}
        {/* MEDIOS DE PAGO */}
        {tab==="medios"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>💳 Medios de pago</div>
              <div style={{fontSize:12,color:C.t3,marginTop:4}}>Los medios fijos no se pueden eliminar. Agregá los tuyos para usarlos al cargar gastos.</div>
            </div>
            <button onClick={()=>{setMedioDraft({label:"",color:"#38BDF8"});setMedioModal(v=>!v);}} style={{background:medioModal?"transparent":"#38BDF8",color:medioModal?C.t2:"#fff",border:medioModal?`1px solid ${C.bd2}`:"none",borderRadius:7,padding:"7px 16px",cursor:"pointer",fontSize:13,fontWeight:500}}>{medioModal?"× Cancelar":"+ Agregar medio"}</button>
          </div>

          {/* Formulario nuevo medio */}
          {medioModal&&<div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:20,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Nuevo medio de pago</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,marginBottom:14}}>
              <div>
                <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Nombre</div>
                <input style={{...inp,fontSize:14}} placeholder="Ej: Naranja X, Brubank, Cuenta DNI, Modo..." value={medioDraft.label} onChange={e=>setMedioDraft(d=>({...d,label:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&!medioSaving&&medioDraft.label.trim()&&saveNewMedio()} autoFocus/>
              </div>
              {medioDraft.label&&<div style={{display:"flex",alignItems:"center",gap:8,background:C.bg3,borderRadius:9,padding:"10px 14px",border:`1px solid ${medioDraft.color}55`,alignSelf:"end",marginBottom:"0px"}}>
                <span style={{width:12,height:12,borderRadius:"50%",background:medioDraft.color,display:"inline-block",flexShrink:0}}/>
                <span style={{fontSize:13,color:C.t,fontWeight:500}}>{medioDraft.label}</span>
              </div>}
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:8}}>Color</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{COLORS.map(c=><div key={c} onClick={()=>setMedioDraft(d=>({...d,color:c}))} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${medioDraft.color===c?"#fff":"transparent"}`,transform:medioDraft.color===c?"scale(1.2)":"scale(1)",transition:"transform .15s,border .1s"}}/>)}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveNewMedio} disabled={medioSaving||!medioDraft.label.trim()} style={{background:"#38BDF8",color:"#fff",border:"none",borderRadius:7,padding:"8px 20px",cursor:medioSaving||!medioDraft.label.trim()?"not-allowed":"pointer",fontSize:13,fontWeight:500,opacity:medioSaving||!medioDraft.label.trim()?0.5:1}}>{medioSaving?"Guardando...":"Crear medio"}</button>
              <button onClick={()=>setMedioModal(false)} style={{background:C.bg4,color:C.t2,border:`1px solid ${C.bd2}`,borderRadius:7,padding:"8px 20px",cursor:"pointer",fontSize:13}}>Cancelar</button>
            </div>
          </div>}

          {/* Medios fijos */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Fijos</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {MEDIOS_PAGO_BASE.map(m=>(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,background:C.bg2,border:`1px solid ${m.color}33`,borderRadius:10,padding:"10px 16px"}}>
                  <span style={{width:12,height:12,borderRadius:"50%",background:m.color,display:"inline-block",flexShrink:0,boxShadow:`0 0 6px ${m.color}66`}}/>
                  <span style={{fontSize:13,color:C.t,fontWeight:500}}>{m.label}</span>
                  <span style={{fontSize:10,color:C.t3,background:C.bg4,borderRadius:4,padding:"1px 6px"}}>fijo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medios custom */}
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Mis medios</div>
            {mediosExtra.length===0
              ?<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"20px",textAlign:"center",color:C.t3,fontSize:12}}>Todavía no agregaste medios propios. Usá el botón "+ Agregar medio" para crear uno.</div>
              :<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {mediosExtra.map(m=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,background:C.bg2,border:`1px solid ${m.color}44`,borderRadius:10,padding:"10px 16px"}}>
                    <span style={{width:12,height:12,borderRadius:"50%",background:m.color,display:"inline-block",flexShrink:0,boxShadow:`0 0 6px ${m.color}66`}}/>
                    <span style={{fontSize:13,color:C.t,fontWeight:500}}>{m.label}</span>
                    <span style={{fontSize:10,color:C.t3,background:C.bg4,borderRadius:4,padding:"1px 6px"}}>custom</span>
                    <button onClick={()=>delMedio(m.id)} title="Eliminar" style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16,lineHeight:1,padding:"0 2px",marginLeft:2}}>×</button>
                  </div>
                ))}
              </div>
            }
          </div>
        </>}


        {tab==="tipos"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>📋 Tipos de ingreso</div>
              <div style={{fontSize:12,color:C.t3,marginTop:4}}>Los tipos base no se pueden eliminar. Agregá los tuyos para categorizarlos a tu medida.</div>
            </div>
            <Btn primary onClick={()=>{setTipoDraft({label:"",grupo:"ingreso",icon:"dollar"});setTipoModal(true);}}>+ Agregar tipo</Btn>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Tipos base</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {TIPOS_INGRESO_DEFAULT.map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,background:C.bg2,border:`1px solid ${t.grupo==="ahorro"?C.purple+"44":C.green+"44"}`,borderRadius:10,padding:"8px 14px"}}>
                  <div style={{width:22,height:22,borderRadius:6,background:(t.grupo==="ahorro"?C.purple:C.green)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic id={t.icon||"dollar"} size={12} color={t.grupo==="ahorro"?C.purple:C.green}/>
                  </div>
                  <span style={{fontSize:13,color:C.t,fontWeight:500}}>{t.label}</span>
                  <span style={{fontSize:10,color:t.grupo==="ahorro"?C.purple:C.green,background:(t.grupo==="ahorro"?C.purple:C.green)+"18",padding:"1px 7px",borderRadius:8}}>{t.grupo==="ahorro"?"Ahorro":"Ingreso"}</span>
                  <span style={{fontSize:10,color:C.t3,background:C.bg4,borderRadius:4,padding:"1px 6px"}}>base</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.t3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Mis tipos</div>
            {tiposExtra.length===0
              ?<div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"20px",textAlign:"center",color:C.t3,fontSize:12}}>
                Sin tipos personalizados todavía. Usá "+ Agregar tipo" para crear uno.
              </div>
              :<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {tiposExtra.map(t=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,background:C.bg2,border:`1px solid ${t.grupo==="ahorro"?C.purple+"44":C.blue+"44"}`,borderRadius:10,padding:"8px 14px"}}>
                    <div style={{width:22,height:22,borderRadius:6,background:(t.grupo==="ahorro"?C.purple:C.blue)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Ic id={t.icon||"dollar"} size={12} color={t.grupo==="ahorro"?C.purple:C.blue}/>
                    </div>
                    <span style={{fontSize:13,color:C.t,fontWeight:500}}>{t.label}</span>
                    <span style={{fontSize:10,color:t.grupo==="ahorro"?C.purple:C.blue,background:(t.grupo==="ahorro"?C.purple:C.blue)+"18",padding:"1px 7px",borderRadius:8}}>{t.grupo==="ahorro"?"Ahorro":"Ingreso"}</span>
                    <span style={{fontSize:10,color:C.t3,background:C.bg4,borderRadius:4,padding:"1px 6px"}}>custom</span>
                    <button onClick={()=>delTipo(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:16,lineHeight:1,padding:"0 2px",marginLeft:2}}>×</button>
                  </div>
                ))}
              </div>}
          </div>
        </>}

        {tab==="ayuda"&&<>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>❓ Centro de Ayuda</div>
            <div style={{fontSize:12,color:C.t3}}>Aprendé a usar la app paso a paso o hacé una pregunta directamente.</div>
          </div>
          {/* Steps nav */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {AYUDA_STEPS.map((s,i)=><button key={i} onClick={()=>setAyudaStep(i)} style={{background:ayudaStep===i?C.purple+"22":C.bg3,border:`1px solid ${ayudaStep===i?C.purple+"55":C.bd}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,color:ayudaStep===i?C.purple:C.t2,display:"flex",alignItems:"center",gap:6}}>
              <Ic id={s.icon} size={12} color={ayudaStep===i?C.purple:C.t3}/>
              {s.title}
            </button>)}
          </div>
          {/* Step card */}
          <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.purple}33`,borderRadius:14,padding:"22px 24px",marginBottom:20,boxShadow:`0 4px 24px ${C.purple}0A`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.purple+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic id={AYUDA_STEPS[ayudaStep].icon} size={20} color={C.purple}/>
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:15,color:C.t}}>{AYUDA_STEPS[ayudaStep].title}</div>
                <div style={{fontSize:11,color:C.t3}}>Paso {ayudaStep+1} de {AYUDA_STEPS.length}</div>
              </div>
            </div>
            <div style={{fontSize:13,color:C.t2,lineHeight:1.8,marginBottom:16}}>{AYUDA_STEPS[ayudaStep].desc}</div>
            <div style={{display:"flex",gap:8}}>
              {ayudaStep>0&&<Btn small onClick={()=>setAyudaStep(i=>i-1)}>← Anterior</Btn>}
              {ayudaStep<AYUDA_STEPS.length-1&&<Btn small primary onClick={()=>setAyudaStep(i=>i+1)}>Siguiente →</Btn>}
              {ayudaStep===AYUDA_STEPS.length-1&&<span style={{fontSize:12,color:C.green,alignSelf:"center"}}>✓ ¡Completaste el recorrido!</span>}
            </div>
          </div>
          {/* Barra de progreso */}
          <div style={{height:4,borderRadius:4,background:C.bg4,marginBottom:24,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${C.purple}88,${C.purple})`,width:`${((ayudaStep+1)/AYUDA_STEPS.length)*100}%`,transition:"width .4s ease"}}/>
          </div>
          {/* Chat de preguntas */}
          <div style={{background:`linear-gradient(135deg,${C.bg2},${C.bg3})`,border:`1px solid ${C.bd}`,borderRadius:14,padding:"20px 22px"}}>
            <div style={{fontSize:12,fontWeight:600,color:C.t,marginBottom:4}}>💬 ¿Tenés alguna duda?</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:14}}>Preguntale al asistente de la app — responde en segundos.</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {["¿Cómo cargo un gasto?","¿Qué es el TC Blue?","¿Cómo funciona el presupuesto?","¿Qué son los gastos hormiga?"].map(q=>
                <button key={q} onClick={()=>{setAyudaQ(q);askAyuda(q);}} style={{background:C.bg4,border:`1px solid ${C.bd2}`,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,color:C.t2}}>{q}</button>
              )}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input style={inp} placeholder="Escribí tu pregunta..." value={ayudaQ} onChange={e=>setAyudaQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAyuda(ayudaQ)}/>
              <Btn primary onClick={()=>askAyuda(ayudaQ)} disabled={ayudaLoading}>{ayudaLoading?"...":"Preguntar"}</Btn>
            </div>
            {ayudaLoading&&<div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.t3,padding:"8px 0"}}>
              <div style={{display:"flex",gap:4}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.purple,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
              Pensando...
            </div>}
            {ayudaResp&&!ayudaLoading&&<div style={{background:C.bg4,border:`1px solid ${C.purple}33`,borderRadius:10,padding:"14px 16px",fontSize:13,color:C.t,lineHeight:1.7,whiteSpace:"pre-wrap"}}>
              <span style={{fontSize:10,color:C.purple,fontWeight:600,display:"block",marginBottom:6}}>ASISTENTE</span>
              {ayudaResp}
            </div>}
          </div>
        </>}
      </div>

      {/* MODALS */}

      {/* MODAL AI CARGA INTELIGENTE */}
      {aiCargaModal&&<Modal title="⚡ Cargar gasto con IA" onClose={()=>{setAiCargaModal(false);setAiCargaResult(null);}} wide>
        <div style={{fontSize:12,color:C.t2,marginBottom:16}}>Describí el gasto, subí una foto de ticket o cargá varios de una vez. Gemini lo interpreta automáticamente.</div>

        {/* Tabs */}
        <div style={{display:"flex",background:C.bg3,borderRadius:8,marginBottom:16,overflow:"hidden"}}>
          {[{id:"texto",label:"✍️ Texto libre"},{id:"imagen",label:"📷 Foto / Ticket"},{id:"excel",label:"📊 Excel / CSV"},{id:"bulk",label:"📋 Varios gastos"}].map(t=>(
            <button key={t.id} onClick={()=>{setAiCargaTab(t.id);setAiCargaResult(null);}} style={{flex:1,padding:"8px 0",fontSize:12,border:"none",cursor:"pointer",background:aiCargaTab===t.id?C.bg4:"transparent",color:aiCargaTab===t.id?C.t:C.t2,fontWeight:aiCargaTab===t.id?500:400,borderBottom:aiCargaTab===t.id?`2px solid ${C.blue}`:"2px solid transparent"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB TEXTO */}
        {aiCargaTab==="texto"&&<div>
          <div style={{fontSize:11,color:C.t3,marginBottom:8}}>Describí el gasto como quieras — con o sin monto, medio de pago, fecha:</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {["Pagué 18500 en el supermercado con débito","Uber 4200 ayer a la noche","Luz 35000 con Visa este mes","Alquiler 280000 efectivo","Netflix 6500 Mastercard","Médico 15000 prepaga hoy"].map(ej=>(
              <button key={ej} onClick={()=>setAiCargaText(ej)} style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,color:C.t3}}>{ej}</button>
            ))}
          </div>
          <textarea
            style={{...inp,minHeight:72,resize:"vertical",marginBottom:12}}
            placeholder='Ej: "Pagué 18500 en el supermercado con débito" o "Uber 4200 ayer" o "Luz 35000 Visa"'
            value={aiCargaText}
            onChange={e=>setAiCargaText(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&e.ctrlKey&&parseGastoTexto()}
          />
          <Btn primary onClick={parseGastoTexto} disabled={aiCargaLoading||!aiCargaText.trim()}>{aiCargaLoading?"Interpretando...":"⚡ Interpretar"}</Btn>
        </div>}

        {/* TAB IMAGEN */}
        {aiCargaTab==="imagen"&&<div>
          <div style={{fontSize:11,color:C.t3,marginBottom:10}}>Subí una foto del ticket, factura o resumen. Gemini extrae el gasto automáticamente.</div>
          {!aiCargaImageB64?(
            <div
              onClick={()=>document.getElementById("ai-file-input").click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const r=new FileReader();r.onload=ev=>{setAiCargaImageB64(ev.target.result.split(",")[1]);setAiCargaImageName(f.name);};r.readAsDataURL(f);}}}
              style={{border:`2px dashed ${C.bd2}`,borderRadius:10,padding:"32px 20px",textAlign:"center",cursor:"pointer",color:C.t3,marginBottom:12}}
            >
              <div style={{fontSize:32,marginBottom:8}}>📷</div>
              <div style={{fontSize:13,fontWeight:500,color:C.t2,marginBottom:4}}>Arrastrá o hacé clic para subir</div>
              <div style={{fontSize:11}}>JPG, PNG · máx 5 MB</div>
            </div>
          ):(
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:C.t3,marginBottom:6}}>📎 {aiCargaImageName}</div>
              <div style={{display:"flex",gap:8}}>
                <Btn primary onClick={parseGastoImagen} disabled={aiCargaLoading}>{aiCargaLoading?"Analizando...":"⚡ Analizar imagen"}</Btn>
                <Btn onClick={()=>{setAiCargaImageB64(null);setAiCargaImageName("");setAiCargaResult(null);}}>Limpiar</Btn>
              </div>
            </div>
          )}
          <input id="ai-file-input" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>{setAiCargaImageB64(ev.target.result.split(",")[1]);setAiCargaImageName(f.name);};r.readAsDataURL(f);}}}/>
        </div>}

        {/* TAB EXCEL */}
        {aiCargaTab==="excel"&&<div>
          <div style={{fontSize:11,color:C.t3,marginBottom:10}}>Subí un archivo Excel (.xlsx, .xls) o CSV con tus gastos. Gemini los clasifica y respeta las fechas originales.</div>
          <div style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:11,color:C.t3}}>
            <div style={{color:C.t2,fontWeight:500,marginBottom:4}}>Formato esperado de columnas (flexible):</div>
            <div>Fecha · Descripción / Concepto · Monto / Importe · Medio de pago (opcional)</div>
            <div style={{marginTop:4,color:C.t3}}>El archivo puede tener otros nombres de columnas — Gemini los interpreta igual. Máx. 100 filas por carga.</div>
          </div>
          <div
            onClick={()=>document.getElementById("ai-excel-input").click()}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)parseExcel(f);}}
            style={{border:`2px dashed ${aiCargaExcelName?C.green+"88":C.bd2}`,borderRadius:10,padding:"28px 20px",textAlign:"center",cursor:"pointer",color:C.t3,marginBottom:12,background:aiCargaExcelName?C.green+"08":"transparent",transition:"all .2s"}}
          >
            {aiCargaExcelName?(
              <>
                <div style={{fontSize:24,marginBottom:6}}>📊</div>
                <div style={{fontSize:13,fontWeight:500,color:C.green,marginBottom:2}}>{aiCargaExcelName}</div>
                <div style={{fontSize:11,color:C.t3}}>Hacé clic para cambiar el archivo</div>
              </>
            ):(
              <>
                <div style={{fontSize:32,marginBottom:8}}>📊</div>
                <div style={{fontSize:13,fontWeight:500,color:C.t2,marginBottom:4}}>Arrastrá o hacé clic para subir</div>
                <div style={{fontSize:11}}>.xlsx · .xls · .csv · máx 100 filas</div>
              </>
            )}
          </div>
          <input id="ai-excel-input" type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)parseExcel(f);e.target.value="";}}/>
          {/* Preview de primeras filas */}
          {aiCargaExcelPreview.length>0&&!aiCargaResult&&!aiCargaLoading&&(
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:C.t3,marginBottom:6}}>Vista previa — primeras {aiCargaExcelPreview.length} filas detectadas:</div>
              <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${C.bd}`}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:C.bg4}}>
                      {Object.keys(aiCargaExcelPreview[0]).slice(0,6).map(k=>(
                        <th key={k} style={{padding:"6px 10px",textAlign:"left",color:C.t3,fontWeight:500,whiteSpace:"nowrap",borderBottom:`1px solid ${C.bd}`}}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aiCargaExcelPreview.map((row,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.bd}`}}>
                        {Object.values(row).slice(0,6).map((v,j)=>(
                          <td key={j} style={{padding:"6px 10px",color:C.t2,whiteSpace:"nowrap",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis"}}>{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>}

        {/* TAB BULK */}
        {aiCargaTab==="bulk"&&<div>
          <div style={{fontSize:11,color:C.t3,marginBottom:8}}>Listá varios gastos, uno por línea. Se guardan todos de una vez con la fecha de hoy.</div>
          <textarea
            style={{...inp,minHeight:120,resize:"vertical",marginBottom:12,fontFamily:"monospace",fontSize:12}}
            placeholder={"Supermercado 25000 débito\nNetflix 6500 Mastercard\nNafta 20000 efectivo\nMédico 15000 prepaga\nDelivery sushi 12000 Mercado Pago"}
            value={aiCargaBulk}
            onChange={e=>setAiCargaBulk(e.target.value)}
          />
          <Btn primary onClick={parseGastoBulk} disabled={aiCargaLoading||!aiCargaBulk.trim()}>{aiCargaLoading?"Interpretando...":"⚡ Interpretar todos"}</Btn>
        </div>}

        {/* LOADING */}
        {aiCargaLoading&&<div style={{display:"flex",alignItems:"center",gap:10,color:C.t2,fontSize:13,padding:"16px 0"}}>
          <div style={{display:"flex",gap:5}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.blue,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
          <span>{aiCargaTab==="excel"?"Procesando planilla con Gemini...":"Gemini está interpretando..."}</span>
        </div>}

        {/* RESULTADO — error */}
        {aiCargaResult?.error&&!aiCargaLoading&&(
          <div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:8,padding:"12px 14px",marginTop:16,fontSize:12,color:C.red}}>
            {aiCargaResult.error}
          </div>
        )}

        {/* RESULTADO — un gasto */}
        {aiCargaResult&&!aiCargaResult.error&&!Array.isArray(aiCargaResult)&&!aiCargaLoading&&(()=>{
          const d=aiCargaResult;
          const conf=Math.round((d.confianza||0.8)*100);
          const cat=cats.find(c=>c.id===d.cat);
          return<div style={{background:C.bg3,border:`1px solid ${C.bd2}`,borderRadius:12,padding:"18px 20px",marginTop:16}}>
            <div style={{fontSize:12,fontWeight:600,color:C.blue,marginBottom:14}}>✓ Gasto interpretado</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 20px",marginBottom:14}}>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>MONTO</div><div style={{fontSize:20,fontWeight:700,color:C.red}}>-${Number(d.monto).toLocaleString("es-AR")}</div></div>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>DESCRIPCIÓN</div><div style={{fontSize:13,color:C.t}}>{d.descripcion||"—"}</div></div>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>CATEGORÍA</div><div style={{display:"flex",alignItems:"center",gap:6}}>{cat&&<div style={{width:18,height:18,borderRadius:4,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id={cat.icon} size={10} color={cat.color}/></div>}<span style={{fontSize:12,background:(cat?.color||C.blue)+"22",color:cat?.color||C.blue,padding:"2px 8px",borderRadius:20,fontWeight:500}}>{d.cat_label||d.cat}</span></div></div>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>SUBCATEGORÍA</div><span style={{fontSize:12,background:C.green+"22",color:C.green,padding:"2px 8px",borderRadius:20,fontWeight:500}}>{d.sub_label||d.sub}</span></div>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>MEDIO DE PAGO</div><span style={{fontSize:12,background:C.amber+"22",color:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:500}}>{d.medio_label||d.medio_pago}</span></div>
              <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>CONFIANZA</div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:5,borderRadius:3,background:C.bg4}}><div style={{height:"100%",borderRadius:3,background:conf>=80?C.green:conf>=60?C.amber:C.red,width:`${conf}%`,transition:"width .4s"}}/></div><span style={{fontSize:11,color:C.t3}}>{conf}%</span></div></div>
            </div>
            {d.nota&&<div style={{background:C.amber+"11",border:`1px solid ${C.amber}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.amber,marginBottom:14}}>{d.nota}</div>}
            {d.comercio&&<div style={{fontSize:12,color:C.t3,marginBottom:14}}>🏪 Comercio: <span style={{color:C.t}}>{d.comercio}</span></div>}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn primary onClick={()=>guardarGastoCargaIA(d)}>✓ Guardar directo</Btn>
              <Btn onClick={()=>confirmarGastoCargaIA(d)}>✏️ Editar antes</Btn>
              <Btn onClick={()=>setAiCargaResult(null)}>↩ Reintentar</Btn>
            </div>
          </div>;
        })()}

        {/* RESULTADO — bulk (array) */}
        {aiCargaResult&&!aiCargaResult.error&&Array.isArray(aiCargaResult)&&!aiCargaLoading&&(()=>{
          const items=aiCargaResult;
          const totalMonto=items.reduce((s,x)=>s+Number(x.monto||0),0);
          return<div style={{marginTop:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:600,color:C.blue}}>✓ {items.length} gastos interpretados</div>
              <div style={{fontSize:12,color:C.red,fontWeight:600}}>-${totalMonto.toLocaleString("es-AR")} total</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16,maxHeight:300,overflowY:"auto"}}>
              {items.map((d,i)=>{
                const cat=cats.find(c=>c.id===d.cat);
                const conf=Math.round((d.confianza||0.8)*100);
                return<div key={i} style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:32,height:32,borderRadius:8,background:(cat?.color||C.blue)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={cat?.icon||"pkg"} size={15} color={cat?.color||C.blue}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:500,color:C.t,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.descripcion}</div>
                    <div style={{fontSize:11,color:C.t3}}>{d.cat_label} › {d.sub_label} · {d.medio_label||d.medio_pago}{d.fecha&&d.fecha!=="null"?` · 📅 ${d.fecha}`:""}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.red}}>-${Number(d.monto).toLocaleString("es-AR")}</div>
                    <div style={{fontSize:10,color:conf>=80?C.green:C.amber}}>{conf}%</div>
                  </div>
                  <button onClick={()=>confirmarGastoCargaIA(d)} title="Editar este" style={{background:C.blue+"22",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.blue,fontSize:11,flexShrink:0}}>Editar</button>
                </div>;
              })}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn primary onClick={()=>confirmarTodosGastosIA(items)} disabled={aiCargaLoading}>{aiCargaLoading?"Guardando...":"✓ Guardar todos"}</Btn>
              <Btn onClick={()=>setAiCargaResult(null)}>↩ Reintentar</Btn>
            </div>
          </div>;
        })()}
      </Modal>}

      {catModal==="new-cat"&&<Modal title="Nueva categoría" onClose={()=>setCatModal(null)}><div style={{display:"flex",flexDirection:"column",gap:16}}><div><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Nombre</div><input style={inp} placeholder="Ej: Transporte" value={catDraft.label} onChange={e=>setCatDraft(d=>({...d,label:e.target.value}))}/></div><ColorPicker value={catDraft.color} onChange={c=>setCatDraft(d=>({...d,color:c}))}/><IconPicker value={catDraft.icon} onChange={ic=>setCatDraft(d=>({...d,icon:ic}))}/><div style={{display:"flex",gap:8}}><Btn primary onClick={saveNewCat}>Crear</Btn><Btn onClick={()=>setCatModal(null)}>Cancelar</Btn></div></div></Modal>}
      {catModal==="edit-cat"&&<Modal title="Editar categoría" onClose={()=>setCatModal(null)}><div style={{display:"flex",flexDirection:"column",gap:16}}><div><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Nombre</div><input style={inp} value={catDraft.label} onChange={e=>setCatDraft(d=>({...d,label:e.target.value}))}/></div><ColorPicker value={catDraft.color} onChange={c=>setCatDraft(d=>({...d,color:c}))}/><IconPicker value={catDraft.icon} onChange={ic=>setCatDraft(d=>({...d,icon:ic}))}/><div style={{display:"flex",gap:8}}><Btn primary onClick={saveEditCat}>Guardar</Btn><Btn onClick={()=>setCatModal(null)}>Cancelar</Btn></div></div></Modal>}
      {catModal==="new-sub"&&<Modal title={`Nueva subcategoría en "${cats.find(c=>c.id===editCatId)?.label}"`} onClose={()=>setCatModal(null)}><div style={{display:"flex",flexDirection:"column",gap:16}}><div><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Nombre</div><input style={inp} placeholder="Ej: Uber" value={subDraft.label} onChange={e=>setSubDraft(d=>({...d,label:e.target.value}))}/></div><IconPicker value={subDraft.icon} onChange={ic=>setSubDraft(d=>({...d,icon:ic}))}/><div style={{display:"flex",gap:8}}><Btn primary onClick={saveNewSub}>Crear</Btn><Btn onClick={()=>setCatModal(null)}>Cancelar</Btn></div></div></Modal>}
      {catModal==="edit-sub"&&<Modal title="Editar subcategoría" onClose={()=>setCatModal(null)}><div style={{display:"flex",flexDirection:"column",gap:16}}><div><div style={{fontSize:11,color:C.t2,marginBottom:6}}>Nombre</div><input style={inp} value={subDraft.label} onChange={e=>setSubDraft(d=>({...d,label:e.target.value}))}/></div><IconPicker value={subDraft.icon} onChange={ic=>setSubDraft(d=>({...d,icon:ic}))}/><div style={{display:"flex",gap:8}}><Btn primary onClick={saveEditSub}>Guardar</Btn><Btn onClick={()=>setCatModal(null)}>Cancelar</Btn></div></div></Modal>}

      {budgetModal&&<Modal title={`Presupuesto — ${MONTHS[selMonth]} ${selYear}`} onClose={()=>setBudgetModal(false)} wide>
        <div style={{fontSize:12,color:C.t2,marginBottom:8}}>Podés poner límite a nivel <b style={{color:C.t}}>categoría</b> y/o a nivel <b style={{color:C.t}}>subcategoría</b>. Dejá vacío para sin límite.</div>
        <div style={{background:C.blue+"0D",border:`1px solid ${C.blue}22`,borderRadius:8,padding:"8px 12px",marginBottom:16,fontSize:11,color:C.t3}}>
          💡 Los valores sugeridos en gris son el promedio de tus últimos 3 meses.
        </div>
        {cats.map(cat=>{
          // Auto-sum: sumar subcategorías con valor en el draft
          const subSum=cat.items.reduce((s,sub)=>{
            const v=budgetDraft[`${cat.id}|${sub.id}`];
            return s+(v?+v:0);
          },0);
          const catVal=budgetDraft[cat.id];
          const showAutoSum=subSum>0&&!catVal;
          const sugerCat=presupuestoSugerido[cat.id];
          return<div key={cat.id} style={{marginBottom:16,background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:10,overflow:"hidden"}}>
          {/* Cat row */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:`1px solid ${C.bd}`,background:cat.color+"0A"}}>
            <div style={{width:28,height:28,borderRadius:7,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={cat.icon} size={14} color={cat.color}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:cat.color}}>{cat.label}</div>
              {sugerCat&&!catVal&&<div style={{fontSize:10,color:C.t3,marginTop:1}}>Promedio 3m: <b style={{color:C.t2}}>{fmtH(sugerCat,currency,tc)}</b> <button onClick={()=>setBudgetDraft(d=>({...d,[cat.id]:sugerCat}))} style={{background:cat.color+"15",border:`1px solid ${cat.color}33`,borderRadius:4,padding:"0px 5px",cursor:"pointer",color:cat.color,fontSize:10}}>usar</button></div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {showAutoSum&&<button
                onClick={()=>setBudgetDraft(d=>({...d,[cat.id]:subSum}))}
                style={{fontSize:11,color:cat.color,background:cat.color+"15",border:`1px solid ${cat.color}44`,borderRadius:6,padding:"3px 8px",cursor:"pointer",whiteSpace:"nowrap"}}
              >= {fmtH(subSum,currency,tc)} ↑ suma</button>}
              <span style={{fontSize:11,color:C.t3,whiteSpace:"nowrap"}}>Total cat:</span>
              <input type="number" placeholder={sugerCat&&!catVal?String(sugerCat):showAutoSum?String(subSum):"Sin límite"} style={{...inp,width:130,padding:"5px 8px",fontSize:12,borderColor:showAutoSum?cat.color+"66":undefined,color:(sugerCat&&!catVal)?C.t3:undefined}} value={budgetDraft[cat.id]||""} onChange={e=>setBudgetDraft(d=>({...d,[cat.id]:e.target.value?+e.target.value:undefined}))}/>
            </div>
          </div>
          {/* Sub rows */}
          {cat.items.map(sub=>{
            const subKey=`${cat.id}|${sub.id}`;
            const sugerSub=presupuestoSugerido[subKey];
            return<div key={sub.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px 8px 28px",borderBottom:`1px solid ${C.bd}`}}>
              <div style={{width:22,height:22,borderRadius:5,background:cat.color+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={sub.icon} size={11} color={cat.color}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.t2}}>{sub.label}</div>
                {sugerSub&&!budgetDraft[subKey]&&<div style={{fontSize:10,color:C.t3}}>Prom 3m: <b style={{color:C.t2}}>{fmtH(sugerSub,currency,tc)}</b> <button onClick={()=>{
                  const val=sugerSub;
                  setBudgetDraft(d=>{
                    const next={...d,[subKey]:val};
                    const newSum=cat.items.reduce((s,s2)=>{const v=next[`${cat.id}|${s2.id}`];return s+(v?+v:0);},0);
                    if(newSum>0) next[cat.id]=newSum;
                    return next;
                  });
                }} style={{background:cat.color+"15",border:`1px solid ${cat.color}33`,borderRadius:4,padding:"0px 5px",cursor:"pointer",color:cat.color,fontSize:10}}>usar</button></div>}
              </div>
              <input type="number" placeholder={sugerSub&&!budgetDraft[subKey]?String(sugerSub):"Sin límite"} style={{...inp,width:130,padding:"5px 8px",fontSize:12,color:sugerSub&&!budgetDraft[subKey]?C.t3:undefined}} value={budgetDraft[subKey]||""} onChange={e=>{
                const val=e.target.value?+e.target.value:undefined;
                setBudgetDraft(d=>{
                  const next={...d,[subKey]:val};
                  const newSum=cat.items.reduce((s,s2)=>{
                    const v=next[`${cat.id}|${s2.id}`];
                    return s+(v?+v:0);
                  },0);
                  if(newSum>0&&!next[cat.id]) next[cat.id]=newSum;
                  else if(newSum>0&&next[cat.id]) next[cat.id]=newSum;
                  return next;
                });
              }}/>
            </div>;
          })}
        </div>;})}
        <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={saveBudgets}>Guardar</Btn><Btn onClick={()=>setBudgetModal(false)}>Cancelar</Btn></div>
      </Modal>}

      {aiModal&&<Modal title="✦ Análisis Financiero IA" onClose={()=>{setAiModal(false);setAiChart(null);setAiResponse("");}} wide>
        <div style={{fontSize:12,color:C.t2,marginBottom:14}}>Gemini analiza tus datos reales y puede generar gráficos automáticamente.</div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {["Análisis general","¿Dónde puedo ahorrar?","Gastos excesivos","Gráfico de categorías","Evolución mensual","Tips para Argentina"].map(q=><button key={q} onClick={()=>setAiQ(q)} style={{background:aiQ===q?C.blue+"33":C.bg3,border:`1px solid ${aiQ===q?C.blue+"66":C.bd2}`,borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:12,color:aiQ===q?C.blue:C.t2,transition:"all .15s"}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input style={inp} placeholder="O escribí tu pregunta..." value={aiQ} onChange={e=>setAiQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!aiLoading&&askAI(aiQ)}/>
          <Btn primary onClick={()=>askAI(aiQ)} disabled={aiLoading}>{aiLoading?"Analizando...":"✦ Analizar"}</Btn>
        </div>
        {aiLoading&&<div style={{display:"flex",alignItems:"center",gap:10,color:C.t2,fontSize:13,padding:"20px 0"}}>
          <div style={{display:"flex",gap:5}}>{[0,0.15,0.3].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.blue,animation:`pulse 1s ${d}s infinite`}}/>)}</div>
          <span>Gemini está analizando tus finanzas...</span>
        </div>}
        {aiChart&&!aiLoading&&(()=>{const svg=buildChartSVG(aiChart);return svg?<div style={{marginBottom:16,borderRadius:10,overflow:"hidden",border:`1px solid ${C.bd}`}} dangerouslySetInnerHTML={{__html:svg}}/>:null;})()}
        {aiResponse&&!aiLoading&&<div style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:10,padding:16,fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:C.t}}>{aiResponse}</div>}
        {!aiResponse&&!aiLoading&&<div style={{background:C.bg3,borderRadius:10,padding:20,fontSize:12,color:C.t3,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8}}>✦</div>
          <div>Seleccioná una consulta rápida o escribí tu pregunta.</div>
          <div style={{marginTop:6,color:C.t3,fontSize:11}}>Powered by Gemini 2.0 Flash via OpenRouter · Datos del período actual</div>
        </div>}
      </Modal>}

      {/* MODAL CARGA RÁPIDA */}
      {quickModal&&<QuickAddModal
        quickType={quickType} setQuickType={setQuickType}
        cats={cats} MEDIOS_PAGO={mediosTodos} tiposTodos={tiposTodos} todayISO={todayISO}
        tc={tc} C={C} inp={inp} sel={sel}
        quickSaving={quickSaving} quickError={quickError} quickOk={quickOk}
        saveQuick={saveQuick} setQuickError={setQuickError}
        onClose={()=>setQuickModal(false)}
      />}

      {/* MODAL EDITAR GASTO */}
      {editGastoModal&&editGastoDraft&&(()=>{
        const catForEdit=cats.find(c=>c.id===editGastoDraft.cat)||cats[0];
        return<Modal title="Editar gasto" onClose={()=>{setEditGastoModal(false);setEditGastoDraft(null);}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Monto ($)</div><input style={{...inp,fontSize:18,fontWeight:600,color:C.t}} type="text" inputMode="decimal" placeholder="0" value={editGastoDraft.monto} onChange={e=>setEditGastoDraft(d=>({...d,monto:e.target.value}))}/></div>
              <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Categoría</div><select style={sel} value={editGastoDraft.cat} onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setEditGastoDraft(d=>({...d,cat:e.target.value,sub:c?.items[0]?.id||""}));}}>{cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
              <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Subcategoría</div><select style={sel} value={editGastoDraft.sub} onChange={e=>setEditGastoDraft(d=>({...d,sub:e.target.value}))}>{catForEdit?.items.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
              <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Medio de pago</div><select style={sel} value={editGastoDraft.medio_pago||"efectivo"} onChange={e=>setEditGastoDraft(d=>({...d,medio_pago:e.target.value}))}>{mediosTodos.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></div>
              <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div><input style={inp} type="date" value={editGastoDraft.fechaISO||""} onChange={e=>setEditGastoDraft(d=>({...d,fechaISO:e.target.value}))}/></div>
              <div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Descripción</div><input style={inp} placeholder="Opcional..." value={editGastoDraft.descripcion||""} onChange={e=>setEditGastoDraft(d=>({...d,descripcion:e.target.value}))}/></div>
            </div>
            {editGastoError&&<div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{editGastoError}</div>}
            <div style={{display:"flex",gap:8}}>
              <Btn primary onClick={saveEditGasto} disabled={editGastoLoading}>{editGastoLoading?"Guardando...":"Guardar cambios"}</Btn>
              <Btn onClick={()=>{setEditGastoModal(false);setEditGastoDraft(null);}}>Cancelar</Btn>
            </div>
          </div>
        </Modal>;
      })()}

      {/* MODAL GASTOS RECURRENTES */}
      {recurrentesModal&&<Modal title="↻ Gastos recurrentes" onClose={()=>setRecurrentesModal(false)} wide>
        <div style={{fontSize:12,color:C.t2,marginBottom:14}}>Definí gastos fijos mensuales (alquiler, expensas, cuotas). Podés aplicarlos al mes actual con un click.</div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <Btn primary onClick={()=>aplicarRecurrentesMes()}>↻ Aplicar todos a {MONTHS[selMonth]} {selYear}</Btn>
        </div>
        {/* Form nuevo recurrente */}
        <div style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:10,padding:14,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:500,color:C.t,marginBottom:10}}>+ Nuevo recurrente</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Categoría</div>
              <select style={sel} value={recDraft.cat} onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setRecDraft(d=>({...d,cat:e.target.value,sub:c?.items[0]?.id||""}));}}>
                <option value="">Seleccioná...</option>
                {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Subcategoría</div>
              <select style={sel} value={recDraft.sub} onChange={e=>setRecDraft(d=>({...d,sub:e.target.value}))}>
                {cats.find(c=>c.id===recDraft.cat)?.items.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Monto mensual ($)</div>
              <input style={inp} type="text" inputMode="decimal" placeholder="0" value={recDraft.monto} onChange={e=>setRecDraft(d=>({...d,monto:e.target.value}))}/>
            </div>
            <div><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Medio de pago</div>
              <select style={sel} value={recDraft.medio_pago} onChange={e=>setRecDraft(d=>({...d,medio_pago:e.target.value}))}>
                {mediosTodos.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,color:C.t2,marginBottom:4}}>Descripción</div>
              <input style={inp} placeholder="Ej: Alquiler depto, Expensas..." value={recDraft.desc} onChange={e=>setRecDraft(d=>({...d,desc:e.target.value}))}/>
            </div>
          </div>
          <Btn primary onClick={saveRecurrente} disabled={recSaving}>{recSaving?"Guardando...":"Agregar recurrente"}</Btn>
        </div>
        {/* Lista de recurrentes */}
        {recurrentes.length===0&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"16px 0"}}>No hay gastos recurrentes definidos todavía.</div>}
        {recurrentes.map(r=>{
          const cat=cats.find(c=>c.id===r.cat);
          const sub=cat?.items.find(s=>s.id===r.sub);
          return<div key={r.id} style={{display:"flex",alignItems:"center",gap:10,background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:9,padding:"10px 14px",marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:7,background:(cat?.color||C.blue)+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={cat?.icon||"dollar"} size={13} color={cat?.color||C.blue}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:500}}>{r.descripcion||sub?.label||r.sub}</div>
              <div style={{fontSize:11,color:C.t3}}>{cat?.label} › {sub?.label} · {mediosTodos.find(m=>m.id===r.medio_pago)?.label||r.medio_pago}</div>
            </div>
            <span style={{fontWeight:600,color:C.red,fontSize:13}}>{fmtH(r.monto,currency,tc)}/mes</span>
            <button onClick={()=>delRecurrente(r.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:18,padding:"0 4px"}}>×</button>
          </div>;
        })}
        {recurrentes.length>0&&<div style={{fontSize:11,color:C.t3,marginTop:8,textAlign:"center"}}>Total recurrentes: <b style={{color:C.t}}>{fmtH(recurrentes.reduce((s,r)=>s+Number(r.monto),0),currency,tc)}/mes</b></div>}
      </Modal>}

      {/* ─── MODAL MOVIMIENTO INVERSIÓN ─── */}
      {invModal&&<Modal title="💸 Registrar movimiento" onClose={()=>setInvModal(false)}>
        {(()=>{
          const esRetiro=invDraft.tipo==="retiro";
          const accentColor=esRetiro?C.red:C.green;
          // Calcular saldo actual de la plataforma seleccionada
          const saldosPlat=[...invSaldos].filter(s=>s.plataforma===invDraft.plataforma&&s.moneda===invDraft.moneda)
            .sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes!==b.mes?a.mes-b.mes:(a.created_at||"")>(b.created_at||"")?1:-1);
          const saldoActual=saldosPlat[saldosPlat.length-1]?.saldo||0;
          const montoNum=parseFloat(invDraft.monto)||0;
          const nuevoSaldoPreview=Math.max(0,saldoActual+(esRetiro?-montoNum:montoNum));
          const platInfo=platTodasPlat.find(p=>p.id===invDraft.plataforma);
          return(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Toggle Depósito / Retiro */}
            <div style={{display:"flex",background:C.bg3,borderRadius:10,padding:3,gap:3}}>
              {[{id:"deposito",label:"📥 Depósito",color:C.green},{id:"retiro",label:"📤 Retiro",color:C.red}].map(t=>(
                <button key={t.id} onClick={()=>setInvDraft(d=>({...d,tipo:t.id}))}
                  style={{flex:1,padding:"9px 0",fontSize:13,fontWeight:500,border:"none",cursor:"pointer",borderRadius:8,
                    background:invDraft.tipo===t.id?t.color+"22":"transparent",
                    color:invDraft.tipo===t.id?t.color:C.t2,
                    borderBottom:invDraft.tipo===t.id?`2px solid ${t.color}`:"2px solid transparent",
                    transition:"all .18s"}}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Plataforma */}
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Plataforma</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {platTodasPlat.map(p=>{
                  const activo=invDraft.plataforma===p.id;
                  const saldoP=[...invSaldos].filter(s=>s.plataforma===p.id).sort((a,b)=>a.anio!==b.anio?a.anio-b.anio:a.mes!==b.mes?a.mes-b.mes:(a.created_at||"")>(b.created_at||"")?1:-1);
                  const s=saldoP[saldoP.length-1];
                  return<button key={p.id} onClick={()=>setInvDraft(d=>({...d,plataforma:p.id,moneda:s?.moneda||d.moneda}))}
                    style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,
                      background:activo?p.color+"22":C.bg3,
                      border:`1px solid ${activo?p.color:C.bd}`,borderRadius:9,
                      padding:"8px 12px",cursor:"pointer",minWidth:100,flex:"1 1 90px",textAlign:"left",transition:"all .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:18,height:18,borderRadius:5,background:p.color+"33",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Ic id={p.icon||"trend"} size={11} color={p.color}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:activo?600:400,color:activo?p.color:C.t}}>{p.label}</span>
                    </div>
                    {s&&<span style={{fontSize:10,color:C.t3,paddingLeft:24}}>
                      {s.moneda==="USD"?`USD ${Number(s.saldo).toLocaleString("es-AR")}`:`$${Number(s.saldo).toLocaleString("es-AR")}`}
                    </span>}
                    {!s&&<span style={{fontSize:10,color:C.t3,paddingLeft:24}}>sin saldo</span>}
                  </button>;
                })}
                <button onClick={()=>setInvNewPlatModal(true)}
                  style={{background:"none",border:`1px dashed ${C.bd2}`,borderRadius:9,padding:"8px 12px",cursor:"pointer",color:C.t3,fontSize:11,minWidth:80,flex:"1 1 80px"}}>
                  + Nueva
                </button>
              </div>
            </div>

            {/* Monto + Moneda */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,alignItems:"end"}}>
              <div>
                <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Monto</div>
                <input autoFocus style={{...inp,fontSize:22,fontWeight:700,color:accentColor,border:`1px solid ${accentColor}44`}}
                  type="text" inputMode="decimal" placeholder="0"
                  value={invDraft.monto} onChange={e=>setInvDraft(d=>({...d,monto:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&addInversion()}/>
              </div>
              <div>
                <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Moneda</div>
                <select style={{...sel,minWidth:90}} value={invDraft.moneda} onChange={e=>setInvDraft(d=>({...d,moneda:e.target.value}))}>
                  <option value="ARS">ARS $</option>
                  <option value="USD">USD u$s</option>
                </select>
              </div>
            </div>

            {/* Preview saldo */}
            {montoNum>0&&(()=>{
              const platColor=platInfo?.color||C.blue;
              return<div style={{background:C.bg3,border:`1px solid ${platColor}33`,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:10,color:C.t3,marginBottom:2}}>{platInfo?.label||invDraft.plataforma} — saldo actual</div>
                  <div style={{fontSize:13,fontWeight:600,color:C.t}}>{invDraft.moneda==="USD"?`USD ${saldoActual.toLocaleString("es-AR")}`:`$${saldoActual.toLocaleString("es-AR")}`}</div>
                </div>
                <div style={{color:C.t3,fontSize:18}}>→</div>
                <div>
                  <div style={{fontSize:10,color:C.t3,marginBottom:2}}>Nuevo saldo</div>
                  <div style={{fontSize:16,fontWeight:700,color:accentColor}}>{invDraft.moneda==="USD"?`USD ${nuevoSaldoPreview.toLocaleString("es-AR")}`:`$${nuevoSaldoPreview.toLocaleString("es-AR")}`}</div>
                </div>
                {invDraft.moneda==="USD"&&<div style={{fontSize:10,color:C.amber,background:C.amber+"15",padding:"4px 8px",borderRadius:6,width:"100%"}}>≈ {fmtH(nuevoSaldoPreview*tc,"ARS",tc)} al TC ${tc.toLocaleString("es-AR")}</div>}
              </div>;
            })()}

            {/* Fecha + descripción */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div>
                <input style={inp} type="date" value={invDraft.fecha} onChange={e=>setInvDraft(d=>({...d,fecha:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Descripción (opcional)</div>
                <input style={inp} placeholder="Ej: CEDEAR, plazo fijo..." value={invDraft.descripcion} onChange={e=>setInvDraft(d=>({...d,descripcion:e.target.value}))}/>
              </div>
            </div>

            {invError&&<div style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{invError}</div>}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn primary onClick={addInversion} disabled={invSaving||!montoNum}>{invSaving?"Guardando...":`${esRetiro?"Registrar retiro":"Registrar depósito"}`}</Btn>
              <Btn onClick={()=>setInvModal(false)}>Cancelar</Btn>
            </div>
          </div>);
        })()}
      </Modal>}

      {/* ─── MODAL ACTUALIZAR SALDO ─── */}
      {saldoModal&&<Modal title="💼 Actualizar saldo de plataforma" onClose={()=>setSaldoModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontSize:11,color:C.t2}}>Cargá el saldo total actual de la plataforma. La app calculará automáticamente la ganancia o pérdida vs el registro anterior.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Plataforma</div>
              <select style={sel} value={saldoDraft.plataforma} onChange={e=>setSaldoDraft(d=>({...d,plataforma:e.target.value}))}>
                {platTodasPlat.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Saldo actual</div>
              <input style={{...inp,fontSize:20,fontWeight:700}} type="text" inputMode="decimal" placeholder="0"
                value={saldoDraft.saldo} onChange={e=>setSaldoDraft(d=>({...d,saldo:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Moneda</div>
              <select style={sel} value={saldoDraft.moneda} onChange={e=>setSaldoDraft(d=>({...d,moneda:e.target.value}))}>
                <option value="ARS">Pesos (ARS)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha</div>
              <input style={inp} type="date" value={saldoDraft.fecha} onChange={e=>setSaldoDraft(d=>({...d,fecha:e.target.value}))}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Nota (opcional)</div>
              <input style={inp} placeholder="Ej: incluye rendimiento FCI, plazo fijo vencido..." value={saldoDraft.nota} onChange={e=>setSaldoDraft(d=>({...d,nota:e.target.value}))}/>
            </div>
          </div>
          {(()=>{const gan=calcGananciaSaldo(saldoDraft.plataforma);if(!gan||!saldoDraft.saldo)return null;const nuevo=saldoDraft.moneda==="USD"?parseFloat(saldoDraft.saldo)*tc:parseFloat(saldoDraft.saldo)||0;const diff=nuevo-gan.saldoActualARS;const pct=gan.saldoActualARS>0?((diff/gan.saldoActualARS)*100).toFixed(1):0;return<div style={{background:diff>=0?C.green+"12":C.red+"12",border:`1px solid ${diff>=0?C.green:C.red}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:diff>=0?C.green:C.red}}>
            Vs saldo anterior ({fmtH(gan.saldoActualARS,currency,tc)}): <b>{diff>=0?"+":""}{fmtH(diff,currency,tc)} ({diff>=0?"+":""}{pct}%)</b>
          </div>;})()}
          {saldoDraft.moneda==="USD"&&saldoDraft.saldo&&parseFloat(saldoDraft.saldo)>0&&<div style={{background:C.amber+"15",borderRadius:8,padding:"8px 12px",fontSize:11,color:C.amber}}>≈ {fmtH(parseFloat(saldoDraft.saldo)*tc,"ARS",tc)} al TC ${tc.toLocaleString("es-AR")}</div>}
          {saldoError&&<div style={{background:C.red+"18",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{saldoError}</div>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn primary onClick={addSaldo} disabled={saldoSaving}>{saldoSaving?"Guardando...":"Guardar saldo"}</Btn>
            <Btn onClick={()=>setSaldoModal(false)}>Cancelar</Btn>
          </div>
        </div>
      </Modal>}

      {/* ─── MODAL NUEVO ACTIVO ─── */}
      {activoModal&&<Modal title="📊 Nuevo activo individual" onClose={()=>setActivoModal(false)} wide>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Nombre del activo</div>
              <input style={inp} placeholder="Ej: CEDEAR AAPL, Bitcoin, MELI, YPF" value={activoDraft.nombre} onChange={e=>setActivoDraft(d=>({...d,nombre:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Ticker (opcional)</div>
              <input style={inp} placeholder="AAPL, BTC, MELI..." value={activoDraft.ticker} onChange={e=>setActivoDraft(d=>({...d,ticker:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Plataforma</div>
              <select style={sel} value={activoDraft.plataforma} onChange={e=>setActivoDraft(d=>({...d,plataforma:e.target.value}))}>
                {platTodasPlat.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Cantidad de unidades</div>
              <input style={inp} type="text" inputMode="decimal" placeholder="10" value={activoDraft.cantidad} onChange={e=>setActivoDraft(d=>({...d,cantidad:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Precio de compra (por unidad)</div>
              <input style={inp} type="text" inputMode="decimal" placeholder="15000" value={activoDraft.precio_compra} onChange={e=>setActivoDraft(d=>({...d,precio_compra:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Moneda compra</div>
              <select style={sel} value={activoDraft.moneda_compra} onChange={e=>setActivoDraft(d=>({...d,moneda_compra:e.target.value}))}>
                <option value="ARS">Pesos (ARS)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Precio actual (por unidad)</div>
              <input style={inp} type="text" inputMode="decimal" placeholder="Opcional, si ya lo sabés" value={activoDraft.precio_actual} onChange={e=>setActivoDraft(d=>({...d,precio_actual:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Moneda precio actual</div>
              <select style={sel} value={activoDraft.moneda_actual} onChange={e=>setActivoDraft(d=>({...d,moneda_actual:e.target.value}))}>
                <option value="ARS">Pesos (ARS)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Fecha de compra</div>
              <input style={inp} type="date" value={activoDraft.fecha_compra} onChange={e=>setActivoDraft(d=>({...d,fecha_compra:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Comisión broker % <span style={{color:C.t3,fontWeight:400}}>(opcional)</span></div>
              <input style={inp} type="text" inputMode="decimal" placeholder="Ej: 0.6" value={activoDraft.comision} onChange={e=>setActivoDraft(d=>({...d,comision:e.target.value}))}/>
            </div>
          </div>
          {activoDraft.cantidad&&activoDraft.precio_compra&&parseFloat(activoDraft.cantidad)>0&&parseFloat(activoDraft.precio_compra)>0&&(()=>{
            const costo=parseFloat(activoDraft.cantidad)*parseFloat(activoDraft.precio_compra);
            const comPct=parseFloat(activoDraft.comision||0);
            const comFactor=1+(comPct/100);
            const costoConCom=costo*comFactor;
            const costoARS=activoDraft.moneda_compra==="USD"?costoConCom*tc:costoConCom;
            const comMonto=costoConCom-costo;
            return<div style={{background:C.blue+"12",borderRadius:8,padding:"10px 12px",fontSize:11}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:comPct>0?6:0}}>
                <span style={{color:C.blue}}>Costo base: <b>{activoDraft.moneda_compra==="USD"?`USD ${costo.toLocaleString("es-AR")}`:`$${costo.toLocaleString("es-AR")}`}</b></span>
                {activoDraft.moneda_compra==="USD"&&<span style={{color:C.t3}}>≈ {fmtH(activoDraft.moneda_compra==="USD"?costo*tc:costo,currency,tc)}</span>}
              </div>
              {comPct>0&&<>
                <div style={{color:C.amber,marginBottom:4}}>+ Comisión {comPct}%: <b>{activoDraft.moneda_compra==="USD"?`USD ${comMonto.toFixed(2)}`:`$${Math.round(comMonto).toLocaleString("es-AR")}`}</b></div>
                <div style={{borderTop:`1px solid ${C.blue}33`,paddingTop:6,color:C.t,fontWeight:600}}>
                  Costo real total: <span style={{color:C.blue}}>{activoDraft.moneda_compra==="USD"?`USD ${costoConCom.toFixed(2)}`:`$${Math.round(costoConCom).toLocaleString("es-AR")}`}</span>
                  {activoDraft.moneda_compra==="USD"&&<span style={{color:C.t3,fontWeight:400}}> ≈ {fmtH(costoARS,currency,tc)}</span>}
                </div>
              </>}
            </div>;
          })()}
          {activoError&&<div style={{background:C.red+"18",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{activoError}</div>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn primary onClick={addActivo} disabled={activoSaving}>{activoSaving?"Guardando...":"Guardar activo"}</Btn>
            <Btn onClick={()=>setActivoModal(false)}>Cancelar</Btn>
          </div>
        </div>
      </Modal>}

      {/* ─── MODAL EDITAR PRECIO ACTUAL ─── */}
      {editPrecioModal&&<Modal title="↻ Actualizar precio actual" onClose={()=>{setEditPrecioModal(false);setEditActivoId(null);setEditPrecioActual("");}}>
        {(()=>{const activo=invActivos.find(a=>a.id===editActivoId);if(!activo)return null;
          const rend=rendimientoActivo({...activo,precio_actual:parseFloat(editPrecioActual)||activo.precio_actual});
          const nuevoActual=activo.moneda_actual==="USD"?(parseFloat(editPrecioActual)||0)*activo.cantidad*(activo.tc_actual||tc):(parseFloat(editPrecioActual)||0)*activo.cantidad;
          const diff=nuevoActual-rend.costo;const pct=rend.costo>0?((diff/rend.costo)*100).toFixed(1):0;
          return<div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:C.bg3,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.t2}}>
              <b style={{color:C.t}}>{activo.nombre}</b> {activo.ticker?`(${activo.ticker}) `:""} · {activo.cantidad} unidades · Costo: {fmtH(rend.costo,currency,tc)}
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Precio actual por unidad ({activo.moneda_actual})</div>
              <input style={{...inp,fontSize:20,fontWeight:700}} type="text" inputMode="decimal" autoFocus
                placeholder={String(activo.precio_compra)} value={editPrecioActual} onChange={e=>setEditPrecioActual(e.target.value)}/>
            </div>
            {editPrecioActual&&parseFloat(editPrecioActual)>0&&<div style={{background:diff>=0?C.green+"12":C.red+"12",border:`1px solid ${diff>=0?C.green:C.red}33`,borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,color:C.t2}}>Valor actual cartera</div>
                <div style={{fontSize:16,fontWeight:700,color:C.t}}>{fmtH(nuevoActual,currency,tc)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,color:C.t2}}>Rendimiento</div>
                <div style={{fontSize:16,fontWeight:700,color:diff>=0?C.green:C.red}}>{diff>=0?"+":""}{fmtH(diff,currency,tc)}</div>
                <div style={{fontSize:12,color:diff>=0?C.green:C.red}}>{diff>=0?"+":""}{pct}%</div>
              </div>
            </div>}
            <div style={{fontSize:11,color:C.t3}}>TC actual: ${tc.toLocaleString("es-AR")} (se guarda con el precio)</div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn primary onClick={updatePrecioActual} disabled={!editPrecioActual||!parseFloat(editPrecioActual)}>Guardar precio</Btn>
              <Btn onClick={()=>{setEditPrecioModal(false);setEditActivoId(null);setEditPrecioActual("");}}>Cancelar</Btn>
            </div>
          </div>;
        })()}
      </Modal>}

      {/* ─── MODAL NUEVA PLATAFORMA ─── */}
      {invNewPlatModal&&<Modal title="+ Nueva plataforma de inversión" onClose={()=>setInvNewPlatModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Nombre</div>
            <input style={inp} placeholder="Ej: Lemon, Brubank, PPI, Tiger..."
              value={invNewPlatDraft.label} onChange={e=>setInvNewPlatDraft(d=>({...d,label:e.target.value}))} autoFocus/>
          </div>
          <ColorPicker value={invNewPlatDraft.color} onChange={c=>setInvNewPlatDraft(d=>({...d,color:c}))}/>
          <div style={{display:"flex",gap:8}}>
            <Btn primary onClick={()=>{
              if(!invNewPlatDraft.label.trim())return;
              const newP={id:"inv-custom-"+Date.now(),label:invNewPlatDraft.label.trim(),color:invNewPlatDraft.color,icon:"trend"};
              setInvCustomPlat(ps=>[...ps,newP]);
              setInvDraft(d=>({...d,plataforma:newP.id}));
              setInvNewPlatDraft({label:"",color:"#94A3B8"});
              setInvNewPlatModal(false);
            }}>Agregar</Btn>
            <Btn onClick={()=>setInvNewPlatModal(false)}>Cancelar</Btn>
          </div>
        </div>
      </Modal>}

      {/* ─── MODAL NUEVO TIPO DE INGRESO ─── */}
      {tipoModal&&<Modal title="📋 Nuevo tipo de ingreso" onClose={()=>setTipoModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>Nombre</div>
            <input style={inp} placeholder="Ej: Comisión, Alquiler cobrado, Dividendos..." autoFocus
              value={tipoDraft.label} onChange={e=>setTipoDraft(d=>({...d,label:e.target.value}))}/>
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:8}}>Tipo</div>
            <div style={{display:"flex",background:C.bg3,borderRadius:8,padding:3,gap:3}}>
              {[{id:"ingreso",label:"💰 Ingreso"},{id:"ahorro",label:"🏦 Ahorro"}].map(g=>(
                <button key={g.id} onClick={()=>setTipoDraft(d=>({...d,grupo:g.id}))}
                  style={{flex:1,padding:"7px 0",fontSize:12,border:"none",cursor:"pointer",borderRadius:6,
                    background:tipoDraft.grupo===g.id?C.bg4:"transparent",
                    color:tipoDraft.grupo===g.id?C.t:C.t2,fontWeight:tipoDraft.grupo===g.id?500:400}}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Ícono</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:6}}>
              {["dollar","briefcase","gift","trend","archive","activity","book","card","flag","heart","smile","pkg","plane","tool","scissors","users"].map(k=>(
                <div key={k} onClick={()=>setTipoDraft(d=>({...d,icon:k}))}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:8,cursor:"pointer",
                    border:`1px solid ${tipoDraft.icon===k?C.blue:"transparent"}`,
                    background:tipoDraft.icon===k?C.blue+"22":"transparent"}}>
                  <Ic id={k} size={16} color={tipoDraft.icon===k?C.blue:C.t2}/>
                </div>
              ))}
            </div>
          </div>
          {tipoDraft.label&&<div style={{background:C.bg3,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:7,background:(tipoDraft.grupo==="ahorro"?C.purple:C.green)+"22",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic id={tipoDraft.icon||"dollar"} size={14} color={tipoDraft.grupo==="ahorro"?C.purple:C.green}/>
            </div>
            <span style={{fontSize:13,color:C.t,fontWeight:500}}>{tipoDraft.label}</span>
            <span style={{fontSize:10,color:tipoDraft.grupo==="ahorro"?C.purple:C.green,background:(tipoDraft.grupo==="ahorro"?C.purple:C.green)+"18",padding:"1px 7px",borderRadius:8}}>{tipoDraft.grupo==="ahorro"?"Ahorro":"Ingreso"}</span>
          </div>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn primary onClick={saveNewTipo} disabled={tipoSaving||!tipoDraft.label.trim()}>{tipoSaving?"Guardando...":"Crear tipo"}</Btn>
            <Btn onClick={()=>setTipoModal(false)}>Cancelar</Btn>
          </div>
        </div>
      </Modal>}

      {/* ─── MODAL IMPORTAR CSV BANCARIO ─── */}
      {csvModal&&<Modal title="⬆ Importar extracto bancario (CSV)" onClose={()=>{setCsvModal(false);setCsvMapped([]);setCsvError("");}} wide>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:C.bg3,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.t2}}>
            Soporta formatos de <b>BNA, BBVA, Galicia</b> y CSV genérico. Descargá el extracto desde el banco, subilo acá y se mapea automáticamente a tus categorías.
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Seleccioná el archivo CSV</div>
            <input type="file" accept=".csv,.txt" onChange={e=>e.target.files[0]&&parsearCSVBanco(e.target.files[0])}
              style={{fontSize:12,color:C.t2,width:"100%"}}/>
          </div>
          {csvLoading&&<div style={{textAlign:"center",padding:"20px 0",color:C.t3,fontSize:13}}>Procesando archivo...</div>}
          {csvError&&<div style={{background:C.red+"18",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{csvError}</div>}
          {csvMapped.length>0&&<>
            <div style={{fontSize:12,fontWeight:500,color:C.t}}>{csvMapped.length} movimientos detectados — marcá los que querés importar:</div>
            <div style={{maxHeight:340,overflowY:"auto",border:`1px solid ${C.bd}`,borderRadius:8}}>
              {/* Header */}
              <div style={{display:"grid",gridTemplateColumns:"32px 1fr 90px 120px 100px",gap:8,padding:"7px 12px",borderBottom:`1px solid ${C.bd}`,fontSize:10,color:C.t3,textTransform:"uppercase",letterSpacing:"0.05em",position:"sticky",top:0,background:C.bg3}}>
                <span>✓</span><span>Descripción</span><span>Monto</span><span>Categoría</span><span>Fecha</span>
              </div>
              {csvMapped.map((r,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"32px 1fr 90px 120px 100px",gap:8,padding:"7px 12px",borderBottom:`1px solid ${C.bd}`,alignItems:"center",background:r.seleccionado?C.green+"06":"transparent"}}>
                  <input type="checkbox" checked={r.seleccionado} onChange={e=>setCsvMapped(m=>m.map((x,j)=>j===i?{...x,seleccionado:e.target.checked}:x))} style={{accentColor:C.green,width:14,height:14}}/>
                  <span style={{fontSize:12,color:C.t2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc||"—"}</span>
                  <span style={{fontSize:12,fontWeight:600,color:C.green}}>${r.monto.toLocaleString("es-AR")}</span>
                  <select style={{...sel,padding:"3px 6px",fontSize:11}} value={r.cat} onChange={e=>{const c=cats.find(x=>x.id===e.target.value);setCsvMapped(m=>m.map((x,j)=>j===i?{...x,cat:e.target.value,sub:c?.items[0]?.id||""}:x));}}>
                    {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <span style={{fontSize:11,color:C.t3}}>{r.fecha||"—"}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <span style={{fontSize:12,color:C.t3}}>{csvMapped.filter(r=>r.seleccionado).length} de {csvMapped.length} seleccionados</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setCsvMapped(m=>m.map(x=>({...x,seleccionado:true})))} style={{background:C.bg3,border:`1px solid ${C.bd}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",color:C.t2,fontSize:11}}>Seleccionar todos</button>
                <Btn primary onClick={guardarCSVImportados} disabled={csvSaving||!csvMapped.some(r=>r.seleccionado)}>{csvSaving?"Guardando...":"Importar seleccionados"}</Btn>
              </div>
            </div>
          </>}
        </div>
      </Modal>}

      {/* ─── MODAL HISTORIAL DE CAMBIOS ─── */}
      {changeLogModal&&<Modal title="📋 Historial de cambios" onClose={()=>setChangeLogModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {changeLog.length===0&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"20px 0"}}>Sin cambios registrados todavía.</div>}
          <div style={{maxHeight:400,overflowY:"auto"}}>
            {changeLog.map((e,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 0",borderBottom:`1px solid ${C.bd}`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.blue,marginTop:5,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500,color:C.t}}>{e.action}</div>
                  <div style={{fontSize:11,color:C.t2,marginTop:1}}>{e.detail}</div>
                </div>
                <div style={{fontSize:10,color:C.t3,whiteSpace:"nowrap"}}>{new Date(e.ts).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
              </div>
            ))}
          </div>
          {changeLog.length>0&&<div style={{textAlign:"right"}}><button onClick={()=>{setChangeLog([]);try{localStorage.removeItem("fa_changelog");}catch{}}} style={{background:C.red+"18",border:`1px solid ${C.red}33`,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.red,fontSize:11}}>Limpiar historial</button></div>}
        </div>
      </Modal>}

      {/* ─── MODAL COMPARTIR MES ─── */}
      {shareModal&&<Modal title="↗ Compartir resumen del mes" onClose={()=>setShareModal(false)}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C.bg3,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.t2}}>
            Compartí un resumen de <b style={{color:C.t}}>{MONTHS[selMonth]} {selYear}</b> en modo lectura. El link incluye ingresos, gastos y distribución por categoría, sin datos privados adicionales.
          </div>
          <div>
            <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Link de solo lectura</div>
            <div style={{display:"flex",gap:8}}>
              <input readOnly style={{...inp,fontSize:11,flex:1}} value={shareUrl}/>
              <button onClick={()=>{navigator.clipboard?.writeText(shareUrl);toast("✓ Link copiado","success");}} style={{background:C.blue+"22",border:`1px solid ${C.blue}44`,borderRadius:7,padding:"8px 14px",cursor:"pointer",color:C.blue,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>Copiar</button>
            </div>
          </div>
          <div style={{background:C.amber+"0D",border:`1px solid ${C.amber}22`,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.t3}}>
            ℹ El link contiene el resumen codificado — quien lo reciba puede ver los números pero no accede a tu cuenta ni a otros meses.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            {navigator.share&&<Btn primary onClick={()=>navigator.share({title:`Finanzas ${MONTHS[selMonth]} ${selYear}`,url:shareUrl})}>Compartir nativo</Btn>}
            <Btn onClick={()=>setShareModal(false)}>Cerrar</Btn>
          </div>
        </div>
      </Modal>}

      {/* ─── ONBOARDING WIZARD ─── */}
      {showOnboarding&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
        <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:18,padding:32,maxWidth:480,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          {/* Progress dots */}
          <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:24}}>
            {[0,1,2].map(i=><span key={i} style={{width:i===onboardingStep?24:8,height:8,borderRadius:4,background:i===onboardingStep?C.blue:C.bg4,transition:"width .3s"}}/>)}
          </div>
          {onboardingStep===0&&<>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:32,marginBottom:8}}>👋</div>
              <div style={{fontSize:18,fontWeight:700,color:C.t,marginBottom:8}}>Bienvenido a FinanzasApp</div>
              <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Tu app de finanzas personales para Argentina. Te guiamos en 3 pasos rápidos para configurarla.</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {[{icon:"📂",txt:"Categorías de gasto ya configuradas"},
                {icon:"💰",txt:"Soporte ARS y USD con TC oficial/blue"},
                {icon:"📊",txt:"Presupuestos, alertas y análisis con IA"}].map((x,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:C.bg3,borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontSize:16}}>{x.icon}</span>
                  <span style={{fontSize:12,color:C.t2}}>{x.txt}</span>
                </div>
              ))}
            </div>
          </>}
          {onboardingStep===1&&<>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:32,marginBottom:8}}>💵</div>
              <div style={{fontSize:18,fontWeight:700,color:C.t,marginBottom:8}}>Tipo de cambio</div>
              <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Configurá qué TC usar. Se obtiene automáticamente desde dolarapi.com o podés ingresarlo manual.</div>
            </div>
            <div style={{background:C.bg3,borderRadius:10,padding:"14px 16px",marginBottom:20}}>
              <div style={{fontSize:12,color:C.t2,marginBottom:8}}>TC actual configurado:</div>
              <div style={{fontSize:24,fontWeight:700,color:C.green}}>${tc.toLocaleString("es-AR")}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:4}}>Podés cambiarlo en cualquier momento desde la barra superior.</div>
            </div>
          </>}
          {onboardingStep===2&&<>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:32,marginBottom:8}}>🚀</div>
              <div style={{fontSize:18,fontWeight:700,color:C.t,marginBottom:8}}>¡Listo para empezar!</div>
              <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Algunos atajos para arrancar rápido:</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {[
                {key:"N",desc:"Nuevo gasto rápido"},
                {key:"I",desc:"Nuevo ingreso"},
                {key:"← →",desc:"Cambiar de mes"},
                {key:"ESC",desc:"Cerrar modales"},
              ].map((x,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:C.bg3,borderRadius:8,padding:"8px 12px"}}>
                  <span style={{background:C.bg4,borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700,color:C.blue,fontFamily:"monospace",whiteSpace:"nowrap"}}>{x.key}</span>
                  <span style={{fontSize:12,color:C.t2}}>{x.desc}</span>
                </div>
              ))}
            </div>
          </>}
          <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
            <button onClick={completeOnboarding} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:12}}>Saltar</button>
            <div style={{display:"flex",gap:8}}>
              {onboardingStep>0&&<Btn onClick={()=>setOnboardingStep(s=>s-1)}>← Atrás</Btn>}
              {onboardingStep<2
                ?<Btn primary onClick={()=>setOnboardingStep(s=>s+1)}>Siguiente →</Btn>
                :<Btn primary onClick={completeOnboarding}>¡Empezar! 🚀</Btn>}
            </div>
          </div>
        </div>
      </div>}

    </div>
  );
}