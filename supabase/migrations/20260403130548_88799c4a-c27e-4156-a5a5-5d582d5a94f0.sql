
-- Confirm the existing user's email
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmation_token = '', 
    raw_app_meta_data = raw_app_meta_data || '{"email_verified": true}'::jsonb
WHERE email = 'ebenezerboluwatife14@gmail.com' AND email_confirmed_at IS NULL;

-- Allow admins to insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
