import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { customers, type Customer } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const classificationBadge: Record<string, string> = {
  VIP: "badge-warning",
  Regular: "badge-info",
  Novo: "badge-success",
  Inativo: "badge-neutral",
};

const filters = ["Todos", "Novo", "Regular", "VIP", "Inativo"] as const;

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = customers.filter(
    (c) =>
      (filter === "Todos" || c.classification === filter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.cpf.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>
        <Button className="rounded-xl" onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Nome</th>
                <th className="pb-2 font-medium">Telefone</th>
                <th className="pb-2 font-medium">Pedidos</th>
                <th className="pb-2 font-medium">Total Gasto</th>
                <th className="pb-2 font-medium">Última Visita</th>
                <th className="pb-2 font-medium">Classe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer border-b last:border-0 transition-colors duration-200 hover:bg-accent/50 ${i % 2 === 0 ? "bg-muted/30" : ""}`}
                >
                  <td className="py-2.5 font-medium">{c.name}</td>
                  <td className="py-2.5">{c.phone}</td>
                  <td className="py-2.5">{c.totalOrders}</td>
                  <td className="py-2.5">R$ {c.totalSpent.toLocaleString()}</td>
                  <td className="py-2.5">{new Date(c.lastVisit).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${classificationBadge[c.classification]}`}>
                      {c.classification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${classificationBadge[selected.classification]}`}>{selected.classification}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🏆 {selected.loyaltyPoints} pts</span>
              </div>
              <div className="space-y-1">
                <p><strong>CPF:</strong> {selected.cpf}</p>
                <p><strong>Telefone:</strong> {selected.phone}</p>
                <p><strong>E-mail:</strong> {selected.email}</p>
                <p><strong>Nascimento:</strong> {new Date(selected.birthDate).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="font-medium">Endereços</p>
                {selected.addresses.map((a, i) => (
                  <p key={i} className="text-muted-foreground">📍 {a}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-3">
                <div><p className="text-xs text-muted-foreground">Total Pedidos</p><p className="font-bold">{selected.totalOrders}</p></div>
                <div><p className="text-xs text-muted-foreground">Total Gasto</p><p className="font-bold">R$ {selected.totalSpent.toLocaleString()}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New customer form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome completo" className="rounded-xl" />
            <Input placeholder="CPF" className="rounded-xl" />
            <Input placeholder="Telefone" className="rounded-xl" />
            <Input placeholder="E-mail" className="rounded-xl" />
            <Input placeholder="Data de nascimento" type="date" className="rounded-xl" />
            <Input placeholder="Endereço" className="rounded-xl" />
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
