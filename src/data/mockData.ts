export interface Pizza {
  id: string; name: string; description: string; category: "salgada" | "doce";
  ingredients: string[]; prices: { broto: number; P: number; M: number; G: number; familia: number };
  active: boolean; image: string;
}

export interface Employee {
  id: string; name: string; role: "Administrador" | "Gerente" | "Atendente" | "Cozinheiro" | "Entregador" | "Caixa";
  shift: "Manhã" | "Tarde" | "Noite"; phone: string; email: string;
  admissionDate: string; salary: number; active: boolean;
}

export interface Customer {
  id: string; name: string; cpf: string; phone: string; email: string; birthDate: string;
  addresses: string[]; classification: "Novo" | "Regular" | "VIP" | "Inativo";
  loyaltyPoints: number; totalOrders: number; totalSpent: number; lastVisit: string;
}

export interface OrderItem { name: string; qty: number; size: string; price: number }

export interface Order {
  id: string; number: number; type: "Balcão" | "Mesa" | "Delivery" | "Telefone";
  customerName: string; items: OrderItem[]; total: number;
  status: "Aguardando" | "Em Preparo" | "Saiu p/ Entrega" | "Entregue" | "Cancelado";
  createdAt: string; paymentMethod: string; notes: string; address?: string; tableNumber?: number;
}

export interface TableItem {
  id: string; number: number; capacity: number;
  status: "Disponível" | "Ocupada" | "Reservada" | "Manutenção";
}

export interface StockItem {
  id: string; name: string; category: "Ingredientes" | "Embalagens" | "Descartáveis" | "Bebidas";
  unit: string; currentQty: number; minQty: number; supplier: string;
  unitPrice: number; lastUpdate: string;
}

export interface DeliveryDriver {
  id: string; name: string; vehicle: string; plate: string; phone: string;
  status: "Disponível" | "Em Rota" | "Folga"; currentOrder?: number;
}

export interface FinancialEntry {
  id: string; date: string; description: string; type: "Receita" | "Despesa";
  category: string; paymentMethod: string; value: number;
}

export const pizzas: Pizza[] = [
  { id: "1", name: "Margherita", description: "Molho de tomate, mussarela, manjericão fresco", category: "salgada", ingredients: ["Molho de tomate", "Mussarela", "Manjericão"], prices: { broto: 22, P: 32, M: 42, G: 52, familia: 65 }, active: true, image: "🍕" },
  { id: "2", name: "Calabresa", description: "Calabresa fatiada, cebola, azeitonas", category: "salgada", ingredients: ["Calabresa", "Cebola", "Azeitonas", "Mussarela"], prices: { broto: 24, P: 34, M: 44, G: 54, familia: 68 }, active: true, image: "🍕" },
  { id: "3", name: "Portuguesa", description: "Presunto, ovos, cebola, azeitonas, ervilha", category: "salgada", ingredients: ["Presunto", "Ovos", "Cebola", "Azeitonas", "Ervilha", "Mussarela"], prices: { broto: 26, P: 36, M: 46, G: 56, familia: 70 }, active: true, image: "🍕" },
  { id: "4", name: "Frango com Catupiry", description: "Frango desfiado com catupiry cremoso", category: "salgada", ingredients: ["Frango desfiado", "Catupiry", "Mussarela"], prices: { broto: 26, P: 36, M: 48, G: 58, familia: 72 }, active: true, image: "🍕" },
  { id: "5", name: "Quatro Queijos", description: "Mussarela, provolone, gorgonzola, parmesão", category: "salgada", ingredients: ["Mussarela", "Provolone", "Gorgonzola", "Parmesão"], prices: { broto: 28, P: 38, M: 50, G: 60, familia: 75 }, active: true, image: "🍕" },
  { id: "6", name: "Pepperoni", description: "Pepperoni importado com mussarela", category: "salgada", ingredients: ["Pepperoni", "Mussarela", "Orégano"], prices: { broto: 28, P: 40, M: 52, G: 62, familia: 78 }, active: true, image: "🍕" },
  { id: "7", name: "Bacon Cheddar", description: "Bacon crocante, cheddar derretido, cebola caramelizada", category: "salgada", ingredients: ["Bacon", "Cheddar", "Cebola caramelizada"], prices: { broto: 30, P: 42, M: 54, G: 64, familia: 80 }, active: true, image: "🍕" },
  { id: "8", name: "Vegetariana", description: "Brócolis, palmito, milho, tomate, champignon", category: "salgada", ingredients: ["Brócolis", "Palmito", "Milho", "Tomate", "Champignon"], prices: { broto: 24, P: 34, M: 44, G: 54, familia: 68 }, active: true, image: "🍕" },
  { id: "9", name: "Lombo Canadense", description: "Lombo canadense, catupiry, cebola roxa", category: "salgada", ingredients: ["Lombo canadense", "Catupiry", "Cebola roxa"], prices: { broto: 28, P: 40, M: 52, G: 62, familia: 76 }, active: false, image: "🍕" },
  { id: "10", name: "Chocolate com Morango", description: "Chocolate ao leite com morangos frescos", category: "doce", ingredients: ["Chocolate ao leite", "Morangos", "Leite condensado"], prices: { broto: 26, P: 36, M: 46, G: 56, familia: 70 }, active: true, image: "🍫" },
  { id: "11", name: "Banana com Canela", description: "Banana caramelizada, canela e açúcar", category: "doce", ingredients: ["Banana", "Canela", "Açúcar", "Leite condensado"], prices: { broto: 22, P: 32, M: 42, G: 52, familia: 64 }, active: true, image: "🍌" },
  { id: "12", name: "Romeu e Julieta", description: "Goiabada derretida com queijo minas", category: "doce", ingredients: ["Goiabada", "Queijo minas"], prices: { broto: 24, P: 34, M: 44, G: 54, familia: 68 }, active: true, image: "🧀" },
];

