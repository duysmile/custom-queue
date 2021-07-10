const doneCallEvent = require('./event');

let maxCCU = 1;
let current = 0;

let resolve = () => {};

exports.limitJobHandle = (queue) => async (job, done) => {
    try {
        if (current == maxCCU) {
            await new Promise(res => {
                resolve = res;
            });
        }

        queue.provide();
        current += 1;
        done();
    } catch(err) {
        console.error(err);
        done(err);
    }
};

exports.handleJob = async (job, done) => {
    try {
        console.log(`handle job started: `, job.id);

        await new Promise(res => setTimeout(() => res(), 5000));
        doneCallEvent.emit("done");
        done();
        console.log(`handle job finished: `, job.id);
    } catch(err) {
        console.error(err);
        done(err);
    }
};

doneCallEvent.on("done", () => {
    current -= 1;
    if (current < maxCCU) {
        resolve();
    }
});

exports.setMaxCCU = (number) => {
    maxCCU = number;
};
