class StreamController {
    constructor(streamService) {
        this.streamService = streamService;
    }

    async getStream(req, res) {
        try {
            const streams = await this.streamService.fetchStreams();
            res.status(200).json(streams);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching streams', error });
        }
    }

    async createStream(req, res) {
        try {
            const newStream = await this.streamService.addStream(req.body);
            res.status(201).json(newStream);
        } catch (error) {
            res.status(500).json({ message: 'Error creating stream', error });
        }
    }

    async deleteStream(req, res) {
        try {
            await this.streamService.removeStream(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting stream', error });
        }
    }
}

export default StreamController;