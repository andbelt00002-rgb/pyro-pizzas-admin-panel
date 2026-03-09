
-- Create storage bucket for pizza images
INSERT INTO storage.buckets (id, name, public) VALUES ('pizza-images', 'pizza-images', true);

-- Allow public read access to pizza images
CREATE POLICY "Public read access for pizza images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pizza-images');

-- Allow public upload to pizza images
CREATE POLICY "Public upload pizza images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pizza-images');

-- Allow public update pizza images
CREATE POLICY "Public update pizza images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pizza-images') WITH CHECK (bucket_id = 'pizza-images');

-- Allow public delete pizza images
CREATE POLICY "Public delete pizza images" ON storage.objects
  FOR DELETE USING (bucket_id = 'pizza-images');
