import PositionCalculator from './util/PositionCalculator.js';
import CanvasRenderer from './util/CanvasRenderer.js';

import Panel from './components/Panel.vue';

Vue.filter('float', function(val) {
    return val.toFixed(2)
});

var app = new Vue({
	el: '#app',
    components: {Panel},
	data: {
        connected: false,
		distances: {
			d1: 0,
			d2: 0,
			d3: 0
		},
        width: 7.413,
        height: 10,
		baseNodes: {
			d1: [0.4, 2.4],
			d2: [7.413 - 0.44, 2.602],
			d3: [3.7, 8.157]
		},
        position: {
            x: 0,
            y: 0,
            error: 0
        },
        errors : [
            0.05,
            0.1,
            0.15,
            0.2,
            0.25,
            0.3,
            0.35,
            0.4,
            0.45,
            0.5,
            0.55
        ],
        error: {
            value: 0.3,
            type: "absolute"
        },
        alpha: 0.6,
        receiveCount: 0
	},

	ready: function() {
        var host = "localhost";
        var port = Number(9001);
        // Create a client instance
        if (window.mqtt_config) {
            host = window.mqtt_config.host;
            if (window.mqtt_config.port) {
                port = Number(window.mqtt_config.port);
            }
        }
        this.client = new Paho.MQTT.Client(host, port, "clientId-"+ Math.random());
        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;
        this.connect();
    },

    methods: {
    	connect: function() {
            if (window.mqtt_config && window.mqtt_config.username) {
                this.client.connect({
                    onSuccess: this.onConnect,
                    userName: window.mqtt_config.username,
                    password: window.mqtt_config.password
                });
            } else {
                this.client.connect({
                    onSuccess: this.onConnect
                });
            }
        },

        onConnectionLost: function(responseObject) {
            this.connected = false;
            if (responseObject.errorCode !== 0) {
                this.status = responseObject.errorMessage;
            }
            window.setTimeout(this.connect, 1000);
        },

        onConnect: function() {
            this.status = "Verbunden";
            this.connected = true;

            this.client.subscribe("pos/#");

            this.renderer = new CanvasRenderer(this.$el.querySelector('canvas'), this.baseNodes, {d1:0,d2:0,d3:0}, this.width, this.height, this.error);
        },

        onMessageArrived: function(message) {
            var channelName = "pos/";

            this.alpha = parseFloat(this.alpha);

            if (message.destinationName.indexOf(channelName) == 0) {
            	var index = message.destinationName.substring(channelName.length);
                var lastDistance = this.distances[index];
            	this.distances[index] = lastDistance + this.alpha * (parseFloat(message.payloadString) - lastDistance);


                this.tryCalculatePosition();
            }
        },

        tryCalculatePosition: function() {
            if(this.distances.d1 > 0 &&
                this.distances.d2 > 0 &&
                this.distances.d3 > 0) {
                this.calculatePosition();
            }
        },

        calculatePosition: function() {
            this.renderer.updateDistances(this.distances);

            var pcalc = new PositionCalculator(this.error);
            var result = pcalc.calculatePosition(this.distances, this.baseNodes);
            this.renderer.setPosition(result);
            this.position.x = result[0];
            this.position.y = result[1];
            this.position.error = result[2];
        }
    }
});
