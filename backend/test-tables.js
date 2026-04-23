const pool = require('./db');

pool.query(`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
  ORDER BY table_name
`, async (err, res) => {
  if(err) {
    console.error('Error:', err);
  } else {
    console.log('Tables in database:');
    res.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
    // Try to query outlets
    console.log('\nTrying to query outlets...');
    pool.query('SELECT * FROM outlets LIMIT 1', (err2, res2) => {
      if(err2) {
        console.error('Outlets query error:', err2.message);
      } else {
        console.log('Outlets found:', res2.rows.length);
      }
      process.exit();
    });
  }
});
