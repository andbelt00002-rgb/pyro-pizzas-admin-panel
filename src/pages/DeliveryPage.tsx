import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { deliveryDrivers, orders, deliveryFees } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const driverStatusCfg: Record<string, { badge: string; emoji: string }> = {
  Disponível: { badge: "badge-success", emoji: "🟢" },
  "Em Rota": { badge: "badge-warning", emoji: "🟡" },
  Folga: { badge: "badge-neutral", emoji: "⚫" },
};

export default function DeliveryPage() {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const activeDeliveries = orders.filter((o) => o.status === "Saiu p/ Entrega");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="rounded-xl" onClick={() => setShowDriverForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Novo Entregador
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drivers */}
        <div>
          <h2 className="mb-4 text-base font-semibold">Entregadores</h2>
          <div className="space-y-3">
            {deliveryDrivers.map((d) => {
              const cfg = driverStatusCfg[d.status];
              return (
                <div key={d.id} className="card-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                    {d.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.vehicle} — {d.plate}</p>
                    {d.currentOrder && <p className="text-xs text-primary">Pedido #{d.currentOrder}</p>}
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${cfg.badge}`}>{cfg.emoji} {d.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active deliveries */}
        <div>
          <h2 className="mb-4 text-base font-semibold">Entregas Ativas</h2>
          <div className="space-y-3">
            {activeDeliveries.length === 0 && (
              <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">Nenhuma entrega ativa</p>
            )}
            {activeDeliveries.map((o) => (
              <div key={o.id} className="card-hover rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{o.number}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> Em trânsito
                  </div>
                </div>
                <p className="mt-1 text-sm text-foreground">{o.customerName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{o.address}</p>
                <p className="mt-1 text-sm font-semibold">R$ {o.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery fees */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Taxas por Bairro</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="pb-2">Bairro</th><th className="pb-2">Taxa</th><th className="pb-2">Tempo Est.</th></tr></thead>
            <tbody>
              {deliveryFees.map((f) => (
                <tr key={f.neighborhood} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{f.neighborhood}</td>
                  <td className="py-2.5">R$ {f.fee}</td>
                  <td className="py-2.5">{f.estimatedTime} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDriverForm} onOpenChange={setShowDriverForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Novo Entregador</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome" className="rounded-xl" />
            <Input placeholder="Telefone" className="rounded-xl" />
            <Input placeholder="Veículo" className="rounded-xl" />
            <Input placeholder="Placa" className="rounded-xl" />
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
