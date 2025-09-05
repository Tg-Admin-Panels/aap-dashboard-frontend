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

// Get the last real commit (not a version bump commit)
function getLastMeaningfulCommit() {
    try {
        const commits = execSync('git log -10 --pretty=format:"%s"').toString()
            .split('\n')
            .map(msg => msg.trim())
            .filter(msg => !msg.startsWith('chore(release)'));

        const lastCommit = commits[0];
        if (lastCommit.startsWith('feat:')) return `✨ ${lastCommit.substring(5).trim()}`;
        if (lastCommit.startsWith('fix:')) return `🐛 ${lastCommit.substring(4).trim()}`;
        if (lastCommit.startsWith('docs:')) return `📚 ${lastCommit.substring(5).trim()}`;
        if (lastCommit.startsWith('style:')) return `💅 ${lastCommit.substring(6).trim()}`;
        if (lastCommit.startsWith('refactor:')) return `♻️ ${lastCommit.substring(9).trim()}`;
        if (lastCommit.startsWith('perf:')) return `⚡️ ${lastCommit.substring(5).trim()}`;
        if (lastCommit.startsWith('test:')) return `✅ ${lastCommit.substring(5).trim()}`;
        return lastCommit;
    } catch (error) {
        console.error('Error getting commit:', error);
        return 'Unable to fetch commit message';
    }
}

// Get the changes
const releaseNotes = getLastMeaningfulCommit();

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