import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  pri: "#1B5E7B", priL: "#2980B9", priD: "#0D3B4F",
  acc: "#E67E22", accL: "#F39C12",
  ok: "#27AE60", err: "#E74C3C", warn: "#F1C40F",
  bg: "#F8FAFC", bdr: "#E2E8F0",
  t1: "#1A202C", t2: "#64748B", t3: "#94A3B8",
  sb: "#0F2B3C", sbH: "#163D54", sbA: "#1B5E7B",
};

function useM(bp = 768) {
  const [m, setM] = useState(window.innerWidth < bp);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [bp]);
  return m;
}

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "inventory", label: "Inventario", icon: "📦" },
  { id: "containers", label: "Contenedores", icon: "🏗️" },
  { id: "purchases", label: "Compras", icon: "🛒" },
  { id: "sales", label: "Ventas", icon: "💰" },
  { id: "invoicing", label: "Facturación", icon: "🧾" },
  { id: "consolidation", label: "Consolidación", icon: "🚢" },
  { id: "exports", label: "Exportación", icon: "🌎" },
  { id: "returns", label: "Devoluciones", icon: "🔄" },
  { id: "contacts", label: "Contactos", icon: "👥" },
  { id: "mobile", label: "App Móvil", icon: "📱" },
];

/* ─── DATA ─── */
const WAREHOUSES = [
  { id: "WH-DRY-01", name: "Almacén Seco #1", type: "Seco", positions: 120, used: 98, temp: "Ambiente" },
  { id: "WH-DRY-02", name: "Almacén Seco #2", type: "Seco", positions: 80, used: 62, temp: "Ambiente" },
  { id: "WH-REF-01", name: "Almacén Refrigerado #1", type: "Refrigerado", positions: 60, used: 55, temp: "2-4°C" },
  { id: "WH-REF-02", name: "Almacén Refrigerado #2", type: "Refrigerado", positions: 45, used: 40, temp: "0-2°C" },
  { id: "WH-REF-03", name: "Almacén Refrigerado #3", type: "Refrigerado", positions: 50, used: 38, temp: "-18°C (Congelado)" },
];

const PRODUCTS = [
  { id:1, name:"Plátano Macho", sku:"PLT-001", cat:"Frutas Tropicales", stock:2450, min:500, max:5000, unit:"lb", cost:0.45, price:0.89, loc:"WH-DRY-01 / A-01-03", lot:"PLT-L087", expiry:"2025-09-15", supplier:"Tropical Farms Inc.", lead:5 },
  { id:2, name:"Yuca Fresca", sku:"YCA-002", cat:"Raíces y Tubérculos", stock:1800, min:400, max:4000, unit:"lb", cost:0.35, price:0.72, loc:"WH-DRY-01 / A-02-01", lot:"YCA-L045", expiry:"2025-09-01", supplier:"Caribbean Roots LLC", lead:7 },
  { id:3, name:"Queso Blanco Llanero", sku:"QBL-003", cat:"Lácteos Latinos", stock:320, min:100, max:800, unit:"unit", cost:4.50, price:8.99, loc:"WH-REF-01 / C-01-02", lot:"QBL-L042", expiry:"2025-08-25", supplier:"Dairy del Sur", lead:3, alert:true },
  { id:4, name:"Harina P.A.N.", sku:"HPN-004", cat:"Harinas y Granos", stock:4200, min:1000, max:8000, unit:"unit", cost:1.80, price:3.49, loc:"WH-DRY-02 / B-03-01", lot:"HPN-L120", expiry:"2026-06-01", supplier:"Alimentos Polar USA", lead:10 },
  { id:5, name:"Frijoles Negros (lata)", sku:"FRN-005", cat:"Enlatados", stock:89, min:200, max:2000, unit:"unit", cost:0.65, price:1.29, loc:"WH-DRY-02 / B-01-04", lot:"FRN-L033", expiry:"2027-03-01", supplier:"Goya Foods", lead:4, low:true },
  { id:6, name:"Chorizo Argentino", sku:"CHA-006", cat:"Carnes y Embutidos", stock:156, min:100, max:600, unit:"unit", cost:3.20, price:6.49, loc:"WH-REF-02 / C-02-01", lot:"CHA-L015", expiry:"2025-10-01", supplier:"Pampa Meats", lead:6 },
  { id:7, name:"Aguacate Hass", sku:"AGH-007", cat:"Frutas Tropicales", stock:45, min:200, max:1500, unit:"unit", cost:0.90, price:1.79, loc:"WH-REF-01 / A-01-01", lot:"AGH-L091", expiry:"2025-08-20", supplier:"Mission Produce", lead:3, low:true },
  { id:8, name:"Camarones 16/20", sku:"CAM-009", cat:"Mariscos Congelados", stock:520, min:200, max:1200, unit:"lb", cost:6.80, price:12.99, loc:"WH-REF-03 / F-01-02", lot:"CAM-L008", expiry:"2026-02-01", supplier:"Gulf Shrimp Co.", lead:5 },
];

const CONTAINERS = [
  { id:"CTR-001", size:"40ft", temp:"-18°C", status:"loaded", yard:"Patio Propio — Doral", content:"Camarones 16/20, Chorizo Argentino", lastMove:"2025-08-06", customer:"Exportación Panamá" },
  { id:"CTR-002", size:"40ft", temp:"2°C", status:"loaded", yard:"Patio Propio — Doral", content:"Plátano Macho, Yuca Fresca", lastMove:"2025-08-07", customer:"Sedano's — Lote Grande" },
  { id:"CTR-003", size:"20ft", temp:"4°C", status:"empty", yard:"YardMax — Medley", content:"—", lastMove:"2025-08-04", customer:"—" },
  { id:"CTR-004", size:"40ft", temp:"-18°C", status:"in-transit", yard:"En tránsito → Puerto de Miami", content:"Consolidación — Lote EXP-2025-015", lastMove:"2025-08-08", customer:"Consolidación Tercero" },
  { id:"CTR-005", size:"20ft", temp:"0°C", status:"maintenance", yard:"CoolBox Repairs — Hialeah", content:"—", lastMove:"2025-07-28", customer:"—" },
  { id:"CTR-006", size:"40ft", temp:"2°C", status:"loaded", yard:"FreightYard — Opa-locka", content:"Queso Blanco, Harina P.A.N.", lastMove:"2025-08-05", customer:"Exportación Colombia" },
  { id:"CTR-007", size:"40ft", temp:"-18°C", status:"empty", yard:"Patio Propio — Doral", content:"—", lastMove:"2025-08-02", customer:"—" },
  { id:"CTR-008", size:"20ft", temp:"4°C", status:"loaded", yard:"Patio Propio — Doral", content:"Aguacate Hass", lastMove:"2025-08-08", customer:"Fresco y Más" },
];

const CONSOLIDATIONS = [
  { id:"CON-2025-012", client:"Alimentos del Caribe SAS", origin:"Barranquilla, CO", dest:"Santo Domingo, RD", status:"in-progress", container:"CTR-004", items:12, weight:"18,400 lb", created:"2025-08-01" },
  { id:"CON-2025-011", client:"Distribuidora Pacífico", origin:"Guayaquil, EC", dest:"San Juan, PR", status:"completed", container:"CTR-006", items:8, weight:"12,200 lb", created:"2025-07-25" },
  { id:"CON-2025-010", client:"TropiExport Venezuela", origin:"Valencia, VE", dest:"Panamá City, PA", status:"draft", container:"—", items:5, weight:"8,000 lb", created:"2025-08-06" },
];

