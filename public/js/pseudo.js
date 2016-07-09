var clock;

// Particles
var particles = new THREE.Object3D(),
  totalParticles = 200,
  maxParticleSize = 200,
  particleRotationSpeed = 0,
  particleRotationDeg = 0,
  lastColorRange = [0, 0.3],
  currentColorRange = [0, 0.3],

clock = new THREE.Clock();
  
function getURL(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
       if (xmlhttp.status == 200){
           callback(JSON.parse(xmlhttp.responseText));
       }
       else {
           console.log('We had an error, status code: ', xmlhttp.status);
       }
    }
  }
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

var particleTexture = THREE.ImageUtils.loadTexture('textures/particle.png'),
  spriteMaterial = new THREE.SpriteMaterial({
  map: particleTexture,
  color: 0xffffff
});

for (var i = 0; i < totalParticles; i++) {
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(64, 64, 1.0);
  sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.75);
  sprite.position.setLength(maxParticleSize * Math.random());
  sprite.material.blending = THREE.AdditiveBlending;
          
  particles.add(sprite);
}

particles.position.y = 70;
scene.add(particles);


 function adjustToWeatherConditions() {
    var cityIDs = '';
    for (var i = 0; i < cities.length; i++) {
      cityIDs += cities[i][1];
      if (i != cities.length - 1) cityIDs += ',';
    }

    // Replace with real API id.
    getURL('http://api.openweathermap.org/data/2.5/group?id=' + cityIDs + '&APPID=b5c0b505a8746a1b2cc6b17cdab34535', function(info) {
      cityWeather = info.list;
      
      lookupTimezones(0, cityWeather.length);
    });
}

function lookupTimezones(t, len) {
    var tz = new TimeZoneDB;
    
    tz.getJSON({
        key: "GPH4A5Q6NGI1", // TODO: Use real key
        lat: cityWeather[t].coord.lat,
        lng: cityWeather[t].coord.lon
    }, function(timeZone){
        cityTimes.push(new Date(timeZone.timestamp * 1000));
        t++;
        if (t < len) {
          setTimeout(function() {
            lookupTimezones(t, len);
          }, 1200);
        } else {
          applyWeatherConditions();
        }
    });
}

function applyWeatherConditions() {
    
    // TODO: Maybe display the city name here
    
    var info = cityWeather[currentCity];
    particleRotationSpeed = info.wind.speed / 2; // dividing by 2 just to slow things down 
    particleRotationDeg = info.wind.deg;

    var timeThere = cityTimes[currentCity] ? cityTimes[currentCity].getUTCHours() : 0,
        isDay = timeThere >= 6 && timeThere <= 18;

    if (isDay) {
      switch (info.weather[0].main) {
        case 'Clouds':
          currentColorRange = [0, 0.01];
          break;
        case 'Rain':
          currentColorRange = [0.7, 0.1];
          break;
        case 'Clear':
        default:
          currentColorRange = [0.6, 0.7];
          break;
      }
    } else {
      currentColorRange = [0.69, 0.6];
    }

    if (currentCity < cities.length-1) currentCity++;
    else currentCity = 0;
    setTimeout(applyWeatherConditions, 5000);
}

function animate() {
  var elapsedSeconds = clock.getElapsedTime(),
      particleRotationDirection = particleRotationDeg <= 180 ? -1 : 1;
    
  particles.rotation.y = elapsedSeconds * particleRotationSpeed * particleRotationDirection;
        
  // We check if the color range has changed, if so, we'll change the colours
  if (lastColorRange[0] != currentColorRange[0] && lastColorRange[1] != currentColorRange[1]) {
    for (var i = 0; i < totalParticles; i++) {
      particles.children[i].material.color.setHSL(currentColorRange[0], currentColorRange[1], (Math.random() * (0.7 - 0.2) + 0.2));
    }
      
    lastColorRange = currentColorRange;
  }
  
  requestAnimationFrame(animate); // TODO: This will add the animations to the main loop, if you have it somewhere else just call animate
  // TODO: Add update code if necessary here
}