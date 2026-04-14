const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\msigf\\source\\repos\\PortfolioSigge\\src\\components\\ProjectList';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
console.log('Directory created at:', dir);
