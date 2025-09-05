const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Read the package.json
const packageJson = require('../package.json');

// Get the latest commit message
const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();

// Create version details object
const versionDetails = {
    version: packageJson.version,
    lastCommit: lastCommit
};

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Write to version-details.json
fs.writeFileSync(
    path.join(publicDir, 'version-details.json'),
    JSON.stringify(versionDetails, null, 2)
);
