const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Assurez-vous que le champ email est unique
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
