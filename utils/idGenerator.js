const crypto = require('crypto');

// Generate ID based on name
function generateId(name) {
  const baseString = name + crypto.randomBytes(8).toString('hex');
  return crypto.createHash('md5').update(baseString).digest('hex').substring(0, 10);
}

module.exports = { generateId };
