const bcrypt = require('bcryptjs');
const db = require('../config/db');

const seedData = async () => {
  try {
    console.log('🌱 Initializing Database Schema & Seed Data...');
    await db.initDatabase();

    // 1. Create Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        category_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        capacity VARCHAR(100) DEFAULT '750 ml',
        material VARCHAR(100) DEFAULT 'Stainless Steel',
        color VARCHAR(100) DEFAULT 'Matte Black',
        image_url VARCHAR(500),
        is_featured INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        user_id INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY ${db.getIsSQLite() ? 'AUTOINCREMENT' : 'AUTO_INCREMENT'},
        key_name VARCHAR(100) NOT NULL UNIQUE,
        key_value TEXT NOT NULL
      );
    `);

    // 2. Check & Seed Users
    const [existingUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    const userCount = existingUsers[0].count || existingUsers[0]['COUNT(*)'] || 0;

    if (userCount === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      const hashedUserPassword = await bcrypt.hash('user123', 10);

      await db.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@aquacraft.com', hashedAdminPassword, 'admin', '+1 800-555-0199']
      );
      await db.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Jane Doe', 'user@aquacraft.com', hashedUserPassword, 'user', '+1 800-555-0144']
      );
      console.log('👤 Default Admin & User created successfully.');
    }

    // 3. Check & Seed Categories
    const [existingCategories] = await db.query('SELECT COUNT(*) as count FROM categories');
    const catCount = existingCategories[0].count || existingCategories[0]['COUNT(*)'] || 0;

    if (catCount === 0) {
      const categoriesData = [
        ['Insulated Thermal Bottles', 'insulated-thermal', 'Double-wall vacuum insulated steel flasks that keep beverages ice cold for 24h or hot for 12h.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80'],
        ['Eco Borosilicate Glass', 'eco-borosilicate-glass', 'Pure taste experience with high-durability thermal glass and protective non-slip silicone sleeves.', 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80'],
        ['Smart UV Hydration', 'smart-uv-hydration', 'Self-cleaning bottles equipped with UV-C purification caps and intelligent hydration reminders.', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80'],
        ['Sports & Gym Shakers', 'sports-gym-shakers', 'High-flow sports lids, leak-proof locking mechanisms, and lightweight Tritan designs.', 'https://images.unsplash.com/photo-1570831739435-660143a4e5d5?w=600&q=80'],
      ];

      for (const cat of categoriesData) {
        await db.query(
          'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
          cat
        );
      }
      console.log('🏷️ Default Categories seeded.');
    }

    // 4. Check & Seed Products
    const [existingProducts] = await db.query('SELECT COUNT(*) as count FROM products');
    const prodCount = existingProducts[0].count || existingProducts[0]['COUNT(*)'] || 0;

    if (prodCount === 0) {
      const productsData = [
        [1, 'HydroShield Pro Thermo 1000ml', 'hydroshield-pro-thermo-1000ml', 'Triple-insulated 18/8 pro-grade stainless steel bottle with sweat-free powder finish and leakproof straw lid.', 39.99, 45, '1000 ml', 'Pro 18/8 Stainless Steel', 'Midnight Black', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 1],
        [1, 'TitanThermo Vacuum Flask 1200ml', 'titanthermo-vacuum-flask-1200ml', 'Rugged outdoor canteen flask engineered for extreme thermal preservation. Keeps soup hot for 18h and water ice-cold for 36h.', 49.99, 25, '1200 ml', 'Vacuum Steel', 'Forest Green', 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&q=80', 1],
        [2, 'GlassPure Artisan Sleeve 750ml', 'glasspure-artisan-sleeve-750ml', 'Thermal shock-resistant borosilicate glass wrapped in food-grade protective silicone. Zero plastic taste.', 24.99, 60, '750 ml', 'Borosilicate Glass', 'Ocean Blue', 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80', 1],
        [2, 'EcoBamboo Fusion Glass 600ml', 'ecobamboo-fusion-glass-600ml', 'Sleek eco-friendly bottle featuring an organic bamboo lid, stainless steel infuser, and crystal clear glass body.', 28.50, 40, '600 ml', 'Glass & Bamboo', 'Natural Wood', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', 0],
        [3, 'SmartClean UV-C Purifier 800ml', 'smartclean-uvc-purifier-800ml', 'Deep UV-C light cap neutralizes 99.99% of bacteria and viruses in 60 seconds. Touchscreen cap displays water temperature.', 69.99, 30, '800 ml', 'Insulated Stainless Steel', 'Starlight Silver', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80', 1],
        [4, 'AeroSport Flex Gym Flask 900ml', 'aerosport-flex-gym-flask-900ml', 'Impact-resistant Tritan bottle with rapid-flow spout, integrated carrying loop, and volumetric measurement markers.', 19.99, 80, '900 ml', 'BPA-Free Tritan', 'Crimson Red', 'https://images.unsplash.com/photo-1570831739435-660143a4e5d5?w=800&q=80', 0],
        [1, 'ArcticChill Slim Tumbler 650ml', 'arcticchill-slim-tumbler-650ml', 'Cup-holder friendly slim insulated bottle with magnetic pop cap and durable powder coating.', 32.00, 50, '650 ml', 'Stainless Steel', 'Rose Quartz', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80', 1],
        [4, 'HydroPulse Chug Bottle 1500ml', 'hydropulse-chug-bottle-1500ml', 'High capacity daily hydration gallon-style bottle with ergonomic handle and wide mouth for ice cubes.', 29.99, 35, '1500 ml', 'Heavy Duty Tritan', 'Matte Grey', 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&q=80', 0],
      ];

      for (const prod of productsData) {
        await db.query(
          'INSERT INTO products (category_id, name, slug, description, price, stock, capacity, material, color, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          prod
        );
      }
      console.log('🍾 Default Bottle Products seeded.');
    }

    // 5. Check & Seed Settings
    const defaultSettings = [
      ['company_name', 'AquaCraft Bottles'],
      ['company_tagline', 'Hydrate in Style, Sustain the Planet'],
      ['company_logo', ''],
      ['hero_title', 'Elevate Your Hydration with Eco-Luxury Bottles'],
      ['hero_subtitle', '100% BPA-Free vacuum insulated thermo flasks & eco borosilicate glass bottles designed for peak performance and style.'],
      ['hero_banner', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80'],
      ['about_us', 'AquaCraft Bottles is dedicated to crafting premium, sustainable hydration vessels that keep your drinks ice-cold for 24 hours or steaming hot for 12 hours. Designed with 18/8 pro-grade stainless steel and borosilicate glass, our bottles eliminate single-use plastic waste while looking impeccably modern.'],
      ['phone', '+1 (800) 555-AQUA'],
      ['email', 'support@aquacraftbottles.com'],
      ['address', '742 Evergreen Hydration Way, Suite 400, San Francisco, CA 94107'],
      ['free_shipping_min', '50'],
      ['social_instagram', 'https://instagram.com'],
      ['social_facebook', 'https://facebook.com'],
      ['social_twitter', 'https://twitter.com'],
    ];

    for (const [key, val] of defaultSettings) {
      const [existing] = await db.query('SELECT * FROM settings WHERE key_name = ?', [key]);
      if (existing.length === 0) {
        await db.query('INSERT INTO settings (key_name, key_value) VALUES (?, ?)', [key, val]);
      }
    }
    console.log('⚙️ Website Settings initialized.');
    console.log('✨ Seed Process Complete!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
