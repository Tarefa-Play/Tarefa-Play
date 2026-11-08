# Tarefa-Play

Plataforma de validação de produtos que conecta Anunciantes a Validadores independentes.

Este projeto é desenvolvido com [Lovable](https://lovable.dev) e usa Lovable Cloud para a infraestrutura gerenciada. Alterações de schema e banco de dados devem ser feitas pelo fluxo do Lovable Cloud, conforme as regras em `AGENTS.md`.

## Desenvolvimento

Requisitos: Bun (versão atual) e Node.js 22 ou superior.

```sh
bun install --frozen-lockfile
bun run dev
```

## Verificações

```sh
bun run test
bun run build
```

O GitHub Actions executa testes e build de produção em pull requests direcionados à `main`. O lint geral está temporariamente fora do bloqueio porque o repositório já apresenta centenas de pendências de formatação preexistentes; elas devem ser tratadas em uma tarefa dedicada.

## Fluxo de contribuição

- Desenvolva em uma branch de trabalho.
- Abra um pull request para `main`.
- Não faça merge sem revisão e validação do responsável pelo projeto.
- Não edite migrations ou arquivos gerados manualmente; consulte `AGENTS.md`.
