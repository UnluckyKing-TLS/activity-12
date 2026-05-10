#!/usr/bin/env node

const chalk = require('chalk').default || require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');

// CONCEPT: Platform-as-a-Service (PaaS) Deployment
// Vercel handles building, hosting, and scaling for you.
// You push code to GitHub, and Vercel deploys automatically.
// This script is an alternative to the Vercel dashboard UI.

console.log(chalk.blue('Quest Tracker Deployment Script'));
console.log(chalk.gray('================================================'));

async function deploy() {
  try {
    // Step 1: Check prerequisites
    console.log(chalk.yellow('\nStep 1: Checking prerequisites...'));

    if (!fs.existsSync('vercel.json')) {
      throw new Error('vercel.json not found. Run this script from the project root.');
    }

    // Check if Vercel CLI is available
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log(chalk.green('Vercel CLI found'));
    } catch (error) {
      console.log(chalk.red('Vercel CLI not found'));
      console.log(chalk.gray('Install it with: npm install -g vercel'));
      console.log(chalk.gray(''));
      console.log(chalk.blue('Or deploy without CLI:'));
      console.log(chalk.gray('1. Go to https://vercel.com/new'));
      console.log(chalk.gray('2. Import your GitHub repository'));
      console.log(chalk.gray('3. Click Deploy'));
      return;
    }

    // =============================================================================
    // TODO 3: Deployment Script Creation (Medium)
    // =============================================================================
    
    // 1. Before deploying, log the current git commit hash and branch
    try {
      const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      console.log(chalk.cyan(`\nGit Branch: ${branch}`));
      console.log(chalk.cyan(`Commit Hash: ${commitHash}`));

      // 2. Check if there are uncommitted changes (warn if yes)
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      if (status) {
        console.log(chalk.yellow('⚠️ WARNING: You have uncommitted changes. You might want to commit before deploying!'));
      } else {
        console.log(chalk.green('✓ Working directory clean'));
      }
    } catch (gitErr) {
      console.log(chalk.yellow('⚠️ Could not perform git checks (not a git repo or git not installed).'));
    }

    // Step 2: Deploy to Vercel
    console.log(chalk.yellow('\nStep 2: Deploying to Vercel...'));

    let deployUrl = '';
    try {
      const output = execSync('vercel --prod --yes', { encoding: 'utf8' });
      console.log(output);
      
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      if (urlMatch) {
        deployUrl = urlMatch[0];
      }
      
      console.log(chalk.green('Deployed to Vercel successfully!'));
    } catch (error) {
      console.log(chalk.red('Deployment failed'));
      console.log(chalk.gray('Check the error above, or deploy manually at vercel.com'));
      // If we error, we don't return, we just exit
      return;
    }

    // 3. After deploying, verify the site is accessible
    if (deployUrl) {
      console.log(chalk.yellow(`\nStep 3: Verifying site accessibility...`));
      console.log(chalk.gray(`Testing URL: ${deployUrl}`));
      try {
        const response = await fetch(deployUrl);
        if (response.ok) {
          console.log(chalk.green(`✓ Site is live and accessible! (Status: ${response.status})`));
        } else {
          console.log(chalk.yellow(`⚠️ Site responded with status ${response.status}`));
        }
      } catch (fetchErr) {
        console.log(chalk.red(`❌ Could not reach the deployed site: ${fetchErr.message}`));
      }
    } else {
      console.log(chalk.yellow('\nStep 3: Could not automatically verify site accessibility (URL not found in deployment output).'));
    }

    // Step 4: Done
    console.log(chalk.green('\nDeployment complete!'));
    console.log(chalk.gray('================================================'));
    console.log(chalk.gray('Your app is live on Vercel.'));
    console.log(chalk.gray('Check your Vercel dashboard for the URL if not listed above.'));

  } catch (error) {
    console.log(chalk.red('\nDeployment failed:'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy };
