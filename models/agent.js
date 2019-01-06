const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentDetails = new Schema({
    nearByAgentLocation: String,
    nearByAgentTrackableCode: String,
});

const Agent = module.exports = mongoose.model('Agent', agentDetails);

module.exports.addAgent = (agentObject, callback) => {
    agentObject ? agentObject.save(callback): null;
}