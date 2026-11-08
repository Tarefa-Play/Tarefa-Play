CREATE TYPE public.app_role AS ENUM ('validador','anunciante','admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  telefone text,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "perfil proprio ou admin" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "atualiza proprio perfil" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "insere proprio perfil" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "ve proprios papeis ou admin" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.configuracoes (
  chave text PRIMARY KEY,
  valor text NOT NULL,
  descricao text
);
GRANT SELECT, UPDATE, INSERT ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logados leem config" ON public.configuracoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin altera config" ON public.configuracoes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin insere config" ON public.configuracoes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.configuracoes (chave, valor, descricao) VALUES
('comissao_percentual','35','Comissão da plataforma (%)'),
('saque_minimo','100','Saldo mínimo para saque (R$)'),
('pendente_horas_novos','24','Horas de saldo pendente para contas novas'),
('pacote_validacao_minimo','100','Validações mínimas por publicação'),
('prazo_habilitacao_horas','2','Prazo da vaga após habilitação (h)'),
('contestacao_horas','48','Prazo para contestação (h)'),
('bloqueio_horas','24','Duração do bloqueio (h)'),
('minimo_diario_instagram','10','Mínimo diário de tarefas de Instagram'),
('bloqueio_por_minimo_ativo','true','Bloqueio por não cumprir o mínimo ativo'),
('liberacao_ciclica','true','Liberação cíclica de tarefas'),
('valor_avaliacao_interna','0.10','Valor pago por avaliação interna (R$)');

CREATE TABLE public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  ativa boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.categorias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "todos leem categorias" ON public.categorias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin gerencia categorias" ON public.categorias FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.categorias (nome) VALUES
('Carros'),('Motos'),('Casas e imóveis'),('Roupas'),('Calçados'),('Bebidas'),('Bebê e infantil'),('Beleza'),
('Mercado financeiro e educação financeira'),('Tecnologia'),('Pets'),('Viagens'),('Comida'),('Esportes'),('Cursos'),('Outros');

CREATE TABLE public.auditoria (
  id bigserial PRIMARY KEY,
  usuario_id uuid,
  acao text NOT NULL,
  entidade text NOT NULL,
  dados jsonb,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auditoria TO authenticated;
GRANT ALL ON public.auditoria TO service_role;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin le auditoria" ON public.auditoria FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.registrar_auditoria()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.auditoria (usuario_id, acao, entidade, dados)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN jsonb_build_object('antes', to_jsonb(OLD))
         WHEN TG_OP = 'INSERT' THEN jsonb_build_object('depois', to_jsonb(NEW))
         ELSE jsonb_build_object('antes', to_jsonb(OLD), 'depois', to_jsonb(NEW)) END);
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER aud_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();
CREATE TRIGGER aud_configuracoes AFTER INSERT OR UPDATE OR DELETE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();
CREATE TRIGGER aud_categorias AFTER INSERT OR UPDATE OR DELETE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

-- Novo usuário: cria perfil e papel escolhido (só validador ou anunciante; admin nunca pelo cadastro)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r text := NEW.raw_user_meta_data->>'perfil';
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'telefone');
  IF r = 'anunciante' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'anunciante');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'validador');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();