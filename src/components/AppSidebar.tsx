import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, Armchair,
  Truck, Users, Package, UserCog, Wallet, BarChart3, Settings,
  ChevronLeft, ChevronRight, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pedidos", icon: ClipboardList, path: "/pedidos" },
  { label: "Cardápio", icon: UtensilsCrossed, path: "/cardapio" },
  { label: "Mesas", icon: Armchair, path: "/mesas" },
  { label: "Delivery", icon: Truck, path: "/delivery" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Estoque", icon: Package, path: "/estoque" },
  { label: "Funcionários", icon: UserCog, path: "/funcionarios" },
  { label: "Financeiro", icon: Wallet, path: "/financeiro" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar shadow-sm transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Flame className="h-7 w-7 shrink-0 text-primary" />
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">
            Pyro Pizzas
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-sidebar-foreground sidebar-item-hover"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-t border-sidebar-border text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
