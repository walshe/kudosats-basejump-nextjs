# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn install` - Install dependencies
- `yarn dev` - Start Next.js development server
- `yarn build` - Build the production application
- `yarn start` - Start production server
- `supabase start` - Start local Supabase instance
- `supabase stop` - Stop local Supabase instance

## Testing

Database tests are located in `supabase/tests/database/` and use the Supabase test helpers. Tests are written in SQL and use the pgTAP testing framework.

## Architecture Overview

This is a **Basejump Next.js starter** - a SaaS application template that combines Next.js with Supabase and the Basejump framework for multi-tenant applications.

### Core Concepts

- **Personal Accounts**: Every authenticated user gets a personal account automatically
- **Team Accounts**: Users can create and join team accounts for collaboration
- **Account-based Routing**: URLs use account slugs (`/dashboard/[accountSlug]`) for team contexts
- **Role-based Permissions**: Managed through Supabase RLS with account-level roles

### Key Architecture Components

**Authentication & Authorization**
- Supabase Auth handles user authentication
- Basejump provides account-based authorization layer
- RLS policies enforce account-level data access

**Account System**
- `src/lib/hooks/use-accounts.ts` - Client-side account data fetching
- `src/lib/actions/teams.ts` - Server actions for team management
- `src/components/basejump/account-selector.tsx` - Account switching UI

**Data Layer**
- Supabase client (`src/lib/supabase/client.ts`) for browser
- Supabase server (`src/lib/supabase/server.ts`) for SSR/actions
- Basejump schema provides account tables and RPC functions

**Routing Structure**
- `/dashboard/(personalAccount)` - Personal account dashboard
- `/dashboard/[accountSlug]` - Team account dashboard
- Account slug determines the active account context

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set Supabase URL and anon key
3. Set `NEXT_PUBLIC_URL` for invitation/billing links
4. For billing: Configure Stripe keys in `supabase/functions/.env`

### Database Operations

Use Basejump RPC functions instead of direct table operations:
- `get_accounts()` - Fetch user's accounts
- `create_account(name, slug)` - Create team account
- `update_account(account_id, name?, slug?)` - Update account

### Billing Integration

Basejump includes Stripe integration for subscription billing on both personal and team accounts. Billing can be enabled/disabled per account type.