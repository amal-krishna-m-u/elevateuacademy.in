const { db } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    const client = await db.connect();

    try {
        // 1. Create Users Table
        await client.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
        console.log('✅ Created "users" table.');

        // 2. Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD not found in .env.local');
            return;
        }

        // Check if admin already exists
        const { rows } = await client.sql`SELECT * FROM users WHERE email = ${adminEmail}`;

        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await client.sql`
                INSERT INTO users (name, email, password, role)
                VALUES ('Super Admin', ${adminEmail}, ${hashedPassword}, 'admin')
            `;
            console.log(`✅ Seeded admin user: ${adminEmail}`);
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        await client.end();
    }
}

seed();
