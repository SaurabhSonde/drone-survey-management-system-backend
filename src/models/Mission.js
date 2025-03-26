const mongoose = require('mongoose');

const createMissionSchema = () => {
    const MissionSchema = new mongoose.Schema({
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ['one-time', 'recurring'],
            default: 'one-time'
        },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'aborted'],
            default: 'scheduled'
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        scheduledDrones: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Drone'
        }],
        scheduledTime: {
            type: Date,
            required: true
        },
        recurrenceRule: {
            frequency: {
                type: String,
                enum: ['daily', 'weekly', 'monthly'],
                required: function () {
                    return this.type === 'recurring';
                }
            }
        }
    }, {
        timestamps: true
    });

    // Geospatial index for location-based queries
    MissionSchema.index({ location: '2dsphere' });

    return MissionSchema;
};

module.exports = mongoose.model('Mission', createMissionSchema());