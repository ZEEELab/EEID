function Cohort() {
	this.members = [];
}

Cohort.prototype.move_cohort = function(destination, callback_for_agent) {
	for (let i=0; i < this.members.length; i++) {
		let agent = this.members[i];
		agent.location.migrate_to(destination, agent, callback_for_agent);
	}
};

Cohort.prototype.send_cohort_home = function(callback_for_agent) {
	for (let i=0; i < this.members.length; i++) {
		let agent = this.members[i];
		agent.location.migrate_to(agent.home, agent, callback_for_agent)
	}
};

Cohort.prototype.add_agent = function(agent, callback) {
	this.members.push(agent);
	agent.cohorts.push(this);
	
	if (callback) callback(agent);
};

module.exports = Cohort;