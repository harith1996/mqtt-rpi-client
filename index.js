require("dotenv").config();

const mqtt = require("mqtt");
const leds = require("./actuators/leds");
const dht11 = require("./sensors/dht11");
const ultrasonic = require("./sensors/ultrasonic");
const { parseBrokers } = require("./misc/utils")

const masterMQTTBrokers = parseBrokers(
  process.env.MASTER_MQTT_BROKERS,
  process.env.MASTER_MQTT_PORTS,
  process.env.MASTER_MQTT_USERS,
  process.env.MASTER_MQTT_PWDS
).map(b => mqtt.connect(b.host, {
  port: b.port,
  username: b.username,
  password: b.password
}));

const secondaryMQTTBrokers = parseBrokers(
  process.env.SECONDARY_MQTT_BROKERS,
  process.env.SECONDARY_MQTT_PORTS,
  process.env.SECONDARY_MQTT_USERS,
  process.env.SECONDARY_MQTT_PWDS
).map(b => mqtt.connect(b.host, {
  port: b.port,
  username: b.username,
  password: b.password
}));

if (process.env.SIMULATION == 'true') {
  console.log('ℹ ︎Running in simulation mode')
}

masterMQTTBrokers.forEach((b, i) => {
  b.on("connect", () => {
    console.log(
      `✔️ Master MQTT Client (${i}) successfully connected :D`
    )
  })
})

secondaryMQTTBrokers.forEach((b, i) => {
  b.on("connect", () => {
    console.log(
      `✔️ Secondary MQTT Client (${i}) successfully connected :D`
    )
  })
})

// Only masters should subscribe and read from trigger-led
masterMQTTBrokers.forEach((b, i) => {
  b.subscribe(["trigger-led"], undefined, (err, granted) => {
    if (err) {
      console.error(`ⅹ Master MQTT Client (${i}) could not subscribe to topics :(`);
      process.exit(1);
    } else {
      console.log(`✔ ️Master MQTT Client (${i}) successfully connected to topics :D`);
    }
  });

  b.on("message", (topic, payload) => {
    var msg = JSON.parse(payload.toString());
    if (topic === "trigger-led") {
      // We change the LED
      state = leds.setStateLED(msg.id, msg.state);
      if (state) {
        // If we indeed change the LED, let everyone know 
        masterMQTTBrokers.forEach(mb => mb.publish("led", payload.toString()))
        secondaryMQTTBrokers.forEach(sb => sb.publish("led", payload.toString()))
      }
    } else {
      console.log(`⚠️ Master MQTT Client (${i}) received a message from an unknown topic`);
    }
  });
})

dht11.setPublish(
  [...masterMQTTBrokers, ...secondaryMQTTBrokers],
  process.env.UPDATE_RATE,
  process.env.SIMULATION
);

ultrasonic.setPublish(
  [...masterMQTTBrokers, ...secondaryMQTTBrokers],
  process.env.UPDATE_RATE,
  process.env.SIMULATION
);