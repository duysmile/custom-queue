const Queue = require('bull');

const BACK_OFF = {
    type: "exponential",
    delay: 1000,
};
class MyQueue {
    constructor(name, concurrency, redisHost = process.env.REDIS_HOST) {
        this.name = name;
        this.concurrency = concurrency;
        this.queue = new Queue(this.name, redisHost);
        this.initEvent();
    }

    provide(data, options = {}) {
        return this.queue.add(data, {
            backOff: BACK_OFF,
            removeOnComplete: true,
            ...options,
        });
    }

    addConsumer(handler) {
        return this.queue.process(
            this.concurrency,
            handler,
        );
    }

    pause({
        isLocal = false,
        doNotWaitActive = true,
    }) {
        return this.queue.pause(isLocal, doNotWaitActive);
    }

    resume(isLocal = false) {
        return this.queue.resume(isLocal);
    }

    async removeJob(jobId) {
        const job = await this.queue.getJob(jobId);
        if (job) {
            return job.remove();
        }
    }

    initEvent() {
        this.queue.on('completed', (job) => {
            // console.info(`COMPLETED: Job ${job.id} done`);
        });

        this.queue.on('error', (error) => {
            error.message = `ERROR: ${error.message}`;
            console.error(error);
        });
    }
}

module.exports = MyQueue;
