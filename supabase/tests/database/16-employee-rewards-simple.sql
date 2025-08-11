BEGIN;
CREATE EXTENSION "basejump-supabase_test_helpers" VERSION '0.0.6';

SELECT plan(10);

-- Enable team accounts for testing
UPDATE basejump.config SET enable_team_accounts = true;

-- Create test users
SELECT tests.create_supabase_user('owner');
SELECT tests.create_supabase_user('employee');

-- Authenticate as account owner
SELECT tests.authenticate_as('owner');

-- Test 1: Create team account
INSERT INTO basejump.accounts (id, name, slug, personal_account) 
VALUES ('d126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid, 'Test Company', 'test-company', false);

SELECT ok(true, 'Can create team account');

-- Test 2: Create company lightning wallet
SELECT ok(
    (SELECT public.create_company_wallet(
        'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid,
        'lightning'::basejump.wallet_type
    ) IS NOT NULL),
    'Company owner can create lightning wallet'
);

-- Test 3: Create company solana wallet  
SELECT ok(
    (SELECT public.create_company_wallet(
        'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid,
        'solana'::basejump.wallet_type
    ) IS NOT NULL),
    'Company owner can create solana wallet'
);

-- Test 4: Cannot create duplicate wallet types
SELECT throws_ok(
    $$ SELECT public.create_company_wallet(
        'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid,
        'lightning'::basejump.wallet_type
    ) $$,
    'Company already has a lightning wallet',
    'Cannot create duplicate company wallets'
);

-- Test 5: Can retrieve account wallets
SELECT ok(
    (SELECT json_array_length(public.get_account_wallets('d126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid)) >= 2),
    'Can retrieve account wallets'
);

-- Test 6: Create reward category
SELECT ok(
    (SELECT public.create_reward_category(
        'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid,
        'Performance Bonus',
        'Rewards for good work',
        50000,
        false
    ) IS NOT NULL),
    'Can create reward category'
);

-- Test 7: Get reward categories
SELECT ok(
    (SELECT json_array_length(public.get_reward_categories('d126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid)) >= 1),
    'Can retrieve reward categories'
);

-- Add an employee to test employee functions
SELECT tests.authenticate_as_service_role();
INSERT INTO basejump.account_user (id, account_id, user_id, account_role) VALUES
    (extensions.uuid_generate_v4(), 'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid, tests.get_supabase_uid('employee'), 'member');

-- Resume as owner
SELECT tests.authenticate_as('owner');

-- Test 8: Create employee wallet
SELECT ok(
    (SELECT public.create_employee_wallet(
        (SELECT au.id FROM basejump.account_user au WHERE au.user_id = tests.get_supabase_uid('employee') LIMIT 1),
        'lightning'::basejump.wallet_type
    ) IS NOT NULL),
    'Can create employee lightning wallet'
);

-- Test 9: Create a reward record using service function (used by edge functions)
SELECT tests.authenticate_as_service_role();
SELECT ok(
    (SELECT public.create_reward_record(
        'd126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid,
        (SELECT w.id FROM basejump.wallets w WHERE w.owner_type = 'account' AND w.wallet_type = 'lightning' LIMIT 1),
        (SELECT w.id FROM basejump.wallets w WHERE w.owner_type = 'account_user' AND w.wallet_type = 'lightning' LIMIT 1),
        10000,
        'lightning_sats'::basejump.reward_type,
        (SELECT rc.id FROM basejump.reward_categories rc WHERE rc.name = 'Performance Bonus' LIMIT 1),
        'Test reward',
        'completed'::basejump.transaction_status,
        'test_tx_123'
    ) IS NOT NULL),
    'Can create reward records using service function'
);

SELECT tests.authenticate_as('owner');

-- Test 10: Get account rewards
SELECT ok(
    (SELECT json_array_length(public.get_account_rewards('d126ecef-35f6-4b5d-9f28-d9f00a9fb46f'::uuid)) >= 1),
    'Can retrieve account reward history'
);

SELECT * FROM finish();
ROLLBACK;