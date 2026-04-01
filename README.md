# 🚀 Affiliate OS SaaS

> Plataforma SaaS de gestão de afiliados — independente de qualquer CMS ou plataforma de e-commerce.

![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## 📋 Sobre o Projeto

O **Affiliate OS** nasceu da transformação de um plugin WordPress de afiliados num SaaS standalone completo. O sistema permite que empresas (clientes) gerem os seus próprios programas de afiliados, com rastreamento de vendas via API REST, independente de qualquer plataforma de loja.

---

## 🏗️ Arquitectura

```
Owner (dono do SaaS)
└── Empresas (clientes)
    ├── Admin (gestor da empresa)
    │   ├── Afiliados
    │   ├── Cupões
    │   ├── Produtos
    │   └── Comissões
    └── API Key (integração com qualquer loja)
```

### Multi-tenancy
Cada empresa tem os seus próprios dados completamente isolados. Um admin só vê os dados da sua empresa. Um afiliado só vê as suas comissões.

---

## ⚙️ Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React 18 + Inertia.js |
| Build Tool | Vite 8 |
| Base de Dados | SQLite (dev) / MySQL (prod) |
| Autenticação | Laravel Breeze |
| Gráficos | Chart.js 4 |

---

## ✅ Funcionalidades Implementadas

### Painel do Owner
- Gestão completa de empresas (criar, editar, ativar/desativar, deletar)
- Geração e regeneração de API Key por empresa
- Trocar admin de uma empresa
- Ver detalhes, afiliados e métricas por empresa

### Painel do Admin (Empresa)
- Dashboard com métricas em tempo real (comissões, vendas, gráficos)
- Filtros por período (hoje, semana, mês, personalizado)
- Modal de detalhes por afiliado com histórico de vendas e gráficos
- Gestão de afiliados (CRUD completo)
- Gestão de cupões (com desconto %, frete grátis, validade, limite de usos)
- Gestão de produtos com % de comissão por produto
- Configurações com API Key visível

### API REST
- `POST /api/v1/sales` — receber vendas de qualquer plataforma
- Autenticação por `X-API-Key` no header
- Cálculo automático de comissão por produto
- Idempotência (evita duplicados pelo order_id)

---

## 🗺️ Roadmap

- [ ] Dashboard do Owner com métricas globais do SaaS
- [ ] Listagem de comissões com filtros e exportação CSV
- [ ] Cancelamentos e estornos de comissões
- [ ] Tracking de cliques com links de afiliado rastreáveis
- [ ] Painel do Afiliado
- [ ] Menu lateral profissional (front-end completo)
- [ ] Plugin WordPress para integração automática

---

## 🚀 Instalação

```bash
# Clonar o repositório
git clone https://github.com/RebecaEvelyn/Affiliate-os.git
cd Affiliate-os

# Instalar dependências PHP
composer install

# Instalar dependências Node
npm install --legacy-peer-deps

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Executar migrations
php artisan migrate

# Criar utilizador owner inicial
php artisan db:seed --class=OwnerSeeder

# Iniciar servidores
php artisan serve
npm run dev
```

---

## 📡 Exemplo de Uso da API

```bash
curl -X POST https://seu-dominio.com/api/v1/sales \
  -H "X-API-Key: sua_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "1001",
    "coupon_code": "CUPAO2026",
    "product_id": "123",
    "amount": 50.00
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Comissão registada com sucesso.",
  "data": {
    "commission_id": 1,
    "order_id": "1001",
    "affiliate": "Nome do Afiliado",
    "product": "Nome do Produto",
    "amount": "50.00",
    "commission_rate": "10%",
    "commission": "5.00",
    "status": "ativa"
  }
}
```

---

## 👩‍💻 Autora

**Rebeca Dias** — Full Stack Developer (PHP / JavaScript / Laravel / React)

---

*Transformando um plugin WordPress num SaaS escalável e independente de plataforma.*