export const employees: Employee[] = [
  { id: "1", name: "Carlos Silva", role: "Administrador", shift: "Manhã", phone: "(11) 99999-0001", email: "carlos@pyropizzas.com", admissionDate: "2022-03-15", salary: 5500, active: true },
  { id: "2", name: "Ana Oliveira", role: "Gerente", shift: "Tarde", phone: "(11) 99999-0002", email: "ana@pyropizzas.com", admissionDate: "2022-06-01", salary: 4200, active: true },
  { id: "3", name: "João Santos", role: "Cozinheiro", shift: "Noite", phone: "(11) 99999-0003", email: "joao@pyropizzas.com", admissionDate: "2023-01-10", salary: 3200, active: true },
  { id: "4", name: "Maria Costa", role: "Atendente", shift: "Tarde", phone: "(11) 99999-0004", email: "maria@pyropizzas.com", admissionDate: "2023-09-20", salary: 2400, active: true },
];

export const customers: Customer[] = [
  { id: "1", name: "Ricardo Mendes", cpf: "123.456.789-01", phone: "(11) 98765-0001", email: "ricardo@email.com", birthDate: "1990-05-12", addresses: ["Rua das Flores, 123 - Jardim América"], classification: "VIP", loyaltyPoints: 850, totalOrders: 47, totalSpent: 3520, lastVisit: "2025-02-18" },
  { id: "2", name: "Fernanda Lima", cpf: "234.567.890-12", phone: "(11) 98765-0002", email: "fernanda@email.com", birthDate: "1985-11-28", addresses: ["Av. Paulista, 456 - Bela Vista"], classification: "VIP", loyaltyPoints: 620, totalOrders: 35, totalSpent: 2680, lastVisit: "2025-02-17" },
  { id: "3", name: "Bruno Almeida", cpf: "345.678.901-23", phone: "(11) 98765-0003", email: "bruno@email.com", birthDate: "1995-03-07", addresses: ["Rua Augusta, 789 - Consolação"], classification: "Regular", loyaltyPoints: 320, totalOrders: 18, totalSpent: 1450, lastVisit: "2025-02-15" },
  { id: "4", name: "Juliana Rocha", cpf: "456.789.012-34", phone: "(11) 98765-0004", email: "juliana@email.com", birthDate: "1992-08-15", addresses: ["Rua Oscar Freire, 321 - Pinheiros", "Rua Frei Caneca, 100 - Consolação"], classification: "Regular", loyaltyPoints: 180, totalOrders: 12, totalSpent: 980, lastVisit: "2025-02-10" },
  { id: "5", name: "Pedro Nascimento", cpf: "567.890.123-45", phone: "(11) 98765-0005", email: "pedro@email.com", birthDate: "1988-01-22", addresses: ["Alameda Santos, 654 - Paraíso"], classification: "Regular", loyaltyPoints: 240, totalOrders: 15, totalSpent: 1120, lastVisit: "2025-02-14" },
  { id: "6", name: "Camila Ferreira", cpf: "678.901.234-56", phone: "(11) 98765-0006", email: "camila@email.com", birthDate: "1998-07-03", addresses: ["Rua Haddock Lobo, 987 - Cerqueira César"], classification: "Novo", loyaltyPoints: 40, totalOrders: 3, totalSpent: 245, lastVisit: "2025-02-18" },
  { id: "7", name: "Lucas Barbosa", cpf: "789.012.345-67", phone: "(11) 98765-0007", email: "lucas@email.com", birthDate: "1993-12-10", addresses: ["Av. Rebouças, 147 - Pinheiros"], classification: "Novo", loyaltyPoints: 60, totalOrders: 4, totalSpent: 320, lastVisit: "2025-02-16" },
  { id: "8", name: "Patrícia Souza", cpf: "890.123.456-78", phone: "(11) 98765-0008", email: "patricia@email.com", birthDate: "1987-04-19", addresses: ["Rua Bela Cintra, 258 - Consolação"], classification: "Regular", loyaltyPoints: 380, totalOrders: 22, totalSpent: 1790, lastVisit: "2025-02-12" },
  { id: "9", name: "Gustavo Martins", cpf: "901.234.567-89", phone: "(11) 98765-0009", email: "gustavo@email.com", birthDate: "1991-09-25", addresses: ["Rua da Consolação, 369 - República"], classification: "VIP", loyaltyPoints: 720, totalOrders: 40, totalSpent: 3100, lastVisit: "2025-02-19" },
  { id: "10", name: "Isabela Nunes", cpf: "012.345.678-90", phone: "(11) 98765-0010", email: "isabela@email.com", birthDate: "1996-06-30", addresses: ["Rua Pamplona, 741 - Jardim Paulista"], classification: "Regular", loyaltyPoints: 150, totalOrders: 9, totalSpent: 720, lastVisit: "2025-02-08" },
  { id: "11", name: "Thiago Araújo", cpf: "111.222.333-44", phone: "(11) 98765-0011", email: "thiago@email.com", birthDate: "1994-02-14", addresses: ["Av. Brasil, 852 - Jardim Europa"], classification: "Novo", loyaltyPoints: 20, totalOrders: 2, totalSpent: 156, lastVisit: "2025-02-17" },
  { id: "12", name: "Renata Carvalho", cpf: "222.333.444-55", phone: "(11) 98765-0012", email: "renata@email.com", birthDate: "1989-10-08", addresses: ["Rua Estados Unidos, 963 - Jardim América"], classification: "Inativo", loyaltyPoints: 90, totalOrders: 6, totalSpent: 480, lastVisit: "2024-11-20" },
  { id: "13", name: "Marcelo Pinto", cpf: "333.444.555-66", phone: "(11) 98765-0013", email: "marcelo@email.com", birthDate: "1986-08-02", addresses: ["Rua Artur de Azevedo, 174 - Pinheiros"], classification: "Regular", loyaltyPoints: 290, totalOrders: 16, totalSpent: 1280, lastVisit: "2025-02-11" },
  { id: "14", name: "Amanda Teixeira", cpf: "444.555.666-77", phone: "(11) 98765-0014", email: "amanda@email.com", birthDate: "1997-03-27", addresses: ["Rua Cardeal Arcoverde, 285 - Pinheiros"], classification: "Novo", loyaltyPoints: 30, totalOrders: 2, totalSpent: 178, lastVisit: "2025-02-19" },
  { id: "15", name: "Felipe Gomes", cpf: "555.666.777-88", phone: "(11) 98765-0015", email: "felipe@email.com", birthDate: "1990-12-18", addresses: ["Av. Faria Lima, 396 - Itaim Bibi"], classification: "Inativo", loyaltyPoints: 110, totalOrders: 7, totalSpent: 560, lastVisit: "2024-10-05" },
];

