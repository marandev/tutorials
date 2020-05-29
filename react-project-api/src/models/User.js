const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true
};

const userSchema = new Schema({
    firstName: requiredString,
    lastName: requiredString,
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    mobileNumber: Number,
    profilePhotoPath: String,
    isDoctor: {
        type: Boolean
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema)

module.exports = User;