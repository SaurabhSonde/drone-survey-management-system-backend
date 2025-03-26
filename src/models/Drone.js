const mongoose = require('mongoose');

const createDroneSchema = () => {
    const DroneSchema = new mongoose.Schema({
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        model: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'assigned', 'maintenance', 'charging', 'out-of-service'],
            default: 'available'
        },
        batteryLevel: {
            type: Number,
            min: 0,
            max: 100,
            default: 100
        },
        currentLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        lastMaintenance: {
            type: Date
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        }
    }, {
        timestamps: true
    });

    // Geospatial index for location tracking
    DroneSchema.index({ currentLocation: '2dsphere' });

    return DroneSchema;
};

module.exports = mongoose.model('Drone', createDroneSchema());