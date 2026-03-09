import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, LayoutGrid, List, Loader2, Wine, GlassWater, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tabs = ["Todas", "Não Alcoólicas", "Alcoólicas"] as const;

interface BebidaRow {
  id: string;
  name: string;
  category: string;
  price: number;
  volume: string;
  stock_quantity: number;
  active: boolean;
  image_url: string;
}

export default function Bebidas() {
  const [activeTab, setActiveTab] = useState<string>("Todas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editBebida, setEditBebida] = useState<BebidaRow | null>(null);
  const [bebidaList, setBebidaList] = useState<BebidaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"alcoolica" | "nao_alcoolica">("nao_alcoolica");
  const [formPrice, setFormPrice] = useState("");
  const [formVolume, setFormVolume] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  const fetchBebidas = useCallback(async () => {
    const { data, error } = await supabase
      .from("bebidas")
      .select("*")
      .order("name");
    if (error) {
      toast.error("Erro ao carregar bebidas");
      console.error(error);
    } else {
      setBebidaList(data as BebidaRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBebidas();
  }, [fetchBebidas]);

  const filtered =
    activeTab === "Não Alcoólicas"
      ? bebidaList.filter((b) => b.category === "nao_alcoolica")
      : activeTab === "Alcoólicas"
      ? bebidaList.filter((b) => b.category === "alcoolica")
      : bebidaList;

  const openAddForm = () => {
    setEditBebida(null);
    setFormName("");
    setFormCategory("nao_alcoolica");
    setFormPrice("");
    setFormVolume("");
    setFormStock("");
    setFormActive(true);
    setFormImageFile(null);
    setFormImagePreview("");
    setFormImageUrl("");
    setShowForm(true);
  };

  const openEditForm = (b: BebidaRow) => {
    setEditBebida(b);
    setFormName(b.name);
    setFormCategory(b.category as "alcoolica" | "nao_alcoolica");
    setFormPrice(String(b.price));
    setFormVolume(b.volume);
    setFormStock(String(b.stock_quantity));
    setFormActive(b.active);
    setFormImageFile(null);
    setFormImagePreview(b.image_url);
    setFormImageUrl(b.image_url);
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `bebidas/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("pizza-images")
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("pizza-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = formImageUrl;
      if (formImageFile) {
        imageUrl = await uploadImage(formImageFile);
      }

      const bebidaData = {
        name: formName,
        category: formCategory,
        price: Number(formPrice) || 0,
        volume: formVolume,
        stock_quantity: Number(formStock) || 0,
        active: formActive,
        image_url: imageUrl,
      };

      if (editBebida) {
        const { error } = await supabase.from("bebidas").update(bebidaData).eq("id", editBebida.id);
        if (error) throw error;
        toast.success("Bebida atualizada!");
      } else {
        const { error } = await supabase.from("bebidas").insert(bebidaData);
        if (error) throw error;
        toast.success("Bebida adicionada!");
      }

      setShowForm(false);
      fetchBebidas();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (b: BebidaRow) => {
    const { error } = await supabase.from("bebidas").update({ active: !b.active }).eq("id", b.id);
    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      setBebidaList((prev) => prev.map((item) => (item.id === b.id ? { ...item, active: !item.active } : item)));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bebidas").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir bebida");
    } else {
      setBebidaList((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bebida excluída!");
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

  const stockBadge = (qty: number) => {
    if (qty === 0) return { label: "Sem estoque", cls: "bg-destructive/10 text-destructive" };
    if (qty <= 10) return { label: "Baixo", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { label: "OK", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  };

  const categoryIcon = (cat: string) =>
    cat === "alcoolica" ? <Wine className="h-4 w-4 text-purple-500" /> : <GlassWater className="h-4 w-4 text-blue-500" />;

  const categoryLabel = (cat: string) =>
    cat === "alcoolica" ? "Alcoólica" : "Não Alcoólica";

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar Bebida
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="card-hover rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer"
              onClick={() => openEditForm(b)}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl">{b.category === "alcoolica" ? "🍷" : "🥤"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={b.active} onCheckedChange={() => handleToggleActive(b)} onClick={(e) => e.stopPropagation()} />
                  <span className={`text-xs font-medium ${b.active ? "text-green-600" : "text-muted-foreground"}`}>
                    {b.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">{b.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {categoryIcon(b.category)}
                <span>{categoryLabel(b.category)}</span>
                <span className="text-border">•</span>
                <span>{b.volume}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">R$ {Number(b.price).toFixed(2)}</span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${stockBadge(b.stock_quantity).cls}`}>
                  {b.stock_quantity} un • {stockBadge(b.stock_quantity).label}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditForm(b); }}
                  className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted"
                >
                  <Edit className="mr-1 inline h-3 w-3" /> Editar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                  className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 hidden sm:table-cell">Tipo</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3 hidden md:table-cell">Estoque</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const badge = stockBadge(b.stock_quantity);
                return (
                  <tr
                    key={b.id}
                    className="border-b last:border-0 transition-all duration-200 hover:bg-muted/30 cursor-pointer"
                    onClick={() => openEditForm(b)}
                  >
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                        {b.image_url ? (
                          <img src={b.image_url} alt={b.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">{b.category === "alcoolica" ? "🍷" : "🥤"}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        {categoryIcon(b.category)}
                        <span className="text-xs text-muted-foreground">{categoryLabel(b.category)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.volume}</td>
                    <td className="px-4 py-3 font-semibold">R$ {Number(b.price).toFixed(2)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
                        {b.stock_quantity} un • {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Switch checked={b.active} onCheckedChange={() => handleToggleActive(b)} />
                        <span className={`text-xs font-medium ${b.active ? "text-green-600" : "text-muted-foreground"}`}>
                          {b.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditForm(b)} className="rounded-lg border border-border p-1.5 text-xs transition-all duration-200 hover:bg-muted">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="rounded-lg border border-destructive/30 p-1.5 text-xs text-destructive transition-all duration-200 hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p>Nenhuma bebida encontrada.</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editBebida ? "Editar Bebida" : "Adicionar Bebida"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Coca-Cola" />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={formCategory} onValueChange={(v) => setFormCategory(v as "alcoolica" | "nao_alcoolica")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_alcoolica">Não Alcoólica</SelectItem>
                  <SelectItem value="alcoolica">Alcoólica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Preço (R$)</Label>
                <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Volume</Label>
                <Input value={formVolume} onChange={(e) => setFormVolume(e.target.value)} placeholder="Ex: 600ml, 2L" />
              </div>
            </div>
            <div>
              <Label>Estoque (unidades)</Label>
              <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Imagem</Label>
              <div className="mt-1 flex items-center gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                  {formImagePreview ? (
                    <img src={formImagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted text-center">
                    Escolher arquivo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                  </label>
                  {formImagePreview && (
                    <button
                      type="button"
                      onClick={() => { setFormImageFile(null); setFormImagePreview(""); setFormImageUrl(""); }}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remover imagem
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formActive} onCheckedChange={setFormActive} />
              <Label>{formActive ? "Ativo" : "Inativo"}</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editBebida ? "Salvar Alterações" : "Adicionar Bebida"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
