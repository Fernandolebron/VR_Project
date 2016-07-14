//--------------------------------------------------------------//
//---------------------- GLOBAL VARIABLES ----------------------//
//--------------------------------------------------------------//

// Display Elements------------------
var container, raycaster, objects = [];
var renderer, scene, camera, controls, effect;
var zoom = 0;
var d, nd;
var plan=[];
var homecubes=[];
var reticle;
var keyState = {};
var plane;
var sky, sunSphere;
var sphere;
var time = new Date();
var time2=0; 
var player, playerId, moveSpeed, turnSpeed;
var playerData;
var otherPlayers = [], otherPlayersId = [];

var currentCityTextMesh; 
var currentCityText;

var currentCityTextMesh2; 
var currentCityText2;

var ctrlx = 0;
var ctrly = 5;
var ctrlz = 0;

var clock;

// Particles
var particles = new THREE.Object3D(),
  totalParticles = 200,
  maxParticleSize = 200,
  particleRotationSpeed = 0,
  particleRotationDeg = 0,
  lastColorRange = [0, 0.3],
  currentColorRange = [0, 0.3];
  currentWeather = 'Clear';

var particleTexture, spriteMaterial;
  //weather

/*
London 51.507351, -0.127758
Paris 48.856614, 2.352222
Tokyo 35.6895, 139.6917
Turkey 38.963745, 35.243322
NYC 40.712784, -74.005941
SD 18.7357, -70.1627

white 0xEBECEC
Blue 0x1E82D6
Gray 0x929495
*/


