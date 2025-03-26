const express = require('express');
const { body, query, param } = require('express-validator');
const droneController = require('../controllers/droneController');

const router = express.Router();

// Validation middleware for drone creation
const createDroneValidation = [
    body('serialNumber')
        .trim()
        .notEmpty()
        .withMessage('Serial number is required')
        .isLength({ max: 50 })
        .withMessage('Serial number too long'),

    body('model')
        .trim()
        .notEmpty()
        .withMessage('Drone model is required'),

    body('batteryLevel')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Battery level must be between 0 and 100')
];

// Validation middleware for drone status update
const updateDroneStatusValidation = [
    param('id').isMongoId().withMessage('Invalid drone ID'),

    body('status')
        .optional()
        .isIn(['available', 'assigned', 'maintenance', 'charging'])
        .withMessage('Invalid drone status'),

    body('batteryLevel')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Battery level must be between 0 and 100'),

    body('location')
        .optional()
        .isObject()
        .custom((value) => {
            if (value.type !== 'Point') {
                throw new Error('Location type must be Point');
            }
            if (!Array.isArray(value.coordinates) || value.coordinates.length !== 2) {
                throw new Error('Coordinates must be an array of [longitude, latitude]');
            }
            return true;
        })
];

// Drone routes
router.post('/',
    createDroneValidation,
    droneController.createDrone
);

router.get('/',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('minBattery').optional().isFloat({ min: 0, max: 100 })
    ],
    droneController.getDrones
);

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid drone ID'),
    droneController.getDroneById
);

router.patch('/:id/status',
    updateDroneStatusValidation,
    droneController.updateDroneStatus
);

router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid drone ID'),
    droneController.deleteDrone
);

module.exports = router;