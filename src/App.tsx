import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Cardapio from "./pages/Cardapio";
import Mesas from "./pages/Mesas";
import DeliveryPage from "./pages/DeliveryPage";
import Clientes from "./pages/Clientes";
import Estoque from "./pages/Estoque";
import Funcionarios from "./pages/Funcionarios";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Bebidas from "./pages/Bebidas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/bebidas" element={<Bebidas />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
