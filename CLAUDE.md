# CLAUDE.md — Tênis no Alçapão

## Regras Gerais

- **NUNCA faça commits automáticos.** Sempre aguarde confirmação explícita do desenvolvedor.
- Use **português brasileiro** com acentuação correta em toda comunicação e nos seeders/mensagens de usuário.
- Siga rigorosamente a estrutura de pastas definida abaixo.

## Stack Tecnológica

### Backend
- Laravel 11 + PHP 8.4
- MySQL 8
- Laravel Sanctum (autenticação via tokens)
- Arquitetura MVC com Services
- REST JSON API

### Frontend
- React 19 + TypeScript 5+
- Vite
- Tailwind CSS 3
- React Router v6
- Axios

### Infraestrutura
- Docker + Docker Compose
- Nginx como reverse proxy
- Makefile obrigatório

## Estrutura de Pastas

```
desafiotenis/
├── backend/                  # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── src/
│   ├── pages/                # Telas completas (React Router)
│   ├── components/           # Componentes reutilizáveis
│   ├── services/             # Chamadas à API (axios)
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Helpers e formatadores
│   └── types/                # TypeScript interfaces
├── docker/
│   ├── nginx/
│   └── php/
├── CLAUDE.md
├── README.md
├── Makefile
├── docker-compose.yml
└── package.json
```

## Comandos Make

```bash
make up           # Sobe os containers
make up-prod      # Sobe em produção (build + migrate + cache)
make down         # Derruba os containers
make migrate      # Executa as migrations
make seed         # Executa os seeders
make fresh        # migrate:fresh --seed (apaga tudo)
make deploy       # Pull + build + migrate em produção
make send         # Lint + pede mensagem de commit + push
make db           # Abre o MySQL no container
make thinker      # Abre o artisan tinker
make shell        # Abre bash no container PHP
make install      # Primeira configuração do projeto
```

## Padrões de Código

### React
- Apenas componentes funcionais com hooks
- Props tipadas com interfaces TypeScript
- Serviços isolados em `/src/services/` — nunca fetch direto em componentes
- Páginas em `/src/pages/`, componentes reutilizáveis em `/src/components/`

### Laravel
- Controllers devem retornar JSON consistente via Resources
- Use FormRequest para validação
- Lógica de negócio em Services
- Nunca lógica pesada nos Controllers

## Padrão de Resposta da API

```json
// Sucesso
{ "data": {...}, "message": "Operação realizada com sucesso" }

// Erro
{ "message": "Descrição clara do erro", "errors": {...} }
```

## Padrão de Banco de Dados

Toda tabela deve ter:
```php
$table->id();
$table->timestamps();
$table->softDeletes();
```

Seeders usam `updateOrCreate()` para garantir idempotência.

Usuário admin padrão: `admin@admin.com` / `123456`

## UI e Modais

- Clicar fora do modal ou pressionar ESC fecha o modal
- Erros devem exibir mensagem clara ao usuário — nunca "Erro 500"
- Toasts de sucesso desaparecem automaticamente em 3 segundos
- Toasts de erro permanecem até o usuário fechar

## Perfis de Acesso

- **Admin**: usuário cujo e-mail contém "admin" ou "coordenador" — acessa o painel de gestão
- **Desafiante**: demais usuários autenticados — acessa apenas o painel de reservas
