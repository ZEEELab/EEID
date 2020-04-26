function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function Location(name) {
	this.name = name;
	this.bounds = undefined;
	this.friction = 0.2;
	this.occupants = [];
	this.border_color = undefined;
}

Location.prototype.draw_borders = function(ctx, strokeStyle) {
	if (!strokeStyle || !this.border_color){
		strokeStyle = "black";
	} else {
		strokeStyle = strokeStyle || this.border_color;
	}


	let width = this.bounds.max.x - this.bounds.min.x;
	let height = this.bounds.max.y - this.bounds.min.y;

	ctx.beginPath();
	ctx.rect(this.bounds.min.x-2, this.bounds.min.y-2, width+4, height+4);
	ctx.strokeStyle = strokeStyle;
	ctx.stroke();
};

Location.prototype.get_random_position = function() {
	if(this.bounds){
		return {
			x: getRandomArbitrary(this.bounds.min.x, this.bounds.max.x),
			y: getRandomArbitrary(this.bounds.min.y, this.bounds.max.y)
		}
	} else {
		return {
			x: 0, 
			y: 0
		}
	}
};

Location.prototype.remove_agent =function(agent) {
	this.occupants = this.occupants.filter(function(a) {
		return (a !== agent)
	});
	agent.location = undefined;
};

Location.prototype.set_bounds = function(bounds) {
	this.bounds = bounds;
};

Location.prototype.migrate_to = function(destination, agent, callback) {
	this.remove_agent(agent);
	destination.add_agent(agent);

	if(callback) {
		callback(agent);
	}
};

Location.prototype.migrate_random_to = function(destination, callback) {
	if (this.occupants.length > 0)
	{
		let temp_a = getRandomChoice(this.occupants);
		this.migrate_to(destination, temp_a, callback);	
	}
};

Location.prototype.add_agent = function(agent) {
	this.occupants.push(agent);
	agent.location = this;
};

module.exports = Location;