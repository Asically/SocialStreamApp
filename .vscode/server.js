// Schedule a Stream
const StreamSchedule = mongoose.model('StreamSchedule', new mongoose.Schema({
    userId: String,
    startTime: Date,
    platform: String,
    streamKey: String
}));

app.post('/schedule-stream', async (req, res) => {
    const { userId, startTime, platform, streamKey } = req.body;
    const schedule = new StreamSchedule({ userId, startTime, platform, streamKey });
    await schedule.save();
    res.status(200).json({ message: 'Stream scheduled successfully' });
});
