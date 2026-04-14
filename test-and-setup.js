const fs = require('fs');
const path = require('path');

// Quick check if we can write files
const testFile = path.join(__dirname, 'test-write.txt');
try {
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('File write test: OK');
} catch (e) {
  console.log('File write test FAILED');
  process.exit(1);
}

// Now run the actual setup
console.log('Running ProjectList setup...');
require('./setup-project-list.js');
