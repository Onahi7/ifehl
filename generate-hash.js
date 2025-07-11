const bcrypt = require('bcryptjs');
const password = process.argv[2];

if (!password) {
    console.error('Please provide a password as an argument');
    process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log('Password hash:', hash);
