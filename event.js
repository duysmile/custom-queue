const EventEmitter = require('events');

class DoneCallEvent extends EventEmitter {}

module.exports = new DoneCallEvent();
