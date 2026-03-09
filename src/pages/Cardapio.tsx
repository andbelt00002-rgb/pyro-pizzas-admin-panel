import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Clock, ImagePlus, LayoutGrid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tabs = ["Pizzas Salgadas", "Pizzas Doces", "Bordas", "Combos", "Promoções"] as const;

interface PizzaRow {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  price_g: number;
  price_broto: number;
  prep_time: number;
  active: boolean;
  image_url: string;
}

export default function Cardapio() {
  const [activeTab, setActiveTab] = useState<string>("Pizzas Salgadas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editPizza, setEditPizza] = useState<PizzaRow | null>(null);
  const [pizzaList, setPizzaList] = useState<PizzaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"salgada" | "doce">("salgada");
  const [formIngredients, setFormIngredients] = useState("");
  const [formPriceG, setFormPriceG] = useState("");
  const [formPriceBroto, setFormPriceBroto] = useState("");
  const [formPrepTime, setFormPrepTime] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [formActive, setFormActive] = useState(true);

  const fetchPizzas = useCallback(async () => {
    const { data, error } = await supabase
      .from("pizzas")
      .select("*")
      .order("name");
    if (error) {
      toast.error("Erro ao carregar pizzas");
      console.error(error);
    } else {
      setPizzaList(data as PizzaRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPizzas();
  }, [fetchPizzas]);

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
    setFormImageUrl("");
    setFormImageFile(null);
    setFormImagePreview("");
    setFormActive(true);
    setShowForm(true);
  };

  const openEditForm = (p: PizzaRow) => {
    setEditPizza(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormCategory(p.category as "salgada" | "doce");
    setFormIngredients(p.ingredients.join(", "));
    setFormPriceG(String(p.price_g));
    setFormPriceBroto(String(p.price_broto));
    setFormPrepTime(String(p.prep_time));
    setFormImageUrl(p.image_url);
    setFormImageFile(null);
    setFormImagePreview(p.image_url);
    setFormActive(p.active);
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("pizza-images")
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("pizza-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formName.trim() || !formIngredients.trim()) return;
    setSaving(true);

    try {
      let imageUrl = formImageUrl;
      if (formImageFile) {
        imageUrl = await uploadImage(formImageFile);
      }

      const pizzaData = {
        name: formName,
        description: formDescription,
        category: formCategory,
        ingredients: formIngredients.split(",").map((i) => i.trim()).filter(Boolean),
        price_g: Number(formPriceG) || 0,
        price_broto: Number(formPriceBroto) || 0,
        prep_time: Number(formPrepTime) || 0,
        image_url: imageUrl,
        active: formActive,
      };

      if (editPizza) {
        const { error } = await supabase.from("pizzas").update(pizzaData).eq("id", editPizza.id);
        if (error) throw error;
        toast.success("Pizza atualizada!");
      } else {
        const { error } = await supabase.from("pizzas").insert(pizzaData);
        if (error) throw error;
        toast.success("Pizza adicionada!");
      }

      setShowForm(false);
      fetchPizzas();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: PizzaRow) => {
    const { error } = await supabase.from("pizzas").update({ active: !p.active }).eq("id", p.id);
    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      setPizzaList((prev) => prev.map((item) => (item.id === p.id ? { ...item, active: !item.active } : item)));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("pizzas").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir pizza");
    } else {
      setPizzaList((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pizza excluída!");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFormImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all duration-200 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-all duration-200 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button className="rounded-xl" onClick={openAddForm}>
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar Pizza
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && (activeTab === "Pizzas Salgadas" || activeTab === "Pizzas Doces") && viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer" onClick={() => openEditForm(p)}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">🍕</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.active} onCheckedChange={() => handleToggleActive(p)} onClick={(e) => e.stopPropagation()} />
                  <span className={`text-xs font-medium ${p.active ? "text-green-600" : "text-muted-foreground"}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.ingredients.map((ing) => (
                  <span key={ing} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{ing}</span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/60 py-2">
                  <p className="text-[10px] text-muted-foreground">Grande</p>
                  <p className="text-sm font-semibold">R$ {Number(p.price_g).toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-muted/60 py-2">
                  <p className="text-[10px] text-muted-foreground">Broto</p>
                  <p className="text-sm font-semibold">R$ {Number(p.price_broto).toFixed(2)}</p>
                </div>
              </div>
              {p.prep_time > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{p.prep_time} min</span>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); openEditForm(p); }} className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted">
                  <Edit className="mr-1 inline h-3 w-3" /> Editar
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-200 hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (activeTab === "Pizzas Salgadas" || activeTab === "Pizzas Doces") && viewMode === "list" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 hidden md:table-cell">Ingredientes</th>
                <th className="px-4 py-3">Grande</th>
                <th className="px-4 py-3">Broto</th>
                <th className="px-4 py-3 hidden sm:table-cell">Preparo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 transition-all duration-200 hover:bg-muted/30 cursor-pointer" onClick={() => openEditForm(p)}>
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg">🍕</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {p.ingredients.slice(0, 3).map((ing) => (
                        <span key={ing} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{ing}</span>
                      ))}
                      {p.ingredients.length > 3 && (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">+{p.ingredients.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">R$ {Number(p.price_g).toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold">R$ {Number(p.price_broto).toFixed(2)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                    {p.prep_time > 0 ? <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.prep_time} min</span> : "—"}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Switch checked={p.active} onCheckedChange={() => handleToggleActive(p)} />
                      <span className={`text-xs font-medium ${p.active ? "text-green-600" : "text-muted-foreground"}`}>
                        {p.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditForm(p)} className="rounded-lg border border-border p-1.5 text-xs transition-all duration-200 hover:bg-muted">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-destructive/30 p-1.5 text-xs text-destructive transition-all duration-200 hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <Label className="text-xs text-muted-foreground">Imagem do Produto</Label>
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                  {formImagePreview ? (
                    <img src={formImagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-muted">
                    <ImagePlus className="h-4 w-4" />
                    {formImagePreview ? "Trocar imagem" : "Escolher imagem"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </label>
                  {formImagePreview && (
                    <button type="button" onClick={() => { setFormImageFile(null); setFormImagePreview(""); setFormImageUrl(""); }} className="ml-2 text-xs text-destructive hover:underline">Remover</button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label className="text-sm">Pizza ativa</Label>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave} disabled={!formName.trim() || !formIngredients.trim() || saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
