import {
  ShoppingCart, DollarSign, Pizza, Clock, AlertTriangle,
  TrendingUp, TrendingDown, Package,
} from "lucide-react";
import { orders, stockItems } from "@/data/mockData";

const metrics = [
  { label: "Pedidos Hoje", value: "23", change: "+12%", up: true, icon: ShoppingCart },
  { label: "Faturamento do Dia", value: "R$ 2.840", change: "+8%", up: true, icon: DollarSign },
  { label: "Pizzas Produzidas", value: "31", change: "-3%", up: false, icon: Pizza },
  { label: "Tempo Médio Entrega", value: "28 min", change: "-5%", up: true, icon: Clock },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Aguardando: "badge-info",
    "Em Preparo": "badge-warning",
    "Saiu p/ Entrega": "badge-info",
    Entregue: "badge-success",
    Cancelado: "badge-danger",
  };
  return map[status] || "badge-neutral";
};

export default function Dashboard() {
  const recentOrders = orders.slice(0, 5);
  const lowStock = stockItems.filter((s) => s.currentQty < s.minQty);
  const topPizzas = [
    { name: "Pepperoni", qty: 8 },
    { name: "Margherita", qty: 6 },
    { name: "Quatro Queijos", qty: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <m.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{m.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {m.up ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={m.up ? "text-emerald-600" : "text-red-500"}>{m.change} vs ontem</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">Pedidos Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium">Itens</th>
                  <th className="pb-2 font-medium">Valor</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o.id} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                    <td className="py-2.5 font-medium">{o.number}</td>
                    <td className="py-2.5">{o.customerName}</td>
                    <td className="py-2.5 text-muted-foreground">{o.items.map((it) => it.name).join(", ")}</td>
                    <td className="py-2.5 font-medium">R$ {o.total}</td>
                    <td className="py-2.5">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge(o.status)}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top sellers */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">🏆 Mais Vendidos Hoje</h2>
            <div className="space-y-3">
              {topPizzas.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{p.qty} un</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Alertas
            </h2>
            <div className="space-y-2">
              {lowStock.map((s) => (
                <div key={s.id} className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  <Package className="h-4 w-4" />
                  <span><strong>{s.name}</strong> — estoque baixo ({s.currentQty} {s.unit})</span>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
                <Clock className="h-4 w-4" />
                <span>Mesa 5 ocupada há mais de 2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
