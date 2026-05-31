CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.app_settings (
  id TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL DEFAULT 'ServiçosPRO',
  company_document TEXT NOT NULL DEFAULT '',
  company_email TEXT NOT NULL DEFAULT '',
  company_phone TEXT NOT NULL DEFAULT '',
  support_whatsapp TEXT NOT NULL DEFAULT '',
  company_address TEXT NOT NULL DEFAULT '',
  company_city TEXT NOT NULL DEFAULT '',
  business_hours TEXT NOT NULL DEFAULT 'Seg a Sex, 8h às 18h',
  default_commission_pct NUMERIC NOT NULL DEFAULT 20,
  notify_email TEXT NOT NULL DEFAULT '',
  notify_new_request BOOLEAN NOT NULL DEFAULT true,
  primary_color TEXT NOT NULL DEFAULT '#3B82F6',
  logo_url TEXT NOT NULL DEFAULT '',
  whatsapp_api_url TEXT NOT NULL DEFAULT '',
  whatsapp_api_token TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT app_settings_single_row CHECK (id = 'default')
);

GRANT SELECT, INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read settings"
ON public.app_settings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage settings"
ON public.app_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;