export const orders: Order[] = [
  { id: "1", number: 1042, type: "Delivery", customerName: "Ricardo Mendes", items: [{ name: "Pepperoni", qty: 1, size: "G", price: 62 }, { name: "Coca-Cola 2L", qty: 1, size: "-", price: 14 }], total: 82, status: "Entregue", createdAt: "2025-02-19T18:30:00", paymentMethod: "PIX", notes: "Sem cebola", address: "Rua das Flores, 123 - Jardim América" },
  { id: "2", number: 1043, type: "Mesa", customerName: "Fernanda Lima", items: [{ name: "Quatro Queijos", qty: 1, size: "M", price: 50 }, { name: "Margherita", qty: 1, size: "M", price: 42 }], total: 92, status: "Em Preparo", createdAt: "2025-02-19T19:15:00", paymentMethod: "Cartão Crédito", notes: "", tableNumber: 3 },
  { id: "3", number: 1044, type: "Balcão", customerName: "Bruno Almeida", items: [{ name: "Calabresa", qty: 1, size: "G", price: 54 }], total: 54, status: "Aguardando", createdAt: "2025-02-19T19:45:00", paymentMethod: "Dinheiro", notes: "Borda recheada" },
  { id: "4", number: 1045, type: "Delivery", customerName: "Gustavo Martins", items: [{ name: "Frango com Catupiry", qty: 1, size: "G", price: 58 }, { name: "Chocolate com Morango", qty: 1, size: "M", price: 46 }], total: 110, status: "Saiu p/ Entrega", createdAt: "2025-02-19T19:20:00", paymentMethod: "Cartão Débito", notes: "", address: "Rua da Consolação, 369 - República" },
  { id: "5", number: 1046, type: "Telefone", customerName: "Juliana Rocha", items: [{ name: "Portuguesa", qty: 1, size: "G", price: 56 }], total: 62, status: "Em Preparo", createdAt: "2025-02-19T20:00:00", paymentMethod: "PIX", notes: "Entregar no portão 2", address: "Rua Oscar Freire, 321 - Pinheiros" },
  { id: "6", number: 1047, type: "Mesa", customerName: "Camila Ferreira", items: [{ name: "Margherita", qty: 2, size: "P", price: 64 }], total: 64, status: "Aguardando", createdAt: "2025-02-19T20:10:00", paymentMethod: "Cartão Crédito", notes: "", tableNumber: 1 },
  { id: "7", number: 1048, type: "Delivery", customerName: "Pedro Nascimento", items: [{ name: "Bacon Cheddar", qty: 1, size: "G", price: 64 }, { name: "Banana com Canela", qty: 1, size: "M", price: 42 }], total: 112, status: "Entregue", createdAt: "2025-02-19T17:50:00", paymentMethod: "PIX", notes: "", address: "Alameda Santos, 654 - Paraíso" },
  { id: "8", number: 1049, type: "Balcão", customerName: "Lucas Barbosa", items: [{ name: "Pepperoni", qty: 1, size: "M", price: 52 }], total: 52, status: "Entregue", createdAt: "2025-02-19T18:05:00", paymentMethod: "Dinheiro", notes: "" },
  { id: "9", number: 1050, type: "Delivery", customerName: "Patrícia Souza", items: [{ name: "Vegetariana", qty: 1, size: "G", price: 54 }], total: 60, status: "Cancelado", createdAt: "2025-02-19T19:00:00", paymentMethod: "PIX", notes: "Cliente cancelou", address: "Rua Bela Cintra, 258 - Consolação" },
  { id: "10", number: 1051, type: "Mesa", customerName: "Amanda Teixeira", items: [{ name: "Romeu e Julieta", qty: 1, size: "P", price: 34 }, { name: "Calabresa", qty: 1, size: "M", price: 44 }], total: 78, status: "Em Preparo", createdAt: "2025-02-19T20:20:00", paymentMethod: "Cartão Crédito", notes: "", tableNumber: 5 },
];

