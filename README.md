# custom-queue

Build a custom queue base on Bull

This example is to limit concurrent job in active state.

My idea is using 2 queues:
- Queue 1: handle request sequence, check if reach limit -> stop and wait.
- Queue 2: handle job concurrent and follow limit of system (default 200).

Usage:
```
// run server
node server.js

// run client to create job
node create-jobs.js

// run client to set limit concurrent job
node set-limit.js
```