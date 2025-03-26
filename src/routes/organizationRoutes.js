const express = require('express');
const { body, param, query } = require('express-validator');
const {
    createOrganization,
    getOrganizationById,
    listOrganizations,
    getOrganizationStatistics,
} = require('../controllers/organizationController');

const router = express.Router();

// Validation middleware for organization creation
const createOrganizationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Organization name must be between 2 and 100 characters'),

    body('contactEmail')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
];


// Validation middleware for listing organizations
const listOrganizationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// Routes
router.post(
    '/',
    createOrganizationValidation,
    createOrganization
);

router.get(
    '/',
    listOrganizationValidation,
    listOrganizations
);

router.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid organization ID'),
    getOrganizationById
);

router.get(
    '/statistics/:organizationId',
    param('id').isMongoId().withMessage('Invalid organization ID'),
    getOrganizationStatistics
);



module.exports = router;