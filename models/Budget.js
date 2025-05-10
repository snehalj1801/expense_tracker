const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    limit: { 
        type: Number, 
        required: true 
    }
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