export const tables: TableItem[] = [
  { id: "1", number: 1, capacity: 4, status: "Ocupada" },
  { id: "2", number: 2, capacity: 2, status: "Disponível" },
  { id: "3", number: 3, capacity: 6, status: "Ocupada" },
  { id: "4", number: 4, capacity: 4, status: "Reservada" },
  { id: "5", number: 5, capacity: 8, status: "Ocupada" },
];

export const stockItems: StockItem[] = [
  { id: "1", name: "Mussarela", category: "Ingredientes", unit: "kg", currentQty: 8, minQty: 10, supplier: "Laticínios São Paulo", unitPrice: 38, lastUpdate: "2025-02-19" },
  { id: "2", name: "Farinha de Trigo", category: "Ingredientes", unit: "kg", currentQty: 25, minQty: 15, supplier: "Moinho Nacional", unitPrice: 6.5, lastUpdate: "2025-02-18" },
  { id: "3", name: "Molho de Tomate", category: "Ingredientes", unit: "L", currentQty: 12, minQty: 8, supplier: "Cirio Alimentos", unitPrice: 9.9, lastUpdate: "2025-02-17" },
  { id: "4", name: "Calabresa", category: "Ingredientes", unit: "kg", currentQty: 3, minQty: 5, supplier: "Frigorífico Sul", unitPrice: 28, lastUpdate: "2025-02-19" },
  { id: "5", name: "Caixa Pizza G", category: "Embalagens", unit: "un", currentQty: 120, minQty: 50, supplier: "Embalart", unitPrice: 1.8, lastUpdate: "2025-02-16" },
  { id: "6", name: "Guardanapo", category: "Descartáveis", unit: "pct", currentQty: 45, minQty: 20, supplier: "PapelMax", unitPrice: 4.5, lastUpdate: "2025-02-15" },
  { id: "7", name: "Coca-Cola 2L", category: "Bebidas", unit: "un", currentQty: 36, minQty: 24, supplier: "Distribuidora Central", unitPrice: 8.5, lastUpdate: "2025-02-18" },
  { id: "8", name: "Catupiry", category: "Ingredientes", unit: "kg", currentQty: 2, minQty: 4, supplier: "Laticínios São Paulo", unitPrice: 45, lastUpdate: "2025-02-19" },
];

