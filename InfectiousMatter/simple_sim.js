var UIkit = require('uikit');



window.onload = function() {
    var Matter = require('matter-js');
    var Plotly = require('plotly.js');
    var Viva = require('vivagraphjs');

    const dat = require('dat.gui');
    var { InfectiousMatter, AgentStates, ContactGraph } = require('./lib/simulation.js');

    InfectiousMatter.prototype.migrate_event = function() {
        return () => {
            for (let i=0; i < world_params.num_visitors; i++) {
                let temp_agent = Matter.Common.choose(this.agents);
                if (temp_agent.migrating) continue;
                temp_agent.migrating = true;

                let temp_dest = Matter.Common.choose(residences);
                let agent_home = temp_agent.home || temp_agent.location;

                temp_agent.home_state = {position: temp_agent.body.position, velocity: temp_agent.body.velocity};

                temp_agent.location.migrate_to(temp_dest, temp_agent, function(agent) {
                        //update bounds...
                        agent.body.plugin.wrap = temp_dest.bounds;
                        Matter.Body.setPosition(agent.body, temp_dest.get_random_position());
                        agent.body.frictionAir = temp_dest.friction;
                    }
                );
                
                this.add_event( {
                    time: this.simulation_params.sim_time_per_day, 
                    callback: function() {
                        temp_agent.location.migrate_to(agent_home, temp_agent, function(agent) {
                        //update bounds...
                            agent.body.plugin.wrap = agent_home.bounds;
                            Matter.Body.setPosition(agent.body, agent_home.get_random_position());
                            Matter.Body.setVelocity(agent.body, agent.home_state.velocity);
                            agent.body.frictionAir = agent_home.friction;
                            agent.migrating = false;
                        });
                    }
                });

            }
        };
    };

    let world_params = {
        num_residences: 1,
        residence_options: [],
        pop_size: 20,
        num_to_infect: 2,
        num_visitors: 0,
        residence_size: 250,
        residence_padding: 20

    };

    let simulation_params = {
        sim_time_per_day: 1000,
        agent_size: 3,
        link_lifetime: 200,
    };
    simulation_params.link_lifetime = 7*simulation_params.sim_time_per_day;

    var infection_params = {
        per_contact_infection: 0.5, 

        incubation_period_mu: 5,
        incubation_period_sigma: 3,
        
        infectious_period_mu: 7,
        infectious_period_sigma: 4,
        fraction_asymptomatic: 0.2,
        
        asymptomatic_infectious_period_mu: 1.5,
        asymptomatic_infectious_period_sigma: 1.5,

        fraction_seek_care: 0.5,
        fraction_isolate: 0.2,
        time_to_seek_care: 2.5,
        movement_scale: 0.8,
    };

    let default_simulation_colors = {
        viva_colors: [0x8B008Bff, 0x00FF00ff, 0xFFFF00ff, 0xFFA500ff, 0x0000FFff, 0xA9A9A9ff, 0xFF00FFff, 0x00CED1ff,0x98FB98ff, 0xCD853Fff],
        matter_colors: ["darkmagenta", "lime", "yellow", "orange", "blue", "darkgrey", "fuchsia", "darkturquoise", "palegreen", "peru"]
    }

    let infection_layout = {
        margin: {
            l: 50,
            r: 10,
            b: 50,
            t: 10,
            pad: 10
          },
        showlegend: false,
        xaxis: {
            title: "Days",
            rangemode: 'nonnegative'
        }, 
        yaxis: {
            title: "Count",
            rangemode: 'nonnegative'
        },
    };



    let InfectiousMatterSim = new InfectiousMatter('matterDiv', simulation_params, infection_params, default_simulation_colors);

    let viva_layout = Viva.Graph.Layout.forceDirected(ContactGraph, {
        springLength : 15,
        springCoeff : 0.00005,
        dragCoeff : 0.01,
        gravity : -1.5
    });

    let viva_graphics = Viva.Graph.View.webglGraphics();
    let viva_renderer = Viva.Graph.View.renderer(ContactGraph, {
        container: document.getElementById('graphDiv'),
        graphics: viva_graphics,
        renderLinks: true,
        layout: viva_layout,
        interactive: 'node drag'

    });
    viva_renderer.run();
    for (let i=0; i < 30; i++) {
        viva_renderer.zoomOut();
    }

    var setup_world = function(res_size, res_pad) {
        residences = []
        let margin = res_pad || world_params.residence_padding || 20;
        let residence_size = res_size || world_params.residence_size || 140;

        let row = 0;
        let col = 0;

        for (let j=0; j < world_params.num_residences; j++) {
            
            if (margin + residence_size + (residence_size + margin)*row > 
                InfectiousMatterSim.matter_render.options.height) {
                
                row = 0;
                col += 1;
            }   

            let x_min = margin + (margin + residence_size) * col;
            let y_min = margin + (residence_size + margin) * row;

            let x_max = x_min + residence_size;
            let y_max = y_min + residence_size;
            
            let res_prop = {
                type: "residence", 
                friction: 0.02,
                bounds: {
                    min: {
                        x: x_min,
                        y: y_min,
                    },
                    max: {
                        x: x_max,
                        y: y_max,
                    }
                }
            };
            row += 1;

            let res = InfectiousMatterSim.add_location('residence', res_prop);
            residences.push(res);

            if (world_params.residence_options[residences.length-1]) {
                if (world_params.residence_options[residences.length-1].subpop_size == undefined) {
                    world_params.residence_options[residences.length-1].subpop_size = world_params.pop_size/world_params.num_residences;
                    //let new_subpop_gui = f4.add(world_params.residence_options[residences.length-1], "subpop_size", 0, 1000).step(1).name("Subpop " + this.residences.length);

                }  
            } else {
                world_params.residence_options.push({subpop_size: world_params.pop_size/world_params.num_residences});
                //let new_subpop_gui = f4.add(world_params.residence_options[residences.length-1], "subpop_size", 0, 1000).step(1).name("Subpop " + this.residences.length);

            }
            
            for (let i=0; i<world_params.residence_options[residences.length-1].subpop_size; i++) {
                let temp_agent = InfectiousMatterSim.add_agent(res);
                //temp_agent.node
                if (typeof viva_graphics !== 'undefined') {
                    viva_graphics.getNodeUI(temp_agent.node.id).color = res.viva_node_color;
                    viva_graphics.getNodeUI(temp_agent.node.id).size = 20
                }
                
            }
        }

        InfectiousMatterSim.add_event({time: 1000, callback: InfectiousMatterSim.migrate_event(), recurring: true });
        InfectiousMatterSim.add_event( {
            time: InfectiousMatterSim.simulation_params.sim_time_per_day * 3,
            callback: function() {
                //
                for (let i=0; i < world_params.num_to_infect; i++) {
                    let random_agent = Matter.Common.choose(InfectiousMatterSim.agents);
                    InfectiousMatterSim.expose_org(random_agent.body, AgentStates.S_INFECTED);
                }
            }
        })

    };
    

    var plotly_interval;

    let get_fresh_traces = function() {
        let exposed = {
            x: [0],
            y: [0],
            stackgroup: 'one',
            name: "Exposed",
          marker: { color: "orange" }
        };

        let infected = {
          x: [0],
          y: [0],
          stackgroup: 'one',
          name: "Infected",
          marker: { color: "red" }
        };

        let recovered = {
          x: [0],
          y: [0],
          stackgroup: 'one',
          name: "Recovered",
          marker: { color: "green" }
        };

        let susceptible = {
            x: [0],
            y: [0],
            stackgroup: 'one',
            name: "Susceptable",
            marker: { color: "grey" }
        }

        let plot_data = [exposed, infected, recovered, susceptible];

        return plot_data;

    }

    let clear_simulation = function() {
        clearInterval(plotly_interval);
        Plotly.purge('plotDiv');

        InfectiousMatterSim.clear_simulator();

        world_params.residence_options = [];

        ContactGraph.clear();

    };

    let reset_population = function() {
        InfectiousMatterSim.setup_matter_env();
        setup_world();

    };



    UIkit.util.on("#page1", 'inview', function(e) {
        //clear_simulation();
        document.getElementById('graphDiv').style.visibility = "hidden";
        document.getElementById('plotDiv').style.visibility = "hidden";

    });

    UIkit.util.on("#page2", 'inview', function(e) {
        document.getElementById('graphDiv').style.visibility = "hidden";
        document.getElementById('plotDiv').style.visibility = "hidden";

        clear_simulation();
        world_params.pop_size = 11 
        world_params.num_residences = 1;
        world_params.residence_size = 300 - world_params.residence_padding*2;
        world_params.num_to_infect = 0;

        reset_population();
    });
    
    UIkit.util.on("#page3", 'inview', function(e) {
        document.getElementById('graphDiv').style.visibility = "hidden";
        document.getElementById('plotDiv').style.visibility = "hidden";

        clear_simulation();
        world_params.pop_size = 100; 
        world_params.num_residences = 1;
        world_params.residence_size = 300 - world_params.residence_padding*2;
        world_params.num_to_infect = 5;

        reset_population();
        InfectiousMatterSim.infection_params.per_contact_infection = 1.0;


        document.getElementById('plotDiv').style.visibility = "hidden";
        Plotly.newPlot('plotDiv', get_fresh_traces(), infection_layout, {responsive:true});
        plotly_interval = setInterval(function() {
            Plotly.extendTraces('plotDiv', {
                x: [
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day], 
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day]
                    ],
                y: [
                    [InfectiousMatterSim.state_counts[AgentStates.EXPOSED]],
                    [InfectiousMatterSim.state_counts[AgentStates.S_INFECTED] + InfectiousMatterSim.state_counts[AgentStates.A_INFECTED]],
                    [InfectiousMatterSim.state_counts[AgentStates.RECOVERED]],
                    [InfectiousMatterSim.state_counts[AgentStates.SUSCEPTIBLE]]
                    ]
            }, [0, 1, 2, 3]);
        }, 1000)

    });

    UIkit.util.on("#page4", 'inview', function(e) {
        //TODO: handle direct browser refresh
        document.getElementById('graphDiv').style.visibility = "hidden";

        document.getElementById('plotDiv').style.width=300;
        document.getElementById('plotDiv').style.visibility = "visible";
        Plotly.relayout('plotDiv', {width: 300});
    });

    UIkit.util.on("#page5", 'inview', function(e) {
        document.getElementById('graphDiv').style.visibility = "hidden";
        document.getElementById('plotDiv').style.visibility = "visible";


        clear_simulation();
        world_params.pop_size = 100; 
        world_params.num_residences = 4;
        world_params.residence_size = 120;
        world_params.num_to_infect = 2;
        world_params.num_visitors = 5;

        reset_population();
        InfectiousMatterSim.infection_params.per_contact_infection = 1.0;
        
        document.getElementById('plotDiv').style.visibility = "visible";

        Plotly.react('plotDiv', get_fresh_traces(), infection_layout, {responsive:true});
        plotly_interval = setInterval(function() {
            Plotly.extendTraces('plotDiv', {
                x: [
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day], 
                    [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day]
                    ],
                y: [
                    [InfectiousMatterSim.state_counts[AgentStates.EXPOSED]],
                    [InfectiousMatterSim.state_counts[AgentStates.S_INFECTED] + InfectiousMatterSim.state_counts[AgentStates.A_INFECTED]],
                    [InfectiousMatterSim.state_counts[AgentStates.RECOVERED]],
                    [InfectiousMatterSim.state_counts[AgentStates.SUSCEPTIBLE]]
                    ]
            }, [0, 1, 2, 3]);
        }, 1000)
    });

    UIkit.util.on("#page6", 'inview', function(e) {
        //TODO: Handle browser refresh/link to this div directly
        document.getElementById('graphDiv').style.visibility = "visible";
    })

    UIkit.util.on("#page7", 'inview', function(e) {
        console.log("did a thing")
        document.getElementById('plotDiv').style.visibility = "visible";
        document.getElementById('graphDiv').style.visibility = "visible";

        let setup_rural_sim = function() {
            clear_simulation();
            world_params.pop_size = 20; 
            world_params.num_residences = 9;
            world_params.residence_size = 80;
            world_params.residence_padding = 15;
            world_params.agent_size = 1.5;
            world_params.num_to_infect = 2;
            world_params.num_visitors = 3;

            world_params.residence_options = [
                {subpop_size: 70},
                {subpop_size: 40},
                {subpop_size: 10},
                {subpop_size: 30},
                {subpop_size: 12},
                {subpop_size: 10},
                {subpop_size: 20},
                {subpop_size: 12},
                {subpop_size: 10}
            ]

            reset_population();
            InfectiousMatterSim.infection_params.per_contact_infection = 0.5;
            InfectiousMatterSim.infection_params.movement_scale = 1.0;

            Plotly.react('plotDiv', get_fresh_traces(), infection_layout, {responsive:true});
            plotly_interval = setInterval(function() {
                Plotly.extendTraces('plotDiv', {
                    x: [
                        [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                        [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day],
                        [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day], 
                        [InfectiousMatterSim.cur_sim_time/simulation_params.sim_time_per_day]
                        ],
                    y: [
                        [InfectiousMatterSim.state_counts[AgentStates.EXPOSED]],
                        [InfectiousMatterSim.state_counts[AgentStates.S_INFECTED] + InfectiousMatterSim.state_counts[AgentStates.A_INFECTED]],
                        [InfectiousMatterSim.state_counts[AgentStates.RECOVERED]],
                        [InfectiousMatterSim.state_counts[AgentStates.SUSCEPTIBLE]]
                        ]
                }, [0, 1, 2, 3]);
            }, 1000);
        }

        setup_rural_sim();
        

        document.getElementById('restart_btn').onclick = function() {
            setup_rural_sim();

        }

    });


}
