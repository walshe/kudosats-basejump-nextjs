/**
 * -------------------------------------------------------
 * Section - Public Functions for Employee Rewards System
 * -------------------------------------------------------
 * These functions follow Basejump patterns and provide API access
 * to wallet and reward functionality while enforcing business rules
 */

/**
 * -------------------------------------------------------
 * Section - Wallet Management Functions
 * -------------------------------------------------------
 */

/**
 * Creates a company-level wallet for an account
 * Only account owners can create company wallets
 */
CREATE OR REPLACE FUNCTION public.create_company_wallet(
    account_id uuid,
    wallet_type basejump.wallet_type,
    wallet_config jsonb DEFAULT '{}'::jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    new_wallet_id uuid;
    wallet_result json;
BEGIN
    -- Check if user is account owner
    IF NOT basejump.has_role_on_account(create_company_wallet.account_id, 'owner') THEN
        RAISE EXCEPTION 'Only account owners can create company wallets';
    END IF;
    
    -- Check if company already has a wallet of this type
    IF EXISTS (
        SELECT 1 FROM basejump.wallets w 
        WHERE w.owner_type = 'account' 
        AND w.owner_id = create_company_wallet.account_id 
        AND w.wallet_type = create_company_wallet.wallet_type
    ) THEN
        RAISE EXCEPTION 'Company already has a % wallet', wallet_type;
    END IF;
    
    -- Create the wallet
    INSERT INTO basejump.wallets (owner_type, owner_id, wallet_type, metadata)
    VALUES ('account', create_company_wallet.account_id, create_company_wallet.wallet_type, wallet_config)
    RETURNING id INTO new_wallet_id;
    
    -- Return wallet details
    SELECT json_build_object(
        'wallet_id', w.id,
        'owner_type', w.owner_type,
        'owner_id', w.owner_id,
        'wallet_type', w.wallet_type,
        'balance', w.balance,
        'created_at', w.created_at
    ) INTO wallet_result
    FROM basejump.wallets w
    WHERE w.id = new_wallet_id;
    
    RETURN wallet_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_company_wallet(uuid, basejump.wallet_type, jsonb) TO authenticated;

/**
 * Creates an employee wallet for a specific account_user
 * Account owners can create employee wallets
 */
CREATE OR REPLACE FUNCTION public.create_employee_wallet(
    account_user_id uuid,
    wallet_type basejump.wallet_type,
    wallet_config jsonb DEFAULT '{}'::jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    target_account_id uuid;
    new_wallet_id uuid;
    wallet_result json;
BEGIN
    -- Get the account_id for this account_user
    SELECT au.account_id INTO target_account_id
    FROM basejump.account_user au
    WHERE au.id = create_employee_wallet.account_user_id;
    
    IF target_account_id IS NULL THEN
        RAISE EXCEPTION 'Account user not found';
    END IF;
    
    -- Check if user is account owner or the employee themselves
    IF NOT (basejump.has_role_on_account(target_account_id, 'owner') OR 
            EXISTS (SELECT 1 FROM basejump.account_user au WHERE au.id = create_employee_wallet.account_user_id AND au.user_id = auth.uid())) THEN
        RAISE EXCEPTION 'Only account owners or the employee can create employee wallets';
    END IF;
    
    -- Check if employee already has a wallet of this type
    IF EXISTS (
        SELECT 1 FROM basejump.wallets w 
        WHERE w.owner_type = 'account_user' 
        AND w.owner_id = create_employee_wallet.account_user_id 
        AND w.wallet_type = create_employee_wallet.wallet_type
    ) THEN
        RAISE EXCEPTION 'Employee already has a % wallet', wallet_type;
    END IF;
    
    -- Create the wallet
    INSERT INTO basejump.wallets (owner_type, owner_id, wallet_type, metadata)
    VALUES ('account_user', create_employee_wallet.account_user_id, create_employee_wallet.wallet_type, wallet_config)
    RETURNING id INTO new_wallet_id;
    
    -- Return wallet details
    SELECT json_build_object(
        'wallet_id', w.id,
        'owner_type', w.owner_type,
        'owner_id', w.owner_id,
        'wallet_type', w.wallet_type,
        'balance', w.balance,
        'created_at', w.created_at
    ) INTO wallet_result
    FROM basejump.wallets w
    WHERE w.id = new_wallet_id;
    
    RETURN wallet_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_employee_wallet(uuid, basejump.wallet_type, jsonb) TO authenticated;

/**
 * Creates both company and employee wallets for an account owner
 * Automatically called when an owner needs dual wallet functionality
 */
CREATE OR REPLACE FUNCTION public.setup_owner_wallets(
    account_id uuid,
    owner_account_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    company_wallet_result json;
    employee_wallet_result json;
    final_result json;
BEGIN
    -- Check if user is account owner
    IF NOT basejump.has_role_on_account(setup_owner_wallets.account_id, 'owner') THEN
        RAISE EXCEPTION 'Only account owners can setup dual wallets';
    END IF;
    
    -- Create company wallet if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM basejump.wallets w 
        WHERE w.owner_type = 'account' 
        AND w.owner_id = setup_owner_wallets.account_id 
        AND w.wallet_type = 'company'
    ) THEN
        SELECT public.create_company_wallet(setup_owner_wallets.account_id, 'company'::basejump.wallet_type) INTO company_wallet_result;
    ELSE
        -- Get existing company wallet
        SELECT json_build_object(
            'wallet_id', w.id,
            'owner_type', w.owner_type,
            'owner_id', w.owner_id,
            'wallet_type', w.wallet_type,
            'balance', w.balance,
            'created_at', w.created_at
        ) INTO company_wallet_result
        FROM basejump.wallets w
        WHERE w.owner_type = 'account' 
        AND w.owner_id = setup_owner_wallets.account_id 
        AND w.wallet_type = 'company';
    END IF;
    
    -- Create employee wallet if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM basejump.wallets w 
        WHERE w.owner_type = 'account_user' 
        AND w.owner_id = setup_owner_wallets.owner_account_user_id 
        AND w.wallet_type = 'employee'
    ) THEN
        SELECT public.create_employee_wallet(setup_owner_wallets.owner_account_user_id, 'employee'::basejump.wallet_type) INTO employee_wallet_result;
    ELSE
        -- Get existing employee wallet
        SELECT json_build_object(
            'wallet_id', w.id,
            'owner_type', w.owner_type,
            'owner_id', w.owner_id,
            'wallet_type', w.wallet_type,
            'balance', w.balance,
            'created_at', w.created_at
        ) INTO employee_wallet_result
        FROM basejump.wallets w
        WHERE w.owner_type = 'account_user' 
        AND w.owner_id = setup_owner_wallets.owner_account_user_id 
        AND w.wallet_type = 'employee';
    END IF;
    
    -- Return both wallets
    SELECT json_build_object(
        'company_wallet', company_wallet_result,
        'employee_wallet', employee_wallet_result
    ) INTO final_result;
    
    RETURN final_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.setup_owner_wallets(uuid, uuid) TO authenticated;

/**
 * Gets all wallets for an account
 * Returns both company wallets and employee wallets
 */
CREATE OR REPLACE FUNCTION public.get_account_wallets(account_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
    -- Check access to account
    IF NOT basejump.has_role_on_account(get_account_wallets.account_id) THEN
        RAISE EXCEPTION 'Access denied to account wallets';
    END IF;
    
    RETURN (
        SELECT coalesce(json_agg(
            json_build_object(
                'wallet_id', w.id,
                'owner_type', w.owner_type,
                'owner_id', w.owner_id,
                'wallet_type', w.wallet_type,
                'balance', w.balance,
                'created_at', w.created_at,
                'employee_name', CASE 
                    WHEN w.owner_type = 'account_user' THEN (
                        SELECT pa.name 
                        FROM basejump.account_user au
                        JOIN basejump.accounts pa ON pa.primary_owner_user_id = au.user_id AND pa.personal_account = true
                        WHERE au.id = w.owner_id
                    )
                    ELSE null
                END
            )
        ), '[]'::json)
        FROM basejump.wallets w
        WHERE (w.owner_type = 'account' AND w.owner_id = get_account_wallets.account_id)
           OR (w.owner_type = 'account_user' AND w.owner_id IN (
               SELECT au.id FROM basejump.account_user au 
               WHERE au.account_id = get_account_wallets.account_id
           ))
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_account_wallets(uuid) TO authenticated;

/**
 * Updates wallet balance - restricted to service_role for LNbits integration
 */
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
    wallet_id uuid,
    new_balance bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
    -- This function is restricted to service_role via GRANT permissions
    
    UPDATE basejump.wallets 
    SET balance = new_balance,
        updated_at = timezone('utc'::text, now())
    WHERE id = update_wallet_balance.wallet_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_wallet_balance(uuid, bigint) TO service_role;

/**
 * -------------------------------------------------------
 * Section - Reward Category Management Functions
 * -------------------------------------------------------
 */

/**
 * Creates a reward category for an account
 */
CREATE OR REPLACE FUNCTION public.create_reward_category(
    account_id uuid,
    name text,
    description text DEFAULT NULL,
    max_amount bigint DEFAULT NULL,
    requires_approval boolean DEFAULT false
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    new_category_id uuid;
    category_result json;
BEGIN
    -- Check if user is account owner
    IF NOT basejump.has_role_on_account(create_reward_category.account_id, 'owner') THEN
        RAISE EXCEPTION 'Only account owners can create reward categories';
    END IF;
    
    -- Create the category
    INSERT INTO basejump.reward_categories (account_id, name, description, max_amount, requires_approval)
    VALUES (create_reward_category.account_id, create_reward_category.name, create_reward_category.description, 
            create_reward_category.max_amount, create_reward_category.requires_approval)
    RETURNING id INTO new_category_id;
    
    -- Return category details
    SELECT json_build_object(
        'category_id', rc.id,
        'account_id', rc.account_id,
        'name', rc.name,
        'description', rc.description,
        'max_amount', rc.max_amount,
        'requires_approval', rc.requires_approval,
        'created_at', rc.created_at
    ) INTO category_result
    FROM basejump.reward_categories rc
    WHERE rc.id = new_category_id;
    
    RETURN category_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_reward_category(uuid, text, text, bigint, boolean) TO authenticated;

/**
 * Gets all reward categories for an account
 */
CREATE OR REPLACE FUNCTION public.get_reward_categories(account_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
    -- Check access to account
    IF NOT basejump.has_role_on_account(get_reward_categories.account_id) THEN
        RAISE EXCEPTION 'Access denied to account reward categories';
    END IF;
    
    RETURN (
        SELECT coalesce(json_agg(
            json_build_object(
                'category_id', rc.id,
                'name', rc.name,
                'description', rc.description,
                'max_amount', rc.max_amount,
                'requires_approval', rc.requires_approval,
                'active', rc.active,
                'created_at', rc.created_at
            ) ORDER BY rc.name
        ), '[]'::json)
        FROM basejump.reward_categories rc
        WHERE rc.account_id = get_reward_categories.account_id
        AND rc.active = true
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_reward_categories(uuid) TO authenticated;

/**
 * -------------------------------------------------------
 * Section - Reward Management Functions
 * -------------------------------------------------------
 */

-- Reward sending is handled by edge functions that coordinate LNbits API calls
-- and database operations in transactions. No public.send_reward function needed.

/**
 * Creates a reward record - used by edge functions during reward processing
 * This is a simple record creation without business logic (that's handled in edge functions)
 */
CREATE OR REPLACE FUNCTION public.create_reward_record(
    account_id uuid,
    sender_wallet_id uuid,
    recipient_wallet_id uuid,
    amount bigint,
    reward_type basejump.reward_type,
    category_id uuid DEFAULT NULL,
    note text DEFAULT NULL,
    status basejump.transaction_status DEFAULT 'pending',
    external_tx_id text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    new_reward_id uuid;
    reward_result json;
BEGIN
    -- This function is restricted to service_role via GRANT permissions
    
    -- Create the reward record
    INSERT INTO basejump.rewards (
        account_id, 
        sender_wallet_id, 
        recipient_wallet_id, 
        amount, 
        reward_type, 
        category_id, 
        note,
        status,
        external_tx_id
    )
    VALUES (
        create_reward_record.account_id, 
        create_reward_record.sender_wallet_id, 
        create_reward_record.recipient_wallet_id, 
        create_reward_record.amount, 
        create_reward_record.reward_type, 
        create_reward_record.category_id, 
        create_reward_record.note,
        create_reward_record.status,
        create_reward_record.external_tx_id
    )
    RETURNING id INTO new_reward_id;
    
    -- Return reward details
    SELECT json_build_object(
        'reward_id', r.id,
        'account_id', r.account_id,
        'amount', r.amount,
        'reward_type', r.reward_type,
        'note', r.note,
        'status', r.status,
        'external_tx_id', r.external_tx_id,
        'created_at', r.created_at
    ) INTO reward_result
    FROM basejump.rewards r
    WHERE r.id = new_reward_id;
    
    RETURN reward_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_reward_record(uuid, uuid, uuid, bigint, basejump.reward_type, uuid, text, basejump.transaction_status, text) TO service_role;

/**
 * Gets reward history for an account with pagination
 */
CREATE OR REPLACE FUNCTION public.get_account_rewards(
    account_id uuid,
    results_limit integer DEFAULT 50,
    results_offset integer DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
    -- Check access to account
    IF NOT basejump.has_role_on_account(get_account_rewards.account_id) THEN
        RAISE EXCEPTION 'Access denied to account rewards';
    END IF;
    
    RETURN (
        SELECT coalesce(json_agg(
            json_build_object(
                'reward_id', r.id,
                'amount', r.amount,
                'reward_type', r.reward_type,
                'note', r.note,
                'status', r.status,
                'external_tx_id', r.external_tx_id,
                'created_at', r.created_at,
                'category_name', rc.name,
                'recipient_name', (
                    SELECT pa.name 
                    FROM basejump.wallets w
                    JOIN basejump.account_user au ON au.id = w.owner_id
                    JOIN basejump.accounts pa ON pa.primary_owner_user_id = au.user_id AND pa.personal_account = true
                    WHERE w.id = r.recipient_wallet_id AND w.owner_type = 'account_user'
                ),
                'sender_name', (
                    SELECT CASE 
                        WHEN w.owner_type = 'account' THEN 'Company Wallet'
                        ELSE (
                            SELECT pa.name 
                            FROM basejump.account_user au
                            JOIN basejump.accounts pa ON pa.primary_owner_user_id = au.user_id AND pa.personal_account = true
                            WHERE au.id = w.owner_id
                        )
                    END
                    FROM basejump.wallets w
                    WHERE w.id = r.sender_wallet_id
                )
            ) ORDER BY r.created_at DESC
        ), '[]'::json)
        FROM basejump.rewards r
        LEFT JOIN basejump.reward_categories rc ON rc.id = r.category_id
        WHERE r.account_id = get_account_rewards.account_id
        LIMIT coalesce(get_account_rewards.results_limit, 50) 
        OFFSET coalesce(get_account_rewards.results_offset, 0)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_account_rewards(uuid, integer, integer) TO authenticated;

/**
 * Gets reward history for a specific employee
 */
CREATE OR REPLACE FUNCTION public.get_employee_reward_history(account_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
DECLARE
    target_account_id uuid;
BEGIN
    -- Get the account_id for this account_user
    SELECT au.account_id INTO target_account_id
    FROM basejump.account_user au
    WHERE au.id = get_employee_reward_history.account_user_id;
    
    IF target_account_id IS NULL THEN
        RAISE EXCEPTION 'Account user not found';
    END IF;
    
    -- Check access (must be the employee themselves or account owner)
    IF NOT (basejump.has_role_on_account(target_account_id) OR 
            EXISTS (SELECT 1 FROM basejump.account_user au WHERE au.id = get_employee_reward_history.account_user_id AND au.user_id = auth.uid())) THEN
        RAISE EXCEPTION 'Access denied to employee reward history';
    END IF;
    
    RETURN (
        SELECT coalesce(json_agg(
            json_build_object(
                'reward_id', r.id,
                'amount', r.amount,
                'reward_type', r.reward_type,
                'note', r.note,
                'status', r.status,
                'external_tx_id', r.external_tx_id,
                'created_at', r.created_at,
                'category_name', rc.name
            )
        ), '[]'::json)
        FROM basejump.rewards r
        JOIN basejump.wallets w ON w.id = r.recipient_wallet_id
        LEFT JOIN basejump.reward_categories rc ON rc.id = r.category_id
        WHERE w.owner_type = 'account_user' 
        AND w.owner_id = get_employee_reward_history.account_user_id
        ORDER BY r.created_at DESC
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_employee_reward_history(uuid) TO authenticated;

/**
 * Updates reward status - for LNbits webhook integration
 */
CREATE OR REPLACE FUNCTION public.update_reward_status(
    reward_id uuid,
    new_status basejump.transaction_status,
    external_tx_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, basejump
AS $$
BEGIN
    -- This function is restricted to service_role via GRANT permissions
    
    UPDATE basejump.rewards 
    SET status = new_status,
        external_tx_id = coalesce(update_reward_status.external_tx_id, external_tx_id),
        updated_at = timezone('utc'::text, now())
    WHERE id = update_reward_status.reward_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward not found';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_reward_status(uuid, basejump.transaction_status, text) TO service_role;