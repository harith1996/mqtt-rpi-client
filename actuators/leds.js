require('dotenv').config()

let gpio, leds;

if (!process.env.SIMULATION) {
    // Extract the pins of the LEDs
    var ledarr = process.env.GPIO_LEDS.split(',')
    
    // Initialize LEDs
    gpio = require("pigpio").Gpio;
    leds = ledarr.map((led) => new gpio(Number(led), { mode: gpio.OUTPUT }));
    leds.forEach((led) => led.digitalWrite(0));
}

const setStateLED = (idx, state) => {
    
    // There has to be data for this to work...
    if (idx == undefined || state == undefined) {
        console.log('⚠️ LED got an invalid state :(');
        return
    }

    if (process.env.SIMULATION) {
        console.log(`ℹ︎ We changed LED ${idx} to state ${state}`)
        return
    }
    
    // Make sure the parameters are valid
    if (idx < 0 || idx >= leds.length
        || (state !== 0 && state !== 1)) {
        return;
    }

    leds[idx].digitalWrite(state);

};

module.exports = {
    setStateLED,
};
