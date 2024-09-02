const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    task: [
        {
            id: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            order: {
                type: Number,
                required: true
            },
            stage: {
                type: String,
                required: true
            },
            index: {
                type: Number,
                required: true
            },
            attachment: [
                {
                    type: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