const EXPORT_DOCS = [
  { id:"EXP-2025-015", type:"Packing List", destination:"Panamá City, PA", status:"issued", date:"2025-08-07", container:"CTR-004", client:"Importadora Central PA" },
  { id:"EXP-2025-014", type:"Certificado de Origen", destination:"Santo Domingo, RD", status:"issued", date:"2025-08-05", container:"CTR-006", client:"Caribe Foods DR" },
  { id:"EXP-2025-013", type:"Certificado TLC", destination:"Bogotá, CO", status:"pending", date:"2025-08-06", container:"—", client:"Distribuidora Andina" },
  { id:"EXP-2025-012", type:"Reporte de Inspección", destination:"Panamá City, PA", status:"issued", date:"2025-08-07", container:"CTR-004", client:"Importadora Central PA" },
  { id:"EXP-2025-011", type:"Guía de Transporte (BL)", destination:"San Juan, PR", status:"issued", date:"2025-07-30", container:"CTR-006", client:"Caribe Foods DR" },
  { id:"EXP-2025-010", type:"Packing List", destination:"Bogotá, CO", status:"draft", date:"2025-08-08", container:"—", client:"Distribuidora Andina" },
];

const SALES = [
  { id:"SO-2025-112", customer:"Sedano's Supermarkets", date:"2025-08-08", status:"confirmed", total:12450, items:8, pl:"Mayorista A", bl:"BL-2025-0891", payDue:"2025-09-07" },
  { id:"SO-2025-111", customer:"Fresco y Más", date:"2025-08-07", status:"invoiced", total:8900, items:5, pl:"Mayorista B", bl:"—", payDue:"2025-09-06" },
  { id:"SO-2025-110", customer:"El Bodegón Market", date:"2025-08-06", status:"draft", total:3200, items:3, pl:"Detallista", bl:"—", payDue:"—" },
  { id:"SO-2025-109", customer:"Presidente Supermarket", date:"2025-08-05", status:"confirmed", total:18750, items:12, pl:"Mayorista A", bl:"BL-2025-0889", payDue:"2025-09-04" },
  { id:"SO-2025-108", customer:"Importadora Central PA", date:"2025-08-04", status:"shipped", total:32400, items:6, pl:"Exportación", bl:"BL-2025-0887", payDue:"2025-09-03", export:true },
];

const POS = [
  { id:"PO-2025-041", supplier:"Tropical Farms Inc.", date:"2025-08-05", status:"confirmed", total:4500, items:3, eta:"2025-08-10", dropship:false },
  { id:"PO-2025-040", supplier:"Goya Foods", date:"2025-08-03", status:"received", total:2800, items:5, eta:"2025-08-07", dropship:false },
  { id:"PO-2025-039", supplier:"Alimentos Polar USA", date:"2025-08-01", status:"draft", total:7200, items:2, eta:"2025-08-11", dropship:false },
  { id:"PO-2025-038", supplier:"Gulf Shrimp Co.", date:"2025-07-30", status:"confirmed", total:8160, items:1, eta:"2025-08-05", dropship:true },
];

const INVOICES = [
  { id:"INV-2025-089", customer:"Sedano's Supermarkets", date:"2025-08-08", due:"2025-09-07", status:"open", total:12450, paid:0 },
  { id:"INV-2025-088", customer:"Fresco y Más", date:"2025-08-07", due:"2025-09-06", status:"partial", total:8900, paid:5000 },
  { id:"INV-2025-087", customer:"Presidente Supermarket", date:"2025-08-05", due:"2025-09-04", status:"paid", total:18750, paid:18750 },
  { id:"INV-2025-086", customer:"Importadora Central PA", date:"2025-08-04", due:"2025-09-03", status:"open", total:32400, paid:0 },
];

const RETURNS = [
  { id:"DEV-2025-008", customer:"Sedano's", date:"2025-08-07", reason:"Producto dañado", product:"Queso Blanco Llanero", qty:"15 unit", status:"approved", action:"Devolución a proveedor", auth:"Carlos M." },
  { id:"DEV-2025-007", customer:"Fresco y Más", date:"2025-08-05", reason:"Error en pedido", product:"Harina P.A.N.", qty:"50 unit", status:"restock", action:"Reintegrado a inventario", auth:"Ana R." },
  { id:"DEV-2025-006", customer:"El Bodegón", date:"2025-08-03", reason:"Lote caducado", product:"Chorizo Argentino", qty:"8 unit", status:"pending-auth", action:"Pendiente autorización", auth:"—" },
];

const CONTACTS = [
  { id:1, name:"Sedano's Supermarkets", type:"customer", cat:"Mayorista A", phone:"(305) 555-0101", city:"Hialeah, FL", balance:12450 },
  { id:2, name:"Tropical Farms Inc.", type:"supplier", cat:"Proveedor Premium", phone:"(786) 555-0202", city:"Homestead, FL", balance:-4500 },
  { id:3, name:"Importadora Central PA", type:"customer", cat:"Exportación", phone:"+507 555-0303", city:"Panamá City, PA", balance:32400 },
  { id:4, name:"Alimentos del Caribe SAS", type:"consolidation", cat:"Cliente Consolidación", phone:"+57 555-0404", city:"Barranquilla, CO", balance:0 },
  { id:5, name:"Gulf Shrimp Co.", type:"supplier", cat:"Drop-Ship", phone:"(985) 555-0505", city:"Houma, LA", balance:-8160 },
];

const TUTORIAL = [
  { target:"welcome", title:"Bienvenido al ERP — Alcance v2", desc:"Este demo presenta el sistema integral con alcance ampliado: gestión de inventario multi-almacén, contenedores refrigerados itinerantes, consolidación de carga para terceros, documentos de exportación y app móvil con soporte offline.", pos:"center" },
  { target:"sidebar", title:"10 Módulos Integrados", desc:"Compras, Inventario, Ventas, Facturación, Devoluciones y Contactos — más los 3 módulos nuevos: Contenedores, Consolidación y Exportación. Todo conectado en tiempo real con sincronización a QuickBooks.", pos:"right" },
  { target:"kpis", title:"KPIs Operativos", desc:"Métricas clave del negocio: ventas, inventario valorizado en 5 almacenes (2 secos + 3 refrigerados), contenedores activos, y documentos de exportación pendientes.", pos:"bottom" },
  { target:"alerts", title:"8 Tipos de Alertas", desc:"Alertas configurables: stock bajo mínimo, lotes próximos a caducar, contenedor sin movimiento, embarque próximo, BL por vencer, autorización pendiente, recepción incompleta y más.", pos:"bottom" },
  { target:"mod-containers", title:"28 Contenedores Itinerantes", desc:"Gestión de contenedores refrigerados entre patio propio y yardas externas. Control de temperatura, historial de movimientos, y reasignación desde la app móvil con soporte offline.", pos:"right", nav:"containers" },
  { target:"mod-consolidation", title:"Consolidación para Terceros", desc:"Inventario de consignación separado (valoración cero). Flujo end-to-end: orden, ingreso, consolidación, embarque y cierre. Documentos firmados con datos del tercero.", pos:"right", nav:"consolidation" },
  { target:"mod-exports", title:"5 Documentos de Exportación", desc:"Packing List, Certificado de Origen, Certificado TLC, Reporte de Inspección y Guía de Transporte (BL/AWB). Formatos internacionales personalizados.", pos:"right", nav:"exports" },
  { target:"done", title:"¡Explore el Sistema!", desc:"Haga clic en cualquier módulo, registro u orden para ver los detalles. Cada módulo tiene al menos dos niveles de profundidad. El sistema completo se implementará en 7 meses con dos entregas escalonadas.", pos:"center", nav:"dashboard" },
];

