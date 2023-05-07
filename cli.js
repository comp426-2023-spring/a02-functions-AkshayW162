#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// Args
const args = minimist(process.argv.slice(2));

// -h command help text
if (args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("    -h            Show this help message and exit.");
    console.log("    -n, -s        Latitude: N positive; S negative.");
    console.log("    -e, -w        Longitude: E positive; W negative.");
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

// System timezone
const timezone = moment.tz.guess() || args.z;

// Weather
const latitude = args.n || (args.s * -1);
const longitude = args.e || (args.w * -1);

// Weather data url
const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&temperature_unit=fahrenheit&timezone=' + timezone;

// Request
const response = await fetch(url);
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

const days_count = args.d

if (days_count == 0) {
  console.log("today.")
} else if (days_count > 1) {
  console.log("in " + days_count + " days.")
} else {
  console.log("tomorrow.")
}

if (data.daily.precipitation_hours[days_count] == 0) {
    console.log("You will not need your galoshes.");
} else {
    console.log("You might need your galoshes.");
}
