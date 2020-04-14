// ZIM - http://zimjs.com - Code Creativity!
// JavaScript Canvas Framework for General Interactive Media
// free to use - donations welcome of course! http://zimjs.com/donate

// ZIM PHYSICS - see http://zimjs.com/code#libraries for examples

// ~~~~~~~~~~~~~~~~~~~~~~~~
// DESCRIPTION - coded in 2016 (c) Inventor Dan Zen http://danzen.com
// physics.js is an add-on ZIM module to help with Box2D
// (17K) currently only providing a non-minified file - minify to save 10K
// built for and requires Box2dWeb-2.1.a.3.min.js (220K)
// available here: https://d309knd7es5f10.cloudfront.net/Box2dWeb-2.1.a.3.min.js

// physics.js abstracts the world creation
// makes border around the world
// makes rectangles, circles and triangles and adds x, y and rotation
// maps these to ZIM assets like shapes and bitmaps
// wraps mouse control code
// abstracts the debug mode
// abstracts the update function and provides Ticker access before and after stepping
// provides movement controls and world following

/*-- ~~~~~~~~~~~~~~~~~~~~~~~~
DOCS

NOTE: As of ZIM 10 Physics has been further integrated with ZIM
The docs now offer support for Physics
https://zimjs.com/docs.html?item=Physics
https://zimjs.com/docs.html?item=addPhysics

*******
THE DOCS IN ZIM DOCS SHOULD NOW BE USED
--*/


var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
var b2AABB = Box2D.Collision.b2AABB;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var zimPhysics = true;
var zimDefaultPhysics;