/* ─── SHARED COMPONENTS ─── */
function Badge({ status }) {
  const m = { confirmed:{b:"#DBEAFE",c:"#1D4ED8",l:"Confirmado"}, received:{b:"#D1FAE5",c:"#059669",l:"Recibido"}, draft:{b:"#F1F5F9",c:"#64748B",l:"Borrador"}, invoiced:{b:"#EDE9FE",c:"#7C3AED",l:"Facturado"}, shipped:{b:"#FEF3C7",c:"#D97706",l:"Enviado"}, open:{b:"#FEE2E2",c:"#DC2626",l:"Pendiente"}, partial:{b:"#FEF3C7",c:"#D97706",l:"Pago Parcial"}, paid:{b:"#D1FAE5",c:"#059669",l:"Pagada"}, customer:{b:"#DBEAFE",c:"#1D4ED8",l:"Cliente"}, supplier:{b:"#FEF3C7",c:"#D97706",l:"Proveedor"}, loaded:{b:"#DBEAFE",c:"#1D4ED8",l:"Cargado"}, empty:{b:"#F1F5F9",c:"#64748B",l:"Vacío"}, "in-transit":{b:"#EDE9FE",c:"#7C3AED",l:"En Tránsito"}, maintenance:{b:"#FEE2E2",c:"#DC2626",l:"Mantenimiento"}, "in-progress":{b:"#DBEAFE",c:"#1D4ED8",l:"En Proceso"}, completed:{b:"#D1FAE5",c:"#059669",l:"Completado"}, issued:{b:"#D1FAE5",c:"#059669",l:"Emitido"}, pending:{b:"#FEF3C7",c:"#D97706",l:"Pendiente"}, approved:{b:"#D1FAE5",c:"#059669",l:"Aprobado"}, restock:{b:"#DBEAFE",c:"#1D4ED8",l:"Reintegrado"}, "pending-auth":{b:"#FEE2E2",c:"#DC2626",l:"Pend. Autoriz."}, consolidation:{b:"#EDE9FE",c:"#7C3AED",l:"Consolidación"} };
  const s = m[status] || { b:"#F1F5F9", c:"#64748B", l:status };
  return <span style={{ background:s.b, color:s.c, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>{s.l}</span>;
}

function Kpi({ icon, label, value, sub, color }) {
  const mob = useM();
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:mob?"14px 16px":"20px 24px", border:`1px solid ${C.bdr}`, flex:mob?"1 1 100%":"1 1 200px", minWidth:mob?0:180, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color }} />
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <span style={{ fontSize:24 }}>{icon}</span>
        <span style={{ fontSize:12, color:C.t2, fontWeight:500 }}>{label}</span>
      </div>
      <div style={{ fontSize:24, fontWeight:700, color:C.t1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.t3, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function Table({ cols, data, onClick }) {
  return (
    <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.bdr}` }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:600 }}>
        <thead><tr style={{ background:C.bg }}>
          {cols.map(c => <th key={c.k} style={{ textAlign:"left", padding:"10px 14px", fontWeight:600, color:C.t2, borderBottom:`1px solid ${C.bdr}`, fontSize:11, textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap" }}>{c.l}</th>)}
        </tr></thead>
        <tbody>
          {data.map((r, i) => <tr key={i} onClick={() => onClick?.(r)} style={{ cursor:onClick?"pointer":"default", borderBottom:`1px solid ${C.bdr}` }} onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            {cols.map(c => <td key={c.k} style={{ padding:"10px 14px", color:C.t1 }}>{c.r ? c.r(r[c.k], r) : r[c.k]}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Detail({ title, onBack, children }) {
  return <div style={{ animation:"slideIn 0.25s ease-out" }}>
    <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.priL, cursor:"pointer", fontSize:13, fontWeight:600, marginBottom:16, padding:0 }}>← Volver</button>
    <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:20 }}>{title}</h2>
    {children}
  </div>;
}

function Field({ l, v }) {
  return <div style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>{l}</div><div style={{ fontSize:14, color:C.t1, fontWeight:500 }}>{v}</div></div>;
}

function Card({ children, style }) {
  return <div style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.bdr}`, padding:20, ...style }}>{children}</div>;
}

function Hdr({ title, sub, children }) {
  return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
    <div><h1 style={{ fontSize:24, fontWeight:700, color:C.t1 }}>{title}</h1>{sub && <p style={{ color:C.t2, fontSize:13 }}>{sub}</p>}</div>
    {children && <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{children}</div>}
  </div>;
}

function Btn({ children, primary, onClick, style }) {
  return <button onClick={onClick} style={{ padding:"8px 16px", borderRadius:8, background:primary?C.pri:"#fff", color:primary?"#fff":C.t1, border:primary?"none":`1px solid ${C.bdr}`, fontSize:13, fontWeight:600, cursor:"pointer", ...style }}>{children}</button>;
}

/* ─── VIEWS ─── */

function DashboardView({ onNav }) {
  const mob = useM();
  const lowStock = PRODUCTS.filter(p => p.low);
  const activeCtrs = CONTAINERS.filter(c => c.status === "loaded" || c.status === "in-transit");
  return <div>
    <div style={{ marginBottom:24 }}>
      <h1 style={{ fontSize:26, fontWeight:700, color:C.t1, marginBottom:4 }}>Dashboard</h1>
      <p style={{ color:C.t2, fontSize:14 }}>South Florida Foods Int'l Inc — Alcance Ampliado v2</p>
    </div>
    <div id="kpis" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
      <Kpi icon="💵" label="Ventas del Mes" value="$75,700" sub="+18% vs mes anterior" color={C.ok} />
      <Kpi icon="📦" label="Inventario (5 Almacenes)" value="$184,200" sub="2 secos + 3 refrigerados" color={C.pri} />
      <Kpi icon="🏗️" label="Contenedores Activos" value={`${activeCtrs.length} / 28`} sub="3 cargados, 1 en tránsito" color={C.acc} />
      <Kpi icon="🚢" label="Consolidaciones Abiertas" value="2" sub="1 en proceso, 1 borrador" color="#7C3AED" />
      <Kpi icon="🌎" label="Docs Exportación Pend." value="2" sub="1 certificado + 1 packing list" color={C.err} />
      <Kpi icon="📋" label="Cuentas por Cobrar" value="$44,850" sub="4 facturas abiertas" color={C.warn} />
    </div>
    <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.t1 }}>Ventas Recientes</h3>
          <button onClick={() => onNav("sales")} style={{ background:"none", border:"none", color:C.priL, cursor:"pointer", fontSize:12, fontWeight:600 }}>Ver todas →</button>
        </div>
        {SALES.slice(0,4).map(o => <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.bdr}` }}>
          <div><div style={{ fontSize:13, fontWeight:600, color:C.t1 }}>{o.customer} {o.export ? "🌎" : ""}</div><div style={{ fontSize:11, color:C.t3 }}>{o.id} · {o.date}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:700 }}>${o.total.toLocaleString()}</div><Badge status={o.status} /></div>
        </div>)}
      </Card>
      <Card id="alerts">
        <h3 style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:14 }}>⚠️ Alertas del Sistema</h3>
        {lowStock.map(p => <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:6, background:"#FEF2F2", borderRadius:8, border:"1px solid #FECACA" }}>
          <span style={{ fontSize:18 }}>📉</span><div><div style={{ fontSize:12, fontWeight:600, color:"#991B1B" }}>Bajo Stock: {p.name}</div><div style={{ fontSize:11, color:"#DC2626" }}>Actual: {p.stock} {p.unit} · Mín: {p.min}</div></div>
        </div>)}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:6, background:"#FEF3C7", borderRadius:8, border:"1px solid #FDE68A" }}>
          <span style={{ fontSize:18 }}>📅</span><div><div style={{ fontSize:12, fontWeight:600, color:"#92400E" }}>Lote próximo a caducar</div><div style={{ fontSize:11, color:"#D97706" }}>Queso Blanco — Lote QBL-L042 vence 2025-08-25</div></div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:6, background:"#EDE9FE", borderRadius:8, border:"1px solid #DDD6FE" }}>
          <span style={{ fontSize:18 }}>🏗️</span><div><div style={{ fontSize:12, fontWeight:600, color:"#5B21B6" }}>Contenedor sin movimiento (14 días)</div><div style={{ fontSize:11, color:"#7C3AED" }}>CTR-005 en CoolBox Repairs — Hialeah</div></div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:6, background:"#DBEAFE", borderRadius:8, border:"1px solid #BFDBFE" }}>
          <span style={{ fontSize:18 }}>🔄</span><div><div style={{ fontSize:12, fontWeight:600, color:"#1E40AF" }}>Autorización pendiente</div><div style={{ fontSize:11, color:"#2563EB" }}>DEV-2025-006 — Devolución Chorizo Argentino</div></div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#D1FAE5", borderRadius:8, border:"1px solid #A7F3D0" }}>
          <span style={{ fontSize:18 }}>📘</span><div><div style={{ fontSize:12, fontWeight:600, color:"#065F46" }}>QuickBooks Sync</div><div style={{ fontSize:11, color:"#059669" }}>Última: Hace 12 min — 5 movimientos exportados</div></div>
        </div>
      </Card>
    </div>
  </div>;
}

function InventoryView() {
  const mob = useM(); const [sel, setSel] = useState(null); const [tab, setTab] = useState("products");
  if (sel) { const p = sel; const pct = Math.min(100, Math.round((p.stock / p.max) * 100)); const clr = p.stock < p.min ? C.err : p.stock < p.min*1.5 ? C.warn : C.ok;
    return <Detail title={p.name} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Producto</h4>
          <Field l="SKU" v={p.sku} /><Field l="Categoría" v={p.cat} /><Field l="Ubicación" v={p.loc} /><Field l="Lote" v={p.lot} /><Field l="Caducidad" v={p.expiry} /><Field l="FIFO" v="Activo — Primera entrada, primera salida" /></Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Stock y Reabastecimiento</h4>
          <Field l="Stock Actual" v={`${p.stock.toLocaleString()} ${p.unit}`} />
          <div style={{ marginBottom:12 }}><div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.t3, marginBottom:4 }}><span>Mín: {p.min}</span><span>Máx: {p.max}</span></div><div style={{ height:8, background:C.bdr, borderRadius:4, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:clr, borderRadius:4 }} /></div></div>
          <Field l="Proveedor" v={p.supplier} /><Field l="Lead Time" v={`${p.lead} días`} /><Field l="Costo" v={`$${p.cost.toFixed(2)}`} /><Field l="Precio" v={`$${p.price.toFixed(2)}`} /><Field l="Margen" v={`${Math.round(((p.price-p.cost)/p.price)*100)}%`} /></Card>
      </div>
      <Card style={{ marginTop:16 }}><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:12, textTransform:"uppercase" }}>Movimientos</h4>
        <Table cols={[{k:"date",l:"Fecha"},{k:"type",l:"Tipo",r:v=><Badge status={v==="Entrada"?"received":"shipped"} />},{k:"qty",l:"Cantidad"},{k:"ref",l:"Referencia"},{k:"wh",l:"Almacén"}]}
          data={[{date:"2025-08-08",type:"Entrada",qty:`+500 ${p.unit}`,ref:"PO-2025-041",wh:"WH-DRY-01"},{date:"2025-08-06",type:"Salida",qty:`-120 ${p.unit}`,ref:"SO-2025-112",wh:"WH-DRY-01"},{date:"2025-08-04",type:"Transferencia",qty:`80 ${p.unit}`,ref:"TR-INT-045",wh:"WH-DRY-01 → WH-REF-01"}]} />
      </Card>
    </Detail>;
  }
  return <div id="mod-inventory">
    <Hdr title="Inventario" sub="5 almacenes · 355 posiciones · Control FIFO y lotes con caducidad">
      <Btn onClick={() => setTab(tab==="products"?"warehouses":"products")}>{tab==="products"?"Ver Almacenes":"Ver Productos"}</Btn>
      <Btn primary>+ Nuevo Producto</Btn>
    </Hdr>
    {tab==="warehouses" ? <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:16 }}>
      {WAREHOUSES.map(w => <Card key={w.id}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:14, fontWeight:700 }}>{w.name}</span><Badge status={w.type==="Refrigerado"?"loaded":"received"} /></div>
        <Field l="Tipo" v={w.type} /><Field l="Temperatura" v={w.temp} /><Field l="Posiciones" v={`${w.used} / ${w.positions} ocupadas`} />
        <div style={{ height:6, background:C.bdr, borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${Math.round(w.used/w.positions*100)}%`, background:w.used/w.positions>0.9?C.err:C.ok, borderRadius:3 }} /></div>
      </Card>)}
    </div> :
    <Table cols={[{k:"sku",l:"SKU"},{k:"name",l:"Producto",r:(v,r)=><span style={{fontWeight:600}}>{v}{r.low?" ⚠️":""}{r.alert?" 📅":""}</span>},{k:"cat",l:"Categoría"},{k:"stock",l:"Stock",r:(v,r)=><span style={{color:v<r.min?C.err:C.t1,fontWeight:600}}>{v.toLocaleString()} {r.unit}</span>},{k:"loc",l:"Ubicación"},{k:"lot",l:"Lote"},{k:"expiry",l:"Caducidad"}]} data={PRODUCTS} onClick={setSel} />}
  </div>;
}

