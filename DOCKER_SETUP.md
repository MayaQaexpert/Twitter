# Docker Setup Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

1. **Environment is already configured** in `.env.local`

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (clean start)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose down
docker-compose build --no-cache app
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Check service status
```bash
docker-compose ps
```

### Access MongoDB shell
```bash
docker-compose exec mongodb mongosh twitter-clone
```

### Restart services
```bash
docker-compose restart
```

### Stop a specific service
```bash
docker-compose stop app
```

### Start a specific service
```bash
docker-compose start app
```

## Troubleshooting

### Port already in use
If port 3000 or 27017 is already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

### MongoDB connection issues
- Ensure MongoDB service is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`

### Application not starting
- Check application logs: `docker-compose logs app`
- Verify environment variables are set correctly
- Ensure NEXTAUTH_SECRET is set in docker-compose.yml

### Need to rebuild after changes
```bash
docker-compose down
docker-compose build --no-cache app
docker-compose up -d
```

## Development vs Production

### Current Setup (Production Mode)
The default `docker-compose.yml` runs in production mode with optimized builds.

### For Development with Hot Reload
To enable hot reload during development, you would need to:
1. Mount the source code as a volume
2. Use `npm run dev` instead of `npm start`
3. Set `NODE_ENV=development`

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

| Variable | Description | Value |
|----------|-------------|-------|
| MONGODB_URI | MongoDB connection string | mongodb://mongodb:27017/twitter-clone |
| NEXTAUTH_URL | Application URL | http://localhost:3000 |
| NEXTAUTH_SECRET | Secret for NextAuth.js | Set in docker-compose.yml |
| NODE_ENV | Environment mode | production |
| NEWS_API_KEY | News API key | Set in docker-compose.yml |

## Architecture

```
┌─────────────────────────────────────┐
│   Docker Compose Network            │
│  ┌────────────────┐ ┌─────────────┐ │
│  │   MongoDB      │ │   Next.js   │ │
│  │   Container    │ │   App       │ │
│  │   Port: 27017  │ │   Port:3000 │ │
│  └────────────────┘ └─────────────┘ │
└─────────────────────────────────────┘
         ↓                    ↓
    Data Volume         Exposed to Host
  (Persistent)          (localhost:3000)
```

## Notes

- MongoDB data persists in Docker volumes even after stopping containers
- The application runs in production mode for better performance
- First build may take a few minutes
- Subsequent starts are faster due to Docker layer caching
- The app waits for MongoDB to be healthy before starting (via healthcheck)
