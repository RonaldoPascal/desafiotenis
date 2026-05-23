# Tênis no Alçapão

Plataforma web de agendamento de partidas de tênis no saibro para moradores e amigos do Condomínio Reserva do Paratehy.

## Requisitos

- Docker Desktop
- Node.js 20+

## Configuração Inicial

```bash
# Clone o repositório
git clone <url>

# Instale todas as dependências (Docker, composer, npm)
make install
```

## Desenvolvimento

```bash
make up          # Sobe a API (http://localhost:8080)
npm run dev      # Sobe o frontend (http://localhost:5173)
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `make up` | Sobe os containers Docker |
| `make down` | Derruba os containers |
| `make migrate` | Executa as migrations |
| `make seed` | Executa os seeders |
| `make fresh` | Recria o banco e executa os seeders |
| `make deploy` | Deploy em produção |
| `make send` | Commit e push com lint |
| `make db` | Abre o MySQL interativo |
| `make thinker` | Abre o artisan tinker |
| `make shell` | Abre o bash no container PHP |

## Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@admin.com | 123456 |
| Desafiante | amigo@teste.com | 123456 |

## Stack

- **Backend**: Laravel 11, PHP 8.4, MySQL 8, Sanctum
- **Frontend**: React 19, TypeScript 5, Vite, Tailwind CSS
- **Infra**: Docker, Nginx
