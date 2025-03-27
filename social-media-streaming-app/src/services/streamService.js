class StreamService {
    constructor() {
        this.streams = [];
    }

    fetchStreams() {
        return this.streams;
    }

    addStream(stream) {
        this.streams.push(stream);
        return stream;
    }

    removeStream(streamId) {
        const index = this.streams.findIndex(stream => stream.id === streamId);
        if (index !== -1) {
            return this.streams.splice(index, 1)[0];
        }
        return null;
    }
}

export default StreamService;