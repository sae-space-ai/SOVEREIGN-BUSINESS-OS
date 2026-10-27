CREATE TABLE audit_events(id TEXT PRIMARY KEY,quote_id TEXT,event_type TEXT NOT NULL,detail TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE TABLE integration_settings (setting_key TEXT PRIMARY KEY,setting_value TEXT NOT NULL,updated_at TEXT NOT NULL);

CREATE TABLE quotes (id TEXT PRIMARY KEY,created_at TEXT NOT NULL,customer TEXT NOT NULL,description TEXT NOT NULL,amount_cents INTEGER NOT NULL CHECK(amount_cents>0),currency TEXT NOT NULL DEFAULT 'EUR',status TEXT NOT NULL DEFAULT 'DRAFT',paypal_order_id TEXT UNIQUE,capture_id TEXT,captured_at TEXT);

CREATE TABLE webhook_events(event_id TEXT PRIMARY KEY,event_type TEXT NOT NULL,received_at TEXT NOT NULL);

CREATE INDEX ix_events_quote ON audit_events(quote_id);

CREATE INDEX ix_quote_created ON quotes(created_at DESC);
