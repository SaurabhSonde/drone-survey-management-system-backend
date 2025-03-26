# Missions API Documentation

## Endpoints

### Create Mission
- **URL**: `/api/missions`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "type": "one-time|recurring",
  "location": {
    "type": "Point",
    "coordinates": [number, number]
  },
  "scheduledDrones": ["droneId"],
  "scheduledTime": "ISO date",
  "recurrenceRule": {
    "frequency": "daily|weekly|monthly"
  },
  "organizationId": "string"
}
```

### List Missions
- **URL**: `/api/missions`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: string
  - `type`: string
  - `startDate`: date
  - `endDate`: date
  - `page`: number
  - `limit`: number
  - `organizationId`: string
- **Response**:
```json
{
  "missions": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalMissions": 0
  }
}
```

### Update Mission Status
- **URL**: `/api/missions/:id/status`
- **Method**: `PATCH`
- **Body**:
```json
{
  "status": "scheduled|in-progress|completed|aborted"
}
```
