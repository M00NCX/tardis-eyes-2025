// Preparado para quando você adicionar a integração Neon
// import { neon } from '@neondatabase/serverless'

// export const sql = neon(process.env.DATABASE_URL!)

// SQL para criar as tabelas:
/*
CREATE TABLE IF NOT EXISTS annotations (
  id SERIAL PRIMARY KEY,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_points (
  id SERIAL PRIMARY KEY,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS easter_eggs (
  id SERIAL PRIMARY KEY,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  discovered_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

export {}
