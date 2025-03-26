# Organizations API Documentation

## Endpoints

### Create Organization
- **URL**: `/api/organizations`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "contactEmail": "string"
}
```
- **Response**: 
```json
{
  "message": "Organization created successfully",
  "organization": {
    "_id": "string",
    "name": "string"
  }
}
```

### List Organizations
- **URL**: `/api/organizations`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `status`: string
  - `subscriptionType`: string
  - `sortBy`: string (default: createdAt)
  - `sortOrder`: string (default: desc)
- **Response**:
```json
{
  "organizations": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalOrganizations": 0
  }
}
```

### Get Organization Details
- **URL**: `/api/organizations/:id`
- **Method**: `GET`
- **Response**: Organization object

### Get Organization Statistics
- **URL**: `/api/organizations/statistics/:organizationId`
- **Method**: `GET`
- **Response**:
```json
{
  "totalDrones": 0,
  "activeMissions": 0,
  "completedMissions": 0,
  "scheduledMissions": 0
}
```
