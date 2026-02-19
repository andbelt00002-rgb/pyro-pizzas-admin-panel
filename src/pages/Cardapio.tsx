import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { pizzas, type Pizza } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const tabs = ["Pizzas Salgadas", "Pizzas Doces", "Bordas", "Combos", "Promoções"] as const;

export default function Cardapio() {
  const [activeTab, setActiveTab] = useState<string>("Pizzas Salgadas");
  const [showForm, setShowForm] = useState(false);
  const [editPizza, setEditPizza] = useState<Pizza | null>(null);

  const filtered = activeTab === "Pizzas Salgadas"
    ? pizzas.filter((p) => p.category === "salgada")
    : activeTab === "Pizzas Doces"
    ? pizzas.filter((p) => p.category === "doce")
    : [];

  const bordas = [
    { name: "Catupiry", price: 8, active: true },
    { name: "Cheddar", price: 8, active: true },
    { name: "Chocolate", price: 10, active: true },
  ];

  const combos = [
    { name: "Combo Família", items: "2 Pizzas G + 1 Refri 2L", originalPrice: 140, price: 119, active: true },
    { name: "Combo Casal", items: "1 Pizza M + 1 Refri 600ml + 1 Sobremesa", originalPrice: 85, price: 69, active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeTab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button className="rounded-xl" onClick={() => { setEditPizza(null); setShowForm(true); }}>
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar Pizza
        </Button>
      </div>

      {(activeTab === "Pizzas Salgadas" || activeTab === "Pizzas Doces") && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{p.image}</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${p.active ? "badge-success" : "badge-neutral"}`}>
                  {p.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.ingredients.map((ing) => (
                  <span key={ing} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{ing}</span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs">
                {(["broto", "P", "M", "G", "familia"] as const).map((size) => (
                  <div key={size} className="rounded-lg bg-muted/60 py-1">
                    <p className="text-[10px] text-muted-foreground">{size === "familia" ? "F" : size}</p>
                    <p className="font-semibold">R${p.prices[size]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setEditPizza(p); setShowForm(true); }} className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted">
                  <Edit className="mr-1 inline h-3 w-3" /> Editar
                </button>
                <button className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-200 hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Bordas" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="pb-2">Borda</th><th className="pb-2">Preço Adicional</th><th className="pb-2">Status</th></tr></thead>
            <tbody>
              {bordas.map((b) => (
                <tr key={b.name} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{b.name}</td>
                  <td className="py-2.5">+ R$ {b.price}</td>
                  <td className="py-2.5"><span className={`rounded-md px-2 py-0.5 text-xs font-medium ${b.active ? "badge-success" : "badge-neutral"}`}>{b.active ? "Ativo" : "Inativo"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Combos" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {combos.map((c) => (
            <div key={c.name} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-base font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.items}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">R$ {c.price}</span>
                <span className="text-sm text-muted-foreground line-through">R$ {c.originalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Promoções" && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p>Nenhuma promoção ativa no momento.</p>
          <Button variant="outline" className="mt-3 rounded-xl">Criar Promoção</Button>
        </div>
      )}

      {/* Add/Edit Pizza modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editPizza ? "Editar Pizza" : "Adicionar Pizza"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome da pizza" defaultValue={editPizza?.name} className="rounded-xl" />
            <Input placeholder="Descrição" defaultValue={editPizza?.description} className="rounded-xl" />
            <Input placeholder="Ingredientes (separados por vírgula)" defaultValue={editPizza?.ingredients.join(", ")} className="rounded-xl" />
            <div className="grid grid-cols-5 gap-2">
              {(["broto", "P", "M", "G", "familia"] as const).map((s) => (
                <Input key={s} placeholder={s} type="number" defaultValue={editPizza?.prices[s]} className="rounded-xl text-sm" />
              ))}
            </div>
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
