const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(plain, hashed) {
  if (!plain || typeof plain !== 'string' || !hashed || typeof hashed !== 'string') {
    throw new Error('Both passwords must be non-empty strings');
  }
  return bcrypt.compare(plain, hashed);
}

module.exports = { hashPassword, comparePassword };
