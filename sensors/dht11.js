const events = require("events");
const EventEmitter = new events();

const setPublish = (mqttBrokers, interval, isSimulation) => {
  let dataPin, dhtType, sensor;
  let time, data = {}; //variables to be published
  if (!isSimulation) {
    //connect to sensors on RPI (if not in SIMULATION mode)
    const dht = require("pigpio-dht");
    dataPin = process.env.GPIO_DHT11;
    dhtType = 11;
    sensor = dht(dataPin, dhtType);
  }
  setInterval(
    isSimulation
      ? () => {
          time = new Date().getTime();
          data.temperature = Math.floor(Math.random() * 10) + 20; //round off temperature & humidity readings
          data.humidity = Math.floor(Math.random() * 10);
          EventEmitter.emit("dhtDataReady");
        }
      : () => {
          sensor.read();
        },
    interval
  );

  if (!isSimulation) {
    sensor.on("result", (sensorData) => {
      //every sensor reading triggers a DB insert.
      time = new Date().getTime();
      data.humidity = sensorData.humidity;
      data.temperature = sensorData.temperature;
      EventEmitter.emit("dhtDataReady");
    });
  }
  EventEmitter.addListener("dhtDataReady", () => {
    let humidityMessage = JSON.stringify({
      time: time,
      humidity: data.humidity,
    });
    let tempMessage = JSON.stringify({
      time: time,
      temperature: data.temperature,
    });
    mqttBrokers.forEach(b => {
      b.publish("humidity", humidityMessage, {}, handlePublishError);
      b.publish("temperature", tempMessage, {}, handlePublishError);
    })
  });
};

const handlePublishError = (err) => {
  if(err){
    console.error("Unable to publish dht11 readings to MQTT broker");
    console.error(err);
  }
};

module.exports = {
  setPublish,
};