function ContainersView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const c = sel;
    return <Detail title={`Contenedor ${c.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Datos del Contenedor</h4>
          <Field l="Tamaño" v={c.size} /><Field l="Temperatura" v={c.temp} /><Field l="Estado" v={<Badge status={c.status} />} /><Field l="Yarda Actual" v={c.yard} /><Field l="Contenido" v={c.content} /><Field l="Cliente / Destino" v={c.customer} /><Field l="Último Movimiento" v={c.lastMove} /></Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Btn primary>🔄 Reasignar Yarda</Btn><Btn>📦 Ver Inventario</Btn><Btn>📋 Historial de Movimientos</Btn><Btn>🖨️ Etiqueta del Contenedor</Btn>
            {c.status==="maintenance" && <Btn style={{background:C.ok,color:"#fff",border:"none"}}>✓ Marcar como Disponible</Btn>}
          </div>
          <div style={{ marginTop:16, padding:12, background:"#EDE9FE", borderRadius:8, border:"1px solid #DDD6FE" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#5B21B6" }}>📱 Operación Móvil</div>
            <div style={{ fontSize:11, color:"#7C3AED", marginTop:2 }}>Escanee el código del contenedor desde la app Zebra para consultar yarda, contenido y reasignar — funciona offline.</div>
          </div>
        </Card>
      </div>
      <Card style={{ marginTop:16 }}><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:12, textTransform:"uppercase" }}>Historial de Movimientos</h4>
        <Table cols={[{k:"date",l:"Fecha"},{k:"from",l:"Desde"},{k:"to",l:"Hacia"},{k:"user",l:"Usuario"},{k:"note",l:"Nota"}]}
          data={[{date:"2025-08-06 14:30",from:"Patio Propio — Doral",to:c.yard,user:"Carlos M.",note:"Reasignación programada"},{date:"2025-07-28 09:15",from:"FreightYard — Opa-locka",to:"Patio Propio — Doral",user:"Ana R.",note:"Retorno de yarda externa"},{date:"2025-07-20 16:00",from:"Patio Propio — Doral",to:"FreightYard — Opa-locka",user:"Carlos M.",note:"Espacio insuficiente en patio"}]} />
      </Card>
    </Detail>;
  }
  const byStatus = { loaded:CONTAINERS.filter(c=>c.status==="loaded").length, empty:CONTAINERS.filter(c=>c.status==="empty").length, transit:CONTAINERS.filter(c=>c.status==="in-transit").length, maint:CONTAINERS.filter(c=>c.status==="maintenance").length };
  return <div id="mod-containers">
    <Hdr title="Contenedores Itinerantes" sub="28 contenedores refrigerados · Patio propio + yardas externas"><Btn primary>+ Registrar Movimiento</Btn></Hdr>
    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
      <Kpi icon="📦" label="Cargados" value={byStatus.loaded} color={C.pri} /><Kpi icon="🚛" label="En Tránsito" value={byStatus.transit} color="#7C3AED" /><Kpi icon="⬜" label="Vacíos" value={byStatus.empty} color={C.t3} /><Kpi icon="🔧" label="Mantenimiento" value={byStatus.maint} color={C.err} />
    </div>
    <Table cols={[{k:"id",l:"ID",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"size",l:"Tamaño"},{k:"temp",l:"Temp."},{k:"status",l:"Estado",r:v=><Badge status={v} />},{k:"yard",l:"Yarda Actual"},{k:"content",l:"Contenido"},{k:"customer",l:"Destino"},{k:"lastMove",l:"Último Mov."}]} data={CONTAINERS} onClick={setSel} />
  </div>;
}

function ConsolidationView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const o = sel;
    return <Detail title={`Consolidación ${o.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Orden de Consolidación</h4>
          <Field l="Cliente Tercero" v={o.client} /><Field l="Origen" v={o.origin} /><Field l="Destino" v={o.dest} /><Field l="Contenedor Asignado" v={o.container} /><Field l="Estado" v={<Badge status={o.status} />} /><Field l="Líneas de Producto" v={o.items} /><Field l="Peso Total" v={o.weight} /><Field l="Tipo de Inventario" v="Consignación (valoración $0 — no afecta ledger propio)" />
        </Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {o.status==="draft" && <Btn primary>✓ Confirmar Orden</Btn>}
            {o.status==="in-progress" && <><Btn primary>📦 Registrar Ingreso</Btn><Btn style={{background:C.ok,color:"#fff",border:"none"}}>🚢 Cerrar y Embarcar</Btn></>}
            <Btn>📄 Documento de Consolidación Firmado</Btn><Btn>🖨️ Imprimir</Btn>
          </div>
          <div style={{ marginTop:16, padding:12, background:"#FEF3C7", borderRadius:8, border:"1px solid #FDE68A" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#92400E" }}>⚠️ Inventario Separado</div>
            <div style={{ fontSize:11, color:"#D97706", marginTop:2 }}>La mercancía consolidada NO entra al inventario propio de SFF. Se mantiene en inventario de consignación con valoración cero.</div>
          </div>
        </Card>
      </div>
      <Card style={{ marginTop:16 }}><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:12, textTransform:"uppercase" }}>Líneas de Mercancía (Tercero)</h4>
        <Table cols={[{k:"product",l:"Producto"},{k:"qty",l:"Cantidad"},{k:"weight",l:"Peso"},{k:"lot",l:"Lote Tercero"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]}
          data={[{product:"Arroz Integral Premium",qty:"400 sacos",weight:"8,800 lb",lot:"T-LOT-001",status:"received"},{product:"Aceite de Palma",qty:"200 bidones",weight:"4,400 lb",lot:"T-LOT-002",status:"received"},{product:"Harina de Trigo",qty:"300 sacos",weight:"5,200 lb",lot:"T-LOT-003",status:o.status==="draft"?"pending":"received"}]} />
      </Card>
    </Detail>;
  }
  return <div id="mod-consolidation">
    <Hdr title="Consolidación de Carga" sub="Servicio para terceros · Inventario de consignación separado"><Btn primary>+ Nueva Consolidación</Btn></Hdr>
    <Table cols={[{k:"id",l:"Orden",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"client",l:"Cliente Tercero"},{k:"origin",l:"Origen"},{k:"dest",l:"Destino"},{k:"container",l:"Contenedor"},{k:"items",l:"Líneas"},{k:"weight",l:"Peso"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={CONSOLIDATIONS} onClick={setSel} />
  </div>;
}

function ExportsView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const d = sel;
    return <Detail title={`${d.type} — ${d.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Documento</h4>
          <Field l="Tipo" v={d.type} /><Field l="Número" v={d.id} /><Field l="Destino" v={d.destination} /><Field l="Cliente / Importador" v={d.client} /><Field l="Contenedor" v={d.container} /><Field l="Fecha" v={d.date} /><Field l="Estado" v={<Badge status={d.status} />} />
          {d.type==="Packing List" && <><Field l="Inspector" v="Jorge Pérez" /><Field l="Peso Bruto" v="19,200 lb" /><Field l="Peso Neto" v="18,400 lb" /></>}
          {d.type==="Certificado de Origen" && <><Field l="País de Origen" v="Estados Unidos" /><Field l="Autoridad Emisora" v="US Chamber of Commerce" /></>}
          {d.type==="Certificado TLC" && <><Field l="Acuerdo Comercial" v="DR-CAFTA" /><Field l="Preferencia Arancelaria" v="0% — Partida 0803.90" /></>}
          {d.type.includes("BL") && <><Field l="Naviera" v="Mediterranean Shipping Co." /><Field l="Número BL" v="MSCU-2025-08-0341" /><Field l="Puerto Origen" v="PortMiami" /><Field l="Puerto Destino" v={d.destination} /></>}
        </Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {d.status==="draft" && <Btn primary>✓ Emitir Documento</Btn>}
            {d.status==="pending" && <Btn primary>📝 Completar Datos</Btn>}
            <Btn>🖨️ Imprimir (Formato Internacional)</Btn><Btn>📧 Enviar al Importador</Btn><Btn>📎 Adjuntar a Embarque</Btn>
          </div>
        </Card>
      </div>
    </Detail>;
  }
  const types = ["Packing List","Certificado de Origen","Certificado TLC","Reporte de Inspección","Guía de Transporte (BL)"];
  return <div id="mod-exports">
    <Hdr title="Documentos de Exportación" sub="5 tipos de documento · Formatos internacionales"><Btn primary>+ Nuevo Documento</Btn></Hdr>
    <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
      {types.map(t => <span key={t} style={{ padding:"4px 12px", borderRadius:20, background:"#EDE9FE", color:"#5B21B6", fontSize:11, fontWeight:600 }}>{t}</span>)}
    </div>
    <Table cols={[{k:"id",l:"Número",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"type",l:"Tipo"},{k:"destination",l:"Destino"},{k:"client",l:"Importador"},{k:"container",l:"Contenedor"},{k:"date",l:"Fecha"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={EXPORT_DOCS} onClick={setSel} />
  </div>;
}

function PurchasesView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const o = sel;
    return <Detail title={`OC ${o.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><Field l="Proveedor" v={o.supplier} /><Field l="Fecha" v={o.date} /><Field l="ETA" v={o.eta} /><Field l="Estado" v={<Badge status={o.status} />} /><Field l="Total" v={`$${o.total.toLocaleString()}`} />
          {o.dropship && <div style={{ marginTop:8, padding:10, background:"#DBEAFE", borderRadius:8, border:"1px solid #BFDBFE" }}><div style={{ fontSize:12, fontWeight:600, color:"#1E40AF" }}>🚚 Drop-Ship</div><div style={{ fontSize:11, color:"#2563EB", marginTop:2 }}>Envío directo desde almacén del proveedor al cliente final. No toca inventario propio.</div></div>}
        </Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {o.status==="draft" && <Btn primary>✓ Confirmar</Btn>}{o.status==="confirmed" && <Btn primary>📦 Recibir Mercancía</Btn>}<Btn>🖨️ Imprimir</Btn><Btn>✉️ Enviar al Proveedor</Btn>
          </div></Card>
      </div>
    </Detail>;
  }
  return <div><Hdr title="Compras" sub="Órdenes de compra · Drop-Ship · Reabastecimiento automático"><Btn primary>+ Nueva Orden</Btn></Hdr>
    <Table cols={[{k:"id",l:"Orden",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"supplier",l:"Proveedor"},{k:"date",l:"Fecha"},{k:"eta",l:"ETA"},{k:"total",l:"Total",r:v=><span style={{fontWeight:700}}>${v.toLocaleString()}</span>},{k:"dropship",l:"Drop-Ship",r:v=>v?"🚚 Sí":"—"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={POS} onClick={setSel} />
  </div>;
}

function SalesView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const o = sel;
    return <Detail title={`Pedido ${o.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><Field l="Cliente" v={o.customer} /><Field l="Lista de Precios" v={o.pl} /><Field l="Fecha" v={o.date} /><Field l="Estado" v={<Badge status={o.status} />} /><Field l="Total" v={`$${o.total.toLocaleString()}`} />
          {o.bl!=="—" && <Field l="Bill of Lading" v={o.bl} />}{o.payDue!=="—" && <Field l="Vencimiento Pago (desde BL)" v={o.payDue} />}
          {o.export && <div style={{ marginTop:8, padding:10, background:"#EDE9FE", borderRadius:8, border:"1px solid #DDD6FE" }}><div style={{ fontSize:12, fontWeight:600, color:"#5B21B6" }}>🌎 Venta de Exportación</div><div style={{ fontSize:11, color:"#7C3AED", marginTop:2 }}>Requiere documentos de exportación. Pago calculado desde fecha del BL.</div></div>}
        </Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {o.status==="draft" && <Btn primary>✓ Confirmar</Btn>}{o.status==="confirmed" && <Btn primary>🧾 Crear Factura</Btn>}
            <Btn>✉️ Enviar Cotización</Btn><Btn>🖨️ Imprimir</Btn>{o.export && <Btn>🌎 Generar Docs Exportación</Btn>}
          </div></Card>
      </div>
    </Detail>;
  }
  return <div id="mod-sales"><Hdr title="Ventas" sub="Listas de precios · Descuentos con aprobación · Payment terms desde BL"><Btn>Listas de Precios</Btn><Btn primary>+ Nueva Cotización</Btn></Hdr>
    <Table cols={[{k:"id",l:"Pedido",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"customer",l:"Cliente"},{k:"pl",l:"Lista Precios"},{k:"date",l:"Fecha"},{k:"total",l:"Total",r:v=><span style={{fontWeight:700}}>${v.toLocaleString()}</span>},{k:"export",l:"Export",r:v=>v?"🌎":"—"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={SALES} onClick={setSel} />
  </div>;
}

function InvoicingView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const inv = sel; const pct = Math.round((inv.paid/inv.total)*100);
    return <Detail title={`Factura ${inv.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><Field l="Cliente" v={inv.customer} /><Field l="Emisión" v={inv.date} /><Field l="Vencimiento" v={inv.due} /><Field l="Estado" v={<Badge status={inv.status} />} /><Field l="Total" v={`$${inv.total.toLocaleString()}`} /><Field l="Pagado" v={`$${inv.paid.toLocaleString()}`} /><Field l="Saldo" v={`$${(inv.total-inv.paid).toLocaleString()}`} />
          <div style={{ height:6, background:C.bdr, borderRadius:3, overflow:"hidden", marginTop:4 }}><div style={{ height:"100%", width:`${pct}%`, background:pct===100?C.ok:C.acc, borderRadius:3 }} /></div>
        </Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {inv.status!=="paid" && <Btn primary>💳 Registrar Pago</Btn>}<Btn>📄 Nota de Crédito</Btn><Btn>✉️ Enviar Factura</Btn><Btn>🔄 Exportar a QuickBooks</Btn>
          </div></Card>
      </div>
    </Detail>;
  }
  return <div id="mod-invoicing"><Hdr title="Facturación" sub="Facturas · Pagos parciales · Notas de crédito/débito · QuickBooks"><Btn primary>+ Nueva Factura</Btn></Hdr>
    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
      <Kpi icon="📋" label="Abiertas" value="2" sub="$44,850" color={C.err} /><Kpi icon="⏳" label="Pago Parcial" value="1" sub="$3,900 rest." color={C.warn} /><Kpi icon="✅" label="Pagadas" value="1" sub="$18,750" color={C.ok} />
    </div>
    <Table cols={[{k:"id",l:"Factura",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"customer",l:"Cliente"},{k:"date",l:"Emisión"},{k:"due",l:"Vencimiento"},{k:"total",l:"Total",r:v=><span style={{fontWeight:700}}>${v.toLocaleString()}</span>},{k:"paid",l:"Pagado",r:v=>`$${v.toLocaleString()}`},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={INVOICES} onClick={setSel} />
  </div>;
}

function ReturnsView() {
  const mob = useM(); const [sel, setSel] = useState(null);
  if (sel) { const r = sel;
    return <Detail title={`Devolución ${r.id}`} onBack={() => setSel(null)}>
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
        <Card><Field l="Cliente" v={r.customer} /><Field l="Producto" v={r.product} /><Field l="Cantidad" v={r.qty} /><Field l="Motivo" v={r.reason} /><Field l="Acción" v={r.action} /><Field l="Estado" v={<Badge status={r.status} />} /><Field l="Autorizado por" v={r.auth} /></Card>
        <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Acciones</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {r.status==="pending-auth" && <Btn primary>✓ Aprobar Devolución</Btn>}<Btn>📄 Nota de Crédito</Btn><Btn>🔄 Devolver a Proveedor</Btn><Btn>🖨️ Imprimir</Btn>
          </div></Card>
      </div>
    </Detail>;
  }
  return <div><Hdr title="Devoluciones" sub="Registro · Autorización · Reintegro o destrucción"><Btn primary>+ Nueva Devolución</Btn></Hdr>
    <Table cols={[{k:"id",l:"Dev.",r:v=><span style={{fontWeight:600,color:C.priL}}>{v}</span>},{k:"customer",l:"Cliente"},{k:"product",l:"Producto"},{k:"qty",l:"Cant."},{k:"reason",l:"Motivo"},{k:"action",l:"Acción"},{k:"status",l:"Estado",r:v=><Badge status={v} />}]} data={RETURNS} onClick={setSel} />
  </div>;
}

function ContactsView() {
  const mob = useM(); const [sel, setSel] = useState(null); const [f, setF] = useState("all");
  const data = f==="all" ? CONTACTS : CONTACTS.filter(c => c.type === f);
  if (sel) { return <Detail title={sel.name} onBack={() => setSel(null)}>
    <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
      <Card><Field l="Tipo" v={<Badge status={sel.type} />} /><Field l="Categoría" v={sel.cat} /><Field l="Teléfono" v={sel.phone} /><Field l="Ciudad" v={sel.city} />
        <Field l="Balance" v={<span style={{ color:sel.balance>0?C.err:sel.balance<0?C.pri:C.ok, fontWeight:700 }}>${Math.abs(sel.balance).toLocaleString()} {sel.balance>0?"(nos debe)":sel.balance<0?"(le debemos)":"(saldado)"}</span>} /></Card>
      <Card><h4 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Historial</h4>
        <div style={{ fontSize:13 }}>{sel.type==="consolidation" ? <>
          <div style={{ padding:"6px 0", borderBottom:`1px solid ${C.bdr}` }}>🚢 CON-2025-012 — En Proceso</div>
          <div style={{ padding:"6px 0" }}>📄 Documento de Consolidación Firmado</div>
        </> : <>
          <div style={{ padding:"6px 0", borderBottom:`1px solid ${C.bdr}` }}>📄 Última orden: {sel.type==="supplier"?"PO":"SO"}-2025-041</div>
          <div style={{ padding:"6px 0" }}>🧾 {sel.type==="supplier"?"Factura proveedor":"Factura"} reciente</div>
        </>}</div></Card>
    </div>
  </Detail>; }
  return <div><Hdr title="Contactos" sub="Clientes · Proveedores · Clientes de consolidación">
    <select value={f} onChange={e => setF(e.target.value)} style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${C.bdr}`, fontSize:13 }}>
      <option value="all">Todos</option><option value="customer">Clientes</option><option value="supplier">Proveedores</option><option value="consolidation">Consolidación</option>
    </select><Btn primary>+ Nuevo</Btn></Hdr>
    <Table cols={[{k:"name",l:"Nombre",r:v=><span style={{fontWeight:600}}>{v}</span>},{k:"type",l:"Tipo",r:v=><Badge status={v} />},{k:"cat",l:"Categoría"},{k:"phone",l:"Teléfono"},{k:"city",l:"Ciudad"},{k:"balance",l:"Balance",r:v=><span style={{fontWeight:600,color:v>0?C.err:v<0?C.pri:C.ok}}>${Math.abs(v).toLocaleString()}</span>}]} data={data} onClick={setSel} />
  </div>;
}

function MobileView() {
  const mob = useM();
  const screens = [
    { name:"Consulta de SKU", icon:"🔍", desc:"Escanee código de barras con Zebra para ver producto, stock, lote, ubicación y caducidad." },
    { name:"Recepción de Compras", icon:"📥", desc:"Escanee PO y productos al recibir. Validación automática contra orden. Multi-almacén." },
    { name:"Picking y Packing", icon:"📤", desc:"Ruta optimizada de picking. Impresión Bluetooth de etiquetas desde Zebra." },
    { name:"Toma Física", icon:"📋", desc:"Conteo cíclico o completo por almacén/zona. Ajustes automáticos al cerrar." },
    { name:"Transferencias", icon:"🔄", desc:"Mueva inventario entre los 5 almacenes. Escaneo origen y destino." },
    { name:"Devoluciones", icon:"↩️", desc:"Registre devolución con motivo y destino. Requiere autorización según reglas." },
    { name:"Contenedores", icon:"🏗️", desc:"Escanee contenedor, consulte yarda y contenido, reasigne yarda. Funciona offline." },
    { name:"Consolidación", icon:"🚢", desc:"Ingreso de mercancía de terceros. Visualmente diferenciado del inventario propio." },
    { name:"Alertas", icon:"⚠️", desc:"Notificaciones push: stock bajo, lote por caducar, autorización pendiente, embarque próximo." },
  ];
  return <div>
    <Hdr title="Aplicación Móvil" sub="Dispositivos Zebra · Escaneo de barras · Impresión Bluetooth · Modo Offline" />
    <Card style={{ marginBottom:20, background:"linear-gradient(135deg, #0F2B3C, #1B5E7B)", border:"none" }}>
      <div style={{ color:"#fff", display:"flex", alignItems:mob?"flex-start":"center", gap:20, flexDirection:mob?"column":"row" }}>
        <div style={{ fontSize:48 }}>📱</div>
        <div><h3 style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>App Nativa para Operaciones de Almacén</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>Aplicación Android optimizada para dispositivos Zebra con escaneo de códigos de barras e impresión Bluetooth de etiquetas. Soporte completo de operación sin conexión para yardas externas y zonas con conectividad limitada. Sincronización automática al recuperar señal.</p>
        </div>
      </div>
    </Card>
    <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr", gap:12 }}>
      {screens.map(s => <Card key={s.name}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:24 }}>{s.icon}</span><span style={{ fontSize:14, fontWeight:700, color:C.t1 }}>{s.name}</span>
        </div>
        <p style={{ fontSize:12, color:C.t2, lineHeight:1.5 }}>{s.desc}</p>
      </Card>)}
    </div>
    <Card style={{ marginTop:16 }}>
      <h4 style={{ fontSize:14, fontWeight:700, color:C.t1, marginBottom:12 }}>Cronograma de Entrega</h4>
      <div style={{ display:"flex", gap:0, flexWrap:"wrap" }}>
        {["Mes 1: Preparación","Mes 2: Desarrollo Base","Mes 3: Contenedores + Consolidación","Mes 4: ✅ GO-LIVE ODOO","Mes 5: App — Core","Mes 6: App — Avanzado","Mes 7: ✅ GO-LIVE MÓVIL"].map((m,i) => 
          <div key={i} style={{ flex:"1 1 120px", padding:"10px 12px", background:m.includes("✅")?"#D1FAE5":i<=3?"#DBEAFE":"#EDE9FE", borderRadius:8, margin:4, textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:m.includes("✅")?"#059669":i<=3?"#1D4ED8":"#5B21B6" }}>{m}</div>
          </div>)}
      </div>
    </Card>
  </div>;
}

function ProfileView() {
  const mob = useM();
  const perms = [{m:"Inventario",l:"Lectura / Escritura",i:"📦"},{m:"Compras",l:"Lectura / Escritura / Aprobación",i:"🛒"},{m:"Ventas",l:"Lectura / Escritura",i:"💰"},{m:"Facturación",l:"Lectura / Escritura",i:"🧾"},{m:"Contenedores",l:"Lectura / Escritura",i:"🏗️"},{m:"Consolidación",l:"Lectura / Escritura",i:"🚢"},{m:"Exportación",l:"Lectura / Escritura",i:"🌎"},{m:"Devoluciones",l:"Lectura / Escritura / Aprobación",i:"🔄"}];
  return <div>
    <h1 style={{ fontSize:24, fontWeight:700, color:C.t1, marginBottom:20 }}>Mi Perfil</h1>
    <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:20 }}>
      <Card>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${C.bdr}` }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg, ${C.pri}, ${C.priL})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:700 }}>CM</div>
          <div><div style={{ fontSize:18, fontWeight:700, color:C.t1 }}>Carlos Martínez</div><div style={{ fontSize:13, color:C.t2 }}>Gerente de Operaciones</div></div>
        </div>
        <Field l="Email" v="carlos.martinez@southfloridafoods.com" /><Field l="Ubicación" v="5900 NW 97 Ave, Doral, FL 33178" /><Field l="Departamento" v="Operaciones y Logística" />
      </Card>
      <Card>
        <h3 style={{ fontSize:13, fontWeight:700, color:C.t2, marginBottom:14, textTransform:"uppercase" }}>Permisos</h3>
        {perms.map((p,i) => <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:i<perms.length-1?`1px solid ${C.bdr}`:"none" }}>
          <span style={{ fontSize:13 }}>{p.i} {p.m}</span>
          <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:p.l.includes("Aprobación")?"#D1FAE5":"#DBEAFE", color:p.l.includes("Aprobación")?"#059669":"#1D4ED8" }}>{p.l}</span>
        </div>)}
      </Card>
    </div>
  </div>;
}

/* ─── TUTORIAL ─── */
function TutorialOverlay({ step, total, cur, onNext, onSkip }) {
  const mob = useM();
  useEffect(() => { const h = e => { if (e.key==="Escape") onSkip(); }; window.addEventListener("keydown",h); return () => window.removeEventListener("keydown",h); }, [onSkip]);
  if (!step) return null;
  return <div style={{ position:"fixed", inset:0, zIndex:10000 }}>
    <div onClick={onSkip} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)", cursor:"pointer" }} />
    <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fff", borderRadius:16, padding:mob?"20px":"28px 32px", maxWidth:mob?"calc(100vw - 32px)":440, minWidth:mob?280:340, zIndex:10002, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", animation:"fadeUp 0.35s ease-out" }}>
      <button onClick={onSkip} style={{ position:"absolute", top:12, right:12, width:28, height:28, borderRadius:"50%", border:"none", background:"transparent", color:C.t3, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div style={{ width:28, height:28, borderRadius:6, background:`linear-gradient(135deg, ${C.pri}, ${C.priL})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:800 }}>M</div>
        <span style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:"uppercase", letterSpacing:1 }}>Minari Solutions — Demo v2</span>
      </div>
      <h3 style={{ fontSize:20, fontWeight:700, color:C.t1, marginBottom:10 }}>{step.title}</h3>
      <p style={{ fontSize:14, lineHeight:1.65, color:C.t2, marginBottom:24 }}>{step.desc}</p>
      <div style={{ display:"flex", gap:4, marginBottom:18 }}>{Array.from({length:total}).map((_,i) => <div key={i} style={{ height:3, flex:1, borderRadius:2, background:i<=cur?C.pri:C.bdr }} />)}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={onSkip} style={{ background:"none", border:"none", color:C.t3, cursor:"pointer", fontSize:13 }}>Saltar</button>
        <button onClick={onNext} style={{ background:`linear-gradient(135deg, ${C.pri}, ${C.priL})`, color:"#fff", border:"none", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 12px rgba(27,94,123,0.3)" }}>
          {cur===total-1 ? "Comenzar ✨" : `Siguiente (${cur+1}/${total})`}
        </button>
      </div>
    </div>
  </div>;
}

/* ─── APP ─── */
export default function App() {
  const [mod, setMod] = useState("dashboard");
  const [rk, setRk] = useState(0);
  const [tStep, setTStep] = useState(0);
  const [tShow, setTShow] = useState(true);
  const [sbOpen, setSbOpen] = useState(false);
  const mob = useM();

  const nav = useCallback(id => { setMod(id); setRk(k=>k+1); setSbOpen(false); }, []);
  const startTut = useCallback(() => { setTStep(0); setTShow(true); setMod("dashboard"); setRk(k=>k+1); setSbOpen(false); }, []);
  const cur = tShow ? TUTORIAL[tStep] : null;

  useEffect(() => {
    if (!tShow || !cur) return;
    if (cur.nav) setMod(cur.nav);
  }, [tStep, tShow]);

  const nextStep = () => { if (tStep >= TUTORIAL.length-1) { setTShow(false); setMod("dashboard"); } else setTStep(tStep+1); };
  const skipTut = () => { setTShow(false); setMod("dashboard"); };

  const renderMod = () => {
    switch(mod) {
      case "dashboard": return <DashboardView key={rk} onNav={nav} />;
      case "inventory": return <InventoryView key={rk} />;
      case "containers": return <ContainersView key={rk} />;
      case "purchases": return <PurchasesView key={rk} />;
      case "sales": return <SalesView key={rk} />;
      case "invoicing": return <InvoicingView key={rk} />;
      case "consolidation": return <ConsolidationView key={rk} />;
      case "exports": return <ExportsView key={rk} />;
      case "returns": return <ReturnsView key={rk} />;
      case "contacts": return <ContactsView key={rk} />;
      case "mobile": return <MobileView key={rk} />;
      case "profile": return <ProfileView key={rk} />;
      default: return <DashboardView key={rk} onNav={nav} />;
    }
  };

  return <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans',-apple-system,sans-serif", background:C.bg, overflow:"hidden" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
    `}</style>

    {mob && sbOpen && <div onClick={() => setSbOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:998 }} />}

    {/* Sidebar */}
    <div id="sidebar" style={{ width:220, background:C.sb, display:"flex", flexDirection:"column", flexShrink:0, boxShadow:"2px 0 20px rgba(0,0,0,0.15)", zIndex:999, position:mob?"fixed":"relative", top:0, left:0, bottom:0, transform:mob&&!sbOpen?"translateX(-100%)":"translateX(0)", transition:"transform 0.25s ease" }}>
      <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:6, background:"linear-gradient(135deg, #E67E22, #F39C12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:800 }}>S</div>
          <div><div style={{ color:"#fff", fontSize:13, fontWeight:700, lineHeight:1.2 }}>South Florida Foods</div><div style={{ color:"rgba(255,255,255,0.45)", fontSize:10 }}>ERP · Odoo 19 CE · v2</div></div>
        </div>
      </div>
      <div style={{ padding:"8px 8px", flex:1, overflowY:"auto" }}>
        {MODULES.map(m => <button key={m.id} onClick={() => !tShow && nav(m.id)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", borderRadius:6, border:"none", cursor:tShow?"default":"pointer", background:mod===m.id?C.sbA:"transparent", color:mod===m.id?"#fff":"rgba(255,255,255,0.6)", fontSize:12, fontWeight:mod===m.id?600:500, transition:"all 0.15s", marginBottom:1, textAlign:"left" }}
          onMouseEnter={e => { if (mod!==m.id && !tShow) e.currentTarget.style.background=C.sbH; }} onMouseLeave={e => { if (mod!==m.id) e.currentTarget.style.background="transparent"; }}>
          <span style={{ fontSize:16 }}>{m.icon}</span>{m.label}
        </button>)}
      </div>
      <div onClick={() => !tShow && nav("profile")} style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.08)", cursor:tShow?"default":"pointer" }}
        onMouseEnter={e => { if (!tShow) e.currentTarget.style.background=C.sbH; }} onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, #2980B9, ${C.pri})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, border:mod==="profile"?"2px solid #fff":"2px solid transparent" }}>CM</div>
          <div><div style={{ color:"#fff", fontSize:11, fontWeight:600 }}>Carlos Martínez</div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:9 }}>Gerente de Operaciones</div></div>
        </div>
      </div>
      <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:6 }}>
        <div style={{ width:16, height:16, borderRadius:4, background:`linear-gradient(135deg, ${C.pri}, ${C.priL})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:8, fontWeight:800 }}>M</div>
        <span style={{ color:"rgba(255,255,255,0.35)", fontSize:9 }}>Powered by Minari Solutions</span>
      </div>
    </div>

    {/* Main */}
    <div style={{ flex:1, overflow:"auto", padding:mob?"16px":"24px 32px", position:"relative" }}>
      {mob && <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${C.bdr}` }}>
        <button onClick={() => setSbOpen(true)} style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:8, padding:"8px 10px", cursor:"pointer", fontSize:18, lineHeight:1, color:C.t1 }}>☰</button>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:24, height:24, borderRadius:4, background:"linear-gradient(135deg, #E67E22, #F39C12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800 }}>S</div>
          <span style={{ fontSize:12, fontWeight:700, color:C.t1 }}>SFF · ERP</span>
        </div>
        {!tShow ? <button onClick={startTut} style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:8, padding:"8px 10px", cursor:"pointer", fontSize:14, lineHeight:1, color:C.t2 }}>🎓</button> : <div style={{ width:38 }} />}
      </div>}
      {!tShow && !mob && <button onClick={startTut} style={{ position:"fixed", top:16, right:24, zIndex:100, display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, background:"#fff", border:`1px solid ${C.bdr}`, color:C.t2, fontSize:12, fontWeight:600, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}
        onMouseEnter={e => { e.currentTarget.style.background=C.pri; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=C.pri; }}
        onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color=C.t2; e.currentTarget.style.borderColor=C.bdr; }}>
        <span style={{ fontSize:14 }}>🎓</span> Tutorial
      </button>}
      {renderMod()}
    </div>

    {tShow && <TutorialOverlay step={cur} total={TUTORIAL.length} cur={tStep} onNext={nextStep} onSkip={skipTut} />}
  </div>;
}
