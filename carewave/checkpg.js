// check-pg.js
const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://postgres:stk99NO57ynJhTHt@db.zkjqhubdbdvbeiomcywn.supabase.co:5432/postgres?connect_timeout=60',
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('Connected to Supabase database!');

    // List databases (similar to \l)
    const dbList = await client.query('SELECT datname FROM pg_database;');
    console.log('Databases:', dbList.rows);

    // List tables in postgres database (similar to \dt)
    const tableList = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Tables:', tableList.rows);

    // Query Transaction table
    const transactions = await client.query(
      'SELECT id, category, amount FROM "Transaction"'
    );
    console.log('Transactions:', transactions.rows);
  } catch (error) {
    console.error('Failed to connect or query database:', error);
  } finally {
    await client.end();
  }
}

checkDatabase();
