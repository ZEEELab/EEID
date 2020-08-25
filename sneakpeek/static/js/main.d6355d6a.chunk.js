(this.webpackJsonpinfectious_matter_component=this.webpackJsonpinfectious_matter_component||[]).push([[0],{326:function(t,e,n){var o=n(230);function a(t){this.track_all_contacts=!0,this.state=void 0,this.body=t,this.interaction_callback=void 0,this.uuid=o(),this.viva_color=void 0,this.location=void 0,this.home=void 0,this.cohorts=[],this.color=void 0,this.home_state={},this.migrating=!1,this.masked=!1}a.prototype.add_body=function(t){this.body=t},a.prototype.register_interaction_callback=function(t){this.interaction_callback=t},a.prototype.handle_agent_contact=function(t){this.interaction_callback(t)},a.prototype.draw_mask=function(t,e){t.fillStyle="#FFFFFF",t.strokeStyle="#000000",t.lineWidth=1,t.fillRect(this.body.position.x-e,this.body.position.y,2*e,e-1),t.strokeRect(this.body.position.x-e,this.body.position.y,2*e,e-1),t.stroke()},t.exports=a},358:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id=358},378:function(t,e,n){t.exports=n(502)},420:function(t,e,n){var o={name:"matter-collision-events",version:"0.1.5",for:"matter-js@^0.12.0",install:function(t){var e=t.Body.create;t.Body.create=function(){var t=e.apply(null,arguments);return t.onCollide=function(e){t._mceOC=e},t.onCollideEnd=function(e){t._mceOCE=e},t.onCollideActive=function(e){t._mceOCA=e},t},t.after("Engine.create",(function(){t.Events.on(this,"collisionStart",(function(e){e.pairs.map((function(e){t.Events.trigger(e.bodyA,"onCollide",{pair:e}),t.Events.trigger(e.bodyB,"onCollide",{pair:e}),e.bodyA._mceOC&&e.bodyA._mceOC(e),e.bodyB._mceOC&&e.bodyB._mceOC(e)}))})),t.Events.on(this,"collisionActive",(function(e){e.pairs.map((function(e){t.Events.trigger(e.bodyA,"onCollideActive",{pair:e}),t.Events.trigger(e.bodyB,"onCollideActive",{pair:e}),e.bodyA._mceOCA&&e.bodyA._mceOCA(e),e.bodyB._mceOCA&&e.bodyB._mceOCA(e)}))})),t.Events.on(this,"collisionEnd",(function(e){e.pairs.map((function(e){t.Events.trigger(e.bodyA,"onCollideEnd",{pair:e}),t.Events.trigger(e.bodyB,"onCollideEnd",{pair:e}),e.bodyA._mceOCE&&e.bodyA._mceOCE(e),e.bodyB._mceOCE&&e.bodyB._mceOCE(e)}))}))}))}};n(108).Plugin.register(o),t.exports.MatterCollisionEvents=o},424:function(t,e,n){var o=n(230);function a(t,e){return Math.random()*(e-t)+t}function i(t){this.name=t,this.uuid=o(),this.bounds=void 0,this.friction=.2,this.occupants=[],this.border_color=void 0}i.prototype.draw_borders=function(t,e){e=e&&this.border_color?e||this.border_color:"black";var n=this.bounds.max.x-this.bounds.min.x,o=this.bounds.max.y-this.bounds.min.y;t.beginPath(),t.rect(this.bounds.min.x-2,this.bounds.min.y-2,n+4,o+4),t.strokeStyle=e,t.lineWidth=2,t.stroke()},i.prototype.get_random_position=function(){return this.bounds?{x:a(this.bounds.min.x,this.bounds.max.x),y:a(this.bounds.min.y,this.bounds.max.y)}:{x:0,y:0}},i.prototype.remove_agent=function(t){this.occupants=this.occupants.filter((function(e){return e!==t})),t.location=void 0},i.prototype.set_bounds=function(t){this.bounds=t},i.prototype.migrate_to=function(t,e,n){this.remove_agent(e),t.add_agent(e),n&&n(e)},i.prototype.try_getting_random_residents=function(t){for(var e,n=[],o=0;o<t;o++){var a=(e=this.occupants)[Math.floor(e.length*Math.random())];a&&0==a.migrating&&n.push(a)}return n},i.prototype.add_agent=function(t){this.occupants.push(t),t.location=this},t.exports=i},425:function(t,e){function n(){this.members=[]}n.prototype.move_cohort=function(t,e){for(var n=0;n<this.members.length;n++){var o=this.members[n];o.location.migrate_to(t,o,e)}},n.prototype.send_cohort_home=function(t){for(var e=0;e<this.members.length;e++){var n=this.members[e];n.location.migrate_to(n.home,n,t)}},n.prototype.add_agent=function(t,e){this.members.push(t),t.cohorts.push(this),e&&e(t)},t.exports=n},426:function(t,e,n){var o=n(427),a=n(325);function i(){this.fast_queue=new o((function(t,e){return t.time<e.time}))}i.prototype.add_event=function(t,e){a(e.time&&e.callback),e.original_time=e.time,e.time+=t,this.fast_queue.add(e)},i.prototype.run_events_fired=function(t,e){for(var n=0;this.fast_queue.peek()&&this.fast_queue.peek().time<t&&n<e;){var o=this.fast_queue.poll();o.recurring&&this.add_event(t,{time:o.original_time,callback:o.callback,recurring:!0}),o.callback(),n+=1}},i.prototype.clear_events=function(){this.fast_queue=null,this.fast_queue=new o((function(t,e){return t.time<e.time}))},t.exports=i},502:function(t,e,n){"use strict";n.r(e);var o=n(0),a=n.n(o),i=n(15),r=n.n(i),s=n(36),c=n(348),u=n(528),_=n(347),m=n(529),l=n(87),d=n(88),p=n(230),f=function(t){var e=t.color_float+d.jStat.exponential.sample(8),n=Math.min(t.contagiousness+d.jStat.normal.sample(0,.1),1);e%=1,this.color_float=e,this.contagiousness=n};function g(t,e){this.parent=void 0,this.interaction_callback=void 0,this.uuid=p(),this.color_float=t||Math.random(),this.mutation_function=f,this.contagiousness=.5}g.prototype.get_offspring=function(t){var e=new g(this.color_float);return Math.random()<t&&this.mutation_function&&e.mutation_function(this),e};var h=g,y=n(108),b=(n(111),function(t){var e=t.InfectiousMatterRef,n=t.InfectiousMatterAPI,i=t.redraw_trigger,r=t.setWorldReadyTrigger,s=t.numMasked,c=Object(o.useRef)(null),u=function(t){var o=n(e,{type:"add_location",payload:{residence_props:{type:"residence",friction:.01,bounds:{min:{x:10,y:10},max:{x:190,y:190}}}}}),a=n(e,{type:"add_location",payload:{residence_props:{type:"residence",friction:.02,bounds:{min:{x:10,y:210},max:{x:190,y:390}}}}}),i=n(e,{type:"add_location",payload:{residence_props:{type:"residence",friction:.02,bounds:{min:{x:210,y:10},max:{x:390,y:190}}}}}),r=n(e,{type:"add_location",payload:{residence_props:{type:"residence",friction:.02,bounds:{min:{x:210,y:210},max:{x:390,y:390}}}}});n(e,{type:"add_agents",payload:{residence:o,num_agents:100}}),n(e,{type:"add_agents",payload:{residence:a,num_agents:100}}),n(e,{type:"add_agents",payload:{residence:i,num_agents:100}}),n(e,{type:"add_agents",payload:{residence:r,num_agents:100}}),e.current.add_event({time:1e3,callback:e.current.new_migration_event(),recurring:!0}),n(e,{type:"add_migration_link",payload:{from_location:o.uuid,to_location:a.uuid,num_agents:2}}),n(e,{type:"add_migration_link",payload:{from_location:a.uuid,to_location:i.uuid,num_agents:2}}),n(e,{type:"add_migration_link",payload:{from_location:i.uuid,to_location:r.uuid,num_agents:2}}),n(e,{type:"add_migration_link",payload:{from_location:r.uuid,to_location:o.uuid,num_agents:2}}),y.Common.shuffle(e.current.agents),n(e,{type:"set_num_mask",payload:{num_masked:t}}),console.log(t)};return Object(o.useEffect)((function(){var t={sim_time_per_day:1e3,agent_size:4,link_lifetime:200};t.link_lifetime=7*t.sim_time_per_day;console.log("initalizing matter"),e.current=new z(!1,t,{per_contact_infection:.5,incubation_period_mu:5,incubation_period_sigma:3,infectious_period_mu:7,infectious_period_sigma:4,fraction_asymptomatic:.2,asymptomatic_infectious_period_mu:1.5,asymptomatic_infectious_period_sigma:1.5,fraction_seek_care:.5,fraction_isolate:.2,time_to_seek_care:2.5,movement_scale:2},{viva_colors:[2473647103,16711935,4294902015,4289003775,65535,2846468607,4278255615,13554175,2566625535,3448061951],matter_colors:["mediumpurple","lime","yellow","orange","blue","darkgrey","fuchsia","darkturquoise","palegreen","peru"]}),n(e,{type:"setup_environment",payload:{sim_div:c}}),u(s)}),[]),Object(o.useLayoutEffect)((function(){e.current&&(u(s),r((function(t){return t+1})))}),[i]),a.a.createElement("div",null,a.a.createElement("div",{ref:c,style:{height:400,width:400}}))}),v=n(108);n(419);var k=n(420).MatterCollisionEvents;v.use("matter-wrap",k),v._seed=2,Math.random=v.Common.random,d.jStat._random_fn=v.Common.random;var E=n(325),j=n(111),O=new j.Graph.graph,x=n(424),C=n(425),w=n(426),I=n(326),S=n(429),A=(S({colormap:"chlorophyll",nshades:9,format:"hex",alpha:1}),S({colormap:"portland",nshades:15,format:"hex",alpha:1}),n(431)(["white"])),M={SUSCEPTIBLE:0,EXPOSED:1,A_INFECTED:2,S_INFECTED:3,RECOVERED:4,size:5},R=v.Engine,D=v.Render,L=v.World,N=(v.Body,v.Bodies),B=(v.Bounds,v.Mouse),P=v.MouseConstraint,T=v.Events,F={sim_time_per_day:2e3,agent_size:3,link_lifetime:4e3,pathogen_mut_prob:.1},q={per_contact_infection:.5,incubation_period_mu:5,incubation_period_sigma:3,infectious_period_mu:7,infectious_period_sigma:4,fraction_asymptomatic:.2,asymptomatic_infectious_period_mu:1.5,asymptomatic_infectious_period_sigma:1.5,fraction_seek_care:.5,fraction_isolate:.2,time_to_seek_care:2.5,movement_scale:.2,use_pathogen_contagiousness:!1},W={viva_colors:[2332068863,16711935,4294902015,4289003775,65535,2846468607,4278255615,13554175,2566625535,3448061951],matter_colors:["darkmagenta","lime","yellow","orange","blue","darkgrey","fuchsia","darkturquoise","palegreen","peru"]};function z(t,e,n,o){this.simulation_params=v.Common.extend(F,e),this.infection_params=v.Common.extend(q,n),this.simulation_colors=v.Common.extend(W,o),this.matter_world=L.create(),this.headless=t||!1,this.pathogen_color_range=A,console.log("creating infectious matter environment!"),this.matter_engine=R.create({positionIterations:15,velocityIterations:15,constraintIterations:10}),this.matter_engine.world.gravity.y=0,this.event_queue=new w,this.migration_graph=new j.Graph.graph}z.prototype.setup_renderer=function(t){var e=t;this.matter_render=D.create({element:e,engine:this.matter_engine,options:{height:e.offsetHeight,width:e.offsetWidth,background:"rgba(229,229,229)",wireframes:!1}});var n=B.create(this.matter_render.canvas);this.mouseConstraint=P.create(this.matter_engine,{mouse:n,constraint:{stiffness:.1,render:{visible:!0}}}),n.element.removeEventListener("mousewheel",n.mousewheel),n.element.removeEventListener("DOMMouseScroll",n.mousewheel),this.matter_render.mouse=n,L.add(this.matter_engine.world,this.mouseConstraint),D.run(this.matter_render),R.run(this.matter_engine)},z.prototype.run_headless=function(t){if(t=t||30,this.run_headless)for(var e=0;e<t*this.simulation_params.sim_time_per_day;e++){this.event_queue.run_events_fired(this.cur_sim_time,500);v.Common.choose(this.agents);R.update(this.matter_engine,1e3/60),this.cur_sim_time=this.matter_engine.timing.timestamp}},z.prototype.setup_matter_env=function(){var t=this;O.clear(),this.locations=[],this.migration_graph.clear(),this.location_uuid_hash={},this.agents=[],this.cohorts=[],this.cur_sim_time=0,this.state_counts=[],this.matter_engine.timing.timestamp=0;for(var e=0;e<M.size;e++)this.state_counts.push(0);this.headless||(T.on(this.matter_render,"beforeRender",(function(e){t.cur_sim_time=e.timestamp,t.event_queue.run_events_fired(t.cur_sim_time,500)})),T.on(this.matter_render,"afterRender",(function(e){var n=t.matter_render.context;if(n){for(var o=0;o<t.locations.length;o++)t.locations[o].draw_borders(n);t.agents.forEach((function(e){e.masked&&e.draw_mask(n,t.simulation_params.agent_size)}))}}))),this.add_event({time:100,callback:this.pulse_orgs_event(),recurring:!0})},z.prototype.update_org_state=function(t,e){var n=t.agent_object.state;t.agent_object.state=e,"undefined"!==typeof n&&(this.state_counts[n]-=1),this.state_counts[e]+=1,t.render.lineWidth=3;var o=t.render.strokeStyle;switch(e){case M.EXPOSED:o="orange";break;case M.S_INFECTED:case M.A_INFECTED:o="red",4278190335;break;case M.RECOVERED:o="blue",4294967295;break;case M.SENSITIVE:t.render.lineWidth=0}return t.render.strokeStyle=o,t},z.prototype.add_location=function(t,e){var n=new x(t);return n.border_color=e.border_color,n.set_bounds(e.bounds),n.friction=e.friction,n.type=e.type||"none",n.home_color=this.simulation_colors.matter_colors[this.locations.length],n.viva_node_color=this.simulation_colors.viva_colors[this.locations.length],this.locations.push(n),this.location_uuid_hash[n.uuid]=n,n},z.prototype.add_cohort=function(){var t=new C;return this.cohorts.push(t),t},z.prototype.assign_cohort=function(t,e){e.add_agent(t.agent_object)},z.prototype.expose_org=function(t,e,n){var o=this;n&&n.pathogen?t.agent_object.pathogen=n.pathogen.get_offspring(this.simulation_params.pathogen_mut_prob):t.agent_object.pathogen=new h(.5,"root"),this.update_org_state(t,M.EXPOSED),this.post_infection_callback&&this.post_infection_callback(t.agent_object,n),this.add_event({time:Math.max(d.jStat.normal.sample(this.infection_params.incubation_period_mu,this.infection_params.incubation_period_sigma),1)*this.simulation_params.sim_time_per_day,callback:function(){o.update_org_state(t,e);var n=0;n=e==M.A_INFECTED?Math.max(d.jStat.normal.sample(o.infection_params.asymptomatic_infectious_period_mu,o.infection_params.asymptomatic_infectious_period_sigma),.5):Math.max(d.jStat.normal.sample(o.infection_params.infectious_period_mu,o.infection_params.infectious_period_sigma),4),o.add_event({time:n*o.simulation_params.sim_time_per_day,callback:function(){o.update_org_state(t,M.RECOVERED)}})}})},z.prototype.register_infection_callback=function(t){this.post_infection_callback=t},z.prototype._check_edge_for_removal=function(t){var e=this;return function(){t.data.timestamp<e.cur_sim_time-e.simulation_params.link_lifetime?O.removeLink(t):e.add_event({time:e.cur_sim_time+e.simulation_params.link_lifetime-t.data.timestamp,callback:e._check_edge_for_removal(t)})}},z.prototype.calc_prob_infection=function(t,e){return this.infection_params.per_contact_infection},z.prototype._default_interaction_callback=function(t){var e=this;return function(n){var o;n.state!=M.S_INFECTED&&n.state!=M.A_INFECTED||t.agent_object.state!=M.SUSCEPTIBLE||v.Common.random(0,1)<e.calc_prob_infection(t,n.body)&&(o=v.Common.random(0,1)<e.infection_params.fraction_asymptomatic?M.A_INFECTED:M.S_INFECTED,e.expose_org(t,o,n));E(n.uuid&&t.agent_object.uuid);var a=O.hasLink(t.agent_object.uuid,n.uuid)||O.hasLink(n.uuid,t.agent_object.uuid);a?a.data.timestamp=e.cur_sim_time:(E(O.hasNode(t.agent_object.uuid)&&O.hasNode(t.agent_object.uuid)),a=O.addLink(t.agent_object.uuid,n.uuid,{origin:t.agent_object.uuid,timestamp:e.cur_sim_time})),e.add_event({time:e.simulation_params.link_lifetime+1,callback:e._check_edge_for_removal(a)})}},z.prototype.add_agent=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:M.SUSCEPTIBLE;E(t&&t.get_random_position);var n=t.get_random_position(),o=N.circle(n.x,n.y,this.simulation_params.agent_size,{plugin:{wrap:t.bounds}});return o.render.fillStyle=t.home_color||"black",o.strokeStyle="black",o.lineWidth=2,o.agent_object=new I(o),o.frictionAir=t.friction,o.friction=0,o.restitution=1.1,o.node=O.addNode(o.agent_object.uuid,{something:!0}),o.agent_object.home=t,o.agent_object.viva_color=t.viva_node_color,t.add_agent(o.agent_object),o.agent_object.register_interaction_callback(this._default_interaction_callback(o,this.get_prob_of_infection)),o.onCollide((function(t){t.bodyA===o&&t.bodyB.agent_object?t.bodyA.agent_object.handle_agent_contact(t.bodyB.agent_object):t.bodyB===o&&t.bodyA.agent_object&&t.bodyB.agent_object.handle_agent_contact(t.bodyA.agent_object)})),L.add(this.matter_engine.world,o),this.agents.push(o.agent_object),this.update_org_state(o,e),o},z.prototype.add_event=function(t){E(t.time&&t.callback),this.event_queue.add_event(this.cur_sim_time,t)},z.prototype.set_agent_contact_callback=function(t){this.agent_contact_callback=t},z.prototype.clear_simulator=function(){L.clear(this.matter_engine.world),R.clear(this.matter_engine),this.event_queue.clear_events()},z.prototype.remove_simulator=function(){this.clear_simulator(),D.stop(),this.matter_engine.events={},this.matter_render.canvas.remove(),this.matter_render.canvas=null,this.matter_render.context=null,this.matter_render.textures={},this.matter_world=null,this.matter_engine=null,this.event_queue=null,this.matter_render=null,this.mouseConstraint=null},z.prototype.pulse_orgs_event=function(){var t=this;return function(){if(t.agents.length>0)for(var e=0;e<100;e++){var n=v.Common.choose(t.agents);v.Body.applyForce(n.body,n.body.position,{x:v.Common.random(-2e-5*t.infection_params.movement_scale,2e-5*t.infection_params.movement_scale),y:v.Common.random(-2e-5*t.infection_params.movement_scale,2e-5*t.infection_params.movement_scale)})}}},z.prototype.get_migration_links=function(){var t=[];return this.migration_graph.forEachLink((function(e){t.push({from_uuid:e.fromId,to_uuid:e.toId,num_agents:e.data.num_agents})})),t},z.prototype.add_migration_link=function(t,e,n){var o=this.migration_graph.hasLink(t,e);o?o.data.num_agents=n:this.migration_graph.addLink(t,e,{num_agents:n})},z.prototype.remove_migration_link=function(t,e){var n=this.migration_graph.hasLink(t,e);n&&this.migration_graph.removeLink(n)},z.prototype.new_migration_event=function(){var t=this;return function(){t.migration_graph.forEachLink((function(e){var n=t.location_uuid_hash[e.fromId],o=t.location_uuid_hash[e.toId];n.try_getting_random_residents(e.data.num_agents).forEach((function(e){e.home_state={location:n,position:Object(l.a)({},e.body.position),velocity:Object(l.a)({},e.body.velocity)},n.migrate_to(o,e,(function(t){t.body.plugin.wrap=o.bounds,v.Body.setPosition(t.body,o.get_random_position()),t.body.frictionAir=o.friction,t.migrating=!0})),t.add_event({time:t.simulation_params.sim_time_per_day,callback:function(){o.migrate_to(n,e,(function(t){v.Body.setPosition(t.body,e.home_state.position),t.body.plugin.wrap=n.bounds,v.Body.setVelocity(t.body,e.home_state.velocity),t.body.frictionAir=n.friction,t.migrating=!1}))}})}))}))}};n(326);var V=n(111),U=n.n(V),G=U.a.Graph.Layout.forceDirected(O,{springLength:15,springCoeff:5e-5,dragCoeff:.01,gravity:-1.5}),X=U.a.Graph.View.webglGraphics(),H=function(t){var e=t.InfectiousMatterRef,n=t.InfectiousMatterAPI,i=t.worldReadyTrigger,r=Object(o.useRef)(null);return Object(o.useEffect)((function(){console.log("initalizing viva graph");var t=U.a.Graph.View.renderer(O,{container:r.current,graphics:X,renderLinks:!0,layout:G,interactive:"node drag"});t.run();for(var e=0;e<30;e++)t.zoomOut()}),[]),Object(o.useEffect)((function(){n(e,{type:"forEach_agents",payload:{callback:function(t){X.getNodeUI(t.uuid).color=t.viva_color,X.getNodeUI(t.uuid).size=40}}})}),[i]),a.a.createElement("div",{ref:r,style:{width:400,height:400}})},J=n(148),K=n(183),Q=n.n(K);var Y=function(t){var e=t.InfectiousMatterRef,n=t.InfectiousMatterAPI,i=t.worldReadyTrigger,r=Object(o.useState)([]),c=Object(s.a)(r,2),u=c[0],_=c[1],m=Object(o.useState)({}),d=Object(s.a)(m,2),p=d[0],f=d[1],g=Object(o.useState)(null),h=Object(s.a)(g,2),y=(h[0],h[1],Object(o.useState)(0)),b=Object(s.a)(y,2),v=b[0],k=b[1],E=Object(o.useState)([]),j=Object(s.a)(E,2),O=j[0],x=j[1],C=Object(o.useState)([{title:"From Location",field:"from_uuid",type:"numeric"},{title:"To Location",field:"to_uuid",type:"numeric"},{title:"Visitors/Day",field:"num_agents",type:"numeric"}]),w=Object(s.a)(C,2),I=w[0],S=w[1],A=function(t,e){return t.to_uuid!=e.to_uuid||t.from_uuid!=e.from_uuid||t.num_agents!=e.num_agents};return Object(o.useEffect)((function(){S([{title:"From Location",field:"from_uuid",type:"numeric",lookup:p,editable:"onAdd"},{title:"To Location",field:"to_uuid",type:"numeric",lookup:p,editable:"onAdd"},{title:"Visitors/Day",field:"num_agents",type:"numeric"}])}),[p]),Object(o.useEffect)((function(){O.length>0&&O.forEach((function(t){n(e,{type:"add_migration_link",payload:{from_location:t.from_uuid,to_location:t.to_uuid,num_agents:t.num_agents}})}))}),[v]),Object(o.useEffect)((function(){var t=Object(l.a)({},p),o=n(e,{type:"map_locations",payload:{callback:function(t,e){return{location_idx:e,location_uuid:t.uuid}}}});_(o);var a=n(e,{type:"get_migration_links"});O.length>0&&t&&(n(e,{type:"clear_migration_links"}),a=O.map((function(e){var n=t[e.from_uuid],a=t[e.to_uuid];return{from_uuid:o[n].location_uuid,to_uuid:o[a].location_uuid,num_agents:e.num_agents}}))),x(a),k((function(t){return t+1}))}),[i]),Object(o.useEffect)((function(){var t={};u.forEach((function(e){t[e.location_uuid]=e.location_idx})),S([{title:"From Location",field:"from_uuid",type:"numeric",lookup:p,editable:"onAdd"},{title:"To Location",field:"to_uuid",type:"numeric",lookup:t,editable:"onAdd"},{title:"Visitors/Day",field:"num_agents",type:"numeric"}]),f(t)}),[u]),a.a.createElement(Q.a,{title:"Migration Links",columns:I,data:O,options:{filtering:!1,toolbar:!0,search:!1,pageSizeOptions:[5]},editable:{onRowAdd:function(t){return new Promise((function(e,n){var o;o=t,!(O.find((function(t){return t.to_uuid==o.to_uuid&&t.from_uuid==o.from_uuid}))||o.num_agents<0)&&(x([].concat(Object(J.a)(O),[o])),k((function(t){return t+1})));e()}))},onRowUpdate:function(t,e){return new Promise((function(n,o){!function(t,e){var n=Object(J.a)(O),o=O.findIndex((function(t){return t.to_uuid==e.to_uuid&&t.from_uuid==e.from_uuid}));A(t,e)&&(n[o]=t,x(n),k((function(t){return t+1})))}(t,e),n()}))},onRowDelete:function(t){return new Promise((function(o,a){!function(t){var o=O.filter((function(e){return A(t,e)}));x(o),n(e,{type:"remove_migration_link",payload:{from_location:t.from_uuid,to_location:t.to_uuid}}),k((function(t){return t+1}))}(t),o()}))}}})},Z=n(369),$=n.n(Z),tt={margin:{l:50,r:10,b:50,t:10,pad:10},showlegend:!0,legend:{x:1,xanchor:"right",y:1},xaxis:{title:"Days",rangemode:"nonnegative"},yaxis:{title:"Count",rangemode:"nonnegative"},width:390,height:390},et=[{x:[0],y:[0],stackgroup:"one",name:"Exposed",marker:{color:"orange"}},{x:[0],y:[0],stackgroup:"one",name:"Infected",marker:{color:"red"}},{x:[0],y:[0],stackgroup:"one",name:"Recovered",marker:{color:"green"}},{x:[0],y:[0],stackgroup:"one",name:"Susceptible",marker:{color:"grey"}}];function nt(t,e){t||console.log("didnt get state");var n=Object(J.a)(t);switch(e.type){case"extend":return n[0].x.push(e.payload.cur_time),n[0].y.push(e.payload.cur_state_counts[M.EXPOSED]),n[1].x.push(e.payload.cur_time),n[1].y.push(e.payload.cur_state_counts[M.S_INFECTED]+e.payload.cur_state_counts[M.A_INFECTED]),n[2].x.push(e.payload.cur_time),n[2].y.push(e.payload.cur_state_counts[M.RECOVERED]),n[3].x.push(e.payload.cur_time),n[3].y.push(e.payload.cur_state_counts[M.SUSCEPTIBLE]),n;case"reset":return n=[{x:[0],y:[0],stackgroup:"one",name:"Exposed",marker:{color:"orange"}},{x:[0],y:[0],stackgroup:"one",name:"Infected",marker:{color:"red"}},{x:[0],y:[0],stackgroup:"one",name:"Recovered",marker:{color:"green"}},{x:[0],y:[0],stackgroup:"one",name:"Susceptible",marker:{color:"grey"}}]}}var ot=function(t){var e=t.InfectiousMatterRef,n=t.InfectiousMatterAPI,i=t.redraw_trigger,r=Object(o.useReducer)(nt,et),c=Object(s.a)(r,2),u=c[0],_=c[1],m=Object(o.useState)(0),d=Object(s.a)(m,2),p=d[0],f=d[1],g=tt;return Object(o.useEffect)((function(){var t=setInterval((function(){!function(){var t=n(e,{type:"get_state_counts"});_({type:"extend",payload:{cur_time:t.cur_time,cur_state_counts:t.state_counts}}),f((function(t){return t+1}))}()}),600);return function(){clearInterval(t)}}),[i]),Object(o.useLayoutEffect)((function(){e.current&&(_({type:"reset"}),f((function(t){return t+1})))}),[i]),a.a.createElement($.a,{data:u,layout:Object(l.a)(Object(l.a)({},g),{},{datarevision:p})})},at=n(108),it=n.n(at),rt=n(532),st=n(510),ct=n(504),ut=n(352),_t=n(530),mt=Object(_.a)((function(t){return{root:{flexGrow:0,minWidth:1200},controlls:{width:600},paper:{minHeight:400,minWidth:400,textAlign:"center"},paperControlls:{minHeight:400,minWidth:400,textAlign:"center",padding:t.spacing(2)}}}));z.prototype.mask_transmission_props={self_protection:.05,others_protection:.5},z.prototype.calc_prob_infection=function(t,e){var n=this.infection_params.per_contact_infection;return t.agent_object.masked&&e.agent_object.masked?n*(1-this.mask_transmission_props.self_protection)*(1-this.mask_transmission_props.others_protection):t.agent_object.masked&&!e.agent_object.masked?n*(1-this.mask_transmission_props.self_protection):!t.agent_object.masked&&e.agent_object.masked?n*(1-this.mask_transmission_props.others_protection):t.agent_object.masked||e.agent_object.masked?void 0:n};var lt=function(t,e){if("setup_environment"==e.type&&(t.current.setup_renderer(e.payload.sim_div.current),t.current.setup_matter_env()),"update_mask_transmission_params"==e.type&&(e.payload.self_protection&&(t.current.mask_transmission_props.self_protection=e.payload.self_protection),e.payload.others_protection&&(t.current.mask_transmission_props.others_protection=e.payload.others_protection)),"update_movement_scale"==e.type&&e.payload.movement_scale&&(t.current.infection_params.movement_scale=e.payload.movement_scale),"reset_simulator"==e.type&&(t.current.clear_simulator(),t.current.setup_matter_env()),"add_location"==e.type)return t.current.add_location("residence",e.payload.residence_props);if("add_agents"==e.type){var n=null;if(e.payload.residence&&e.payload.num_agents)for(var o=0;o<e.payload.num_agents;o++)n=t.current.add_agent(e.payload.residence);e.payload.callback&&n&&e.payload.callback(n.agent_object)}if("map_agents"==e.type)return t.current.agents.map((function(t,n){return e.payload.callback(t,n)}));if("forEach_agents"==e.type&&t.current.agents.forEach((function(t){return e.payload.callback(t)})),"map_locations"==e.type)return t.current.locations.map((function(t,n){return e.payload.callback(t,n)}));if("forEach_location"==e.type&&t.current.locations.forEach((function(t){return e.payload.callback(t)})),"infect_random_agents"==e.type&&e.payload.num_agents)for(var a=0;a<e.payload.num_agents;a++){var i=it.a.Common.choose(t.current.agents);t.current.expose_org(i.body,M.S_INFECTED)}if("get_migration_links"==e.type)return t.current.get_migration_links();if("add_migration_link"==e.type&&t.current.add_migration_link(e.payload.from_location,e.payload.to_location,e.payload.num_agents),"clear_migration_links"==e.type&&t.current.migration_graph.clear(),"remove_migration_link"==e.type&&t.current.remove_migration_link(e.payload.from_location,e.payload.to_location),"get_state_counts"==e.type)return{state_counts:t.current.state_counts,cur_time:t.current.cur_sim_time/t.current.simulation_params.sim_time_per_day};if("set_num_mask"==e.type){var r=[],s=[];t.current.agents.forEach((function(t){t.masked?r.push(t):s.push(t)}));var c=r.length,u=e.payload.num_masked-c;if(u>0)for(var _=0;_<u;_++)s[_].masked=!0;else if(u<0)for(var m=0;m<-u;m++)r[m].masked=!1}},dt=function(t){var e=mt(),n=Object(o.useRef)(null),i=Object(o.useState)(0),r=Object(s.a)(i,2),_=r[0],l=r[1],d=Object(o.useState)(.05),p=Object(s.a)(d,2),f=p[0],g=p[1],h=Object(o.useState)(.5),y=Object(s.a)(h,2),v=y[0],k=y[1],E=Object(o.useState)(2),j=Object(s.a)(E,2),O=j[0],x=j[1],C=Object(o.useState)(0),w=Object(s.a)(C,2),I=w[0],S=w[1],A=Object(o.useState)(0),M=Object(s.a)(A,2),R=M[0],D=M[1];return Object(o.useEffect)((function(){lt(n,{type:"update_mask_transmission_params",payload:{self_protection:f}})}),[f]),Object(o.useEffect)((function(){lt(n,{type:"update_mask_transmission_params",payload:{others_protection:v}})}),[v]),Object(o.useEffect)((function(){lt(n,{type:"update_movement_scale",payload:{movement_scale:O}})}),[O]),Object(o.useEffect)((function(){lt(n,{type:"set_num_mask",payload:{num_masked:_}})}),[_]),a.a.createElement("div",{className:"App"},a.a.createElement(u.a,{container:!0,direction:"row",justify:"center",alignItems:"center",className:e.root,spacing:3},a.a.createElement(u.a,{item:!0},a.a.createElement(m.a,{className:e.paper},a.a.createElement(ot,{InfectiousMatterRef:n,InfectiousMatterAPI:lt,redraw_trigger:I}))),a.a.createElement(u.a,{item:!0},a.a.createElement(m.a,{className:e.paper},a.a.createElement(b,{InfectiousMatterRef:n,InfectiousMatterAPI:lt,redraw_trigger:I,setWorldReadyTrigger:D,numMasked:_}))),a.a.createElement(u.a,{item:!0},a.a.createElement(m.a,{className:e.paper},a.a.createElement(H,{InfectiousMatterRef:n,InfectiousMatterAPI:lt,worldReadyTrigger:R})))),a.a.createElement(u.a,{container:!0,direction:"row",justify:"center",alignItems:"center",className:e.root,spacing:10},a.a.createElement(u.a,{item:!0,alignItems:"flex-start"},a.a.createElement(m.a,{className:e.paper},a.a.createElement(st.a,null,a.a.createElement(_t.a,{disableSticky:!0},"World Settings"),a.a.createElement(ct.a,null,a.a.createElement(ut.a,{id:"Masks",primary:"Number Masked"}),a.a.createElement(rt.a,{value:_,"aria-labelledby":"discrete-slider",valueLabelDisplay:"on",onChange:function(t,e){l(e)},step:1,min:0,max:400})),a.a.createElement(ct.a,null,a.a.createElement(ut.a,{id:"Movement",primary:"Movement Scale"}),a.a.createElement(rt.a,{value:O,"aria-labelledby":"discrete-slider",valueLabelDisplay:"on",onChange:function(t,e){x(e)},step:.25,min:0,max:10})),a.a.createElement(ct.a,null,a.a.createElement(u.a,{container:!0,direction:"row",spacing:3},a.a.createElement(u.a,{item:!0},a.a.createElement(c.a,{variant:"contained",onClick:function(t){lt(n,{type:"reset_simulator"}),S((function(t){return t+1}))}},"Reset")),a.a.createElement(u.a,{item:!0},a.a.createElement(c.a,{variant:"contained",onClick:function(t){lt(n,{type:"infect_random_agents",payload:{num_agents:1}})}},"Infect Random Agent")))),a.a.createElement(_t.a,{disableSticky:!0},"Mask Settings"),a.a.createElement(ct.a,null,a.a.createElement(ut.a,{id:"selfProtection",primary:"Self Protection"}),a.a.createElement(rt.a,{value:f,"aria-labelledby":"continuous-slider",onChange:function(t,e){g(e)},valueLabelDisplay:"on",min:0,max:1,step:.01})),a.a.createElement(ct.a,null,a.a.createElement(ut.a,{id:"othersProtection",primary:"Others Protection"}),a.a.createElement(rt.a,{value:v,"aria-labelledby":"continuous-slider",onChange:function(t,e){k(e)},valueLabelDisplay:"on",min:0,max:1,step:.01}))))),a.a.createElement(u.a,{item:!0,className:e.controlls},a.a.createElement(Y,{InfectiousMatterRef:n,InfectiousMatterAPI:lt,worldReadyTrigger:R}))))};r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(dt,null)),document.getElementById("root"))}},[[378,1,2]]]);
//# sourceMappingURL=main.d6355d6a.chunk.js.map