const Organization = require('../models/Organization');
const Drone = require('../models/Drone')
const Mission = require('../models/Mission')
const { validationResult } = require('express-validator');

// Create a new organization
const createOrganization = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if organization with same domain or name already exists
        const { name, contactEmail } = req.body;
        const existingOrg = await Organization.findOne({
            $or: [{ name }, { contactEmail }]
        });

        if (existingOrg) {
            return res.status(409).json({
                message: 'Organization with this name, domain, or email already exists'
            });
        }

        // Create new organization
        const newOrganization = new Organization(req.body);
        await newOrganization.save();

        res.status(201).json({
            message: 'Organization created successfully',
            organization: {
                _id: newOrganization._id,
                name: newOrganization.name
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating organization',
            error: error.message
        });
    }
};

// Get organization by ID
const getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id)
            .populate('activeLocations')
            .select('-__v');

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(organization);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching organization',
            error: error.message
        });
    }
};


// List organizations with advanced filtering
const listOrganizations = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            subscriptionType,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (subscriptionType) filter.subscriptionType = subscriptionType;

        // Sorting
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        // Pagination
        const organizations = await Organization.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('-__v');

        // Total count
        const total = await Organization.countDocuments(filter);

        res.json({
            organizations,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalOrganizations: total
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error listing organizations',
            error: error.message
        });
    }
};

const getOrganizationStatistics = async (req, res) => {
    try {
        const { organizationId } = req.params;

        if (!organizationId) {
            return res.status(400).json({ error: "Organization ID is required" });
        }

        // Fetch total drones in the organization
        const totalDrones = await Drone.countDocuments({ organizationId });

        // Fetch mission counts
        const activeMissions = await Mission.countDocuments({ organizationId, status: "in-progress" });
        const completedMissions = await Mission.countDocuments({ organizationId, status: "completed" });
        const scheduledMissions = await Mission.countDocuments({ organizationId, status: "scheduled" });

        return res.json({
            totalDrones,
            activeMissions,
            completedMissions,
            scheduledMissions
        });

    } catch (error) {
        console.error("Error fetching organization statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    createOrganization,
    getOrganizationById,
    listOrganizations,
    getOrganizationStatistics
};