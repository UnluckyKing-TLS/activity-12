#!/usr/bin/env node

const chalk = require('chalk').default || require('chalk');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');

console.log(chalk.blue('Quest Tracker Health Check'));
console.log(chalk.gray('============================'));

class HealthChecker {
  constructor() {
    this.appUrl = process.env.APP_URL || 'https://your-app.vercel.app';
    this.apiKey = process.env.API_KEY || 'demo_key_12345';
  }

  async checkFrontend() {
    console.log(chalk.yellow('\nChecking Frontend...'));

    try {
      const startTime = Date.now();
      const response = await fetch(this.appUrl, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(chalk.green('  Frontend is accessible'));
        console.log(chalk.gray(`  Status: ${response.status}`));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        console.log(chalk.gray(`  URL: ${this.appUrl}`));
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(chalk.red('  Frontend check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      return false;
    }
  }

  async checkAPIHealth() {
    console.log(chalk.yellow('\nChecking API Health...'));

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.appUrl}/health`, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        console.log(chalk.green('  API is healthy'));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        return true;
      } else {
        throw new Error(`Health check failed: ${data.status || 'unknown'}`);
      }
    } catch (error) {
      console.log(chalk.red('  API health check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      return false;
    }
  }

  async checkAPIEndpoints() {
    console.log(chalk.yellow('\nChecking API Endpoints...'));

    const endpoints = [
      { path: '/api/quests', description: 'Quest list' },
      { path: '/api/quests/1', description: 'Quest details' },
      { path: '/api/players/alex', description: 'Player profile' },
      { path: '/api/categories', description: 'Categories list' }
    ];

    let passedCount = 0;

    for (const endpoint of endpoints) {
      try {
        const url = `${this.appUrl}${endpoint.path}?api_key=${this.apiKey}`;
        const startTime = Date.now();
        const response = await fetch(url, { method: 'GET', timeout: 10000 });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          console.log(chalk.green(`  ${endpoint.description} (${responseTime}ms)`));
          passedCount++;
        } else {
          console.log(chalk.red(`  ${endpoint.description}: ${response.status}`));
        }
      } catch (error) {
        console.log(chalk.red(`  ${endpoint.description}: ${error.message}`));
      }
    }

    const success = passedCount === endpoints.length;
    if (success) {
      console.log(chalk.green(`All ${endpoints.length} API endpoints working`));
    } else {
      console.log(chalk.red(`${endpoints.length - passedCount}/${endpoints.length} endpoints failed`));
    }

    return success;
  }

  // =============================================================================
  // TODO 4: Error Monitoring Setup (Hard)
  // =============================================================================

  async checkPerformance() {
    console.log(chalk.yellow('\nChecking Performance...'));
    const endpointsToTest = ['/', '/health'];
    const results = [];
    let hasSlowResponses = false;

    for (const endpoint of endpointsToTest) {
      try {
        const url = `${this.appUrl}${endpoint}`;
        const startTime = Date.now();
        const response = await fetch(url, { timeout: 10000 });
        const responseTime = Date.now() - startTime;

        const resultEntry = {
          endpoint,
          status: response.status,
          responseTimeMs: responseTime,
          timestamp: new Date().toISOString()
        };
        results.push(resultEntry);

        if (responseTime > 2000) {
          console.log(chalk.yellow(`  ⚠️ WARNING: Slow response from ${endpoint} (${responseTime}ms > 2000ms)`));
          hasSlowResponses = true;
        } else {
          console.log(chalk.green(`  ✓ ${endpoint} responds in ${responseTime}ms`));
        }
      } catch (error) {
        console.log(chalk.red(`  ❌ Failed to measure ${endpoint}: ${error.message}`));
        results.push({
          endpoint,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        hasSlowResponses = true;
      }
    }

    // 3. Log results to health-history.json
    try {
      const historyFile = 'health-history.json';
      let history = [];
      if (fs.existsSync(historyFile)) {
        const fileContent = fs.readFileSync(historyFile, 'utf8');
        history = JSON.parse(fileContent);
      }

      history.push({
        date: new Date().toISOString(),
        measurements: results,
        hadSlowResponses: hasSlowResponses
      });

      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
      console.log(chalk.gray(`  Performance logs saved to ${historyFile}`));
    } catch (err) {
      console.log(chalk.red(`  Failed to save history: ${err.message}`));
    }

    // We can return false if there were slow responses, or true if performance is acceptable
    return !hasSlowResponses;
  }

  async runAllChecks() {
    console.log(chalk.white('\nRunning health checks...\n'));

    const results = {
      frontend: await this.checkFrontend(),
      apiHealth: await this.checkAPIHealth(),
      apiEndpoints: await this.checkAPIEndpoints(),
      performance: await this.checkPerformance()
    };

    const totalChecks = Object.keys(results).length;
    const passedChecks = Object.values(results).filter(Boolean).length;

    console.log(chalk.blue('\nHealth Check Summary'));
    console.log(chalk.gray('========================'));

    Object.entries(results).forEach(([check, passed]) => {
      const icon = passed ? 'PASS' : 'FAIL';
      const color = passed ? chalk.green : chalk.red;
      console.log(color(`${icon} - ${check}`));
    });

    console.log(chalk.blue(`\nScore: ${passedChecks}/${totalChecks} checks passed`));

    if (passedChecks === totalChecks) {
      console.log(chalk.green('All systems working! Your app is ready.'));
      return true;
    } else {
      console.log(chalk.red('Some issues found. Review the failed checks above.'));
      return false;
    }
  }
}

async function main() {
  const checker = new HealthChecker();

  // Allow overriding URL via command line
  if (process.argv[2]) checker.appUrl = process.argv[2];

  const success = await checker.runAllChecks();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Health check failed:', error));
    process.exit(1);
  });
}

module.exports = { HealthChecker };
