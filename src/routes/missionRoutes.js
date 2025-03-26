const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const missionController = require('../controllers/missionController');

// Validation middleware for mission creation
const createMissionValidation = [
    body('name').notEmpty().withMessage('Mission name is required'),
    body('scheduledTime').isISO8601().withMessage('Invalid scheduled time'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]'),
];

// Mission routes
router.post('/',
    createMissionValidation,
    missionController.createMission
);

router.get('/',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 })
    ],
    missionController.getMissions
);

router.patch('/:id/status',
    [
        param('id').isMongoId().withMessage('Invalid mission ID'),
        body('status').isIn(['scheduled', 'in-progress', 'completed', 'aborted']).withMessage('Invalid mission status')
    ],
    missionController.updateMissionStatus
);

module.exports = router;