require("dotenv").config();

const mqtt = require("mqtt");
const leds = require("./actuators/leds");
const dht11 = require("./sensors/dht11");
const ultrasonic = require("./sensors/ultrasonic");
const MQTTclient = mqtt.connect(process.env.MQTT_BROKER, {
  port: process.env.MQTT_PORT || 1883,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PWD
});

if (process.env.SIMULATION == 'true') {
  console.log('ℹ︎Running in simulation mode')
}

MQTTclient.on("connect", () => {
  console.log(
    `✔️ MQTT Client successfully connected to '${process.env.MQTT_BROKER}' :D`
  );
});

MQTTclient.subscribe(["trigger-led"], undefined, (err, granted) => {
  if (err) {
    console.error("ⅹ Could not subscribe to topics :(");
    process.exit(1);
  } else {
    console.log("✔️ Successfully connected to topics :D");
  }
});

MQTTclient.on("message", (topic, payload) => {
  var msg = JSON.parse(payload.toString());
  if (topic === "trigger-led") {
    
    // We change the LED
    state = leds.setStateLED(msg.id, msg.state);

    // If successful, we publish new LED state
    if (state) {
      MQTTclient.publish("led", payload.toString());
    }

    // } else if (more topics...) {

  } else {
    console.log("⚠️ We received a message from an unknown topic");
  }

});

dht11.setPublish(MQTTclient, process.env.UPDATE_RATE, process.env.SIMULATION);
ultrasonic.setPublish(MQTTclient, process.env.UPDATE_RATE, process.env.SIMULATION);
