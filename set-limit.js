const axios = require('axios');
const limitUrl = "http://localhost:8000/limits";

axios.put(limitUrl, { number: 100 });