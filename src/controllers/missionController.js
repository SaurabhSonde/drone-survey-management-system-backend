const Mission = require('../models/Mission');
const Drone = require('../models/Drone');
const { validationResult } = require('express-validator');
const missionScheduler = require('../services/missionScheduler');


// Create a new mission
const createMission = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract mission data from request
        const missionData = req.body;


        // Validate drone availability
        const availableDrones = await Drone.find({
            status: 'available',
            _id: { $in: missionData.scheduledDrones }
        });


        if (availableDrones.length !== missionData.scheduledDrones.length) {
            return res.status(400).json({
                message: 'One or more selected drones are not available'
            });
        }

        // Create mission
        const mission = new Mission(missionData);
        await mission.save();

        // Schedule mission
        if (mission.type === 'recurring') {
            missionScheduler.scheduleRecurringMission(mission);
        } else {
            missionScheduler.scheduleOnTimeMission(mission);
        }

        // Update drone status
        await Drone.updateMany(
            { _id: { $in: mission.scheduledDrones } },
            { status: 'assigned' }
        );

        res.status(201).json({
            message: 'Mission created successfully',
            mission
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error creating mission',
            error: error.message
        });
    }
};

// Get missions with advanced filtering
const getMissions = async (req, res) => {
    try {
        const {
            status,
            type,
            startDate,
            endDate,
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


        // Pagination
        const missions = await Mission.find(filter)
            .populate('scheduledDrones')
            .sort({ scheduledTime: -1 });

        const total = await Mission.countDocuments(filter);

        res.json({
            missions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalMissions: total
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching missions',
            error: error.message
        });
    }
};

// Update mission status
const updateMissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const mission = await Mission.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Handle drone status based on mission status
        if (status === 'completed' || status === 'aborted') {
            await Drone.updateMany(
                { _id: { $in: mission.scheduledDrones } },
                { status: 'available' }
            );
        }

        res.json({
            message: 'Mission status updated',
            mission
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating mission',
            error: error.message
        });
    }
};

module.exports = {
    createMission,
    getMissions,
    updateMissionStatus
};