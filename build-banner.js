const fs = require("fs");
const pkg = require("./package.json");

process.stdout.write(`/*
${pkg.name} v${pkg.version}

${fs.readFileSync("./LICENSE", 'utf8')}
*/
`);