import { useState } from "react";
import { Plus, Clock, ChevronRight } from "lucide-react";
import { orders, type Order } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statuses = ["Todos", "Aguardando", "Em Preparo", "Saiu p/ Entrega", "Entregue", "Cancelado"] as const;
const types = ["Todos", "Balcão", "Mesa", "Delivery", "Telefone"] as const;

const statusColor: Record<string, string> = {
  Aguardando: "badge-info",
  "Em Preparo": "badge-warning",
  "Saiu p/ Entrega": "badge-info",
  Entregue: "badge-success",
  Cancelado: "badge-danger",
};

const nextStatus: Record<string, string> = {
  Aguardando: "Em Preparo",
  "Em Preparo": "Saiu p/ Entrega",
  "Saiu p/ Entrega": "Entregue",
};

function timeSince(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

export default function Pedidos() {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [data, setData] = useState(orders);

  const filtered = data.filter(
    (o) =>
      (statusFilter === "Todos" || o.status === statusFilter) &&
      (typeFilter === "Todos" || o.type === typeFilter)
  );

  const advanceStatus = (id: string) => {
    setData((prev) =>
      prev.map((o) =>
        o.id === id && nextStatus[o.status]
          ? { ...o, status: nextStatus[o.status] as Order["status"] }
          : o
      )
    );
  };

  // Kanban columns
  const kanbanStatuses = ["Aguardando", "Em Preparo", "Saiu p/ Entrega", "Entregue", "Cancelado"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button className="rounded-xl">
          <Plus className="mr-1.5 h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-md px-2.5 py-1 text-xs transition-all duration-200 ${
              typeFilter === t ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Kanban view */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanStatuses.map((status) => {
          const col = filtered.filter((o) => o.status === status);
          return (
            <div key={status} className="min-w-[260px] flex-shrink-0">
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[status]}`}>{status}</span>
                <span className="text-xs text-muted-foreground">({col.length})</span>
              </div>
              <div className="space-y-3">
                {col.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="card-hover cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">#{o.number}</span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{o.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{o.customerName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold">R$ {o.total}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {timeSince(o.createdAt)}
                      </div>
                    </div>
                    {nextStatus[o.status] && (
                      <button
                        onClick={(e) => { e.stopPropagation(); advanceStatus(o.id); }}
                        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-primary/10 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
                      >
                        Avançar <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {col.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-foreground">Nenhum pedido</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order detail modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[selectedOrder.status]}`}>{selectedOrder.status}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{selectedOrder.type}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{selectedOrder.paymentMethod}</span>
              </div>
              <div>
                <p className="font-medium">Cliente: {selectedOrder.customerName}</p>
                {selectedOrder.address && <p className="text-muted-foreground">Endereço: {selectedOrder.address}</p>}
                {selectedOrder.tableNumber && <p className="text-muted-foreground">Mesa: {selectedOrder.tableNumber}</p>}
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="mb-2 font-medium">Itens</p>
                {selectedOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-border last:border-0">
                    <span>{it.qty}x {it.name} ({it.size})</span>
                    <span className="font-medium">R$ {it.price}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {selectedOrder.total}</span>
                </div>
              </div>
              {selectedOrder.notes && (
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <strong>Obs:</strong> {selectedOrder.notes}
                </div>
              )}
              <Button variant="outline" className="w-full rounded-xl">🖨️ Imprimir Comanda</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
