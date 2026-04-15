import { useState, useEffect, useCallback, useRef } from "react";

const COLORS = {
  primary: "#1B5E7B",
  primaryLight: "#2980B9",
  primaryDark: "#0D3B4F",
  accent: "#E67E22",
  accentLight: "#F39C12",
  success: "#27AE60",
  danger: "#E74C3C",
  warning: "#F1C40F",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#E2E8F0",
  textPrimary: "#1A202C",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  sidebar: "#0F2B3C",
  sidebarHover: "#163D54",
  sidebarActive: "#1B5E7B",
};

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "inventory", label: "Inventario", icon: "📦" },
  { id: "purchases", label: "Compras", icon: "🛒" },
  { id: "sales", label: "Ventas", icon: "💰" },
  { id: "invoicing", label: "Facturación", icon: "🧾" },
  { id: "returns", label: "Devoluciones", icon: "🔄" },
  { id: "contacts", label: "Contactos", icon: "👥" },
];

const PRODUCTS = [
  { id: 1, name: "Plátano Macho", sku: "PLT-001", category: "Frutas Tropicales", stock: 2450, min: 500, max: 5000, unit: "lb", cost: 0.45, price: 0.89, location: "A-01-03", barcode: "7501234567890", weight: "1 lb", supplier: "Tropical Farms Inc.", leadTime: 5 },
  { id: 2, name: "Yuca Fresca", sku: "YCA-002", category: "Raíces y Tubérculos", stock: 1800, min: 400, max: 4000, unit: "lb", cost: 0.35, price: 0.72, location: "A-02-01", barcode: "7501234567891", weight: "2 lb avg", supplier: "Caribbean Roots LLC", leadTime: 7 },
  { id: 3, name: "Queso Blanco Llanero", sku: "QBL-003", category: "Lácteos Latinos", stock: 320, min: 100, max: 800, unit: "unit", cost: 4.50, price: 8.99, location: "C-01-02", barcode: "7501234567892", weight: "12 oz", supplier: "Dairy del Sur", leadTime: 3 },
  { id: 4, name: "Harina P.A.N.", sku: "HPN-004", category: "Harinas y Granos", stock: 4200, min: 1000, max: 8000, unit: "unit", cost: 1.80, price: 3.49, location: "B-03-01", barcode: "7501234567893", weight: "2 lb", supplier: "Alimentos Polar USA", leadTime: 10 },
  { id: 5, name: "Frijoles Negros (lata)", sku: "FRN-005", category: "Enlatados", stock: 89, min: 200, max: 2000, unit: "unit", cost: 0.65, price: 1.29, location: "B-01-04", barcode: "7501234567894", weight: "15 oz", supplier: "Goya Foods", leadTime: 4, lowStock: true },
  { id: 6, name: "Chorizo Argentino", sku: "CHA-006", category: "Carnes y Embutidos", stock: 156, min: 100, max: 600, unit: "unit", cost: 3.20, price: 6.49, location: "C-02-01", barcode: "7501234567895", weight: "14 oz", supplier: "Pampa Meats", leadTime: 6 },
  { id: 7, name: "Aguacate Hass", sku: "AGH-007", category: "Frutas Tropicales", stock: 45, min: 200, max: 1500, unit: "unit", cost: 0.90, price: 1.79, location: "A-01-01", barcode: "7501234567896", weight: "8 oz avg", supplier: "Mission Produce", leadTime: 3, lowStock: true },
  { id: 8, name: "Salsa Valentina", sku: "SVL-008", category: "Salsas y Condimentos", stock: 3600, min: 500, max: 6000, unit: "unit", cost: 0.55, price: 1.19, location: "B-02-03", barcode: "7501234567897", weight: "12.5 oz", supplier: "Tamazula Inc.", leadTime: 8 },
];

const PURCHASE_ORDERS = [
  { id: "PO-2025-041", supplier: "Tropical Farms Inc.", date: "2025-08-05", status: "confirmed", total: 4500.00, items: 3, eta: "2025-08-10" },
  { id: "PO-2025-040", supplier: "Goya Foods", date: "2025-08-03", status: "received", total: 2800.00, items: 5, eta: "2025-08-07" },
  { id: "PO-2025-039", supplier: "Alimentos Polar USA", date: "2025-08-01", status: "draft", total: 7200.00, items: 2, eta: "2025-08-11" },
  { id: "PO-2025-038", supplier: "Mission Produce", date: "2025-07-30", status: "confirmed", total: 3150.00, items: 1, eta: "2025-08-02" },
  { id: "PO-2025-037", supplier: "Dairy del Sur", date: "2025-07-28", status: "received", total: 1890.00, items: 4, eta: "2025-08-01" },
];

