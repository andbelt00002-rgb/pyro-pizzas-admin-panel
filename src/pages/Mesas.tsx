import { useState } from "react";
import { Plus } from "lucide-react";
import { tables, orders, type TableItem } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusConfig: Record<string, { color: string; emoji: string }> = {
  Disponível: { color: "border-emerald-300 bg-emerald-50", emoji: "🟢" },
  Ocupada: { color: "border-red-300 bg-red-50", emoji: "🔴" },
  Reservada: { color: "border-amber-300 bg-amber-50", emoji: "🟡" },
  Manutenção: { color: "border-slate-300 bg-slate-100", emoji: "⚫" },
};

export default function Mesas() {
  const [selected, setSelected] = useState<TableItem | null>(null);

  const tableOrders = selected ? orders.filter((o) => o.tableNumber === selected.number) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-xs text-muted-foreground">
          {Object.entries(statusConfig).map(([s, c]) => (
            <span key={s}>{c.emoji} {s}</span>
          ))}
        </div>
        <Button className="rounded-xl"><Plus className="mr-1.5 h-4 w-4" /> Adicionar Mesa</Button>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {tables.map((t) => {
          const cfg = statusConfig[t.status];
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`card-hover flex flex-col items-center justify-center rounded-2xl border-2 p-6 shadow-sm transition-all duration-200 ${cfg.color}`}
            >
              <span className="text-2xl font-bold text-foreground">{t.number}</span>
              <span className="mt-1 text-xs text-muted-foreground">{t.capacity} lugares</span>
              <span className="mt-2 text-sm">{cfg.emoji} {t.status}</span>
            </button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Mesa {selected?.number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{selected.capacity} lugares</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  selected.status === "Ocupada" ? "badge-danger" :
                  selected.status === "Disponível" ? "badge-success" :
                  selected.status === "Reservada" ? "badge-warning" : "badge-neutral"
                }`}>{selected.status}</span>
              </div>

              {selected.status === "Ocupada" && tableOrders.length > 0 && (
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="mb-2 font-medium">Pedidos vinculados</p>
                  {tableOrders.map((o) => (
                    <div key={o.id} className="flex justify-between border-b border-border py-1 last:border-0">
                      <span>#{o.number} — {o.items.map((i) => i.name).join(", ")}</span>
                      <span className="font-medium">R$ {o.total}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {tableOrders.reduce((s, o) => s + o.total, 0)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {selected.status === "Ocupada" && (
                  <>
                    <Button variant="outline" className="flex-1 rounded-xl">Fechar Conta</Button>
                    <Button variant="outline" className="flex-1 rounded-xl">Transferir</Button>
                  </>
                )}
                {selected.status === "Disponível" && (
                  <Button className="flex-1 rounded-xl">Abrir Mesa / Criar Pedido</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
