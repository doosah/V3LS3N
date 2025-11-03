// Simple wrapper to start server from root
// Railway will run this file instead of index.html

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to server directory and run index.js
process.chdir(join(__dirname, 'server'));

// Import and run the server
import('./server/index.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

