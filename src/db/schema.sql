-- ==============================================================================
-- LKL Agricultural Machinery (شركة لبيب كمال للأدوات والآلات الزراعية)
-- Master Production Relational Database Schema (PostgreSQL)
-- Tasks 076 - 087
-- ==============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & IDENTITY (Task 077)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    image TEXT,
    role VARCHAR(32) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. CATEGORIES (Task 079)
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(64),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- 3. PRODUCTS (Task 078)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand VARCHAR(128),
    model VARCHAR(128),
    specifications JSONB DEFAULT '[]'::jsonb NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- 4. PRODUCT IMAGES (Task 080)
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- 5. CONTACT / INQUIRY REQUESTS (Task 081 & Customer Data Isolation)
CREATE TABLE IF NOT EXISTS contact_requests (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255),
    product VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_user_email ON contact_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_contact_requests_user_id ON contact_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created ON contact_requests(created_at DESC);

-- 6. SITE SETTINGS (Task 082)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. CONTENT BLOCKS (Task 083)
CREATE TABLE IF NOT EXISTS content_blocks (
    key VARCHAR(128) PRIMARY KEY,
    content_ar TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. AUDIT LOGS (Task 084)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(128) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
