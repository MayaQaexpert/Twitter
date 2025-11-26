#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Stopping Twitter Clone Application${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Stop Next.js dev server
echo -e "${YELLOW}Stopping Next.js development server...${NC}"
pkill -f "next dev"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Next.js server stopped${NC}"
else
    echo -e "${YELLOW}⚠ Next.js server was not running${NC}"
fi

echo ""
echo -e "${YELLOW}Stopping MongoDB...${NC}"
brew services stop mongodb-community
sleep 1

if brew services list | grep mongodb-community | grep stopped > /dev/null; then
    echo -e "${GREEN}✓ MongoDB stopped successfully${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB may still be running${NC}"
fi

echo ""
echo -e "${GREEN}All services stopped!${NC}"
