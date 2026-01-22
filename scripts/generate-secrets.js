#!/usr/bin/env node

/**
 * Generate secure secrets for deployment
 *
 * Usage:
 *   node scripts/generate-secrets.js
 *
 * This script generates:
 * - JWT_SECRET for Railway
 * - Password hash for admin user (if bcryptjs is available)
 */

const crypto = require('crypto');

console.log('🔐 Generating secure secrets for deployment...\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log('📋 JWT_SECRET (add this to Railway):');
console.log(jwtSecret);
console.log('\n');

// Try to generate password hashes (requires bcryptjs)
try {
  const bcrypt = require('bcryptjs');

  // Generate admin password hashes for common passwords
  const passwords = ['admin123', 'changeme', 'YourSecurePassword123!'];

  console.log('🔑 Password hashes for admin user:');
  console.log('(Use these to update admin_users table in Neon SQL Editor)\n');

  passwords.forEach(password => {
    const hash = bcrypt.hashSync(password, 10);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('');
  });

  // SQL Update Statement
  console.log('💡 SQL to update admin password in Neon:');
  console.log('```sql');
  console.log("UPDATE admin_users");
  console.log("SET password_hash = '$2a$10$your-new-hashed-password'");
  console.log("WHERE username = 'admin';");
  console.log('```\n');
} catch (error) {
  console.log('⚠️  Note: bcryptjs not available for password hashing.');
  console.log('   To generate password hashes, run from backend directory:');
  console.log('   cd backend && npm install && node ../scripts/generate-secrets.js\n');
}

// Environment Variable Template
console.log('📝 Environment Variables Template for Railway:');
console.log('```');
console.log('PORT=3001');
console.log('NODE_ENV=production');
console.log('DATABASE_URL=<your-neon-connection-string>');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app');
console.log('```');

console.log('\n✅ Generated successfully!');
console.log('\n📌 Important: Copy the JWT_SECRET above and add it to Railway environment variables.');
