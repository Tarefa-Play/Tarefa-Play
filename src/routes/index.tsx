import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ShieldCheck, Lock, BadgeCheck, UserCheck, MessageSquare, Heart, Share2, AtSign, Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth, rolePath } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tarefa-Play — Seu produto avaliado por pessoas reais" },
      { name: "description", content: "Valide seu produto com avaliações honestas de pessoas reais: nota, % de aprovação e os motivos. Ou avalie produtos com liberdade de horário." },
      { property: "og:title", content: "Tarefa-Play — Seu produto avaliado por pessoas reais. Sem filtro." },
      { property: "og:description", content: "Validação honesta de produtos: nota, % de aprovação e diagnóstico, feitos por Validadores independentes." },
    ],
  }),
  component: Home,
});

function Header() {
  const { session, role, loading } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Logo />
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
          <a href="#validadores" className="hover:text-foreground">Para Validadores</a>
          <a href="#anunciantes" className="hover:text-foreground">Para Anunciantes</a>
        </nav>
        <div className="flex items-center gap-2">
          {!loading && session ? (
            <Button asChild variant="hero" size="sm"><Link to={rolePath(role)}>Ir para meu painel</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/entrar">Entrar</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/cadastro" search={{ perfil: "validador" }}>Criar conta</Link></Button>
            </>
          )}
        </div>
      </div>
      <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 pb-3 text-xs font-medium text-muted-foreground md:hidden">
        <a href="#como-funciona" className="shrink-0 hover:text-foreground">Como funciona</a>
        <a href="#validadores" className="shrink-0 hover:text-foreground">Para Validadores</a>
        <a href="#anunciantes" className="shrink-0 hover:text-foreground">Para Anunciantes</a>
      </nav>
    </header>
  );
}

