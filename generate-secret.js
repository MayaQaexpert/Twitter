#!/usr/bin/env node

/**
 * Generate secure secrets for NextAuth
 * Run: node generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 NextAuth Secret Generator\n');
console.log('Copy this secret to your .env.local file:\n');
console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('\n');
