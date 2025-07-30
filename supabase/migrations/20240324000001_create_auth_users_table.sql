CREATE TABLE IF NOT EXISTS auth_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO auth_users (name, password) VALUES ('admin', 'admin')
ON CONFLICT (name) DO NOTHING;

alter publication supabase_realtime add table auth_users;