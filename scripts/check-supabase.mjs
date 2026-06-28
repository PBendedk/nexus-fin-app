import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const tables = [
  "tenants",
  "companies",
  "invoices",
  "receivables",
  "payments",
  "payment_allocations",
  "audit_logs",
];

console.log("Checking Supabase connection...\n");

for (const table of tables) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`${table}: ERROR - ${error.message}`);
    process.exit(1);
  }

  console.log(`${table}: ${count}`);
}

console.log("\nSupabase connection OK.");
