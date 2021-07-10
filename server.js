const express = require('express');

const Queue = require('./queue');
const { limitJobHandle, handleJob, setMaxCCU } = require('./consumer');
const doneCallEvent = require('./event');

const app = express();

const QUEUE_LIMIT = "limit-queue";
const QUEUE_ACTION = "action-queue";

function initQueue() {
    const limitQueue = new Queue(QUEUE_LIMIT, 1);
    const actionQueue = new Queue(QUEUE_ACTION, 200);

    limitQueue.addConsumer(limitJobHandle(actionQueue));
    actionQueue.addConsumer(handleJob);

    return limitQueue;
}

let count = 0;

const queue = initQueue();

app.use(express.json());

app.post('/jobs', (_, res) => {
    queue.provide({
        id: count++,
    });

    res.send("OK");
});

app.put('/limits', (req, res) => {
    setMaxCCU(req.body.number);
    res.send("OK");
});

app.put('/events', (_, res) => {
    doneCallEvent.emit("done");
    res.send("OK");
})

app.listen(8000, () => {
    console.log('Server started at port 8000');
});
