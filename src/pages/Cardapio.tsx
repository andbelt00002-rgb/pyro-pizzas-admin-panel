import { useState } from "react";
import { Plus, Edit, Trash2, Clock, ImagePlus, LayoutGrid, List } from "lucide-react";
import { pizzas as initialPizzas, type Pizza } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tabs = ["Pizzas Salgadas", "Pizzas Doces", "Bordas", "Combos", "Promoções"] as const;

export default function Cardapio() {
  const [activeTab, setActiveTab] = useState<string>("Pizzas Salgadas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editPizza, setEditPizza] = useState<Pizza | null>(null);
  const [pizzaList, setPizzaList] = useState<Pizza[]>(initialPizzas);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"salgada" | "doce">("salgada");
  const [formIngredients, setFormIngredients] = useState("");
  const [formPriceG, setFormPriceG] = useState("");
  const [formPriceBroto, setFormPriceBroto] = useState("");
  const [formPrepTime, setFormPrepTime] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formActive, setFormActive] = useState(true);

  const filtered = activeTab === "Pizzas Salgadas"
    ? pizzaList.filter((p) => p.category === "salgada")
    : activeTab === "Pizzas Doces"
    ? pizzaList.filter((p) => p.category === "doce")
    : [];

  const bordas = [
    { name: "Catupiry", price: 8, active: true },
    { name: "Cheddar", price: 8, active: true },
    { name: "Chocolate", price: 10, active: true },
  ];

  const combos = [
    { name: "Combo Família", items: "2 Pizzas G + 1 Refri 2L", originalPrice: 140, price: 119, active: true },
    { name: "Combo Casal", items: "1 Pizza G + 1 Refri 600ml + 1 Sobremesa", originalPrice: 85, price: 69, active: true },
  ];

  const openAddForm = () => {
    setEditPizza(null);
    setFormName("");
    setFormDescription("");
    setFormCategory(activeTab === "Pizzas Doces" ? "doce" : "salgada");
    setFormIngredients("");
    setFormPriceG("");
    setFormPriceBroto("");
    setFormPrepTime("");
    setFormImage("");
    setFormActive(true);
    setShowForm(true);
  };

  const openEditForm = (p: Pizza) => {
    setEditPizza(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormIngredients(p.ingredients.join(", "));
    setFormPriceG(String(p.priceG));
    setFormPriceBroto(String(p.priceBroto));
    setFormPrepTime(String(p.prepTime));
    setFormImage(p.image);
    setFormActive(p.active);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formIngredients.trim()) return;

    const pizzaData: Pizza = {
      id: editPizza?.id || String(Date.now()),
      name: formName,
      description: formDescription,
      category: formCategory,
      ingredients: formIngredients.split(",").map((i) => i.trim()).filter(Boolean),
      priceG: Number(formPriceG) || 0,
      priceBroto: Number(formPriceBroto) || 0,
      prepTime: Number(formPrepTime) || 0,
      image: formImage,
      active: formActive,
    };

    if (editPizza) {
      setPizzaList((prev) => prev.map((p) => (p.id === editPizza.id ? pizzaData : p)));
    } else {
      setPizzaList((prev) => [...prev, pizzaData]);
    }
    setShowForm(false);
  };

  const handleToggleActive = (id: string) => {
    setPizzaList((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleDelete = (id: string) => {
    setPizzaList((prev) => prev.filter((p) => p.id !== id));
  };

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
        <Button className="rounded-xl" onClick={openAddForm}>
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar Pizza
        </Button>
      </div>

      {(activeTab === "Pizzas Salgadas" || activeTab === "Pizzas Doces") && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
              {/* Image */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">🍕</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={p.active}
                    onCheckedChange={() => handleToggleActive(p.id)}
                  />
                  <span className={`text-xs font-medium ${p.active ? "text-green-600" : "text-muted-foreground"}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>

              {/* Ingredients */}
              <div className="mt-3 flex flex-wrap gap-1">
                {p.ingredients.map((ing) => (
                  <span key={ing} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{ing}</span>
                ))}
              </div>

              {/* Prices - only G and Broto */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/60 py-2">
                  <p className="text-[10px] text-muted-foreground">Grande</p>
                  <p className="text-sm font-semibold">R$ {p.priceG.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-muted/60 py-2">
                  <p className="text-[10px] text-muted-foreground">Broto</p>
                  <p className="text-sm font-semibold">R$ {p.priceBroto.toFixed(2)}</p>
                </div>
              </div>

              {/* Prep time */}
              {p.prepTime > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{p.prepTime} min</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEditForm(p)} className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted">
                  <Edit className="mr-1 inline h-3 w-3" /> Editar
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-200 hover:bg-destructive/10">
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
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <Label className="text-xs text-muted-foreground">Nome *</Label>
              <Input placeholder="Nome da pizza" value={formName} onChange={(e) => setFormName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Ingredientes *</Label>
              <Input placeholder="Ingredientes (separados por vírgula)" value={formIngredients} onChange={(e) => setFormIngredients(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea placeholder="Descrição da pizza" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Categoria</Label>
              <Select value={formCategory} onValueChange={(v) => setFormCategory(v as "salgada" | "doce")}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="salgada">Salgada</SelectItem>
                  <SelectItem value="doce">Doce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Preço Grande (R$)</Label>
                <Input placeholder="0.00" type="number" value={formPriceG} onChange={(e) => setFormPriceG(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Preço Broto (R$)</Label>
                <Input placeholder="0.00" type="number" value={formPriceBroto} onChange={(e) => setFormPriceBroto(e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tempo de Preparo (min)</Label>
              <Input placeholder="Ex: 25" type="number" value={formPrepTime} onChange={(e) => setFormPrepTime(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">URL da Imagem</Label>
              <div className="flex gap-2">
                <Input placeholder="https://..." value={formImage} onChange={(e) => setFormImage(e.target.value)} className="rounded-xl flex-1" />
                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  {formImage ? (
                    <img src={formImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label className="text-sm">Pizza ativa</Label>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave} disabled={!formName.trim() || !formIngredients.trim()}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