// Works as the main() in client_world.
var loadWorld = function(){

  //----------------------------------------------------------//
  //---------------------- INITIALIZING ----------------------//
  //----------------------------------------------------------//

  //Scene Elements------------------
  // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
  // Only enable it if you actually need to.
  renderer = new THREE.WebGLRenderer({antialias: false});
  renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);
  // Create a three.js scene.
  scene = new THREE.Scene();
  // Create a three.js camera.
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000000);
  // Apply VR headset positional data to camera.
  controls = new THREE.VRControls(camera);
  // Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  // reticle
  reticle = vreticle.Reticle(camera);
  scene.add(camera);

  //Sky--------------------
  initSky();

  
    ///------------Añadiendo el piso--------------///
  var plane_geometry = new THREE.BoxGeometry( 400,400 );
  var plane_material = new THREE.MeshBasicMaterial( {color: 0xAA3939, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( plane_geometry, plane_material );
  plane.rotation.set(-Math.PI/2, Math.PI/2000, Math.PI);
  plane.position.y= -2;
  scene.add( plane );

  
  document.addEventListener('click', onMouseClick, false );
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mouseup', onMouseUp, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseout', onMouseOut, false);
  document.addEventListener('keydown', onKeyDown, false );
  document.addEventListener('keyup', onKeyUp, false );
  document.addEventListener('keyz', onKeyZ, false );
  document.addEventListener('keyx', onKeyX, false );
  document.addEventListener('keyc', onKeyC, false );  


  function initSky() {

      // Add Sky Mesh
      sky = new THREE.Sky();
      scene.add( sky.mesh );

      // Add Sun Helper
      sunSphere = new THREE.Mesh(
                      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
                      new THREE.MeshBasicMaterial( { color: 0xffffff } )
                  );
      sunSphere.position.y = - 700000;
      sunSphere.visible = false;
      scene.add( sunSphere );

      // GUI

      var effectController  = {
                  turbidity: 10,
                  reileigh: 2,
                  mieCoefficient: 0.005,
                  mieDirectionalG: 0.8,
                  luminance: 0.7,
                  inclination: 0.49, 
                  azimuth: 0.25, 
                  sun:  true
              };

      var distance = 400000;

      guiChanged(effectController, distance);
  }


 

     var geo = new THREE.CubeGeometry(4,4,4,4,4,4);
     var mat = new THREE.MeshNormalMaterial();
     var load = new THREE.TextureLoader();


    var Mat1 = [];
    var Mat2 = [];
    var Mat3 = [];
    var Mat4 = [];
    var Mat5 = [];
    var Mat6 = [];
    var GoBack = [];


    // loading texture imagess and pushing them to arrays
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} )); //LONDON
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} ));
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} ));
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} ));
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} ));
    Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/londres/londres.png')} ));

    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris.png')} )); //PARIS
    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris2.png')} ));
    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris3.jpg')} ));
    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris4.jpg')} ));
    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris45.jpg')} ));
    Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris6.jpg')} ));

    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/1.jpg')} )); //TOKYO
    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/2.jpg')} ));
    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/3.jpg')} ));
    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/4.jpg')} ));
    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/5.jpg')} ));
    Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/jp.png')} ));

    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/1.jpg')} )); //TURKEY
    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/2.jpg')} ));
    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/3.jpg')} ));
    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/4.jpg')} ));
    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/5.jpg')} ));
    Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/turquia.png')} ));

    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/1.jpg')} )); //NYC
    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/2.jpg')} ));
    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/3.jpg')} ));
    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/4.jpg')} ));
    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/5.jpg')} ));
    Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/6.jpg')} ));

    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/1.jpg')} )); //SD
    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/2.jpg')} ));
    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/3.jpg')} ));
    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/4.jpg')} ));
    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/5.jpg')} ));
    Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/6.jpg')} ));

    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));
    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));
    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));
    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));
    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));
    GoBack.push(new THREE.MeshBasicMaterial( { map: load.load('images/menu/home.png')} ));

    // applying textures to cubes
    plan[0] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat1 ));
    plan[1] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat2));
    plan[2] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat3 ));
    plan[3] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat4 ));
    plan[4] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat5 ));
    plan[5] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( Mat6 ));

    homecubes[0] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));
    homecubes[1] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));
    homecubes[2] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));
    homecubes[3] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));
    homecubes[4] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));
    homecubes[5] = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(GoBack));

    /*coordinates
  London
  lat: 51.509, long: -0.126

  Santo Domingo
  lat: 18.500, long: -69.988

  Tokyo
  lat: 35.689, long: 139.691

  Paris
  lat: 48.856, long: 2.352

  Turquia
  lat: 38.962, long: 35.241
  
  Nueva York
  lat: 40.712, long: -74.005
  */  

    plan[0].ongazelong = function(){

          if (time2 < 4){time2++}
            else if (time2 == 4){ 
            socket.emit('lookat', 'Londres');
            player.position.x = 30;
            player.position.z = 30;
            updatePlayerData();
            time2 = 0;
          };

            displayCurrentCityName('Londres');
            WorldTime(51.509, -0.126);
            TheWorldWeather(51.509, -0.126);
             //this.material = reticle.get_random_hex_material();
         }

         plan[0].ongazeover = function(){}

         plan[0].ongazeout = function(){time2 = 0;}

          plan[1].ongazelong = function(){
            if (time2 < 4){time2++}
            else if (time2 == 4){ 
            socket.emit('lookat', 'Paris');
            player.position.x = -30;
            player.position.z = -30;
            updatePlayerData();
             //this.material = reticle.get_random_hex_material();
               time2 = 0;
          };
          displayCurrentCityName('Paris');
          WorldTime(48.856, 2.352);
          TheWorldWeather(48.856, 2.352);

         }
        plan[1].ongazeover = function(){}

         plan[1].ongazeout = function(){time2 = 0;}

         plan[2].ongazelong = function(){
          if (time2 < 4){time2++}
            else if (time2 == 4){ 
            socket.emit('lookat', 'Tokio');
            player.position.x = 60;
            player.position.z = 60;
            updatePlayerData();
             //this.material = reticle.get_random_hex_material();
                time2 = 0;
          };

          displayCurrentCityName('Tokio');
          WorldTime(35.689, 139.691);
          TheWorldWeather(35.689, 139.691);
         } 
         plan[2].ongazeover = function(){}

         plan[2].ongazeout = function(){time2 = 0;}

          plan[3].ongazelong = function(){
           if (time2 < 4){time2++}
            else if (time2 == 4){  
            socket.emit('lookat', 'Turquia');
            player.position.x = -60;
            player.position.z = -60;
            updatePlayerData();
             //this.material = reticle.get_random_hex_material();
                 time2 = 0;
          };
          displayCurrentCityName('Turquia');
          WorldTime(38.962, 35.241);
          TheWorldWeather(38.962, 35.241);
         } 
         plan[3].ongazeover = function(){}

         plan[3].ongazeout = function(){time2 = 0;}

          plan[4].ongazelong = function(){
            if (time2 < 4){time2++}
            else if (time2 == 4){ 
            socket.emit('lookat', 'Nueva York');
             player.position.x = 90;
            player.position.z = -90;
            updatePlayerData();

             //this.material = reticle.get_random_hex_material();
                   time2 = 0;
          };
          displayCurrentCityName('Nueva York');
          WorldTime(40.712, -74.005);
          TheWorldWeather(40.712, -74.005);
         } 
         plan[4].ongazeover = function(){}

         plan[4].ongazeout = function(){time2 = 0;}

          plan[5].ongazelong = function(){
            if (time2 < 4){time2++}
            else if (time2 == 4){ 
            socket.emit('lookat', 'Santo Domingo');
            player.position.x = -90;
            player.position.z = 90;
            updatePlayerData();
             //this.material = reticle.get_random_hex_material();
              time2 = 0;
          };
          displayCurrentCityName('Santo Domingo');
          WorldTime(18.500, -69.988);
          TheWorldWeather(18.500, -69.988);
         } 
         plan[5].ongazeover = function(){}

         plan[5].ongazeout = function(){time2 = 0;}

    homecubes[0].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
        }}
    homecubes[0].ongazeover = function(){}
    homecubes[0].ongazeout = function(){time2 = 0;}

    homecubes[1].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
        }}
    homecubes[1].ongazeover = function(){}
    homecubes[1].ongazeout = function(){time2 = 0;}

    homecubes[2].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
        }}
    homecubes[2].ongazeover = function(){}
    homecubes[2].ongazeout = function(){time2 = 0;}

    homecubes[3].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
    }}
    homecubes[3].ongazeover = function(){}
    homecubes[3].ongazeout = function(){time2 = 0;}

    homecubes[4].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
        }}
    homecubes[4].ongazeover = function(){}
    homecubes[4].ongazeout = function(){time2 = 0;}

    homecubes[5].ongazelong = function(){
      if (time2 < 4){time2++}
            else if (time2 == 4){ 
            player.position.x = 0;
            player.position.z = 0;
            updatePlayerData();
        }}
    homecubes[5].ongazeover = function(){}
    homecubes[5].ongazeout = function(){time2 = 0;}

    for (var i = 0; i < 6; i++) {

        reticle.add_collider(plan[i])

        plan[i].position.z = -20;
        plan[i].position.y = 0.5;
        plan[i].position.x= (i * 8)+ (i +2);
            
        //reticle.add_collider(plan[i]);

        scene.add(plan[i]); 
     };


    reticle.add_collider(homecubes[0]);
    homecubes[0].position.x = 30;
    homecubes[0].position.y = 1;
    homecubes[0].position.z = 35;
    scene.add(homecubes[0]);

    reticle.add_collider(homecubes[1]);
    homecubes[1].position.x = -30;
    homecubes[1].position.y = 1;
    homecubes[1].position.z = -35;
    scene.add(homecubes[1]);

    reticle.add_collider(homecubes[2]);
    homecubes[2].position.x = 60;
    homecubes[2].position.y = 1;
    homecubes[2].position.z = 65;
    scene.add(homecubes[2]);

    reticle.add_collider(homecubes[3]);
    homecubes[3].position.x = -60;
    homecubes[3].position.y = 1;
    homecubes[3].position.z = -65;
    scene.add(homecubes[3]);

    reticle.add_collider(homecubes[4]);
    homecubes[4].position.x = 90;
    homecubes[4].position.y = 1;
    homecubes[4].position.z = -95;
    scene.add(homecubes[4]);

    reticle.add_collider(homecubes[5]);
    homecubes[5].position.x = -90;
    homecubes[5].position.y = 1;
    homecubes[5].position.z = 95;
    scene.add(homecubes[5]);



  

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

    particleTexture = THREE.ImageUtils.loadTexture('textures/particle.png'),
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
  particles.visible = false;

    //Funcion que solicita las condiciones climáticas y las actualiza.
   function adjustToWeatherConditions(cityN) {
      var cityIDs = cityN;

      getURL('http://api.openweathermap.org/data/2.5/group?id=' + cityIDs + '&APPID=90dd85c8ff64da0cd1d09fbc8ae06d81', function(info) {
        cityWeather = info.list;

        lookupTimezones();
      });
  }

  function applyWeatherConditions(currentCity) {

      // TODO: Maybe display the city name here

      console.log(currentCity);

      var info = currentCity;
      particleRotationSpeed = info.wind.speed / 2; // dividing by 2 just to slow things down
      particleRotationDeg = info.wind.deg;

      var timeThere = currentCity ? currentCity.getUTCHours() : 0,
          isDay = timeThere >= 6 && timeThere <= 18;

      if (isDay) {
        switch (info.weather[0].main) {
          case 'Clouds':
            currentColorRange = [0, 0.01];  //white
            break;
          case 'Rain':
            currentColorRange = [0.7, 0.1]; //dark blue
            break;
          case 'Clear':
          default:
            currentColorRange = [0.6, 0.7]; //light blue
            break;
        }
      } else {
        currentColorRange = [0.69, 0.6]; //purple
      }

      if (currentCity < 5) currentCity++;
      else currentCity = 0;
      setTimeout(applyWeatherConditions, 5000);
  }

  function animation() {
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

    if(particles.position.y >= -90) {
      particles.position.y -= 0.1;
    } else {
      particles.position.y = 70;
    }

    //requestAnimationFrame(animate); // TODO: This will add the animations to the main loop, if you have it somewhere else just call animate
    // TODO: Add update code if necessary here
  }

  // Get the VRDisplay and save it for later.
  var vrDisplay = null;
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
    }
  });

  // Request animation frame loop function
  var lastRender = 0;
    function animate(timestamp) {
      var delta = Math.min(timestamp - lastRender, 500);
      lastRender = timestamp;

       //making cubes rotation
        for (var j = 0; j < 6; j++) {
            plan[j].rotation.y +=0.002;
        };
       checkKeyStates();
       animation();   
      // Update VR headset position and apply to camera.
      controls.update(ctrlx, ctrly, ctrlz);

      // Render the scene.
      effect.render(scene, camera);

      reticle.reticle_loop();

      // Keep looping.
      requestAnimationFrame(animate);
    }

  ///------------------------------------------------------//

