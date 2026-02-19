import { useState } from "react";
import { Plus, DollarSign, TrendingDown, TrendingUp, Receipt } from "lucide-react";
import { financialEntries, weeklyRevenue } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const totalReceita = financialEntries.filter((e) => e.type === "Receita").reduce((s, e) => s + e.value, 0);
const totalDespesa = financialEntries.filter((e) => e.type === "Despesa").reduce((s, e) => s + e.value, 0);

const summaryCards = [
  { label: "Receita do Mês", value: `R$ ${totalReceita.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600" },
  { label: "Despesas do Mês", value: `R$ ${totalDespesa.toLocaleString()}`, icon: TrendingDown, color: "text-red-500" },
  { label: "Lucro Estimado", value: `R$ ${(totalReceita - totalDespesa).toLocaleString()}`, icon: DollarSign, color: "text-blue-600" },
  { label: "Ticket Médio", value: "R$ 74", icon: Receipt, color: "text-amber-600" },
];

export default function Financeiro() {
  const [showForm, setShowForm] = useState(false);
  const [caixaAberto, setCaixaAberto] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="rounded-xl" onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Registrar Lançamento
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Daily cash */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Caixa do Dia</h2>
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${caixaAberto ? "badge-success" : "badge-danger"}`}>
              {caixaAberto ? "Aberto" : "Fechado"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setCaixaAberto(!caixaAberto)}>
              {caixaAberto ? "Fechar Caixa" : "Abrir Caixa"}
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">Sangria</Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">Suprimento</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Abertura</p><p className="font-bold">R$ 200</p></div>
          <div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-emerald-600">Entradas</p><p className="font-bold text-emerald-700">R$ 2.840</p></div>
          <div className="rounded-xl bg-red-50 p-3"><p className="text-xs text-red-600">Saídas</p><p className="font-bold text-red-700">R$ 680</p></div>
          <div className="rounded-xl bg-blue-50 p-3"><p className="text-xs text-blue-600">Saldo</p><p className="font-bold text-blue-700">R$ 2.360</p></div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Receita vs Despesa (Semana)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="receita" name="Receita" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesa" name="Despesa" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Lançamentos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Descrição</th>
                <th className="pb-2 font-medium">Tipo</th>
                <th className="pb-2 font-medium">Categoria</th>
                <th className="pb-2 font-medium">Pagamento</th>
                <th className="pb-2 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {financialEntries.map((e, i) => (
                <tr key={e.id} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                  <td className="py-2.5">{new Date(e.date).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2.5 font-medium">{e.description}</td>
                  <td className="py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${e.type === "Receita" ? "badge-success" : "badge-danger"}`}>{e.type}</span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{e.category}</td>
                  <td className="py-2.5 text-muted-foreground">{e.paymentMethod}</td>
                  <td className={`py-2.5 text-right font-semibold ${e.type === "Receita" ? "text-emerald-600" : "text-red-500"}`}>
                    {e.type === "Receita" ? "+" : "-"} R$ {e.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Registrar Lançamento</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Descrição" className="rounded-xl" />
            <Input placeholder="Valor" type="number" className="rounded-xl" />
            <Input placeholder="Categoria" className="rounded-xl" />
            <Input type="date" className="rounded-xl" />
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