const SALES_ORDERS = [
  { id: "SO-2025-112", customer: "Sedano's Supermarkets", date: "2025-08-08", status: "confirmed", total: 12450.00, items: 8, pricelist: "Mayorista A" },
  { id: "SO-2025-111", customer: "Fresco y Más", date: "2025-08-07", status: "invoiced", total: 8900.00, items: 5, pricelist: "Mayorista B" },
  { id: "SO-2025-110", customer: "El Bodegón Market", date: "2025-08-06", status: "draft", total: 3200.00, items: 3, pricelist: "Detallista" },
  { id: "SO-2025-109", customer: "Presidente Supermarket", date: "2025-08-05", status: "confirmed", total: 18750.00, items: 12, pricelist: "Mayorista A" },
  { id: "SO-2025-108", customer: "Bravo Supermarkets", date: "2025-08-04", status: "shipped", total: 6300.00, items: 6, pricelist: "Mayorista B" },
];

const INVOICES = [
  { id: "INV-2025-089", customer: "Sedano's Supermarkets", date: "2025-08-08", due: "2025-09-07", status: "open", total: 12450.00, paid: 0 },
  { id: "INV-2025-088", customer: "Fresco y Más", date: "2025-08-07", due: "2025-09-06", status: "partial", total: 8900.00, paid: 5000 },
  { id: "INV-2025-087", customer: "Presidente Supermarket", date: "2025-08-05", due: "2025-09-04", status: "paid", total: 18750.00, paid: 18750 },
  { id: "INV-2025-086", customer: "Bravo Supermarkets", date: "2025-08-04", due: "2025-09-03", status: "open", total: 6300.00, paid: 0 },
];

const CONTACTS = [
  { id: 1, name: "Sedano's Supermarkets", type: "customer", category: "Mayorista A", phone: "(305) 555-0101", email: "compras@sedanos.com", city: "Hialeah, FL", balance: 12450 },
  { id: 2, name: "Tropical Farms Inc.", type: "supplier", category: "Proveedor Premium", phone: "(786) 555-0202", email: "sales@tropicalfarms.com", city: "Homestead, FL", balance: -4500 },
  { id: 3, name: "Goya Foods", type: "supplier", category: "Proveedor Nacional", phone: "(201) 555-0303", email: "orders@goya.com", city: "Secaucus, NJ", balance: 0 },
  { id: 4, name: "Fresco y Más", type: "customer", category: "Mayorista B", phone: "(954) 555-0404", email: "purchasing@frescoymas.com", city: "Fort Lauderdale, FL", balance: 3900 },
  { id: 5, name: "Presidente Supermarket", type: "customer", category: "Mayorista A", phone: "(305) 555-0505", email: "orders@presidente.com", city: "Miami, FL", balance: 0 },
];

const TUTORIAL_STEPS = [
  {
    target: "welcome",
    title: "Bienvenido a su Sistema ERP",
    description: "Este es el sistema integral que Minari Solutions ha diseñado para South Florida Foods. Desde aquí podrá gestionar inventario, compras, ventas, facturación y más — todo conectado en tiempo real.",
    position: "center",
  },
  {
    target: "sidebar",
    title: "Navegación por Módulos",
    description: "Acceda a cada área de su negocio desde este menú lateral. Los módulos están integrados entre sí: una venta actualiza inventario, genera factura y sincroniza con QuickBooks automáticamente.",
    position: "right",
  },
  {
    target: "dashboard-kpis",
    title: "KPIs en Tiempo Real",
    description: "Monitoree las métricas más importantes de su operación de un vistazo: ventas del mes, inventario valorizado, órdenes pendientes y cuentas por cobrar.",
    position: "bottom",
  },
  {
    target: "dashboard-alerts",
    title: "Alertas Automatizadas",
    description: "El sistema le notifica automáticamente sobre productos con bajo stock, lotes próximos a caducar y órdenes que requieren atención. Usted define los umbrales.",
    position: "bottom",
  },
  {
    target: "module-inventory",
    title: "Gestión de Inventario",
    description: "Control completo de productos con atributos, categorías, ubicaciones de bodega, lectura de código de barras con equipos Zebra y reabastecimiento automático basado en mínimos/máximos.",
    position: "right",
    navigateTo: "inventory",
  },
  {
    target: "module-sales",
    title: "Ventas y Control de Precios",
    description: "Listas de precios por categoría de cliente, cotizaciones automáticas por email, descuentos configurables y reserva automática de stock al confirmar la venta.",
    position: "right",
    navigateTo: "sales",
  },
  {
    target: "module-invoicing",
    title: "Facturación Integrada",
    description: "Facture directamente desde ventas, registre pagos parciales, emita notas de crédito y genere reportes financieros. Todo sincronizado con QuickBooks para su contabilidad.",
    position: "right",
    navigateTo: "invoicing",
  },
  {
    target: "done",
    title: "¡Listo para Explorar!",
    description: "Ahora tiene acceso completo al demo. Haga clic en cualquier módulo, producto u orden para ver los detalles. Este es el sistema que transformará las operaciones de South Florida Foods.",
    position: "center",
    navigateTo: "dashboard",
  },
];

