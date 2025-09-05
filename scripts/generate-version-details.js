import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

// Get the latest commit message
const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();

// Create version details object
const versionDetails = {
    version: packageJson.version,
    lastCommit: lastCommit
};

// Create the public directory if it doesn't exist
const publicDir = join(__dirname, '../public');
if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
}

// Write to version-details.json
writeFileSync(
    join(publicDir, 'version-details.json'),
    JSON.stringify(versionDetails, null, 2)
);