///-----------------------Other functions-------------------///
   function onMouseClick(){
        intersects = calculateIntersects( event );

        if ( intersects.length > 0 ){
            //If object is intersected by mouse pointer, do something
            if (intersects[0].object == sphere){
                alert("This is a sphere!");
            }
        }
    }
    function onMouseDown(){

    }
    function onMouseUp(){

    }
    function onMouseMove(){

    }
    function onMouseOut(){

    }
    function onKeyDown( event ){

        //event = event || window.event;

        keyState[event.keyCode || event.which] = true;

    }

    function onKeyUp( event ){

        //event = event || window.event;

        keyState[event.keyCode || event.which] = false;

    }

    function onKeyZ( event ){

        //event = event || window.event;
        
         keyState[event.keyCode || event.which] = true;
    
    }

    function onKeyX( event ){

        //event = event || window.event;

         keyState[event.keyCode || event.which] = false;

    }

    function onKeyC( event ){

        //event = event || window.event;

         keyState[event.keyCode || event.which] = true;

    }


  function onResize() {
    console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function onVRDisplayPresentChange() {
    console.log('onVRDisplayPresentChange');
    onResize();
  }

  // Kick off animation loop.
  requestAnimationFrame(animate);

  // Resize the WebGL canvas when we resize and also when we change modes.
  window.addEventListener('resize', onResize);
  window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);

  // Button click handlers.
  document.querySelector('button#fullscreen').addEventListener('click', function() {
    enterFullscreen(renderer.domElement);
  });
  document.querySelector('button#vr').addEventListener('click', function() {
    vrDisplay.requestPresent([{source: renderer.domElement}]);
  });
  document.querySelector('button#reset').addEventListener('click', function() {
    vrDisplay.resetPose();
  });

  function enterFullscreen (el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

};

