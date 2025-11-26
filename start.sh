#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Starting Twitter Clone Application${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if MongoDB is already running
echo -e "${YELLOW}Checking MongoDB status...${NC}"
if brew services list | grep mongodb-community | grep started > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 2
    if brew services list | grep mongodb-community | grep started > /dev/null; then
        echo -e "${GREEN}✓ MongoDB started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start MongoDB${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}Starting Next.js development server...${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Start npm dev server
npm run dev
