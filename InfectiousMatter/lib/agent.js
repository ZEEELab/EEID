const uniqid = require("uniqid");

//TODO: Add multiple graphs, and subscribe events to them
//TODO: 

function Agent(body) {
	this.track_all_contacts = true;
	this.state = undefined;
	this.body = body;
	this.interaction_callback = undefined;
	this.uuid = uniqid();

	this.location = undefined;
	this.home = undefined;
	this.cohorts = [];
	this.color = undefined;
	this.home_state = {};
	this.migrating = false;
}

Agent.prototype.add_body = function(body) {
	this.body = body;
}

Agent.prototype.register_interaction_callback = function (interaction_callback) {
	this.interaction_callback = interaction_callback;
}

Agent.prototype.handle_agent_contact = function(other_agent) {
	this.interaction_callback(other_agent);
}

module.exports = Agent;
