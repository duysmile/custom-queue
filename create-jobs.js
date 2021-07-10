const axios = require('axios');

const MAX = 1000;
const promises = [];
const jobUrl = "http://localhost:8000/jobs";

// create job
for (let i = 0; i < MAX; i++) {
    promises.push(axios.post(jobUrl));
}

Promise.all(promises).then(() => {
    console.log("DONE");
});
