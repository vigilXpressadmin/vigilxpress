import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const required = ['package.json','README.md','PROJECT_STATUS.md','.env.example','next.config.mjs','middleware.ts','app/(marketing)/page.tsx','supabase/migrations/0007_rls.sql','supabase/functions/paystack-webhook/index.ts','supabase/functions/create-customer-payment/index.ts','tests/pricing.test.mjs'];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) { console.error('Missing required files:', missing); process.exit(1); }
const all = [];
(function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) { if (!['node_modules','.next','.git'].includes(entry.name)) walk(full); } else all.push(full); } })(root);
const secretPatterns = [/sk_live_[A-Za-z0-9]+/g, /pk_live_[A-Za-z0-9]+/g, /service_role["']?\s*[:=]\s*["']?[A-Za-z0-9._-]{40,}/g];
let found = [];
for (const file of all) { const text = fs.readFileSync(file, 'utf8'); for (const pattern of secretPatterns) if (pattern.test(text)) found.push(path.relative(root, file)); }
if (found.length) { console.error('Possible secrets committed:', [...new Set(found)]); process.exit(1); }
const migrations = fs.readdirSync(path.join(root, 'supabase/migrations')).filter((f) => f.endsWith('.sql')).map((f) => fs.readFileSync(path.join(root, 'supabase/migrations', f), 'utf8')).join('\n');
const checks = [/enable row level security/g, /amount_kobo integer/g, /idempotency_key text not null unique/g, /check \(price_kobo >= 0\)/g];
for (const check of checks) if (!check.test(migrations)) { console.error('Migration check failed:', check); process.exit(1); }
console.log(`VIGILXpress validation passed: ${required.length} required files, ${all.length} files scanned.`);