/*coordinates
  London
  lat: 51.509, long: -0.126

  Santo Domingo
  lat: 18.500, long: -69.988

  Tokyo
  lat: 35.689, long: 139.691

  Paris
  lat: 48.856, long: 2.352

  Turquia
  lat: 38.962, long: 35.241
  
  Nueva York
  lat: 40.712, long: -74.005
  */  
  
var WorldTime = function(latitude, longitude) {
  $.ajax({
     url: 'http://api.timezonedb.com/v2/get-time-zone',
            data: {
                key: 'D8RGXM6K480Q',
                format: 'json', 
                by: 'position', 
                lat: latitude, 
                lng: longitude}, 
        success: function(response) {
            d = new Date(response.timestamp * 1000);
           // var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var h = d.getHours() + 4; 
            var m = d. getMinutes();
            var s = d. getSeconds(); 

            if(h >= 24) {h -= 24;}
            nd = h + ':'+ m + ':' + s; 
            console.log("The time is " + nd + ".");
        
        //-----------hours in sky ---------///

                scene.remove(currentCityTextMesh2);

                var textloader = new THREE.FontLoader();

                textloader.load('font/texto.js', function (font){

                currentCityText2 = new THREE.TextGeometry(nd, {
                  size: 2,
                  height: 1,
                  curveSegments: 3,
                  font: font
     
                });
                
              currentCityTextMesh2 = new THREE.Mesh(currentCityText2, new THREE.MeshBasicMaterial({ color: 0xAA3939, opacity: 1}));

                currentCityTextMesh2.position.y = 10;
                currentCityTextMesh2.position.z = -10;
               // currentCityTextMesh2.position.x = -10;
                
                currentCityTextMesh2.rotation.x = 0.1;
                currentCityTextMesh2.rotation.y = 0;

                scene.add(currentCityTextMesh2);
                });

       var ilumination = setSkyIntensity(h);
       lightControl(ilumination, ilumination, ilumination, ilumination, ilumination);

     }
    });
};

