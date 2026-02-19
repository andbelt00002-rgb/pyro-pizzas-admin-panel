import { useState } from "react";
import { BarChart3, Pizza, CreditCard, Truck, Users, Package, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "vendas", title: "Vendas por Período", icon: BarChart3, emoji: "📊" },
  { id: "produtos", title: "Produtos Mais Vendidos", icon: Pizza, emoji: "🍕" },
  { id: "pagamento", title: "Faturamento por Forma de Pagamento", icon: CreditCard, emoji: "💳" },
  { id: "entregadores", title: "Performance de Entregadores", icon: Truck, emoji: "🛵" },
  { id: "clientes", title: "Relatório de Clientes", icon: Users, emoji: "👥" },
  { id: "estoque", title: "Relatório de Estoque", icon: Package, emoji: "📦" },
];

const sampleData: Record<string, { headers: string[]; rows: string[][] }> = {
  vendas: {
    headers: ["Período", "Qtd Pedidos", "Faturamento"],
    rows: [["19/02/2025", "23", "R$ 2.840"], ["18/02/2025", "28", "R$ 3.120"], ["17/02/2025", "20", "R$ 2.560"]],
  },
  produtos: {
    headers: ["Produto", "Quantidade", "Receita"],
    rows: [["Pepperoni", "45", "R$ 2.340"], ["Margherita", "38", "R$ 1.596"], ["Quatro Queijos", "32", "R$ 1.600"]],
  },
  pagamento: {
    headers: ["Forma", "Transações", "Valor Total"],
    rows: [["PIX", "89", "R$ 6.520"], ["Cartão Crédito", "62", "R$ 5.180"], ["Dinheiro", "34", "R$ 2.450"], ["Cartão Débito", "28", "R$ 1.980"]],
  },
  entregadores: {
    headers: ["Entregador", "Entregas", "Tempo Médio", "Avaliação"],
    rows: [["Roberto Lima", "12", "28 min", "4.8 ⭐"], ["Diego Ferraz", "9", "32 min", "4.6 ⭐"]],
  },
  clientes: {
    headers: ["Classificação", "Quantidade", "Ticket Médio"],
    rows: [["VIP", "3", "R$ 103"], ["Regular", "6", "R$ 78"], ["Novo", "4", "R$ 62"], ["Inativo", "2", "R$ 54"]],
  },
  estoque: {
    headers: ["Item", "Status", "Qtd Atual", "Qtd Mín"],
    rows: [["Mussarela", "🔴 Crítico", "8 kg", "10 kg"], ["Calabresa", "🔴 Crítico", "3 kg", "5 kg"], ["Catupiry", "🔴 Crítico", "2 kg", "4 kg"]],
  },
};

export default function Relatorios() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(active === r.id ? null : r.id)}
            className={`card-hover flex items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 ${
              active === r.id ? "border-primary bg-accent" : "border-border bg-card"
            }`}
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className="text-sm font-semibold text-foreground">{r.title}</span>
          </button>
        ))}
      </div>

      {active && sampleData[active] && (
        <div className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">{reports.find((r) => r.id === active)?.title}</h2>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              <Download className="mr-1.5 h-3 w-3" /> Exportar CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {sampleData[active].headers.map((h) => (
                    <th key={h} className="pb-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData[active].rows.map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                    {row.map((cell, j) => (
                      <td key={j} className="py-2.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
