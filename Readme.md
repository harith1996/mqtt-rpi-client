# Raspberry Pi MQTT client

A simple MQTT client for sending and subscribing to sensor topics on an MQTT broker

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Limitations](#limitations)
- [Related Efforts](#related-efforts)
- [Maintainers](#maintainers)


## Install
- Step 1: Install NodeJS and NPM (`apt install nodejs npm`).
- Step 2: This project uses the `pigpio` node modules so you should make sure the `pigpio` package is installed (`apt install pigpio`).
- Step 3 If the Pi is not using a recent version of NodeJS it might have to compile some things in order to get the `better-sqlite3` module up and running. `python`, `make`, `gcc` (`apt install python make gcc`) and `node-gyp` (`npm install -g node-gyp`) are required. To skip this step just use a [LTS release of NodeJS](https://nodejs.org/en/about/releases/).
- Step 4: Clone the repository
- Step 5: Install all of the required modules with `npm install`.

***TLDR***
```bash
sudo apt install -y nodejs npm pigpio python make gcc
sudo npm install -g node-gyp
git clone --recursive git@github.com:harith1996/mqtt-rpi-client.git
cd backend
npm install
```

## Usage
Before running the program make sure `.env` is configured correctly: 
```env
#Details of primary MQTT broker. This broker MUST BE FUNCTIONAL
#Hostnames (comma separated)
MASTER_MQTT_BROKERS=mqtt://broker
MASTER_MQTT_PORTS=1883

#Username and password for publishing to topics
MASTER_MQTT_USERS=iotp2p
MASTER_MQTT_PWDS=milestone2

#Details of secondary MQTT brokers
# SECONDARY_MQTT_BROKERS=mqtt://cloud-broker
# SECONDARY_MQTT_PORTS=1883
# SECONDARY_MQTT_USERS=iotp2p
# SECONDARY_MQTT_PWDS=milestone2

# GPIO ports for the LEDs
GPIO_LEDS=4,2,22

# GPIO ports for the Ultrasonic sensor
GPIO_TRIGGER=23
GPIO_ECHO=24

# GPIO port for the Humidity and Temperature Sensor
GPIO_DHT11=12

# How often should the WebSocket send information (miliseconds) ?
UPDATE_RATE=30000
```

With the `.env` file ready you can run the program with `npm start`. If you wish to to run the program in "sim mode", without the need for a Raspberry Pi, use `npm run sim`. The displayed values in this mode will be random.

## Limitations
Root privileges are required to read the Raspberry Pi's sensors.

## Maintainers
[Harith Rathish](https://github.com/harith1996)

[Sam Martin Vargas Giagnocavo](https://github.com/smvg)