function ScoreCard() {
  const bars = [["Produto", 88], ["Preço", 71], ["Divulgação", 79]] as const;
  return (
    <div className="w-full max-w-sm rounded-3xl border bg-card p-6 shadow-elegant">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Resultado da validação</p>
      <div className="mt-4 flex items-end gap-6">
        <div>
          <p className="font-display text-5xl font-bold">4,2</p>
          <div className="mt-1 flex text-primary">
            {[0, 1, 2, 3].map((i) => <Star key={i} className="size-4 fill-current" />)}
            <Star className="size-4 opacity-30" />
          </div>
        </div>
        <div className="rounded-2xl bg-success-soft px-4 py-2">
          <p className="font-display text-2xl font-bold text-success-foreground">82%</p>
          <p className="text-xs text-success-foreground/80">aprovação</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {bars.map(([l, v]) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-sm"><span>{l}</span><span className="text-muted-foreground">{v}%</span></div>
            <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-gradient-primary" style={{ width: `${v}%` }} /></div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Exemplo ilustrativo · 100 avaliações</p>
    </div>
  );
}

const faq: [string, string][] = [
  ["O que é o Tarefa-Play?", "Uma plataforma que conecta Anunciantes, que querem saber o que o público acha dos seus produtos, a Validadores independentes, que avaliam com honestidade."],
  ["Como e quando o saque será feito?", "A regra planejada prevê saque via Pix, para uma chave do próprio titular, a partir de R$ 100. O pagamento via Pix ainda não está disponível nesta etapa; prazos e condições serão confirmados quando a funcionalidade for ativada."],
  ["Quanto eu ganho como Validador?", "Cada tarefa tem um valor exibido antes de você aceitar. Os ganhos variam e não são garantidos."],
  ["Preciso cumprir horário?", "Não. O Validador é um usuário independente, com liberdade de horário e sem vínculo trabalhista."],
  ["O anunciante pode apagar uma nota ruim?", "Não. As avaliações são independentes e o anunciante não pode alterar nem apagar o resultado."],
  ["Quem pode participar?", "A plataforma é destinada a maiores de 18 anos. Poderão ser solicitadas verificações adicionais quando esses recursos estiverem disponíveis."],
];

function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-success" /> Validação honesta de produtos
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] md:text-6xl">
              Seu produto avaliado por pessoas reais. <span className="text-primary">Sem filtro.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Descubra o que o público pensa do seu produto, do preço e da divulgação — antes de investir pesado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="success" size="xl"><Link to="/cadastro" search={{ perfil: "validador" }}>Quero validar e ganhar</Link></Button>
              <Button asChild variant="hero" size="xl"><Link to="/cadastro" search={{ perfil: "anunciante" }}>Quero validar meu produto</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">Uma plataforma para validar produtos de verdade.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">O Validador julga de forma independente. Ninguém diz o que ele deve achar.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [MessageSquare, "Comenta", "o que foi bom ou ruim"],
            [Heart, "Curte", "ou não curte"],
            [Share2, "Compartilha", "ou não compartilha"],
            [AtSign, "Marca amigos", "ou não marca"],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Heart;
            return (
              <div key={t as string} className="rounded-2xl border bg-card p-5 shadow-card">
                <I className="size-6 text-primary" />
                <p className="mt-4 font-display font-semibold">{t as string}</p>
                <p className="text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">Como funciona</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["O Anunciante cria a publicação", "Foto, preço e texto de divulgação, como seria no feed."],
              ["O Validador avalia", "Dá nota ao produto, ao preço e à divulgação e responde se compraria."],
              ["O Anunciante recebe o resultado", "Nota, % de aprovação e os motivos, em um diagnóstico privado."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-3xl border border-ink-foreground/10 p-6">
                <span className="font-display text-5xl font-bold text-success">0{i + 1}</span>
                <p className="mt-4 font-display text-lg font-semibold">{t}</p>
                <p className="mt-1 text-sm opacity-70">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Etapa 1</p>
              <p className="mt-2 font-display text-2xl font-bold">Validação privada</p>
              <p className="mt-2 opacity-85">100 avaliações por publicação, feitas dentro da plataforma por quem curte aquela categoria. Só você vê o resultado.</p>
            </div>
            <div className="rounded-3xl bg-success p-7 text-success-foreground">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Etapa 2</p>
              <p className="mt-2 font-display text-2xl font-bold">Tarefas reais</p>
              <p className="mt-2 opacity-85">Depois de validar, leve o produto às redes: Instagram, visitas ao site e YouTube, com verificação por código.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Duas colunas */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2">
        {[
          { id: "validadores", t: "Para Validadores", items: ["Avalie produtos das categorias que você curte", "Liberdade de horário, sem vínculo trabalhista",  "Regra de saque planejada: Pix a partir de R$ 100 (indisponível nesta etapa)", "Níveis Bronze, Prata, Ouro e Diamante"], cta: "Quero validar e ganhar", perfil: "validador" as const, v: "success" as const },
          { id: "anunciantes", t: "Para Anunciantes", items: ["Opinião honesta antes de investir em divulgação", "Nota, % de aprovação e diagnóstico", "Avaliações de pessoas que curtem sua categoria", "Resultado privado, que ninguém altera"], cta: "Quero validar meu produto", perfil: "anunciante" as const, v: "hero" as const },
        ].map((c) => (
          <div key={c.id} id={c.id} className="scroll-mt-24 rounded-3xl border bg-card p-8 shadow-card">
            <h3 className="text-2xl font-bold">{c.t}</h3>
            <ul className="mt-5 space-y-3">
              {c.items.map((i) => (
                <li key={i} className="flex gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-success" />{i}</li>
              ))}
            </ul>
            <Button asChild variant={c.v} size="lg" className="mt-7"><Link to="/cadastro" search={{ perfil: c.perfil }}>{c.cta}</Link></Button>
          </div>
        ))}
      </section>
      <p className="-mt-12 pb-16 text-center text-xs text-muted-foreground">Os ganhos variam e não são garantidos.</p>

      {/* Exemplo de resultado */}
      <section aria-label="Exemplo de resultado de validação" className="mx-auto flex max-w-6xl justify-center px-5 pb-20">
        <ScoreCard />
      </section>

      {/* Confiança */}
      <section className="border-y bg-primary-soft">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {[[UserCheck, "Avaliações independentes"], [Lock, "O anunciante não apaga a nota"], [BadgeCheck, "Cadastro sujeito a verificações"], [ShieldCheck, "Somente maiores de 18"]].map(([Icon, t]) => {
            const I = Icon as typeof Lock;
            return <div key={t as string} className="flex items-center gap-3 text-sm font-semibold text-secondary-foreground"><I className="size-5 shrink-0 text-primary" />{t as string}</div>;
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faq.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <nav className="flex gap-6">
            <Link to="/termos" className="hover:text-foreground">Termos</Link>
            <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
            <Link to="/contato" className="hover:text-foreground">Contato</Link>
          </nav>
          <p>© 2026 Tarefa-Play</p>
        </div>
      </footer>

      {/* CTA final */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-primary px-6 py-14 text-center text-primary-foreground shadow-elegant">
          <h2 className="text-3xl font-bold md:text-4xl">Pronto para ouvir a verdade sobre seu produto?</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="success" size="xl"><Link to="/cadastro" search={{ perfil: "validador" }}>Quero validar e ganhar</Link></Button>
            <Button asChild variant="secondary" size="xl" className="rounded-full font-semibold"><Link to="/cadastro" search={{ perfil: "anunciante" }}>Quero validar meu produto</Link></Button>
          </div>
        </div>
      </section>

    </div>
  );
}
