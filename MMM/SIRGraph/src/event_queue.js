let FastPriorityQueue = require('fastpriorityqueue');
let assert = require('assert');


function EventQueue() {
	this.fast_queue = new FastPriorityQueue(function(a,b) {
		return a.time <= b.time;
	});
};

EventQueue.prototype.add_event = function(cur_sim_time, q_event) {
	assert(q_event.time && q_event.callback);
	q_event.original_time = q_event.time;
	q_event.time += cur_sim_time;
	q_event.stale = false;
	this.fast_queue.add(q_event);
};

EventQueue.prototype.run_events_fired = function(cur_sim_time, event_limit) {
	let num_events = 0;
	while (this.fast_queue.peek() && this.fast_queue.peek().time < cur_sim_time && num_events < event_limit){
		var this_event = this.fast_queue.poll();

		if (this_event.stale == false) {
			if (this_event.recurring) {
				this.add_event(cur_sim_time, {time:this_event.original_time, callback:this_event.callback, recurring:true, stale:false});
			}
			this_event.callback();
			num_events += 1;
		}
	}
};

EventQueue.prototype.clear_events = function() {
	this.fast_queue = null;
	this.fast_queue = new FastPriorityQueue(function(a,b) {
		return a.time <= b.time;
	});
};



module.exports = {EventQueue};