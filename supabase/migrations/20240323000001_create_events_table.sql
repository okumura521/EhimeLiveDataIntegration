CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT,
  content TEXT,
  venue TEXT,
  date DATE,
  fee TEXT,
  ticket TEXT,
  time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table events;

INSERT INTO events (title, link, content, venue, date, fee, ticket, time) VALUES
('Summer Music Festival', 'https://example.com/summer-fest', 'Annual summer music celebration featuring local artists', 'Central Park', '2024-07-15', '¥3,000', 'Available online', '12:00 - 20:00'),
('Art Exhibition Opening', 'https://example.com/art-exhibit', 'Contemporary art showcase featuring international artists', 'Modern Gallery', '2024-08-05', '¥1,500', 'At the door', '18:00 - 21:00'),
('Jazz Night', 'https://example.com/jazz-night', 'Evening of classic and modern jazz performances', 'Blue Note Club', '2024-06-30', '¥2,500', 'Reservation required', '19:30 - 23:00');
