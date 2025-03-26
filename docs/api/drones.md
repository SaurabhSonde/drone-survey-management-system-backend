# Drones API Documentation

## Endpoints

### Register Drone
- **URL**: `/api/drones`
- **Method**: `POST`
- **Body**:
```json
{
  "serialNumber": "string",
  "model": "string",
  "batteryLevel": number,
  "organizationId": "string"
}
```
- **Response**: Drone object

### List Drones
- **URL**: `/api/drones`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: string
  - `type`: string
  - `minBattery`: number
  - `page`: number
  - `limit`: number
  - `organizationId`: string
- **Response**:
```json
{
  "drones": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalDrones": 0
  }
}
```

### Update Drone Status
- **URL**: `/api/drones/:id/status`
- **Method**: `PATCH`
- **Body**:
```json
{
  "status": "available|assigned|maintenance|charging",
  "batteryLevel": number,
  "location": {
    "type": "Point",
    "coordinates": [number, number]
  }
}
```

### Delete Drone
- **URL**: `/api/drones/:id`
- **Method**: `DELETE`
