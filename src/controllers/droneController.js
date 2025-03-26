const Drone = require('../models/Drone');
const { validationResult } = require('express-validator');

// Create a new drone
const createDrone = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create drone
        const droneData = {
            ...req.body
        };

        const drone = new Drone(droneData);
        await drone.save();

        res.status(201).json({
            message: 'Drone added successfully',
            drone
        });
    } catch (error) {
        // Handle duplicate key error for serial number
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Drone with this serial number already exists'
            });
        }

        res.status(500).json({
            message: 'Error creating drone',
            error: error.message
        });
    }
};

// Get drones with advanced filtering
const getDrones = async (req, res) => {
    try {
        const {
            status,
            type,
            minBattery,
            page = 1,
            limit = 10,
            organizationId
        } = req.query;

        // Build filter
        const filter = {
            organizationId: organizationId
        };

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (minBattery) filter.batteryLevel = { $gte: Number(minBattery) };

        // Pagination
        const drones = await Drone.find(filter)
            .sort({ createdAt: -1 });

        const total = await Drone.countDocuments(filter);

        res.json({
            drones,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalDrones: total
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching drones',
            error: error.message
        });
    }
};

// Update drone status
const updateDroneStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, batteryLevel, location, organizationId } = req.body;

        // Prepare update object
        const updateData = {};
        if (status) updateData.status = status;
        if (batteryLevel !== undefined) updateData.batteryLevel = batteryLevel;
        if (location) updateData.location = location;

        const drone = await Drone.findOneAndUpdate(
            {
                _id: id,
                organizationId: organizationId
            },
            {
                ...updateData,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        res.json({
            message: 'Drone status updated',
            drone
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating drone',
            error: error.message
        });
    }
};

// Get drone details
const getDroneById = async (req, res) => {
    try {
        const { id, organizationId } = req.params;

        const drone = await Drone.findOne({
            _id: id,
            organizationId: organizationId
        });

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        res.json(drone);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching drone details',
            error: error.message
        });
    }
};

// Delete a drone
const deleteDrone = async (req, res) => {
    try {
        const { id } = req.params;

        const drone = await Drone.findOneAndDelete({
            _id: id
        });

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        res.json({
            message: 'Drone removed successfully',
            drone
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error removing drone',
            error: error.message
        });
    }
};

module.exports = {
    createDrone,
    getDrones,
    updateDroneStatus,
    getDroneById,
    deleteDrone
};