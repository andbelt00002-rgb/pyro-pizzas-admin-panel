import { useState } from "react";
import { Plus } from "lucide-react";
import { employees, type Employee } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const roleBadge: Record<string, string> = {
  Administrador: "badge-purple",
  Gerente: "badge-blue",
  Atendente: "badge-green",
  Cozinheiro: "badge-orange",
  Entregador: "badge-yellow",
  Caixa: "badge-gray",
};

export default function Funcionarios() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="rounded-xl" onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Novo Funcionário
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {employees.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelected(e)}
            className="card-hover cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                {e.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{e.name}</p>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${roleBadge[e.role]}`}>{e.role}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Turno: {e.shift}</span>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${e.active ? "badge-success" : "badge-neutral"}`}>
                {e.active ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${roleBadge[selected.role]}`}>{selected.role}</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${selected.active ? "badge-success" : "badge-neutral"}`}>{selected.active ? "Ativo" : "Inativo"}</span>
              </div>
              <p><strong>CPF:</strong> —</p>
              <p><strong>Telefone:</strong> {selected.phone}</p>
              <p><strong>E-mail:</strong> {selected.email}</p>
              <p><strong>Turno:</strong> {selected.shift}</p>
              <p><strong>Admissão:</strong> {new Date(selected.admissionDate).toLocaleDateString("pt-BR")}</p>
              <p><strong>Salário:</strong> R$ {selected.salary.toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New employee form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Novo Funcionário</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome" className="rounded-xl" />
            <Input placeholder="CPF" className="rounded-xl" />
            <Input placeholder="Telefone" className="rounded-xl" />
            <Input placeholder="E-mail" className="rounded-xl" />
            <Input placeholder="Cargo" className="rounded-xl" />
            <Input placeholder="Turno" className="rounded-xl" />
            <Input placeholder="Salário" type="number" className="rounded-xl" />
            <Input placeholder="Data de admissão" type="date" className="rounded-xl" />
            <Button className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