var TheWorldWeather = function(latitude, longitude) {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?',
        data: {
          lat:latitude,
          lon:longitude,
          appid:'d447b3f167725172e64ca9096871d7c5'},
        success: function(Response){
          console.log(Response.weather[0].main);
          currentWeather = Response.weather[0].main;
          //
          scene.remove(particles);
          particles = new THREE.Object3D();
          var weatherpallet;
          switch(currentWeather) {
            case 'Snow': weatherpallet = 0xFFFAFA; particles.visible = true; break;  //snow
            case 'Rain': weatherpallet = 0x00FFFF; particles.visible = true; break; //aqua
            case 'Clouds': weatherpallet = 0x6A5ACD; particles.visible = true; break; //slateblue
            case 'Mist': weatherpallet = 0xF5F5F5; particles.visible = true; break; //whitesmoke
            case 'Clear': weatherpallet = 0xF0F8FF; particles.visible = false; break; //aliceblue
            default: weatherpallet = 0xDDA0DD; break; //plum
          }
          particleTexture = new THREE.ImageUtils.loadTexture('textures/particle.png'),
            spriteMaterial = new THREE.SpriteMaterial({
              map: particleTexture,
              color: weatherpallet
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
        }
    });
};

var setSkyIntensity = function(hora) {

    if(hora == 12){
      return 0.3;
    }
    else if(hora == 11 || hora == 13 || hora == 10 || hora == 14){
      return 0.4;
    }
    else if(hora == 9 || hora == 15){
      return 0.5;
    }
    else if(hora == 8 || hora == 16){
      return 0.5
    }
    else if(hora == 7 || hora == 17){
      return 0.7;
    }
    else if(hora ==  6 || hora == 18){
      return 0.9;
    }
    else if(hora == 5 || hora == 19){
      return 1;
    }
    else if(hora == 4 || hora == 20){
      return 1.1;
    }
    else if(hora == 21 || hora == 22 || hora == 23 || hora == 0 || hora == 1 || hora == 2 || hora == 3){
      return 0;
    }
    else{
      return 1;
    }

};

