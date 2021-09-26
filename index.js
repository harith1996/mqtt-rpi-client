require("dotenv").config();

const mqtt = require("mqtt");
const leds = require("./actuators/leds");
const dht11 = require("./sensors/dht11");
const ultrasonic = require("./sensors/ultrasonic");
const MQTTclient = mqtt.connect(process.env.MQTT_BROKER, {
  port: process.env.MQTT_PORT || 1883,
});

MQTTclient.on("connect", () => {
  console.log(
    `✔️ MQTT Client successfully connected to '${process.env.MQTT_BROKER}' :D`
  );
});

MQTTclient.subscribe(["led"], undefined, (err, granted) => {
  if (err) {
    console.error("ⅹ Could not subscribe to topics :(");
    process.exit(1);
  } else {
    console.log("✔️ Successfully connected to topics :D");
  }
});

MQTTclient.on("message", (topic, payload) => {
  msg = JSON.parse(payload.toString());
  switch (topic) {
    // All of the actuators should be listed here...
    case "led":
      leds.setStateLED(msg.id, msg.state);
      break;
    default:
      console.log("⚠️ We received a message from an unknown topic");
  }
});

dht11.setPublish(MQTTclient, process.env.UPDATE_RATE, process.env.SIMULATION);
ultrasonic.setPublish(MQTTclient, process.env.UPDATE_RATE, process.env.SIMULATION);