export const deliveryDrivers: DeliveryDriver[] = [
  { id: "1", name: "Roberto Lima", vehicle: "Moto", plate: "ABC-1234", phone: "(11) 98888-0001", status: "Em Rota", currentOrder: 1045 },
  { id: "2", name: "Diego Ferraz", vehicle: "Moto", plate: "DEF-5678", phone: "(11) 98888-0002", status: "Disponível" },
];

export const financialEntries: FinancialEntry[] = [
  { id: "1", date: "2025-02-19", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 2840 },
  { id: "2", date: "2025-02-19", description: "Compra de insumos", type: "Despesa", category: "Fornecedores", paymentMethod: "Boleto", value: 680 },
  { id: "3", date: "2025-02-18", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 3120 },
  { id: "4", date: "2025-02-18", description: "Conta de energia", type: "Despesa", category: "Utilidades", paymentMethod: "Débito Automático", value: 450 },
  { id: "5", date: "2025-02-17", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 2560 },
  { id: "6", date: "2025-02-17", description: "Salários", type: "Despesa", category: "Folha", paymentMethod: "Transferência", value: 15300 },
  { id: "7", date: "2025-02-16", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 3450 },
  { id: "8", date: "2025-02-16", description: "Manutenção forno", type: "Despesa", category: "Manutenção", paymentMethod: "PIX", value: 350 },
  { id: "9", date: "2025-02-15", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 4200 },
  { id: "10", date: "2025-02-15", description: "Material de limpeza", type: "Despesa", category: "Limpeza", paymentMethod: "Cartão", value: 180 },
  { id: "11", date: "2025-02-14", description: "Vendas do dia (Dia dos Namorados)", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 5800 },
  { id: "12", date: "2025-02-14", description: "Aluguel", type: "Despesa", category: "Aluguel", paymentMethod: "Boleto", value: 4500 },
  { id: "13", date: "2025-02-13", description: "Vendas do dia", type: "Receita", category: "Vendas", paymentMethod: "Diversos", value: 2980 },
  { id: "14", date: "2025-02-13", description: "Compra de bebidas", type: "Despesa", category: "Fornecedores", paymentMethod: "PIX", value: 520 },
];

export const weeklyRevenue = [
  { day: "Seg", receita: 2980, despesa: 520 },
  { day: "Ter", receita: 5800, despesa: 4500 },
  { day: "Qua", receita: 4200, despesa: 180 },
  { day: "Qui", receita: 3450, despesa: 350 },
  { day: "Sex", receita: 2560, despesa: 15300 },
  { day: "Sáb", receita: 3120, despesa: 450 },
  { day: "Dom", receita: 2840, despesa: 680 },
];

export const deliveryFees = [
  { neighborhood: "Centro", fee: 5, estimatedTime: 20 },
  { neighborhood: "Jardim América", fee: 8, estimatedTime: 30 },
  { neighborhood: "Pinheiros", fee: 7, estimatedTime: 25 },
  { neighborhood: "Consolação", fee: 6, estimatedTime: 20 },
  { neighborhood: "Paraíso", fee: 9, estimatedTime: 35 },
  { neighborhood: "Bela Vista", fee: 6, estimatedTime: 22 },
  { neighborhood: "Itaim Bibi", fee: 10, estimatedTime: 40 },
];
