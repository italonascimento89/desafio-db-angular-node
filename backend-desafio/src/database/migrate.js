import pool from './db.js';
import fs from 'fs';

async function runMigrations() {
  try {
    const sql = fs.readFileSync(new URL('./schema.sql', import.meta.url)).toString();
    await pool.query(sql);
    console.log('Migrações executadas com sucesso!');
  } catch (err) {
    console.error('Erro ao executar migrações:', err);
  } finally {
    await pool.end();
  }
}

runMigrations();
