var strformat = require('strformat');
var fs = require('fs');
var webshot = require('webshot');
var ejs = require('ejs');
var moment = require('moment');
var schedule = require('node-schedule');

// http://trac.ffmpeg.org/wiki/Create%20a%20video%20slideshow%20from%20images
// ffmpeg -framerate 1 -pattern_type glob -i 'maps_161104_1*.png' -c:v libx264 -profile:v high -crf 20 -r 30 -pix_fmt yuv420p output.mp4
// ffmpeg -framerate 2 -pattern_type glob -i 'maps_161104_1*.png' -c:v libx264 -profile:v high -crf 20 -r 30 -pix_fmt yuv420p output.mp4

var options = {
  screenSize: {
    width: 1920,
    height: 1080
  },
  shotSize: {
    width: 'all',
    height: 'all'
  },
  siteType: 'html',
  renderDelay: 10000,
  timeout: 20000,
  userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'
};

const allowed = [0, 1, 2]
const locData = [{
  city: 'bangalore',
  zoom: 14,
  lat: 12.957975,
  lng: 77.6445781
}, {
  city: 'city 2',
  zoom: 13,
  lat: 12.957975,
  lng: 77.6445781
}, {
  city: 'city 3',
  zoom: 15,
  lat: 12.957975,
  lng: 77.6445781
}];

var allowedContent = [];

fs.readFile('./views/google_maps.ejs', function read(err, data) {
  if (err) {
    throw err;
  }

  console.log("MAPS");
  var t;
  for (var i = 0; i < allowed.length; i++) {
    t = allowed[i];
    allowedContent[t] = ejs.render(data.toString(), locData[t]);
  }
  console.log(JSON.stringify(allowedContent));
});

schedule.scheduleJob('0 */5 * * * *', loop);

function loop() {
  for (var i = 0; i < allowed.length; i++) {
    var t = allowed[i];
    setTimeout(save.bind(null, t, allowedContent[t], locData[t].city), (i * 1000));
  }
}

function save(i, c, city) {
  console.log(city);
  var date = moment().format('YYMMDD_HHmmss');
  webshot(c, '/home/k2/maps/maps_' + city + '_' + i + '_' + date + '.png', options, function(err, data) {
    // screenshot now saved!
  });
}

process.stdin.resume();
