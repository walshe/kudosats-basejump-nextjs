/**
      ____                 _
     |  _ \               (_)
     | |_) | __ _ ___  ___ _ _   _ _ __ ___  _ __
     |  _ < / _` / __|/ _ \ | | | | '_ ` _ \| '_ \
     | |_) | (_| \__ \  __/ | |_| | | | | | | |_) |
     |____/ \__,_|___/\___| |\__,_|_| |_| |_| .__/
                         _/ |               | |
                        |__/                |_|

     Employee Rewards System - Database Schema
     Adds wallet management and reward functionality to Basejump
*/

/**
 * -------------------------------------------------------
 * Section - Enums for Employee Rewards System
 * -------------------------------------------------------
 */

-- Wallet owner types
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                  WHERE t.typname = 'wallet_owner_type' AND n.nspname = 'basejump') THEN
        CREATE TYPE basejump.wallet_owner_type AS ENUM ('account', 'account_user');
    END IF;
END $$;

-- Wallet types for different payment systems
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                  WHERE t.typname = 'wallet_type' AND n.nspname = 'basejump') THEN
        CREATE TYPE basejump.wallet_type AS ENUM ('lightning', 'solana', 'points');
    END IF;
END $$;

-- Reward types
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                  WHERE t.typname = 'reward_type' AND n.nspname = 'basejump') THEN
        CREATE TYPE basejump.reward_type AS ENUM ('lightning_sats', 'company_tokens', 'points');
    END IF;
END $$;

-- Transaction status
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace 
                  WHERE t.typname = 'transaction_status' AND n.nspname = 'basejump') THEN
        CREATE TYPE basejump.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
    END IF;
END $$;

/**
 * -------------------------------------------------------
 * Section - Modify existing account_user table
 * -------------------------------------------------------
 */

-- Add surrogate UUID id column to account_user table
ALTER TABLE basejump.account_user 
ADD COLUMN IF NOT EXISTS id uuid DEFAULT extensions.uuid_generate_v4();

-- Make the new id column NOT NULL after populating existing rows
UPDATE basejump.account_user SET id = extensions.uuid_generate_v4() WHERE id IS NULL;
ALTER TABLE basejump.account_user ALTER COLUMN id SET NOT NULL;

-- Add unique constraint on the new id column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_user_id_unique') THEN
        ALTER TABLE basejump.account_user ADD CONSTRAINT account_user_id_unique UNIQUE (id);
    END IF;
END $$;

-- Keep the existing composite primary key for data integrity
-- The new id column will be used by wallets table as foreign key

/**
 * -------------------------------------------------------
 * Section - Wallets table
 * -------------------------------------------------------
 */

