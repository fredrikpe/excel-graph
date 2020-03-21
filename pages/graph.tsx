import * as React from 'react';
import { Checkbox, TextInput, Heading, Card, Pane, Text } from "evergreen-ui";
import cytoscape from "cytoscape";
import elk from 'cytoscape-elk';
import { get } from '../src/state';

cytoscape.use(elk);


export default () => {

    React.useEffect(() => {
        const cy = cytoscape({
            container: document.getElementById('cy'), // container to render in

            elements: get(),

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {
                name: 'grid',
                rows: 1
            }
        })
        const options = {
            name: "elk",
            nodeDimensionsIncludeLabels: true, // Boolean which changes whether label dimensions are included when calculating node dimensions
            fit: true, // Whether to fit
            padding: 40, // Padding on fit
            animate: false, // Whether to transition the node positions
            animateFilter: function( node, i ){ return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
            animationDuration: 500, // Duration of animation in ms if enabled
            animationEasing: undefined, // Easing of animation if enabled
            transform: function( node, pos ){ return pos; }, // A function that applies a transform to the final node position
            ready: undefined, // Callback on layoutready
            stop: undefined, // Callback on layoutstop
            elk: {
            // All options are available at http://www.eclipse.org/elk/reference.html
            // 'org.eclipse.elk.' can be dropped from the Identifier
            // Or look at demo.html for an example.
            // Enums use the name of the enum e.g.
            // 'searchOrder': 'DFS'
            },
            priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
        };

        cy.layout(options).run();
    });

    return (<div id="cy"/>)
}
