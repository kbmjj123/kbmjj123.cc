-- Migration 001: Create subscribers and email_logs tables
-- Run: npx wrangler d1 execute DB --file=server/database/migrations/001_create_subscribers.sql

CREATE TABLE IF NOT EXISTS subscribers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT    NOT NULL UNIQUE,
  name              TEXT,
  status            TEXT    NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'active', 'unsubscribed')),
  source            TEXT    DEFAULT 'sidebar',
  verification_token TEXT   NOT NULL,
  subscribed_at     TEXT    DEFAULT (datetime('now')),
  verified_at       TEXT,
  unsubscribed_at   TEXT,
  last_sent_at      TEXT,
  created_at        TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email  ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_token  ON subscribers(verification_token);

CREATE TABLE IF NOT EXISTS email_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER REFERENCES subscribers(id),
  email_type    TEXT    NOT NULL CHECK(email_type IN ('verify', 'newsletter')),
  recipient     TEXT    NOT NULL,
  subject       TEXT    NOT NULL,
  status        TEXT    DEFAULT 'sent' CHECK(status IN ('sent', 'failed', 'bounced')),
  resend_id     TEXT,
  error         TEXT,
  created_at    TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_logs_subscriber ON email_logs(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type       ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_created    ON email_logs(created_at DESC);
