#!/bin/bash

# Deployment Discovery Challenge Setup
# Activity 12: Deploy API applications to production

echo "Setting up Deployment Discovery Challenge..."
echo ""

echo "Discovery Challenge Overview:"
echo "   Master production deployment with Vercel"
echo "   Focus: Deploy, test, and monitor your app"
echo ""

echo "LEARNING OBJECTIVES:"
echo "   1. Deploy a full-stack app to Vercel"
echo "   2. Configure environment variables"
echo "   3. Set up health checks and monitoring"
echo "   4. Understand automatic deployments from Git"
echo ""

echo "QUICK START:"
echo "   1. npm install"
echo "   2. npm start"
echo "   3. Open http://localhost:3000"
echo ""

if command -v node &> /dev/null; then
    echo "Starting deployment guide server..."
    npm start
else
    echo "Node.js not found. Install Node.js 18+ first."
fi
