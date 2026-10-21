import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const migrations = fs.readdirSync(path.join(root, 'supabase/migrations')).filter((f) => f.endsWith('.sql')).map((f) => fs.readFileSync(path.join(root, 'supabase/migrations', f), 'utf8')).join('\n');
test('financial tables use integer kobo and immutable ledger keys', () => { assert.match(migrations, /price_kobo integer/); assert.match(migrations, /amount_kobo integer/); assert.match(migrations, /idempotency_key text not null unique/); });
test('RLS enabled on core tables', () => { for (const table of ['profiles','orders','payments','ledger_entries','delivery_assignments']) assert.match(migrations, new RegExp(`alter table public\\.${table} enable row level security`)); });
test('no obvious committed secrets', () => { const files = ['package.json','README.md','.env.example']; for (const file of files) { const text = fs.readFileSync(path.join(root, file), 'utf8'); assert.doesNotMatch(text, /sk_live_[A-Za-z0-9]/); assert.doesNotMatch(text, /service_role["']?\s*[:=]\s*["']?[A-Za-z0-9._-]{40,}/); } });
