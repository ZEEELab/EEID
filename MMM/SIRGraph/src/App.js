import './App.css';
import Viva from 'vivagraphjs';
import {useEffect, useRef} from 'react';
import {EventQueue} from './event_queue';
import { jStat } from 'jstat';

var graphGenerator = Viva.Graph.generator();
var graph = graphGenerator.wattsStrogatz(1000, 8, 0.1);


graph.forEachNode( (node) => {
  node.data = {state: "susceptible"}
})

function App() {
  const graph_div = useRef(null);
  const viva_timer = useRef(null);

  useEffect( ()=> {
    var curTime = 0;
    var eventQ = new EventQueue();


    let viva_layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 10,
      springCoeff : 0.0001,
      dragCoeff : 0.1,
      gravity : -1.2,
    });
    
    let viva_graphics = Viva.Graph.View.svgGraphics();

    let viva_renderer = Viva.Graph.View.renderer(graph, {
      container: graph_div.current,
      graphics: viva_graphics,
      renderLinks: true,
      layout: viva_layout,
      interactive: 'scroll node drag'
    });


    let highlight_neighborhood = (node_graphic) => {
      let node_obj = node_graphic.target.node;

    
      viva_graphics.getNodeUI(node_obj.id)
        .attr("r", 20);

      graph.forEachLinkedNode(node_obj.id, (neighbor)=> {
        viva_graphics.getNodeUI(neighbor.id)
          .attr("r", 20);
      });
    };

    let unhighlight_neighborhood = (node_graphic) => {
      let node_obj = node_graphic.target.node;

      viva_graphics.getNodeUI(node_obj.id)
        .attr("r", 10);

      graph.forEachLinkedNode(node_obj.id, (neighbor)=> {
        viva_graphics.getNodeUI(neighbor.id)
          .attr("r", 10);
      });
    };

    let spreadInfection = (node_obj) => {

      viva_graphics.getNodeUI(node_obj.id)
        .attr("fill", "orange");

      //TODO: keep track of states...
      node_obj.data["state"] = "infected"

      eventQ.add_event(curTime, {time: 300, callback: () => { 
        node_obj.data["state"] = "recovered";
        viva_graphics.getNodeUI(node_obj.id)
          .attr("fill", "green");
      }});

      graph.forEachLinkedNode(node_obj.id, (neighbor_node) => {
        if(neighbor_node.data["state"] == "susceptible" && jStat.uniform.sample(0,1) > 0.65) {
          eventQ.add_event(curTime, {time: jStat.uniform.sample(0,300), callback: () => {
            spreadInfection(neighbor_node);
          }});
        }
      });
  

      //calculte time to recover...
      //  how many neighbors should I infect in the time it takes to recover?
      //  randomly sample neighbor that will be (attempted) infected

    };

    viva_graphics.node((node) => {
      var ui = Viva.Graph.svg("circle")
        .attr("r", 10)
        .attr("fill", "MediumBlue")
        .on("click", (t) => spreadInfection(t.target.node))
        .on("mouseover", (t) => highlight_neighborhood(t))
        .on("mouseout", (t) => unhighlight_neighborhood(t));

      return ui;
    });

    viva_graphics.placeNode(function(nodeUI, pos) {
      nodeUI.attr('cx', pos.x).attr('cy', pos.y);
    });
  
    viva_renderer.run();

    for (let i=0; i<15; i++) {
      viva_renderer.zoomOut();
    }


    viva_timer.current = Viva.Graph.Utils.timer( () => {
      //actually do something here...
      //calculate when transmissions occur and when recovery occurs, enter them as events
      curTime += 1;
      eventQ.run_events_fired(curTime, 10);
      return true;
    });

    return () => {
      viva_renderer.dispose();
      eventQ.clear_events();

      viva_timer.current.stop();
      viva_timer.current = null;
    };


  }, [])



  return (
    <svg ref={graph_div} style={{width:800, height:600}} >
    </svg>
  );
}

export default App;
