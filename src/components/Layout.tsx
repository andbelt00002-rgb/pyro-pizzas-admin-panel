import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu, Flame } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pedidos": "Pedidos",
  "/cardapio": "Cardápio",
  "/mesas": "Mesas",
  "/delivery": "Delivery",
  "/clientes": "Clientes",
  "/estoque": "Estoque",
  "/funcionarios": "Funcionários",
  "/financeiro": "Financeiro",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Pedidos", path: "/pedidos" },
  { label: "Cardápio", path: "/cardapio" },
  { label: "Mesas", path: "/mesas" },
  { label: "Delivery", path: "/delivery" },
  { label: "Clientes", path: "/clientes" },
  { label: "Estoque", path: "/estoque" },
  { label: "Funcionários", path: "/funcionarios" },
  { label: "Financeiro", path: "/financeiro" },
  { label: "Relatórios", path: "/relatorios" },
  { label: "Configurações", path: "/configuracoes" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Pyro Pizzas";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main area */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "md:ml-[68px]" : "md:ml-[240px]"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <div className="flex h-16 items-center gap-2 border-b px-4">
                  <Flame className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">Pyro Pizzas</span>
                </div>
                <nav className="space-y-1 px-2 py-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        location.pathname === item.path
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-foreground sidebar-item-hover"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">Admin</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
