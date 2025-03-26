const cron = require('node-cron');
const Drone = require('../models/Drone');

let io;

// Function to initialize Socket.io
const initializeSocket = (socketInstance) => {
    io = socketInstance;
};

// Notification service (simplified)
const notificationService = {
    sendErrorNotification: (mission, error) => {
        console.error(`Mission ${mission._id} failed:`, error);
        if (io) {
            io.emit('mission:error', { missionId: mission._id, error: error.message });
        }
    },
    sendMissionCompletionNotification: (mission) => {
        console.log(`Mission ${mission._id} completed successfully`);
        if (io) {
            io.emit('mission:completed', { missionId: mission._id, message: "Mission completed successfully" });
        }
    },
    sendMissionInProgressNotification: (mission) => {
        console.log(`Mission ${mission._id} completed successfully`);
        if (io) {
            io.emit('mission:in-progress', { missionId: mission._id, message: "Mission is in progress" });
        }
    },
}

// Simulate notifications every 5 seconds for testing
// setInterval(() => {
//     const testMission = { _id: '67e41837b22ea9d4ed3478be' };

//     if (Math.random() > 0.5) {
//         notificationService.sendMissionCompletionNotification(testMission);
//     } else {
//         notificationService.sendErrorNotification(testMission, { message: "Mission Failed" });
//     }
// }, 5000);

// Scheduled jobs storage
const scheduledJobs = new Map();

// Convert date to cron expression
const convertToCronExpression = (date) => {
    return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
};

// Generate recurring cron expression
const generateRecurringCronExpression = (mission) => {
    const { frequency, interval = 1 } = mission.recurrenceRule;

    switch (frequency) {
        case 'daily':
            return `0 0 */${interval} * *`;
        case 'weekly':
            return `0 0 * * ${interval}`;
        case 'monthly':
            return `0 0 ${interval} * *`;
        default:
            throw new Error('Invalid recurrence frequency');
    }
};

// Simulate mission execution (placeholder)
const simulateMissionExecution = async (mission, drones) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Executed mission ${mission._id} with ${drones.length} drones`);
            resolve();
        }, 5000);  // Simulate 5-second mission
    });
};

// Execute mission logic
const executeMission = async (mission) => {
    try {
        // Update mission status
        mission.status = 'in-progress';
        await mission.save();
        // send active notification
        notificationService.sendMissionInProgressNotification(mission)


        // Validate and prepare drones
        const assignedDrones = await Drone.find({
            _id: { $in: mission.scheduledDrones },
            status: 'assigned'
        });

        if (assignedDrones.length === 0) {
            throw new Error('No available drones for mission');
        }

        // Simulate mission execution
        await simulateMissionExecution(mission, assignedDrones);

        // Complete mission
        mission.status = 'completed';
        await mission.save();

        // Free up drones
        await Drone.updateMany(
            { _id: { $in: mission.scheduledDrones } },
            { status: 'available' }
        );

        // Send completion notification
        notificationService.sendMissionCompletionNotification(mission);
    } catch (error) {
        console.error('Mission execution error:', error);
        notificationService.sendErrorNotification(mission, error);

        // Update mission status to aborted
        mission.status = 'aborted';
        await mission.save();
    }
};

// Schedule a one-time mission
const scheduleOnTimeMission = (mission) => {
    const scheduledTime = new Date(mission.scheduledTime);

    const job = cron.schedule(
        convertToCronExpression(scheduledTime),
        async () => {
            try {
                await executeMission(mission);
            } catch (error) {
                console.error('Mission scheduling error:', error);
            }
        },
        { scheduled: true }
    );

    scheduledJobs.set(mission._id.toString(), job);
};

// Schedule recurring mission
const scheduleRecurringMission = (mission) => {
    const cronExpression = generateRecurringCronExpression(mission);

    const job = cron.schedule(
        cronExpression,
        async () => {
            try {
                await executeMission(mission);
            } catch (error) {
                console.error('Recurring mission error:', error);
            }
        },
        { scheduled: true }
    );

    scheduledJobs.set(mission._id.toString(), job);
};

// Cancel a scheduled mission
const cancelMission = (missionId) => {
    const job = scheduledJobs.get(missionId);
    if (job) {
        job.stop();
        scheduledJobs.delete(missionId);
    }
};

module.exports = {
    scheduleOnTimeMission,
    scheduleRecurringMission,
    cancelMission,
    initializeSocket
};