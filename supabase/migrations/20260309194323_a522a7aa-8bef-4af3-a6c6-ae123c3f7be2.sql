
-- Create pizzas table
CREATE TABLE public.pizzas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'salgada' CHECK (category IN ('salgada', 'doce')),
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  price_g NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_broto NUMERIC(10,2) NOT NULL DEFAULT 0,
  prep_time INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no auth required for now)
ALTER TABLE public.pizzas ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view pizzas" ON public.pizzas
  FOR SELECT USING (true);

-- Allow public insert/update/delete (no auth yet)
CREATE POLICY "Anyone can insert pizzas" ON public.pizzas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update pizzas" ON public.pizzas
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete pizzas" ON public.pizzas
  FOR DELETE USING (true);

-- Insert mock data
INSERT INTO public.pizzas (name, description, category, ingredients, price_g, price_broto, prep_time, active, image_url) VALUES
  ('Margherita', 'Molho de tomate, mussarela, manjericão fresco', 'salgada', ARRAY['Molho de tomate', 'Mussarela', 'Manjericão'], 52, 26, 25, true, ''),
  ('Calabresa', 'Calabresa fatiada, cebola, azeitonas', 'salgada', ARRAY['Calabresa', 'Cebola', 'Azeitonas', 'Mussarela'], 54, 27, 25, true, ''),
  ('Portuguesa', 'Presunto, ovos, cebola, azeitonas, ervilha', 'salgada', ARRAY['Presunto', 'Ovos', 'Cebola', 'Azeitonas', 'Ervilha', 'Mussarela'], 56, 28, 30, true, ''),
  ('Frango com Catupiry', 'Frango desfiado com catupiry cremoso', 'salgada', ARRAY['Frango desfiado', 'Catupiry', 'Mussarela'], 58, 29, 28, true, ''),
  ('Quatro Queijos', 'Mussarela, provolone, gorgonzola, parmesão', 'salgada', ARRAY['Mussarela', 'Provolone', 'Gorgonzola', 'Parmesão'], 60, 30, 25, true, ''),
  ('Pepperoni', 'Pepperoni importado com mussarela', 'salgada', ARRAY['Pepperoni', 'Mussarela', 'Orégano'], 62, 31, 22, true, ''),
  ('Bacon Cheddar', 'Bacon crocante, cheddar derretido, cebola caramelizada', 'salgada', ARRAY['Bacon', 'Cheddar', 'Cebola caramelizada'], 64, 32, 28, true, ''),
  ('Vegetariana', 'Brócolis, palmito, milho, tomate, champignon', 'salgada', ARRAY['Brócolis', 'Palmito', 'Milho', 'Tomate', 'Champignon'], 54, 27, 25, true, ''),
  ('Lombo Canadense', 'Lombo canadense, catupiry, cebola roxa', 'salgada', ARRAY['Lombo canadense', 'Catupiry', 'Cebola roxa'], 62, 31, 30, false, ''),
  ('Chocolate com Morango', 'Chocolate ao leite com morangos frescos', 'doce', ARRAY['Chocolate ao leite', 'Morangos', 'Leite condensado'], 56, 28, 20, true, ''),
  ('Banana com Canela', 'Banana caramelizada, canela e açúcar', 'doce', ARRAY['Banana', 'Canela', 'Açúcar', 'Leite condensado'], 52, 26, 18, true, ''),
  ('Romeu e Julieta', 'Goiabada derretida com queijo minas', 'doce', ARRAY['Goiabada', 'Queijo minas'], 54, 27, 20, true, '');
