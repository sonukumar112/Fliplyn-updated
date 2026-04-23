const pool = require('./db');

// Check stalls table
pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'stalls'
  ORDER BY ordinal_position
`, async (err, res) => {
  if(err) {
    console.error('Error:', err);
  } else {
    console.log('Stalls table schema:');
    res.rows.forEach(row => {
      console.log(`  ${row.column_name} (${row.data_type})`);
    });
    
    // Check items table
    pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'items'
      ORDER BY ordinal_position
    `, (err2, res2) => {
      if(err2) {
        console.error('Error:', err2);
      } else {
        console.log('\nItems table schema:');
        res2.rows.forEach(row => {
          console.log(`  ${row.column_name} (${row.data_type})`);
        });
      }
      process.exit();
    });
  }
});
