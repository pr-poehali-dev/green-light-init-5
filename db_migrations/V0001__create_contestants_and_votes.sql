
CREATE TABLE contestants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  category VARCHAR(20) NOT NULL,
  about TEXT,
  photo1_url TEXT,
  photo2_url TEXT,
  photo3_url TEXT,
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  contestant_id INTEGER NOT NULL REFERENCES contestants(id),
  voter_ip VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contestants_votes ON contestants(votes_count DESC);
CREATE INDEX idx_votes_contestant ON votes(contestant_id);
CREATE INDEX idx_votes_ip ON votes(voter_ip, contestant_id);
