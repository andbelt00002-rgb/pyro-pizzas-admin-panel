import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { stockItems } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const categories = ["Ingredientes", "Embalagens", "Descartáveis", "Bebidas"] as const;

function stockStatus(current: number, min: number) {
  if (current <= min * 0.5) return { label: "Crítico", badge: "badge-danger", emoji: "🔴" };
  if (current <= min) return { label: "Baixo", badge: "badge-warning", emoji: "🟡" };
  return { label: "OK", badge: "badge-success", emoji: "🟢" };
}

export default function Estoque() {
  const [tab, setTab] = useState<string>("Ingredientes");
  const [showForm, setShowForm] = useState(false);
  const [showEntry, setShowEntry] = useState<string | null>(null);

  const lowStock = stockItems.filter((s) => s.currentQty <= s.minQty);
  const filtered = stockItems.filter((s) => s.category === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Controle de Estoque</h2>
        <Button className="rounded-xl" onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar Item
        </Button>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lowStock.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">{s.name}</p>
                <p className="text-xs text-red-600">Restam {s.currentQty} {s.unit} (mín: {s.minQty})</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              tab === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Stock table */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium">Unidade</th>
                <th className="pb-2 font-medium">Qtd Atual</th>
                <th className="pb-2 font-medium">Qtd Mín</th>
                <th className="pb-2 font-medium">Fornecedor</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const st = stockStatus(s.currentQty, s.minQty);
                return (
                  <tr key={s.id} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                    <td className="py-2.5 font-medium">{s.name}</td>
                    <td className="py-2.5">{s.unit}</td>
                    <td className="py-2.5">{s.currentQty}</td>
                    <td className="py-2.5">{s.minQty}</td>
                    <td className="py-2.5 text-muted-foreground">{s.supplier}</td>
                    <td className="py-2.5">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${st.badge}`}>{st.emoji} {st.label}</span>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => setShowEntry(s.id)}
                        className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
                      >
                        + Entrada
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhum item nesta categoria</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add item modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Adicionar Item ao Estoque</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome do item" className="rounded-xl" />
            <Input placeholder="Unidade de medida" className="rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Qtd atual" type="number" className="rounded-xl" />
              <Input placeholder="Qtd mínima" type="number" className="rounded-xl" />
            </div>
            <Input placeholder="Fornecedor" className="rounded-xl" />
            <Input placeholder="Preço unitário" type="number" className="rounded-xl" />
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entry modal */}
      <Dialog open={!!showEntry} onOpenChange={() => setShowEntry(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle>Registrar Entrada</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Quantidade" type="number" className="rounded-xl" />
            <Input type="date" className="rounded-xl" />
            <Button className="w-full rounded-xl">Registrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
