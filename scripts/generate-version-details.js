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

// Read CHANGELOG.md to get the latest changes
const changelogPath = join(__dirname, '../CHANGELOG.md');
let releaseNotes = '';

if (existsSync(changelogPath)) {
    const changelog = readFileSync(changelogPath, 'utf-8');
    // Get content between the first two ## headers (latest release)
    const matches = changelog.match(/##[^#]+/);
    if (matches) {
        const latestSection = matches[0];
        // Extract all features, fixes, and breaking changes
        const changes = latestSection.split('\n')
            .filter(line => line.startsWith('* ') || line.startsWith('### '))
            .map(line => line.replace(/^\* /, '').replace(/^### /, ''))
            .filter(line => !line.includes('chore(release)'))
            .join('\n');
        releaseNotes = changes || 'No detailed changes available';
    }
}

// If no changes found in changelog, get commits since last tag
if (!releaseNotes) {
    try {
        const commits = execSync('git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%s"')
            .toString()
            .split('\n')
            .filter(msg => !msg.startsWith('chore(release)'))
            .join('\n');
        releaseNotes = commits || 'No changes recorded';
    } catch (error) {
        releaseNotes = 'Initial release';
    }
}

// Create version details object
const versionDetails = {
    version: packageJson.version,
    lastCommit: releaseNotes
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