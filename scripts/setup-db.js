const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    const client = await db.connect();

    try {
        // Create Enquiries Table
        await client.sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        course_interest VARCHAR(100),
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log('✅ Created "enquiries" table.');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await client.end();
    }
}

setup();