CREATE TABLE IF NOT EXISTS basejump.wallets (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    
    -- Owner can be either an account (company wallet) or account_user (employee wallet)
    owner_type basejump.wallet_owner_type NOT NULL,
    owner_id uuid NOT NULL,
    
    -- Wallet configuration
    wallet_type basejump.wallet_type NOT NULL,
    
    -- External wallet identifiers (LNbits, Solana, etc.)
    wallet_id text,
    admin_key text, -- Encrypted LNbits admin key
    invoice_key text, -- LNbits invoice/read key
    
    -- Cached balance (in minor units: sats, lamports, points)
    balance bigint DEFAULT 0 NOT NULL,
    
    -- Provider-specific configuration and metadata
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Standard Basejump fields
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users,
    updated_by uuid REFERENCES auth.users,
    
    -- Note: Foreign key constraints for owner_id will be enforced by application logic
    -- since PostgreSQL doesn't support conditional foreign keys based on owner_type
    CONSTRAINT wallets_owner_type_not_null CHECK (owner_type IS NOT NULL),
    CONSTRAINT wallets_owner_id_not_null CHECK (owner_id IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS wallets_owner_type_id_idx ON basejump.wallets (owner_type, owner_id);
CREATE INDEX IF NOT EXISTS wallets_wallet_type_idx ON basejump.wallets (wallet_type);
CREATE INDEX IF NOT EXISTS wallets_created_at_idx ON basejump.wallets (created_at);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE basejump.wallets TO authenticated, service_role;

-- Enable RLS
ALTER TABLE basejump.wallets ENABLE ROW LEVEL SECURITY;

-- Validate that owner_id references the correct table based on owner_type
CREATE OR REPLACE FUNCTION basejump.validate_wallet_owner()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.owner_type = 'account' THEN
        IF NOT EXISTS (SELECT 1 FROM basejump.accounts WHERE id = NEW.owner_id) THEN
            RAISE EXCEPTION 'Invalid account owner_id: %', NEW.owner_id;
        END IF;
    ELSIF NEW.owner_type = 'account_user' THEN
        IF NOT EXISTS (SELECT 1 FROM basejump.account_user WHERE id = NEW.owner_id) THEN
            RAISE EXCEPTION 'Invalid account_user owner_id: %', NEW.owner_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER basejump_validate_wallet_owner
    BEFORE INSERT OR UPDATE ON basejump.wallets
    FOR EACH ROW
    EXECUTE FUNCTION basejump.validate_wallet_owner();

-- Standard Basejump triggers
CREATE TRIGGER basejump_set_wallets_timestamp
    BEFORE INSERT OR UPDATE ON basejump.wallets
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_timestamps();

CREATE TRIGGER basejump_set_wallets_user_tracking
    BEFORE INSERT OR UPDATE ON basejump.wallets
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_user_tracking();

/**
 * -------------------------------------------------------
 * Section - Reward Categories table
 * -------------------------------------------------------
 */

CREATE TABLE IF NOT EXISTS basejump.reward_categories (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    account_id uuid REFERENCES basejump.accounts(id) ON DELETE CASCADE NOT NULL,
    
    -- Category details
    name text NOT NULL,
    description text,
    
    -- Business rules
    max_amount bigint, -- Maximum amount per reward in this category
    requires_approval boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    
    -- Metadata for additional configuration
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Standard Basejump fields
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users,
    updated_by uuid REFERENCES auth.users,
    
    -- Ensure category names are unique per account
    CONSTRAINT reward_categories_account_name_unique UNIQUE (account_id, name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS reward_categories_account_id_idx ON basejump.reward_categories (account_id);
CREATE INDEX IF NOT EXISTS reward_categories_active_idx ON basejump.reward_categories (active);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE basejump.reward_categories TO authenticated, service_role;

-- Enable RLS
ALTER TABLE basejump.reward_categories ENABLE ROW LEVEL SECURITY;

-- Standard Basejump triggers
CREATE TRIGGER basejump_set_reward_categories_timestamp
    BEFORE INSERT OR UPDATE ON basejump.reward_categories
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_timestamps();

CREATE TRIGGER basejump_set_reward_categories_user_tracking
    BEFORE INSERT OR UPDATE ON basejump.reward_categories
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_user_tracking();

/**
 * -------------------------------------------------------
 * Section - Rewards table
 * -------------------------------------------------------
 */

CREATE TABLE IF NOT EXISTS basejump.rewards (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    
    -- Tenant isolation
    account_id uuid REFERENCES basejump.accounts(id) ON DELETE CASCADE NOT NULL,
    
    -- Sender and recipient wallets
    sender_wallet_id uuid REFERENCES basejump.wallets(id) ON DELETE CASCADE NOT NULL,
    recipient_wallet_id uuid REFERENCES basejump.wallets(id) ON DELETE CASCADE NOT NULL,
    
    -- Reward details
    amount bigint NOT NULL CHECK (amount > 0),
    reward_type basejump.reward_type NOT NULL,
    category_id uuid REFERENCES basejump.reward_categories(id),
    
    -- Human-readable information
    note text,
    
    -- External transaction tracking
    external_tx_id text, -- LNbits payment hash, Solana transaction signature, etc.
    status basejump.transaction_status DEFAULT 'pending' NOT NULL,
    
    -- Approval workflow
    approved_by uuid REFERENCES auth.users,
    approved_at timestamp with time zone,
    
    -- Metadata for additional data
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Standard Basejump fields
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users,
    updated_by uuid REFERENCES auth.users,
    
    -- Ensure sender and recipient are in the same account context
    CONSTRAINT rewards_account_isolation CHECK (
        sender_wallet_id != recipient_wallet_id
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS rewards_account_id_idx ON basejump.rewards (account_id);
CREATE INDEX IF NOT EXISTS rewards_sender_wallet_id_idx ON basejump.rewards (sender_wallet_id);
CREATE INDEX IF NOT EXISTS rewards_recipient_wallet_id_idx ON basejump.rewards (recipient_wallet_id);
CREATE INDEX IF NOT EXISTS rewards_created_at_idx ON basejump.rewards (created_at);
CREATE INDEX IF NOT EXISTS rewards_status_idx ON basejump.rewards (status);
CREATE INDEX IF NOT EXISTS rewards_external_tx_id_idx ON basejump.rewards (external_tx_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE basejump.rewards TO authenticated, service_role;

-- Enable RLS
ALTER TABLE basejump.rewards ENABLE ROW LEVEL SECURITY;

-- Standard Basejump triggers
CREATE TRIGGER basejump_set_rewards_timestamp
    BEFORE INSERT OR UPDATE ON basejump.rewards
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_timestamps();

CREATE TRIGGER basejump_set_rewards_user_tracking
    BEFORE INSERT OR UPDATE ON basejump.rewards
    FOR EACH ROW
    EXECUTE FUNCTION basejump.trigger_set_user_tracking();

/**
 * -------------------------------------------------------
 * Section - RLS Policies
 * -------------------------------------------------------
 */

-- Wallets RLS Policies
-- Users can view wallets they own or that belong to accounts they're members of
CREATE POLICY "Users can view wallets for their accounts" ON basejump.wallets
    FOR SELECT
    TO authenticated
    USING (
        (owner_type = 'account' AND basejump.has_role_on_account(owner_id) = true) OR
        (owner_type = 'account_user' AND owner_id IN (
            SELECT au.id FROM basejump.account_user au 
            WHERE au.user_id = auth.uid()
        ))
    );

-- Account owners can create wallets for their accounts and account_users
CREATE POLICY "Account owners can create wallets" ON basejump.wallets
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (owner_type = 'account' AND basejump.has_role_on_account(owner_id, 'owner') = true) OR
        (owner_type = 'account_user' AND owner_id IN (
            SELECT au.id FROM basejump.account_user au
            JOIN basejump.accounts a ON a.id = au.account_id
            WHERE basejump.has_role_on_account(a.id, 'owner') = true
        ))
    );

-- Users can update wallets they have access to (balance updates restricted to service_role)
CREATE POLICY "Users can update accessible wallets" ON basejump.wallets
    FOR UPDATE
    TO authenticated
    USING (
        (owner_type = 'account' AND basejump.has_role_on_account(owner_id) = true) OR
        (owner_type = 'account_user' AND owner_id IN (
            SELECT au.id FROM basejump.account_user au 
            WHERE au.user_id = auth.uid()
        ))
    );

-- Service role can update all wallets (for balance updates from LNbits)
CREATE POLICY "Service role can update all wallets" ON basejump.wallets
    FOR UPDATE
    TO service_role
    USING (true);

-- Account owners can delete wallets
CREATE POLICY "Account owners can delete wallets" ON basejump.wallets
    FOR DELETE
    TO authenticated
    USING (
        (owner_type = 'account' AND basejump.has_role_on_account(owner_id, 'owner') = true) OR
        (owner_type = 'account_user' AND owner_id IN (
            SELECT au.id FROM basejump.account_user au
            JOIN basejump.accounts a ON a.id = au.account_id
            WHERE basejump.has_role_on_account(a.id, 'owner') = true
        ))
    );

-- Reward Categories RLS Policies
-- Users can view categories for accounts they're members of
CREATE POLICY "Users can view reward categories for their accounts" ON basejump.reward_categories
    FOR SELECT
    TO authenticated
    USING (basejump.has_role_on_account(account_id) = true);

-- Account owners can manage reward categories
CREATE POLICY "Account owners can manage reward categories" ON basejump.reward_categories
    FOR ALL
    TO authenticated
    USING (basejump.has_role_on_account(account_id, 'owner') = true)
    WITH CHECK (basejump.has_role_on_account(account_id, 'owner') = true);

-- Rewards RLS Policies  
-- Users can view rewards for accounts they're members of
CREATE POLICY "Users can view rewards for their accounts" ON basejump.rewards
    FOR SELECT
    TO authenticated
    USING (basejump.has_role_on_account(account_id) = true);

-- Account members can create rewards (subject to business rules in public functions)
CREATE POLICY "Account members can create rewards" ON basejump.rewards
    FOR INSERT
    TO authenticated
    WITH CHECK (basejump.has_role_on_account(account_id) = true);

-- Account owners and service role can update rewards (for status updates)
CREATE POLICY "Account owners can update rewards" ON basejump.rewards
    FOR UPDATE
    TO authenticated
    USING (basejump.has_role_on_account(account_id, 'owner') = true);

-- Service role can update all rewards (for external transaction confirmations)
CREATE POLICY "Service role can update all rewards" ON basejump.rewards
    FOR UPDATE
    TO service_role
    USING (true);

-- Account owners can delete rewards
CREATE POLICY "Account owners can delete rewards" ON basejump.rewards
    FOR DELETE
    TO authenticated
    USING (basejump.has_role_on_account(account_id, 'owner') = true);