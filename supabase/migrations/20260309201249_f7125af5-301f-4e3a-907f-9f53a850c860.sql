
CREATE TABLE public.bebidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nao_alcoolica' CHECK (category IN ('alcoolica', 'nao_alcoolica')),
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  volume TEXT NOT NULL DEFAULT '',
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bebidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bebidas" ON public.bebidas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bebidas" ON public.bebidas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bebidas" ON public.bebidas FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete bebidas" ON public.bebidas FOR DELETE USING (true);

INSERT INTO public.bebidas (name, category, price, volume, stock_quantity, active) VALUES
  ('Coca-Cola', 'nao_alcoolica', 8.00, '2L', 50, true),
  ('Coca-Cola', 'nao_alcoolica', 6.00, '600ml', 80, true),
  ('Coca-Cola Zero', 'nao_alcoolica', 8.00, '2L', 30, true),
  ('Guaraná Antarctica', 'nao_alcoolica', 7.50, '2L', 40, true),
  ('Guaraná Antarctica', 'nao_alcoolica', 5.50, '600ml', 60, true),
  ('Fanta Laranja', 'nao_alcoolica', 7.50, '2L', 25, true),
  ('Sprite', 'nao_alcoolica', 7.50, '2L', 20, true),
  ('Suco de Laranja Natural', 'nao_alcoolica', 10.00, '500ml', 15, true),
  ('Suco de Maracujá Natural', 'nao_alcoolica', 10.00, '500ml', 15, true),
  ('Água Mineral', 'nao_alcoolica', 4.00, '500ml', 100, true),
  ('Água com Gás', 'nao_alcoolica', 5.00, '500ml', 40, true),
  ('Cerveja Heineken', 'alcoolica', 12.00, '600ml', 48, true),
  ('Cerveja Brahma', 'alcoolica', 8.00, '600ml', 72, true),
  ('Cerveja Stella Artois', 'alcoolica', 14.00, '600ml', 36, true),
  ('Cerveja Corona', 'alcoolica', 15.00, '355ml', 24, true),
  ('Vinho Tinto Suave', 'alcoolica', 45.00, '750ml', 12, true),
  ('Vinho Branco Seco', 'alcoolica', 48.00, '750ml', 8, true),
  ('Espumante Brut', 'alcoolica', 55.00, '750ml', 6, true),
  ('Caipirinha de Limão', 'alcoolica', 18.00, '400ml', 20, true);
