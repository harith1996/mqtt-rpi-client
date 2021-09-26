const events = require("events");
const EventEmitter = new events();
/**
 * @global
 * @typedef {Object} Distance
 * @property {String} time - time at which the value was measured
 * @property {Number} value - distance between sensor and closest object in Centimeters
 */

/**
 * Inits a setInterval routine to measure and publish ultrasonic distance readings to MQTT broker
 * @param {MqttClient} client - mqtt client
 * @param {Number} interval - publish interval in milliseconds
 * @param {Boolean} isSimulation - true if app is running in simulation mode
 */
const setPublish = (MQTTclient, interval, isSimulation) => {
  let gpio, trigger, echo, db, startTick;
  const MICROSECONDS_PER_CM = 1e6 / 34321;
  let time, distance; //variables to publish
  if (!isSimulation) {
    //connect to sensor
    gpio = require("pigpio").Gpio;
    trigger = new gpio(process.env.GPIO_TRIGGER, { mode: gpio.OUTPUT });
    echo = new gpio(process.env.GPIO_ECHO, { mode: gpio.INPUT, alert: true });
    trigger.digitalWrite(0);
  }

  if (!isSimulation) {
    echo.on("alert", (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        time = new Date().getTime();
        distance = diff / 2 / MICROSECONDS_PER_CM;
        EventEmitter.emit("distanceDataReady");
      }
    });
  }

  // Trigger a distance measurement once per 'interval' ms
  setInterval(
    isSimulation
      ? () => {
          time = new Date().getTime();
          distance = Math.floor(Math.random() * 20) + 80;
          EventEmitter.emit("distanceDataReady");
        }
      : () => {
          trigger.trigger(10, 1); // Set trigger high for 10 microseconds
        },
    interval
  );

  EventEmitter.addListener("distanceDataReady", () => {
    let distanceMessage = JSON.stringify({ time: time, distance: distance });
    MQTTclient.publish("distance", distanceMessage, handlePublishError);
  });
};

const handlePublishError = (err) => {
  if(err) {
    console.error("Unable to publish dht11 readings to MQTT broker");
    console.error(err);
  }
};

module.exports = {
  setPublish,
};
