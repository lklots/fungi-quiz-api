const { Pool } = require('pg');

function pool() {
  return new Pool({
    database: 'fungi_dev',
  });
}

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  pool,
  query,
};