function StatusBadge({ status }) {
  const map = {
    confirmed: { bg: "#DBEAFE", color: "#1D4ED8", label: "Confirmado" },
    received: { bg: "#D1FAE5", color: "#059669", label: "Recibido" },
    draft: { bg: "#F1F5F9", color: "#64748B", label: "Borrador" },
    invoiced: { bg: "#EDE9FE", color: "#7C3AED", label: "Facturado" },
    shipped: { bg: "#FEF3C7", color: "#D97706", label: "Enviado" },
    open: { bg: "#FEE2E2", color: "#DC2626", label: "Pendiente" },
    partial: { bg: "#FEF3C7", color: "#D97706", label: "Pago Parcial" },
    paid: { bg: "#D1FAE5", color: "#059669", label: "Pagada" },
    customer: { bg: "#DBEAFE", color: "#1D4ED8", label: "Cliente" },
    supplier: { bg: "#FEF3C7", color: "#D97706", label: "Proveedor" },
  };
  const s = map[status] || { bg: "#F1F5F9", color: "#64748B", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function KpiCard({ icon, label, value, sub, color, id }) {
  return (
    <div id={id} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: `1px solid ${COLORS.border}`, flex: "1 1 220px", minWidth: 200, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DataTable({ columns, data, onRowClick }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: COLORS.surfaceAlt }}>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: COLORS.textSecondary, borderBottom: `1px solid ${COLORS.border}`, whiteSpace: "nowrap", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? "pointer" : "default", borderBottom: `1px solid ${COLORS.border}`, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "10px 14px", color: COLORS.textPrimary }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailPanel({ title, onBack, children }) {
  return (
    <div style={{ animation: "slideIn 0.25s ease-out" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COLORS.primaryLight, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16, padding: 0 }}>
        ← Volver
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>
      {children}
    </div>
  );
}

function FieldGroup({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

/* ─── TUTORIAL OVERLAY ─── */
function TutorialOverlay({ step, total, current, onNext, onSkip, targetRect }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onSkip(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onSkip]);

  if (!step) return null;

  const isCenter = step.position === "center" || !targetRect;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000 }}>
      {/* dark overlay - click to close */}
      <div onClick={onSkip} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", transition: "all 0.4s ease", cursor: "pointer" }} />

      {/* highlight cutout */}
      {targetRect && !isCenter && (
        <div style={{
          position: "absolute",
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          borderRadius: 12,
          boxShadow: "0 0 0 4000px rgba(0,0,0,0.72), 0 0 30px rgba(27,94,123,0.5)",
          background: "transparent",
          zIndex: 10001,
          pointerEvents: "none",
          transition: "all 0.4s ease",
        }} />
      )}

      {/* tooltip card */}
      <div style={{
        position: "absolute",
        ...(isCenter ? {
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        } : step.position === "right" ? {
          top: targetRect.top, left: targetRect.right + 20,
        } : step.position === "bottom" ? {
          top: targetRect.bottom + 16, left: targetRect.left,
        } : step.position === "left" ? {
          top: targetRect.top, right: window.innerWidth - targetRect.left + 20,
        } : {}),
        background: "#fff",
        borderRadius: 16,
        padding: "28px 32px",
        maxWidth: 420,
        minWidth: 320,
        zIndex: 10002,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "fadeUp 0.35s ease-out",
      }}>
        {/* X close button */}
        <button onClick={onSkip} style={{
          position: "absolute", top: 12, right: 12, width: 28, height: 28,
          borderRadius: "50%", border: "none", background: "transparent",
          color: COLORS.textMuted, fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.border; e.currentTarget.style.color = COLORS.textPrimary; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textMuted; }}
        >✕</button>

        {/* Minari badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800 }}>M</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Minari Solutions — Demo Guiado</span>
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: COLORS.textSecondary, marginBottom: 24 }}>{step.description}</p>

        {/* progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= current ? COLORS.primary : COLORS.border, transition: "background 0.3s" }} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onSkip} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 13, padding: "6px 0" }}>
            Saltar tutorial
          </button>
          <button onClick={onNext} style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(27,94,123,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 16px rgba(27,94,123,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(27,94,123,0.3)"; }}
          >
            {current === total - 1 ? "Comenzar ✨" : `Siguiente (${current + 1}/${total})`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODULE VIEWS ─── */

function DashboardView({ onNavigate }) {
  const lowStockProducts = PRODUCTS.filter(p => p.lowStock || p.stock < p.min);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Dashboard</h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>South Florida Foods Int'l Inc — Vista General</p>
      </div>

      <div id="dashboard-kpis" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KpiCard icon="💵" label="Ventas del Mes" value="$49,600" sub="+12.3% vs mes anterior" color={COLORS.success} />
        <KpiCard icon="📦" label="Inventario Valorizado" value="$128,450" sub="8 productos activos" color={COLORS.primary} />
        <KpiCard icon="🛒" label="Órdenes Pendientes" value="3" sub="2 confirmadas, 1 borrador" color={COLORS.accent} />
        <KpiCard icon="📋" label="Cuentas por Cobrar" value="$16,350" sub="4 facturas abiertas" color={COLORS.danger} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Sales */}
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Ventas Recientes</h3>
            <button onClick={() => onNavigate("sales")} style={{ background: "none", border: "none", color: COLORS.primaryLight, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Ver todas →</button>
          </div>
          {SALES_ORDERS.slice(0, 4).map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{o.customer}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{o.id} · {o.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>${o.total.toLocaleString()}</div>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div id="dashboard-alerts" style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 14 }}>⚠️ Alertas del Sistema</h3>
          {lowStockProducts.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8, background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA" }}>
              <span style={{ fontSize: 20 }}>📉</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B" }}>Bajo Stock: {p.name}</div>
                <div style={{ fontSize: 11, color: "#DC2626" }}>Actual: {p.stock} {p.unit} · Mínimo: {p.min} {p.unit}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8, background: "#FEF3C7", borderRadius: 8, border: "1px solid #FDE68A" }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>Lote próximo a caducar</div>
              <div style={{ fontSize: 11, color: "#D97706" }}>Queso Blanco Llanero — Lote QBL-L042 vence 2025-08-25</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#DBEAFE", borderRadius: 8, border: "1px solid #BFDBFE" }}>
            <span style={{ fontSize: 20 }}>🔄</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF" }}>Sincronización QuickBooks</div>
              <div style={{ fontSize: 11, color: "#2563EB" }}>Última sincronización: Hace 15 min — 3 movimientos exportados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryView() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "low" ? PRODUCTS.filter(p => p.stock < p.min) : filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  if (selected) {
    const p = selected;
    const stockPct = Math.min(100, Math.round((p.stock / p.max) * 100));
    const stockColor = p.stock < p.min ? COLORS.danger : p.stock < p.min * 1.5 ? COLORS.warning : COLORS.success;
    return (
      <DetailPanel title={p.name} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Información del Producto</h4>
            <FieldGroup label="SKU" value={p.sku} />
            <FieldGroup label="Código de Barras" value={p.barcode} />
            <FieldGroup label="Categoría" value={p.category} />
            <FieldGroup label="Ubicación en Bodega" value={p.location} />
            <FieldGroup label="Peso" value={p.weight} />
            <FieldGroup label="Unidad de Manejo" value={p.unit} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Stock y Reabastecimiento</h4>
            <FieldGroup label="Stock Actual" value={`${p.stock.toLocaleString()} ${p.unit}`} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
                <span>Mín: {p.min}</span><span>Máx: {p.max}</span>
              </div>
              <div style={{ height: 10, background: COLORS.border, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${stockPct}%`, background: stockColor, borderRadius: 5, transition: "width 0.5s" }} />
              </div>
            </div>
            <FieldGroup label="Proveedor Principal" value={p.supplier} />
            <FieldGroup label="Lead Time" value={`${p.leadTime} días`} />
            <FieldGroup label="Costo Unitario" value={`$${p.cost.toFixed(2)}`} />
            <FieldGroup label="Precio de Venta" value={`$${p.price.toFixed(2)}`} />
            <FieldGroup label="Margen" value={`${Math.round(((p.price - p.cost) / p.price) * 100)}%`} />
          </div>
        </div>
        <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Últimos Movimientos</h4>
          <DataTable
            columns={[
              { key: "date", label: "Fecha" },
              { key: "type", label: "Tipo", render: (v) => <StatusBadge status={v === "Entrada" ? "received" : "shipped"} /> },
              { key: "qty", label: "Cantidad" },
              { key: "ref", label: "Referencia" },
              { key: "user", label: "Usuario" },
            ]}
            data={[
              { date: "2025-08-08", type: "Entrada", qty: `+500 ${p.unit}`, ref: "PO-2025-041", user: "Carlos M." },
              { date: "2025-08-06", type: "Salida", qty: `-120 ${p.unit}`, ref: "SO-2025-112", user: "Ana R." },
              { date: "2025-08-04", type: "Salida", qty: `-80 ${p.unit}`, ref: "SO-2025-109", user: "Carlos M." },
              { date: "2025-08-01", type: "Entrada", qty: `+300 ${p.unit}`, ref: "PO-2025-037", user: "Sistema" },
            ]}
          />
        </div>
      </DetailPanel>
    );
  }

  return (
    <div id="module-inventory">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Inventario</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{PRODUCTS.length} productos · Bodega Doral 5900 NW 97 Ave</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textPrimary, background: "#fff" }}>
            <option value="all">Todas las categorías</option>
            <option value="low">⚠️ Bajo Stock</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nuevo Producto</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: "sku", label: "SKU" },
          { key: "name", label: "Producto", render: (v, r) => <span style={{ fontWeight: 600 }}>{v} {r.lowStock ? "⚠️" : ""}</span> },
          { key: "category", label: "Categoría" },
          { key: "stock", label: "Stock", render: (v, r) => <span style={{ color: v < r.min ? COLORS.danger : COLORS.textPrimary, fontWeight: 600 }}>{v.toLocaleString()} {r.unit}</span> },
          { key: "location", label: "Ubicación" },
          { key: "price", label: "Precio", render: (v) => `$${v.toFixed(2)}` },
          { key: "supplier", label: "Proveedor" },
        ]}
        data={filtered}
        onRowClick={setSelected}
      />
    </div>
  );
}

function PurchasesView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const o = selected;
    return (
      <DetailPanel title={`Orden de Compra ${o.id}`} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Datos de la Orden</h4>
            <FieldGroup label="Proveedor" value={o.supplier} />
            <FieldGroup label="Fecha de Orden" value={o.date} />
            <FieldGroup label="Fecha Estimada Entrega" value={o.eta} />
            <FieldGroup label="Estado" value={<StatusBadge status={o.status} />} />
            <FieldGroup label="Total" value={`$${o.total.toLocaleString()}`} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Acciones</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {o.status === "draft" && <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.success, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Confirmar Orden</button>}
              {o.status === "confirmed" && <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📦 Recibir Mercancía</button>}
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ Imprimir Orden</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✉️ Enviar al Proveedor</button>
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 12, textTransform: "uppercase" }}>Líneas de la Orden</h4>
          <DataTable
            columns={[
              { key: "product", label: "Producto" },
              { key: "qty", label: "Cantidad" },
              { key: "unit_price", label: "Precio Unitario" },
              { key: "subtotal", label: "Subtotal" },
            ]}
            data={[
              { product: "Plátano Macho", qty: "3,000 lb", unit_price: "$0.45", subtotal: "$1,350.00" },
              { product: "Aguacate Hass", qty: "2,000 unit", unit_price: "$0.90", subtotal: "$1,800.00" },
              { product: "Yuca Fresca", qty: "1,500 lb", unit_price: "$0.35", subtotal: "$525.00" },
            ]}
          />
        </div>
      </DetailPanel>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Compras</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>Órdenes de compra a proveedores</p>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nueva Orden</button>
      </div>
      <DataTable
        columns={[
          { key: "id", label: "Orden", render: (v) => <span style={{ fontWeight: 600, color: COLORS.primaryLight }}>{v}</span> },
          { key: "supplier", label: "Proveedor" },
          { key: "date", label: "Fecha" },
          { key: "eta", label: "Entrega Est." },
          { key: "items", label: "Líneas" },
          { key: "total", label: "Total", render: (v) => <span style={{ fontWeight: 700 }}>${v.toLocaleString()}</span> },
          { key: "status", label: "Estado", render: (v) => <StatusBadge status={v} /> },
        ]}
        data={PURCHASE_ORDERS}
        onRowClick={setSelected}
      />
    </div>
  );
}

function SalesView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const o = selected;
    return (
      <DetailPanel title={`Pedido ${o.id}`} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Datos del Pedido</h4>
            <FieldGroup label="Cliente" value={o.customer} />
            <FieldGroup label="Lista de Precios" value={o.pricelist} />
            <FieldGroup label="Fecha" value={o.date} />
            <FieldGroup label="Estado" value={<StatusBadge status={o.status} />} />
            <FieldGroup label="Total" value={`$${o.total.toLocaleString()}`} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Acciones</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {o.status === "draft" && <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.success, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Confirmar Pedido</button>}
              {o.status === "confirmed" && <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🧾 Crear Factura</button>}
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✉️ Enviar Cotización por Email</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ Imprimir</button>
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 12, textTransform: "uppercase" }}>Líneas del Pedido</h4>
          <DataTable
            columns={[
              { key: "product", label: "Producto" },
              { key: "qty", label: "Cantidad" },
              { key: "unit_price", label: "P. Unitario" },
              { key: "discount", label: "Descuento" },
              { key: "subtotal", label: "Subtotal" },
            ]}
            data={[
              { product: "Harina P.A.N.", qty: "500 unit", unit_price: "$3.15", discount: "10%", subtotal: "$1,417.50" },
              { product: "Frijoles Negros (lata)", qty: "1,000 unit", unit_price: "$1.15", discount: "5%", subtotal: "$1,092.50" },
              { product: "Salsa Valentina", qty: "800 unit", unit_price: "$1.05", discount: "12%", subtotal: "$739.20" },
            ]}
          />
        </div>
      </DetailPanel>
    );
  }

  return (
    <div id="module-sales">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Ventas</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>Pedidos y cotizaciones</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Listas de Precios</button>
          <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nueva Cotización</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: "id", label: "Pedido", render: (v) => <span style={{ fontWeight: 600, color: COLORS.primaryLight }}>{v}</span> },
          { key: "customer", label: "Cliente" },
          { key: "pricelist", label: "Lista de Precios" },
          { key: "date", label: "Fecha" },
          { key: "items", label: "Líneas" },
          { key: "total", label: "Total", render: (v) => <span style={{ fontWeight: 700 }}>${v.toLocaleString()}</span> },
          { key: "status", label: "Estado", render: (v) => <StatusBadge status={v} /> },
        ]}
        data={SALES_ORDERS}
        onRowClick={setSelected}
      />
    </div>
  );
}

function InvoicingView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const inv = selected;
    const paidPct = Math.round((inv.paid / inv.total) * 100);
    return (
      <DetailPanel title={`Factura ${inv.id}`} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Datos de Factura</h4>
            <FieldGroup label="Cliente" value={inv.customer} />
            <FieldGroup label="Fecha de Emisión" value={inv.date} />
            <FieldGroup label="Fecha de Vencimiento" value={inv.due} />
            <FieldGroup label="Estado" value={<StatusBadge status={inv.status} />} />
            <FieldGroup label="Total" value={`$${inv.total.toLocaleString()}`} />
            <FieldGroup label="Pagado" value={`$${inv.paid.toLocaleString()}`} />
            <FieldGroup label="Saldo Pendiente" value={`$${(inv.total - inv.paid).toLocaleString()}`} />
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Progreso de Pago</div>
              <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${paidPct}%`, background: paidPct === 100 ? COLORS.success : COLORS.accent, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3, textAlign: "right" }}>{paidPct}%</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Acciones</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inv.status !== "paid" && <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.success, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>💳 Registrar Pago</button>}
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📄 Nota de Crédito</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✉️ Enviar Factura por Email</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🔄 Exportar a QuickBooks</button>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: "#DBEAFE", borderRadius: 8, border: "1px solid #BFDBFE" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1E40AF" }}>📘 QuickBooks</div>
              <div style={{ fontSize: 11, color: "#2563EB", marginTop: 2 }}>Sincronización automática activada. Último sync: 2025-08-08 14:30</div>
            </div>
          </div>
        </div>
      </DetailPanel>
    );
  }

  return (
    <div id="module-invoicing">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Facturación</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>Facturas, pagos y sincronización con QuickBooks</p>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nueva Factura</button>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <KpiCard icon="📋" label="Facturas Abiertas" value="2" sub="$18,750 pendiente" color={COLORS.danger} />
        <KpiCard icon="⏳" label="Pago Parcial" value="1" sub="$3,900 restante" color={COLORS.warning} />
        <KpiCard icon="✅" label="Pagadas (mes)" value="1" sub="$18,750 cobrado" color={COLORS.success} />
      </div>
      <DataTable
        columns={[
          { key: "id", label: "Factura", render: (v) => <span style={{ fontWeight: 600, color: COLORS.primaryLight }}>{v}</span> },
          { key: "customer", label: "Cliente" },
          { key: "date", label: "Emisión" },
          { key: "due", label: "Vencimiento" },
          { key: "total", label: "Total", render: (v) => <span style={{ fontWeight: 700 }}>${v.toLocaleString()}</span> },
          { key: "paid", label: "Pagado", render: (v) => `$${v.toLocaleString()}` },
          { key: "status", label: "Estado", render: (v) => <StatusBadge status={v} /> },
        ]}
        data={INVOICES}
        onRowClick={setSelected}
      />
    </div>
  );
}

function ReturnsView() {
  const [selected, setSelected] = useState(null);
  const returns = [
    { id: "DEV-2025-008", customer: "Sedano's Supermarkets", date: "2025-08-07", reason: "Producto dañado", product: "Queso Blanco Llanero", qty: "15 unit", status: "confirmed", action: "Devolución a proveedor" },
    { id: "DEV-2025-007", customer: "Fresco y Más", date: "2025-08-05", reason: "Error en pedido", product: "Harina P.A.N.", qty: "50 unit", status: "received", action: "Reintegrado a inventario" },
    { id: "DEV-2025-006", customer: "El Bodegón Market", date: "2025-08-03", reason: "Producto caducado", product: "Chorizo Argentino", qty: "8 unit", status: "confirmed", action: "Destrucción" },
  ];

  if (selected) {
    return (
      <DetailPanel title={`Devolución ${selected.id}`} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Datos de la Devolución</h4>
            <FieldGroup label="Cliente" value={selected.customer} />
            <FieldGroup label="Producto" value={selected.product} />
            <FieldGroup label="Cantidad" value={selected.qty} />
            <FieldGroup label="Motivo" value={selected.reason} />
            <FieldGroup label="Acción" value={selected.action} />
            <FieldGroup label="Estado" value={<StatusBadge status={selected.status} />} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Acciones</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📄 Generar Nota de Crédito</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🔄 Devolver a Proveedor</button>
              <button style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ Imprimir Orden</button>
            </div>
          </div>
        </div>
      </DetailPanel>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Devoluciones</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>Gestión de devoluciones de clientes</p>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nueva Devolución</button>
      </div>
      <DataTable
        columns={[
          { key: "id", label: "Devolución", render: (v) => <span style={{ fontWeight: 600, color: COLORS.primaryLight }}>{v}</span> },
          { key: "customer", label: "Cliente" },
          { key: "product", label: "Producto" },
          { key: "qty", label: "Cantidad" },
          { key: "reason", label: "Motivo" },
          { key: "action", label: "Acción" },
          { key: "status", label: "Estado", render: (v) => <StatusBadge status={v} /> },
        ]}
        data={returns}
        onRowClick={setSelected}
      />
    </div>
  );
}

function ContactsView() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? CONTACTS : CONTACTS.filter(c => c.type === filter);

  if (selected) {
    return (
      <DetailPanel title={selected.name} onBack={() => setSelected(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Información de Contacto</h4>
            <FieldGroup label="Tipo" value={<StatusBadge status={selected.type} />} />
            <FieldGroup label="Categoría" value={selected.category} />
            <FieldGroup label="Teléfono" value={selected.phone} />
            <FieldGroup label="Email" value={selected.email} />
            <FieldGroup label="Ciudad" value={selected.city} />
            <FieldGroup label="Balance" value={<span style={{ color: selected.balance > 0 ? COLORS.danger : selected.balance < 0 ? COLORS.primary : COLORS.success, fontWeight: 700 }}>${Math.abs(selected.balance).toLocaleString()} {selected.balance > 0 ? "(nos debe)" : selected.balance < 0 ? "(le debemos)" : "(saldado)"}</span>} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 16, textTransform: "uppercase" }}>Historial Reciente</h4>
            {selected.type === "customer" ? (
              <>
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>📄 SO-2025-112 — $12,450 (Confirmado)</div>
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>🧾 INV-2025-089 — $12,450 (Pendiente)</div>
                <div style={{ padding: "8px 0", fontSize: 13 }}>🔄 DEV-2025-008 — 15 unit Queso Blanco</div>
              </>
            ) : (
              <>
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>🛒 PO-2025-041 — $4,500 (Confirmado)</div>
                <div style={{ padding: "8px 0", fontSize: 13 }}>📦 Entrega estimada: 2025-08-10</div>
              </>
            )}
          </div>
        </div>
      </DetailPanel>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Contactos</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>Clientes y proveedores</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13 }}>
            <option value="all">Todos</option>
            <option value="customer">Clientes</option>
            <option value="supplier">Proveedores</option>
          </select>
          <button style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.primary, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nuevo Contacto</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: "name", label: "Nombre", render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
          { key: "type", label: "Tipo", render: (v) => <StatusBadge status={v} /> },
          { key: "category", label: "Categoría" },
          { key: "phone", label: "Teléfono" },
          { key: "city", label: "Ciudad" },
          { key: "balance", label: "Balance", render: (v) => <span style={{ fontWeight: 600, color: v > 0 ? COLORS.danger : v < 0 ? COLORS.primary : COLORS.success }}>${Math.abs(v).toLocaleString()}</span> },
        ]}
        data={filtered}
        onRowClick={setSelected}
      />
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [targetRect, setTargetRect] = useState(null);
  const sidebarRef = useRef(null);

  const currentStep = showTutorial ? TUTORIAL_STEPS[tutorialStep] : null;

  useEffect(() => {
    if (!showTutorial || !currentStep) return;
    if (currentStep.navigateTo) setActiveModule(currentStep.navigateTo);

    const timer = setTimeout(() => {
      const targetId = currentStep.target;
      let el = null;
      if (targetId === "sidebar") el = sidebarRef.current;
      else if (targetId !== "welcome" && targetId !== "done") el = document.getElementById(targetId);

      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tutorialStep, showTutorial, activeModule]);

  const handleNextStep = () => {
    if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
      setShowTutorial(false);
      setActiveModule("dashboard");
    } else {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setActiveModule("dashboard");
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <DashboardView onNavigate={setActiveModule} />;
      case "inventory": return <InventoryView />;
      case "purchases": return <PurchasesView />;
      case "sales": return <SalesView />;
      case "invoicing": return <InvoicingView />;
      case "returns": return <ReturnsView />;
      case "contacts": return <ContactsView />;
      default: return <DashboardView onNavigate={setActiveModule} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", background: COLORS.surfaceAlt, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <div ref={sidebarRef} id="sidebar" style={{
        width: 240, background: COLORS.sidebar, display: "flex", flexDirection: "column", flexShrink: 0,
        boxShadow: "2px 0 20px rgba(0,0,0,0.15)", zIndex: showTutorial && currentStep?.target === "sidebar" ? 10003 : 1,
        position: "relative"
      }}>
        {/* Logo area */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #E67E22, #F39C12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 800 }}>S</div>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>South Florida Foods</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>ERP · Odoo 19 CE</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ padding: "12px 10px", flex: 1 }}>
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => !showTutorial && setActiveModule(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: showTutorial ? "default" : "pointer",
                background: activeModule === m.id ? COLORS.sidebarActive : "transparent",
                color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.65)",
                fontSize: 13, fontWeight: activeModule === m.id ? 600 : 500,
                transition: "all 0.15s", marginBottom: 2, textAlign: "left",
              }}
              onMouseEnter={(e) => { if (activeModule !== m.id && !showTutorial) e.currentTarget.style.background = COLORS.sidebarHover; }}
              onMouseLeave={(e) => { if (activeModule !== m.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* User area */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2980B9, #1B5E7B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>CM</div>
            <div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Carlos Martínez</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Gerente de Operaciones</div>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: "linear-gradient(135deg, #1B5E7B, #2980B9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800 }}>M</div>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>Powered by Minari Solutions</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {renderModule()}
      </div>

      {/* Tutorial overlay */}
      {showTutorial && (
        <TutorialOverlay
          step={currentStep}
          total={TUTORIAL_STEPS.length}
          current={tutorialStep}
          onNext={handleNextStep}
          onSkip={handleSkipTutorial}
          targetRect={targetRect}
        />
      )}
    </div>
  );
}
