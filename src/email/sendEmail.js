const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://nuquoltxaosivekpvcpx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cXVvbHR4YW9zaXZla3B2Y3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcxNTM4MDcsImV4cCI6MjAxMjcyOTgwN30.utTKxXp5Zf95cHkgfDkHtIc0OjJuoOwspA4gCYgT0zw"
);

module.exports = supabase;