var zim = function(zim) {

	zim.Physics = function(gravity, borders, scroll, frame) {
		var sig = "gravity, borders, scroll, frame";
		var duo; if (duo = zob(zim.Physics, arguments, sig, this)) return duo;

		var that = this;

		if (zon) zog("ZIM PHYSICS");

		if (zot(frame) && (typeof zimDefaultFrame == "undefined" || zot(zimDefaultFrame))) {console.log("zim.Physics() - please provide a zim Frame object"); return;}
		frame = frame || zimDefaultFrame;
		that.frame = frame;
		if (zot(borders)) borders = {x:0, y:0, width:that.frame.width, height:that.frame.height};
		borders = {x:borders.x, y:borders.y, width:borders.width, height:borders.height};
		if (zot(gravity)) gravity = 10;
		if (zot(scroll)) scroll = false;

		if (zot(zimDefaultPhysics)) zimDefaultPhysics = this;
		var stage = that.frame.stage;

		// adjust for ZIM 10.9.0 and CreateJS 1.3.0
		// also turned all stage.scaleX to zim.scaX, etc.
		if (zot(zim.scaX)) {
			createjs.stageTransformable = false;
			zim.scaX = stage.scaleX;
			zim.scaY = stage.scaleY;
		}

		this.gravity = gravity;
		var scale = this.scale = 30;
		var step = this.step = 20;
		this.timeStep = 1/step;

		var world = this.world = new b2World(new b2Vec2(0, gravity), true); // gravity, allow sleep
		// each of these return a b2Body with x, y, and rotation properties added

		this.makeRectangle = function(width, height, dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear) {
			var duo; if (duo = zob(that.makeRectangle, arguments)) return duo;
			return makeShape(["rectangle", width, height], dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear);
		}
		this.makeCircle = function(radius, dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear) {
			var duo; if (duo = zob(that.makeCircle, arguments)) return duo;
			return makeShape(["circle", radius], dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear);
		}
		this.makeTriangle = function(a, b, c, dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear) {
			var duo; if (duo = zob(that.makeTriangle, arguments)) return duo;
			return makeShape(["triangle", a, b, c], dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear);
		}

		function makeShape(shape, dynamic, friction, angular, density, restitution, maskBits, categoryBits, linear) {
			var type = shape[0];
			if (zot(dynamic)) dynamic = true;
			if (zot(friction)) friction = .8;
			if (zot(angular)) angular = .5; // rotational damping
			if (zot(linear)) linear = .5; // linear damping
			if (zot(density)) density = 1;
			if (zot(restitution)) restitution = 0;

			var definition = new b2BodyDef();

			if (dynamic == "kinematic") {
				definition.type = b2Body.b2_kinematicBody;
			} else if (dynamic) {
				definition.type = b2Body.b2_dynamicBody;
			} else {
				definition.type = b2Body.b2_staticBody;
			}
			definition.angularDamping = angular;
			definition.linearDamping = linear;
			var body = world.CreateBody(definition);
			var s;
			if (type=="rectangle") {
				s = new b2PolygonShape();
				if (zot(shape[1])) shape[1] = 100;
				if (zot(shape[2])) shape[2] = 100;
				s.width = shape[1];
				s.height = shape[2];
				s.SetAsBox(s.width/scale/2, s.height/scale/2);

			} else if (type=="triangle") {
				if (!zim) return;
				s = new b2PolygonShape();
				if (zot(shape[1])) shape[1] = 100;
				if (zot(shape[2])) shape[2] = 100;
				if (zot(shape[3])) shape[3] = 100;
				// uses zim Triangle to match Box2D shape
				var tri = new zim.Triangle(shape[1], shape[2], shape[3]);
				s.width = tri.width;
				s.height = tri.height;
				var points = [];
				// outside is right of line - so needed to reverse order
				points[2] = new b2Vec2((tri.one.x-tri.regX)/scale, (tri.one.y+tri.regY)/scale);
				points[1] = new b2Vec2((tri.two.x-tri.regX)/scale, (tri.two.y+tri.regY)/scale);
				points[0] = new b2Vec2((tri.three.x-tri.regX)/scale, (tri.three.y+tri.regY)/scale);
				s.SetAsArray(points, points.length);
			} else { // circle
				if (zot(shape[1])) shape[1] = 50;
				s = new b2CircleShape(shape[1]/scale);
				s.width = s.height = shape[1]*2;
			}
			var fixture = new b2FixtureDef();
			if (!zot(categoryBits)) fixture.filter.categoryBits = categoryBits;
			if (!zot(maskBits)) fixture.filter.maskBits = maskBits;
			fixture.shape = s;
			fixture.density = density;
			fixture.friction = friction;
			fixture.restitution = restitution;
			body.CreateFixture(fixture);
			body.width = s.width;
			body.height = s.height;

			// these hold x, y and rotation local values
			body.zimX = 0;
			body.zimY = 0;
			body.zimR = 0;
			setBasicProperties(body);
			return body;
		}

		function setBasicProperties(body) {
			Object.defineProperty(body, 'x', {
				get: function() {
					return body.GetWorldCenter().x*that.scale;
				},
				set: function(x) {
					body.zimX = x;
					body.SetPosition(new b2Vec2(body.zimX/scale, body.zimY/scale));
				}
			});
			Object.defineProperty(body, 'y', {
				get: function() {
					return body.GetWorldCenter().y*that.scale;
				},
				set: function(y) {
					body.zimY = y;
					body.SetPosition(new b2Vec2(body.zimX/scale, body.zimY/scale));
				}
			});
			Object.defineProperty(body, 'rotation', {
				get: function() {
					return body.GetAngle()*180/Math.PI;
				},
				set: function(rotation) {
					body.zimR = rotation;
					body.SetAngle(rotation*Math.PI/180);
				}
			});
		}

		this.join = function(body1, body2, point1, point2, minAngle, maxAngle, type) {
			if (zot(body1) || zot(body2)) return;
			if (body1.body) body1 = body1.body;
			if (body2.body) body2 = body2.body;
			if (zot(point1)) point1 = new zim.Point(body1.GetWorldCenter().x*that.scale, body1.GetWorldCenter().y*that.scale);
			if (zot(point2)) point2 = new zim.Point(body2.GetWorldCenter().x*that.scale, body2.GetWorldCenter().y*that.scale);
			if (zot(type)) type = "weld";
			var def;
			if (type=="distance") def = new b2DistanceJointDef();
			if (type=="revolute") def = new b2RevoluteJointDef();
			if (type=="weld") def = new b2WeldJointDef();
			def.Initialize(body1, body2, new b2Vec2(point1.x/that.scale, point1.y/that.scale), new b2Vec2(point2.x/that.scale, point2.y/that.scale));
			if (!zot(minAngle) || !zot(maxAngle)) {
				def.enableLimit = true;
				def.lowerAngle = minAngle*Math.PI/180;
				def.upperAngle = maxAngle*Math.PI/180;
			}
			return that.world.CreateJoint(def);
		}
		this.break = function(joint) {
			that.world.DestroyJoint(joint);
		}

		// for backwards compatibility - use join() now...
		this.makeJoint = function(body1, body2, pointX, pointY, minAngle, maxAngle, type) {
			var def = (!zot(type) && type=="distance") ? new b2DistanceJointDef() : new b2RevoluteJointDef();
			def.Initialize(body1, body2, body1.GetWorldPoint(new b2Vec2(pointX/that.scale, pointY/that.scale)));
			if (!zot(minAngle) || !zot(maxAngle)) {
				def.enableLimit = true;
				def.lowerAngle = minAngle*Math.PI/180;
				def.upperAngle = maxAngle*Math.PI/180;
			}
			return that.world.CreateJoint(def);
		}

		var debug;
		this.debug = function() {
			if (debug) {
				debug.debugCanvas.style.display = "block";
			} else {
				// make the Debug object with its canvas only once
				debug = new this.Debug();
			}
			debug.active = true;
			that.updateDebug();
		}
		this.Debug = function() {
			var debugCanvas = this.debugCanvas = document.createElement("canvas");
			debugCanvas.setAttribute("id", "debugCanvas");
			if (that.frame.scale != 1) {
				debugCanvas.setAttribute("width", that.frame.width);
				debugCanvas.setAttribute("height", that.frame.height);
			} else {
				var largest = Math.max(window.innerWidth, screen.width, window.innerHeight, screen.height);
				debugCanvas.setAttribute("width", largest);
				debugCanvas.setAttribute("height", largest);
			}
			that.frame.canvas.parentElement.appendChild(debugCanvas);
			debugCanvas.style.pointerEvents = "none";

			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(debugCanvas.getContext('2d'));
			debugDraw.SetDrawScale(scale);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
			this.update = function() {
				world.m_debugDraw.m_sprite.graphics.clear();
				world.DrawDebugData();
			}
		}
		this.updateDebug = function() {
			if (zot(debug)) return;
			var canvasPosition = getElementPosition(that.frame.canvas);
			var c = debug.debugCanvas;
			c.style.position = "absolute";
			c.style.zIndex = 2;
			c.style.left = that.frame.canvas.style.left;
			c.style.top = that.frame.canvas.style.top;
			c.style.width = that.frame.canvas.style.width;
			c.style.height = that.frame.canvas.style.height;
		}
		this.removeDebug = function() {
			if (!debug) return;
			debug.active = false;
			debug.debugCanvas.style.display = "none";
		}

		// keep a remove list and remove in update function
		// at the correct time so world does not get confused
		var removeList = [];
		this.remove = function(body) {
			removeList.push(body);
		}
		function doRemove() {
			var len = removeList.length;
			if (len==0) return;
			var body;
			for (var i=len-1; i>=0; i--) {
				body = removeList[i];
				mappings.remove(body);
				world.DestroyBody(body);
				body = null;
				removeList.pop();
			}
		}

		this.follow = function(obj, damp, dampY, leftOffset, rightOffset, upOffset, downOffset, offsetDamp, offsetDampY, horizontal, vertical, borderLock, borderOriginal) {
			var duo; if (duo = zob(that.follow, arguments)) return duo;
			that.followObj = null;
			if (zot(obj)) return;
			if (obj.zimObj) obj = obj.zimObj; // passed in a box2DBody instead
			// Ticker uses these if controls are used so just set them to 0 here
			obj.controlX = obj.controlDirX = obj.controlY = obj.controlDirY = 0;
			that.followObj = obj;
			obj.followDampX = null;
			obj.followDampY = null;
			if (zot(damp)) damp = .05;
			if (zot(dampY)) dampY = damp;
			if (zot(leftOffset)) leftOffset = 0;
			if (zot(rightOffset)) rightOffset = that.frame.stage.width;
			if (zot(upOffset)) upOffset = 0;
			if (zot(downOffset)) downOffset = that.frame.stage.height;
			if (zot(offsetDamp)) offsetDamp = .02;
			if (zot(offsetDampY)) offsetDampY = offsetDamp;
			if (zot(horizontal)) horizontal = true;
			if (zot(vertical)) vertical = true;
			if (zot(borderLock)) borderLock = borders.constructor === {}.constructor;
			if (zot(borderOriginal)) borderOriginal = false;
			obj.frameBorderLock = borderLock;
			obj.frameBorderOriginal = borderOriginal;
			if (horizontal) {
				obj.followDampX = new Damp(0,damp);
				obj.offsetDampX = new Damp((leftOffset+rightOffset)/2,offsetDamp);
				obj.followOffsetX = [(leftOffset+rightOffset)/2, leftOffset, rightOffset];
			}
			if (vertical) {
				obj.followDampY = new Damp(0,dampY);
				obj.offsetDampY = new Damp((upOffset+downOffset)/2,offsetDampY);
				obj.followOffsetY = [(upOffset+downOffset)/2, upOffset, downOffset];
			}
			that.followSpeed = 0;
	        var lastPos = stage.x;
	        var lastTime = Date.now();
			obj.followTicker = that.Ticker.add(function() {
				var t = Date.now();
	            var dT = t-lastTime;
	            if (dT==0) return;
	            var dP = lastPos-stage.x;
	            that.followSpeed = dP/dT*1000;
	            lastTime = t;
	            lastPos = stage.x;
			});
		}

		this.control = function(obj, type, speed, speedY, horizontal, vertical) {
			obj.ground = true; // default assumes on ground
			var duo; if (duo = zob(that.control, arguments)) return duo;
			if (zot(obj)) return;
			if (obj.zimObj) zimObj = obj.zimObj; // passed in a box2DBody instead
			that.controlObj = obj;
			obj.controlX = 0;
			obj.controlY = 0;
			if (zot(type)) type = "both";
			if (zot(speed)) speed = 200;
			if (zot(speedY)) speedY = speed;
			if (zot(horizontal)) horizontal = true;
			if (zot(vertical)) vertical = true;

			var k = [0,0,0,0,0,0,0,0,0,0,0,0]; // keep track of wasd 87, 65, 83, 68 and arrows down and custom four directions
			obj.controlKeydown = that.frame.on("keydown", function(e) {
				if (!obj.ground) return;
				checkCodes(e.keyCode, speed, speedY);
			});
			obj.controlKeyup = that.frame.on("keyup", function(e) {checkCodes(e.keyCode, 0, 0);});

			that.customControl = function(code, desiredSpeed, desiredSpeedY) {
				checkCodes(code, !zot(desiredSpeed)?desiredSpeed:speed, !zot(desiredSpeedY)?desiredSpeedY:speedY);
				zog(code, speed)
			}
			function checkCodes(code, speed, speedY) {
				if (code == 37 && horizontal && (type == "both" || type == "arrows")) k[0] = -speed;
				if (code == 38 && vertical && (type == "both" || type == "arrows")) k[1] = -speedY;
				if (code == 39 && horizontal && (type == "both" || type == "arrows")) k[2] = speed;
				if (code == 40 && vertical && (type == "both" || type == "arrows")) k[3] = speedY;
				if (code == 65 && horizontal && (type == "both" || type == "wasd")) k[4] = -speed;
				if (code == 87 && vertical && (type == "both" || type == "wasd")) k[5] = -speedY;
				if (code == 68 && horizontal && (type == "both" || type == "wasd")) k[6] = speed;
				if (code == 83 && vertical && (type == "both" || type == "wasd")) k[7] = speedY;

				// custom
				if (code == "left" && horizontal) k[8] = -speed;
				if (code == "up" && vertical) k[9] = -speed;
				if (code == "right" && horizontal) k[10] = speed;
				if (code == "down" && vertical) k[11] = speed;

				obj.controlDirX = k[0]+k[2]+k[4]+k[6]+k[8]+k[10]==0?0:(k[0]+k[2]+k[4]+k[6]+k[8]+k[10]>0?1:-1); // 0,-1,1
				obj.controlDirY = k[1]+k[3]+k[5]+k[7]+k[9]+k[11]==0?0:(k[1]+k[3]+k[5]+k[7]+k[9]+k[11]>0?1:-1);
				obj.controlX = k[0]+k[2]+k[4]+k[6]+k[8]+k[10]==0?0:(k[0]+k[2]+k[4]+k[6]+k[8]+k[10]>0?1:2); // 0,1,2
				obj.controlY = k[1]+k[3]+k[5]+k[7]+k[9]+k[11]==0?0:(k[1]+k[3]+k[5]+k[7]+k[9]+k[11]>0?1:2);
			}
			var body = obj.body;
			obj.controlTicker = that.Ticker.add(function() {
				// k[0]+k[2] is the total x speed, for instance
				if (Math.abs(k[0]+k[2]+k[4]+k[6]+k[8]+k[10]) + Math.abs(k[1]+k[3]+k[5]+k[7]+k[9]+k[11]) == 0) return;
				body.ApplyForce(new b2Vec2(
					k[0]+k[2]+k[4]+k[6]+k[8]+k[10]>0?speed:(k[0]+k[2]+k[4]+k[6]+k[8]+k[10]<0?-speed:0),
					k[1]+k[3]+k[5]+k[7]+k[9]+k[11]>0?speedY:(k[1]+k[3]+k[5]+k[7]+k[9]+k[11]<0?-speedY:0)
				), body.GetWorldCenter());
			});
		}

		this.noControl = function(obj) {
			if (!zot(obj) && obj.controlTicker) {
				that.controlObj = null;
				that.Ticker.remove(obj.controlTicker);
				that.frame.off("keydown", obj.controlKeydown);
				that.frame.off("keyup", obj.controlKeyup);
				obj.controlX = obj.controlDirX = obj.controlY = obj.controlDirY = 0;
			}
		}

		// Drag wraps the demo example mouse code
		var drag;
		this.drag = function(list) {
			drag = new that.Drag(list);
		}
		this.noDrag = function() {
			drag.removeListeners();
			drag = null;
		}
		this.Drag = function(list) {
			if (zot(frame)) frame = {scale:1};
			if (zot(list)) list = [];
			for (var i=0; i<list.length; i++) {
				if (list[i].body) list[i] = list[i].body;
			}
			this.list = list;
			var that2 = this;
			this.removeListeners = function() {
				isMouseDown = false;
				if (that2.mousedownEvent) stage.off("stagemousedown", that2.mousedownEvent);
				if (that2.mousemoveEvent) stage.off("stagemousemove", that2.mousemoveEvent);
				if (that2.mouseupEvent) stage.off("stagemouseup", that2.mouseupEvent);
				if (mouseJoint) world.DestroyJoint(mouseJoint);
				mouseJoint = null;
			};
			this.removeListeners();
			var stage = that.frame.stage;

			// modified demo.html code at https://code.google.com/p/box2dweb/
			var canvasPosition, mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;

			that2.mousedownEvent = stage.on("stagemousedown", function(e) {
				isMouseDown = true;
				mouseX = (e.stageX/zim.scaX-(scroll?stage.x:0))/scale;
				mouseY = (e.stageY/zim.scaY-(scroll?stage.y:0))/scale;
				that2.mousemoveEvent = stage.on("stagemousemove", function(e) {
					mouseX = (e.stageX/zim.scaX-(scroll?stage.x:0))/scale;
					mouseY = (e.stageY/zim.scaY-(scroll?stage.y:0))/scale;
				});
			});
			that2.mouseupEvent = stage.on("stagemouseup", function(e) {
				isMouseDown = false;
				stage.off("stagemousemove", that2.mousemoveEvent);
				mouseX = (e.stageX/zim.scaX-(scroll?stage.x:0))/scale;
				mouseY = (e.stageY/zim.scaY-(scroll?stage.y:0))/scale;
			});

			function getBodyAtMouse() {
				mousePVec = new b2Vec2(mouseX, mouseY);
				var aabb = new b2AABB();
				aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
				aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

				// Query the world for overlapping shapes.
				selectedBody = null;
				world.QueryAABB(getBodyCB, aabb);
				return selectedBody;
			}

			function getBodyCB(fixture) {
				if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
					  selectedBody = fixture.GetBody();
					  return false;
					}
				}
				return true;
			}
			this.update = function() {

				if(isMouseDown && (!mouseJoint)) {
					var body = getBodyAtMouse();
					if(body) {
						if (that2.list.length > 0 && that2.list.indexOf(body) < 0) return;
						var md = new b2MouseJointDef();
						md.bodyA = world.GetGroundBody();
						md.bodyB = body;
						md.target.Set(mouseX, mouseY);
						md.collideConnected = true;
						md.maxForce = 300.0 * body.GetMass();
						mouseJoint = world.CreateJoint(md);
						body.SetAwake(true);
					}
				}

				if (mouseJoint) {
					if (isMouseDown) {
						mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
					} else {
						world.DestroyJoint(mouseJoint);
						mouseJoint = null;
					}
				}
			}
		}
		//http://js-tut.aardon.de/js-tut/tutorial/position.html
		function getElementPosition(element) {
			var elem=element, tagname="", x=0, y=0;
			while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
				y += elem.offsetTop;
				x += elem.offsetLeft;
				tagname = elem.tagName.toUpperCase();
				if(tagname == "BODY") elem=0;
				if(typeof(elem) == "object") {
					if(typeof(elem.offsetParent) == "object") elem = elem.offsetParent;
				}
			}
			return {x:x-zim.scrollX(), y:y-zim.scrollY()};
		}

		// mappings put zim assets to the x, y and rotation of Box2D bodies
		// a dictionary is used for easy adding and removing

		var mappings = new zim.Dictionary(true);
		function updateMap() {
			for (var i=0; i<mappings.length; i++) {
				var zimObj = mappings.values[i];
				var box2DBody = mappings.objects[i];
				var p = box2DBody.GetWorldPoint(new b2Vec2(0, 0));
				if (!scroll) {
					var point = zimObj.parent.globalToLocal(p.x * scale, p.y * scale);
					zimObj.x = point.x;
					zimObj.y = point.y;
				} else {
					zimObj.x = p.x * scale;
					zimObj.y = p.y * scale;
					//if (that.followObj && that.followObj==zimObj && zimObj.followDampX) that.frame.stage.x = zimObj.followDampX.convert(zimObj.offsetDampX.convert(zimObj.followOffsetX[zimObj.controlX])-zimObj.x);
					//if (that.followObj && that.followObj==zimObj && zimObj.followDampY) that.frame.stage.y = zimObj.followDampY.convert(zimObj.offsetDampY.convert(zimObj.followOffsetY[zimObj.controlY])-zimObj.y);

					var stage = that.frame.stage;

					if (that.followObj && that.followObj==zimObj && zimObj.followDampX) stage.x = zim.scaX*zimObj.followDampX.convert(zimObj.offsetDampX.convert(zimObj.followOffsetX[zimObj.controlX])-zimObj.x);
					if (that.followObj && that.followObj==zimObj && zimObj.followDampY) stage.y = zim.scaY*zimObj.followDampY.convert(zimObj.offsetDampY.convert(zimObj.followOffsetY[zimObj.controlY])-zimObj.y);

					if (zimObj.frameBorderLock) {

						if (stage.x < zim.scaX*(stage.width-borders.x-borders.width) && ((zimObj.frameBorderOriginal && that.borderRight.m_fixtureCount == 0) || that.borderRight.m_fixtureCount == 1)) stage.x = zim.scaX*(stage.width-borders.x-borders.width);
						if (stage.y < zim.scaY*(stage.height-borders.y-borders.height) && ((zimObj.frameBorderOriginal && that.borderBottom.m_fixtureCount == 0) || that.borderBottom.m_fixtureCount == 1)) stage.y = zim.scaY*(stage.height-borders.y-borders.height);
						if (stage.x > -zim.scaX*borders.x && ((zimObj.frameBorderOriginal && that.borderLeft.m_fixtureCount == 0) || that.borderLeft.m_fixtureCount == 1)) stage.x = -zim.scaX*borders.x;
						if (stage.y > -zim.scaY*borders.y && ((zimObj.frameBorderOriginal && that.borderTop.m_fixtureCount == 0) || that.borderTop.m_fixtureCount == 1)) stage.y = -zim.scaY*borders.y;

						// if (that.frame.stage.x < that.frame.zim.scaX*borders.x && ((zimObj.frameBorderOriginal && that.borderRight.m_fixtureCount == 0) || that.borderRight.m_fixtureCount == 1)) that.frame.stage.x = that.frame.zim.scaX*borders.x;
						// if (that.frame.stage.y < that.frame.zim.scaY*borders.y && ((zimObj.frameBorderOriginal && that.borderBottom.m_fixtureCount == 0) || that.borderBottom.m_fixtureCount == 1)) that.frame.stage.y = that.frame.zim.scaY*borders.y;
						// if (that.frame.stage.x > that.frame.zim.scaX*(borders.x + borders.width - that.frame.stage.width) && ((zimObj.frameBorderOriginal && that.borderLeft.m_fixtureCount == 0) || that.borderLeft.m_fixtureCount == 1)) that.frame.stage.x = that.frame.zim.scaX*(borders.x + borders.width - that.frame.stage.width);
						// if (that.frame.stage.y > that.frame.zim.scaY*(borders.y + borders.height - that.frame.stage.height) && ((zimObj.frameBorderOriginal && that.borderTop.m_fixtureCount == 0) || that.borderTop.m_fixtureCount == 1)) that.frame.stage.y = that.frame.zim.scaY*(borders.y + borders.height - that.frame.stage.height);
					}
				}
				zimObj.rotation = box2DBody.GetAngle() * (180 / Math.PI);
			}
			that.frame.stage.update();
		}
		this.addMap = function(box2DBody, zimObj) {
			if (zot(box2DBody) || zot(zimObj)) {
				console.log("physics.Map() - please provide a box2DBody and zimObj");
				return;
			}
			zimObj.body =  box2DBody;
			box2DBody.zimObj = zimObj;
			mappings.add(box2DBody, zimObj);
		}
		this.removeMap = function(box2DBody) {
			mappings.remove(box2DBody);
		}


		this.borders = function(rect) {
			if (zot(rect.x) || zot(rect.y) || zot(rect.width) || zot(rect.height)) return;

			if (that.borderTop) that.remove(that.borderTop);
			if (that.borderBottom) that.remove(that.borderBottom);
			if (that.borderLeft) that.remove(that.borderLeft);
			if (that.borderRight) that.remove(that.borderRight);

			var w = 2000;	// width of wall
			// Create border of boxes
			var wall = new b2PolygonShape();
			var wallBd = new b2BodyDef();
			var wallB;
			// Left
			// wallBd.position.Set((rect.x-w)/scale, (rect.y+rect.height/2)/scale);
			// wall.SetAsBox(w/scale, rect.height/2/scale);
			// wallB = that.borderLeft = world.CreateBody(wallBd);
			// wallB.CreateFixture2(wall);
			that.borderLeft = that.makeRectangle(w*2, rect.height, false);
			that.borderLeft.x = rect.x-w;
			that.borderLeft.y = rect.y+rect.height/2;
			that.borderLeft.zimObj = {type:"Border", side:"left"};

			// Right
			// wallBd.position.Set((rect.x+rect.width+w)/scale, (rect.y+rect.height/2)/scale);
			// wallB = that.borderRight = world.CreateBody(wallBd);
			// wallB.CreateFixture2(wall);
			that.borderRight = that.makeRectangle(w*2, rect.height, false);
			that.borderRight.x = rect.x+rect.width+w;
			that.borderRight.y = rect.y+rect.height/2;
			that.borderRight.zimObj = {type:"Border", side:"right"};
			// Top
			// wallBd.position.Set((rect.x + rect.width/2)/scale, (rect.y-w)/scale);
			// wall.SetAsBox(rect.width/2/scale, w/scale);
			// wallB = that.borderTop = world.CreateBody(wallBd);
			// wallB.CreateFixture2(wall);
			that.borderTop = that.makeRectangle(rect.width, w*2, false);
			that.borderTop.x = rect.x + rect.width/2;
			that.borderTop.y = rect.y-w;
			that.borderTop.zimObj = {type:"Border", side:"top"};

			// Bottom
			// wallBd.position.Set((rect.x + rect.width/2)/scale, (rect.y+rect.height+w)/scale);
			// wallB = that.borderBottom =  world.CreateBody(wallBd);
			// wallB.CreateFixture2(wall);
			that.borderBottom = that.makeRectangle(rect.width, w*2, false);
			that.borderBottom.x = rect.x + rect.width/2;
			that.borderBottom.y = rect.y+rect.height+w;
			that.borderBottom.zimObj = {type:"Border", side:"bottom"};
		}
		this.borders(borders);

		this.paused = false;
		this.pause = function(type) {
			if (zot(type)) type = true;
			if (type) {
				this.timeStep = 0;
			} else {
				this.timeStep = 1/this.step;
			}
			this.paused = type;
		}

		// the Ticker keeps add and remove methods
		// to add and remove functions to the update function
		// either before the world step or after the word step
		// these can be used for adding forces
		var beforeList = new zim.Dictionary();
		var afterList = new zim.Dictionary();
		this.Ticker = {
			add:function(f, after) {
				if (zot(after)) after = true;
				if (after) afterList.add(f, 1);
				else beforeList.add(f, 1);
				return f;
			},
			remove:function(f) {
				afterList.remove(f);
				beforeList.remove(f);
			}
		};

		// update world
		var request;
		function update() {
			request = requestAnimationFrame(update);
			if (drag) drag.update();
			for (var i=0; i<beforeList.objects.length; i++) beforeList.objects[i]();
			world.Step(that.timeStep, 10, 10); // last two are velocity iterations, position iterations
			doRemove();
			world.ClearForces();
			for (i=0; i<afterList.objects.length; i++) afterList.objects[i]();
			if (debug && debug.active) debug.update();
			updateMap();
		}
		update();

		this.dispose = function() {
			// this does not seem to let us make a world again properly?
			if (drag) drag.removeListeners();
			if (this == zimDefaultPhysics) zimDefaultPhysics = null;
			zimContactListener = null
			var node = that.world.GetBodyList();
			while(node) {
				var b = node;
				node = node.GetNext();
				that.world.DestroyBody(b);
				b = null;
			}
			that.removeDebug();
			cancelAnimationFrame(request);
			that.world = null;
		}

	};
	return zim;
}(zim || {});
if (!window.zns) Physics = zim.Physics;
