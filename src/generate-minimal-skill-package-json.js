const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'ascii' }));
delete packageJson.scripts;
delete packageJson.devDependencies;
fs.writeFile(path.join(__dirname, 'apps/what-horror/package.json'), JSON.stringify(packageJson, null, 2));
