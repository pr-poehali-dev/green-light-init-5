ALTER TABLE contestants ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';
CREATE INDEX idx_contestants_status ON contestants(status);