var guiChanged = function(effectController, distance) {

//  if(d<nd){
    var uniforms = sky.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.reileigh.value = effectController.reileigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sunSphere.visible = effectController.sun;
    sky.uniforms.sunPosition.value.copy( sunSphere.position );
    renderer.render( scene, camera );
  // }
  // else{
  //       var uniforms = sky.uniforms;
  //       uniforms.turbidity.value = 1;
  //       uniforms.reileigh.value = 0;
  //       uniforms.luminance.value = 1;
  //       uniforms.mieCoefficient.value = 0.1;
  //       uniforms.mieDirectionalG.value = 0;
  //       var theta = Math.PI * ( effectController.inclination - 0.5 );
  //       var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
  //       sunSphere.position.x = distance * Math.cos( phi );
  //       sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
  //       sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
  //       sunSphere.visible = effectController.sun;
  //       sky.uniforms.sunPosition.value.copy( sunSphere.position );
  // }

   // renderer.render( scene, camera );

};

var lightControl = function(_turbidity, _reileigh, _mieCoefficient, _mieDirectionalG, _luminance) {
    var effectController  = {
              turbidity: _turbidity,
              reileigh: _reileigh,
              mieCoefficient: _mieCoefficient,
              mieDirectionalG: _mieDirectionalG,
              luminance: _luminance,
              inclination: 0.49, // elevation / inclination
              azimuth: 0.25, // Facing front,
              sun:  true
          };
    guiChanged(effectController, 400000);
};

function displayCurrentCityName(name) {  // code snippet sacado del siguiente tutorial https://www.sitepoint.com/bringing-vr-to-web-google-cardboard-three-js/
        scene.remove(currentCityTextMesh);

        var textloader = new THREE.FontLoader();

        textloader.load('font/texto.js', function (font){

        currentCityText = new THREE.TextGeometry(name, {
          size: 4,
          height: 1,
          curveSegments: 3,
          font: font
          // weight: 'normal',
          // bevelThickness: 3,
          // bevelSize: 3,
          // bevelEnabled: true
        });
        
      currentCityTextMesh = new THREE.Mesh(currentCityText, new THREE.MeshBasicMaterial({ color: 0xAA3939, opacity: 1}));

        currentCityTextMesh.position.y = 4;
        currentCityTextMesh.position.z = -10;
       // currentCityTextMesh.position.x = -10;
        
        currentCityTextMesh.rotation.x = 0;
        currentCityTextMesh.rotation.y = 0;

        scene.add(currentCityTextMesh);
        });     
      }


 function calculateIntersects( event ){

        //Determine objects intersected by raycaster
        event.preventDefault();

        var vector = new THREE.Vector3();
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        vector.unproject( camera );

        raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objects );

        return intersects;
    }



//function for colition 
 var colition = function(){
     var c = Math.random()*0xffffff;
  //  console.log("cOLOR: " + c);
    var materialcolor = new THREE.Color(c);

   // for (var i = 0; i < plan.length; i++) {
        if ( plan.position.x === player.position.x) {
            
            plan = new THREE.Color(c);
        };
        
   // };
 
}

