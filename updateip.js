import fs from 'fs';
import fetch from 'node-fetch';
import { exec } from 'child_process';

const REPO_PATH = '/path/to/your/local/repository'; // Replace with your repo's local path
const GITHUB_TOKEN = 'your_personal_access_token'; // Replace with your GitHub PAT
const REPO_URL = 'https://github.com/tlpgcet/tlpgcet.github.io.git';

async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const newIP = data.ip;

        console.log(`Fetched Public IP: ${newIP}`);

        // Update index.html
        const filePath = `${REPO_PATH}/index.html`;
        let content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = content.replace(/http:\/\/[\d.]+:3005/g, `http://${newIP}:3005`);
        fs.writeFileSync(filePath, updatedContent);
        console.log('index.html updated with new IP.');

        // Push changes to GitHub
        pushToGitHub();
    } catch (error) {
        console.error('Error fetching public IP:', error);
    }
}

function pushToGitHub() {
    exec(
        `cd ${REPO_PATH} && git add index.html && git commit -m "Update public IP" && git push https://${GITHUB_TOKEN}@github.com/tlpgcet/tlpgcet.github.io.git`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error pushing to GitHub: ${error.message}`);
                return;
            }
            console.log('Changes pushed to GitHub successfully.');
            console.log(stdout);
        }
    );
}

// Start the process
getPublicIP();
