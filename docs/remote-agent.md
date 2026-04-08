# Remote Agent for Process Monitoring

This module provides a remote agent that monitors processes and automatically restarts them if they hang for more than 15 minutes.

## Features

- **Process Monitoring**: Tracks the activity of registered processes
- **Automatic Restart**: Restarts processes that have been inactive for more than 15 minutes
- **Self-Monitoring**: The agent monitors itself to ensure reliability
- **Configurable**: Easy to configure via JSON configuration file
- **API Integration**: Services can send heartbeats via a simple API
- **Status Reporting**: Provides detailed status information about monitored processes

## Installation

1. Ensure the required dependencies are installed:

```bash
npm install express winston body-parser cors
```

2. Create the necessary directories:

```bash
mkdir -p config data logs
```

## Configuration

The agent is configured via a JSON file located at `config/agent-config.json`. The configuration includes:

- `heartbeatInterval`: How often the agent sends heartbeats (in milliseconds)
- `processes`: Array of processes to monitor, each with:
  - `id`: Unique identifier for the process
  - `name`: Human-readable name
  - `maxHangTime`: Maximum time (in milliseconds) before considering the process hung
  - `restartCommand`: Command to execute to restart the process

Example configuration:

```json
{
  "heartbeatInterval": 300000,
  "processes": [
    {
      "id": "api-server",
      "name": "API Server",
      "maxHangTime": 900000,
      "restartCommand": "pm2 restart api-server"
    }
  ]
}
```

## Starting the Agent

Start the agent using the provided script:

```bash
node bin/start-agent.js
```

For production use, it's recommended to use a process manager like PM2:

```bash
pm2 start bin/start-agent.js --name remote-agent
```

## API Endpoints

The agent exposes the following API endpoints:

### Send Heartbeat

```
POST /api/v1/monitoring/heartbeat
```

Request body:
```json
{
  "processId": "api-server",
  "status": {
    "activeConnections": 42,
    "memoryUsage": 128.5
  }
}
```

Response:
```json
{
  "status": "success",
  "message": "Heartbeat received"
}
```

### Get All Processes

```
GET /api/v1/monitoring/processes
```

Response:
```json
{
  "status": "success",
  "data": {
    "processes": [
      {
        "id": "api-server",
        "name": "API Server",
        "status": "active",
        "lastActivity": "2023-06-01T12:34:56.789Z",
        "lastChecked": "2023-06-01T12:35:56.789Z",
        "inactiveTime": 60,
        "restartCount": 0,
        "lastRestart": null
      }
    ]
  }
}
```

### Get Specific Process

```
GET /api/v1/monitoring/processes/:processId
```

Response:
```json
{
  "status": "success",
  "data": {
    "process": {
      "id": "api-server",
      "name": "API Server",
      "status": "active",
      "lastActivity": "2023-06-01T12:34:56.789Z",
      "lastChecked": "2023-06-01T12:35:56.789Z",
      "inactiveTime": 60,
      "restartCount": 0,
      "lastRestart": null
    }
  }
}
```

### Manually Restart Process

```
POST /api/v1/monitoring/processes/:processId/restart
```

Response:
```json
{
  "status": "success",
  "message": "Process restart initiated"
}
```

## Integrating with Services

Services can integrate with the agent by sending periodic heartbeats. A utility class is provided to simplify this:

```javascript
const ProcessHeartbeat = require('./src/utils/process-heartbeat');

// Create heartbeat instance
const heartbeat = new ProcessHeartbeat({
  processId: 'my-service',
  agentUrl: 'http://localhost:3001',
  interval: 60000 // 1 minute
});

// Start sending heartbeats
heartbeat.start();

// Send heartbeat with additional status information
heartbeat.sendHeartbeat({
  activeUsers: 42,
  queueSize: 10,
  memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
});

// Stop heartbeats when shutting down
process.on('SIGTERM', () => {
  heartbeat.stop();
  process.exit(0);
});
```

## Logs

The agent logs information to the following files:

- `logs/combined.log`: All log messages
- `logs/error.log`: Error messages only

## Process State Persistence

The agent persists the state of monitored processes to `data/process-states.json`. This allows it to resume monitoring after a restart.

## Security Considerations

- The agent API should be secured using authentication and authorization
- In production, use HTTPS for all API communication
- Restrict access to the agent API to trusted services only
- Ensure restart commands are secure and cannot be exploited