var createPlayer = function(data){

    playerData = data;

//Asignando el Color a los
    var c = Math.random()*0xffffff;
  //  console.log("cOLOR: " + c);
    var materialcolor = new THREE.Color(c);


    var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    var cube_material = new THREE.MeshBasicMaterial({color: materialcolor.getHex(), wireframe: false});
    player = new THREE.Mesh(cube_geometry, cube_material);

    player.rotation.set(0,0,0);

    player.position.x = data.x;
    player.position.y = data.y;
    player.position.z = data.z;

    playerId = data.playerId;
    moveSpeed = data.speed;
    turnSpeed = data.turnSpeed;

    ctrlx = player.position.x;
    ctrly = player.position.y + 5;
    ctrlz = player.position.z;

    updateCameraPosition();

    objects.push( player );
    scene.add( player );

    camera.lookAt( player.position )


};

var updateCameraPosition = function(){

    camera.position.x = player.position.x + 6 * Math.sin( player.rotation.y );
    camera.position.y = player.position.y + 6;
    camera.position.z = player.position.z + 6 * Math.cos( player.rotation.y );

};

var updatePlayerPosition = function(data){

    var somePlayer = playerForId(data.playerId);

    somePlayer.position.x = data.x;
    somePlayer.position.y = data.y;
    somePlayer.position.z = data.z;

    somePlayer.rotation.x = data.r_x;
    somePlayer.rotation.y = data.r_y;
    somePlayer.rotation.z = data.r_z;

};

var updatePlayerData = function(){
    playerData.x = player.position.x;
    playerData.y = player.position.y;
    playerData.z = player.position.z;

    playerData.r_x = player.rotation.x;
    playerData.r_y = player.rotation.y;
    playerData.r_z = player.rotation.z;

    ctrlx = player.position.x;
    ctrly = player.position.y + 5;
    ctrlz = player.position.z;

};

var checkKeyStates = function(){

    if (keyState[38] || keyState[87]) {
        // up arrow or 'w' - move forward
        player.position.x -= moveSpeed * Math.sin(player.rotation.y);
        player.position.z -= moveSpeed * Math.cos(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[40] || keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += moveSpeed * Math.sin(player.rotation.y);
        player.position.z += moveSpeed * Math.cos(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[37] || keyState[65]) {
        // left arrow or 'a' - rotate left
        player.rotation.y += turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[39] || keyState[68]) {
        // right arrow or 'd' - rotate right
        player.rotation.y -= turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[81]) {
        // 'q' - strafe left
        player.position.x -= moveSpeed * Math.cos(player.rotation.y);
        player.position.z += moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[69]) {
        // 'e' - strage right
        player.position.x += moveSpeed * Math.cos(player.rotation.y);
        player.position.z -= moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }

    //camera move
    if(keyState[90]){//z
        camera.position.x *= 2; 
    }
    if(keyState[88]){//x
        camera.position.y *= 2; 
    }
    if(keyState[67]){//c
        camera.position.z *= 2; 
    }

};

var addOtherPlayer = function(data){
    var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    var cube_material = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false});
    var otherPlayer = new THREE.Mesh(cube_geometry, cube_material);

    otherPlayer.position.x = data.x;
    otherPlayer.position.y = data.y;
    otherPlayer.position.z = data.z;

    otherPlayersId.push( data.playerId );
    otherPlayers.push( otherPlayer );
    objects.push( otherPlayer );
    scene.add( otherPlayer );

};

var removeOtherPlayer = function(data){

    scene.remove( playerForId(data.playerId) );

};

var playerForId = function(id){
    var index;
    for (var i = 0; i < otherPlayersId.length; i++){
        if (otherPlayersId[i] == id){
            index = i;
            break;
        }
    }
    return otherPlayers[index];
};
