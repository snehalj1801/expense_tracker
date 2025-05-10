// Summary model
const summarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    budgetLimit: { type: Number, required: true },
    savings: { type: Number, required: true },
    expenses: [
        {
            name: String,
            amount: Number,
            date: String, // Store date as a string for simplicity, or use Date type
        },
    ],
    createdAt: { type: Date, default: Date.now }
});
const Summary = mongoose.model('Summary', summarySchema);
