import { useState } from "react";
import { Save, Plus, Download, Upload } from "lucide-react";
import { deliveryFees } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const weekDays = [
  { day: "Segunda-feira", open: "18:00", close: "23:30", active: true },
  { day: "Terça-feira", open: "18:00", close: "23:30", active: true },
  { day: "Quarta-feira", open: "18:00", close: "23:30", active: true },
  { day: "Quinta-feira", open: "18:00", close: "23:30", active: true },
  { day: "Sexta-feira", open: "18:00", close: "00:00", active: true },
  { day: "Sábado", open: "17:00", close: "00:00", active: true },
  { day: "Domingo", open: "17:00", close: "23:00", active: true },
];

export default function Configuracoes() {
  const [schedule, setSchedule] = useState(weekDays);

  return (
    <div className="space-y-6">
      {/* Pizzaria info */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">🍕 Dados da Pizzaria</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input defaultValue="Pyro Pizzas" className="rounded-xl" />
          <Input placeholder="CNPJ" defaultValue="12.345.678/0001-99" className="rounded-xl" />
          <Input placeholder="Endereço" defaultValue="Rua das Pizzas, 42 - Centro, São Paulo" className="rounded-xl sm:col-span-2" />
          <Input placeholder="Telefone" defaultValue="(11) 3333-4444" className="rounded-xl" />
          <Input placeholder="E-mail" defaultValue="contato@pyropizzas.com" className="rounded-xl" />
        </div>
        <Button className="mt-4 rounded-xl"><Save className="mr-1.5 h-4 w-4" /> Salvar</Button>
      </div>

      {/* Operating hours */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">🕐 Horário de Funcionamento</h2>
        <div className="space-y-2">
          {schedule.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
              <span className="w-32 text-sm font-medium">{d.day}</span>
              <Input defaultValue={d.open} className="w-24 rounded-lg text-sm" />
              <span className="text-xs text-muted-foreground">até</span>
              <Input defaultValue={d.close} className="w-24 rounded-lg text-sm" />
              <Switch
                checked={d.active}
                onCheckedChange={(checked) => {
                  const updated = [...schedule];
                  updated[i] = { ...d, active: checked };
                  setSchedule(updated);
                }}
              />
              <span className="text-xs text-muted-foreground">{d.active ? "Aberto" : "Fechado"}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4 rounded-xl"><Save className="mr-1.5 h-4 w-4" /> Salvar</Button>
      </div>

      {/* Delivery fees */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">🛵 Taxas de Entrega</h2>
          <Button variant="outline" size="sm" className="rounded-lg text-xs">
            <Plus className="mr-1 h-3 w-3" /> Adicionar Bairro
          </Button>
        </div>
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

      {/* Default times */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">⏱ Tempos Padrão</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Tempo médio de preparo (min)</label>
            <Input defaultValue="25" type="number" className="rounded-xl" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Tempo médio de entrega (min)</label>
            <Input defaultValue="30" type="number" className="rounded-xl" />
          </div>
        </div>
        <Button className="mt-4 rounded-xl"><Save className="mr-1.5 h-4 w-4" /> Salvar</Button>
      </div>

      {/* Backup */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">💾 Backup de Dados</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">
            <Download className="mr-1.5 h-4 w-4" /> Exportar Dados (JSON)
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Upload className="mr-1.5 h-4 w-4" /> Importar Dados
          </Button>
        </div>
      </div>
    </div>
  );
}
