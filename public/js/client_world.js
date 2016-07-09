//Declaración de Variables
var container, raycaster, objects = [];
var keyState = {};
var d, nd;
var player, playerId, moveSpeed, turnSpeed;
var playerData;
var sky, scene, renderer, camera, effect, sphere, reticle;
var otherPlayers = [], otherPlayersId = [];
var plan=[];
// Apply VR headset positional data to camera.
var time = new Date();
var time2= 0; 
var currentCityTextMesh; 

var loadWorld = function(){

      // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
    // Only enable it if you actually need to.
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(renderer.domElement);

    // Create a three.js scene.
    scene = new THREE.Scene();

    // Create a three.js camera.
    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 20000000);
    camera.position.set( 5, 200, 2000 );
    camera.lookAt( new THREE.Vector3(0,0,0));
    // Apply VR headset positional data to camera.
    controls = new THREE.VRControls(camera);

    // Apply VR stereo rendering to renderer.
    effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    reticle = vreticle.Reticle(camera);
    scene.add(camera);
      
    currentCityTextMesh = new THREE.Mesh(currentCityText, new THREE.MeshBasicMaterial({
      color: 0xffffff, opacity: 1
    })); 

       initSky();

    ///------------Añadiendo el piso--------------///
        var plane_geometry = new THREE.BoxGeometry( 400,400 );
        var plane_material = new THREE.MeshBasicMaterial( {color: 0xAA3939, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( plane_geometry, plane_material );
        plane.rotation.set(-Math.PI/2, Math.PI/2000, Math.PI);
        plane.position.y= -2;
        scene.add( plane );

        
    ///-------------------------------------------///

    ///-------------------------------------------///
    
    ///-----------Añadiendo Paises ---------------///
       //Cubes position in the plane
        
        var geo = new THREE.CubeGeometry(4,4,4,4,4,4);
        var mat = new THREE.MeshNormalMaterial();
        var load = new THREE.TextureLoader();

        var Mat1 = [];
        var Mat2 = [];
        var Mat3 = [];
        var Mat4 = [];
        var Mat5 = [];
        var Mat6 = [];

        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris.png')} ));
        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/londres.png')} ));
        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris2.png')} ));
        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris45.jpg')} ));
        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/paris/paris6.jpg')} ));
        Mat1.push(new THREE.MeshBasicMaterial( { map: load.load('images/Paris/paris3.jpg')} ));

        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/1.jpg')} ));
        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/2.jpg')} ));
        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/jp.png')} ));
        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/3.jpg')} ));
        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/4.jpg')} ));
        Mat2.push(new THREE.MeshBasicMaterial( { map: load.load('images/tokio/5.jpg')} ));

        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/1.jpg')} ));
        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/2.jpg')} ));
        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/turquia.png')} ));
        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/3.jpg')} ));
        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/4.jpg')} ));
        Mat3.push(new THREE.MeshBasicMaterial( { map: load.load('images/turquia/5.jpg')} ));
         
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/1.jpg')} ));
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/2.jpg')} ));
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/3.jpg')} ));
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/4.jpg')} ));
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/5.jpg')} ));
        Mat4.push(new THREE.MeshBasicMaterial( { map: load.load('images/Dominicana/6.jpg')} ));

        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/1.jpg')} ));
        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/2.jpg')} ));
        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/3.jpg')} ));
        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/4.jpg')} ));
        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/5.jpg')} ));
        Mat5.push(new THREE.MeshBasicMaterial( { map: load.load('images/ny/6.jpg')} ));

        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/3.jpg')} ));
        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/2.jpg')} ));
        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/1.jpg')} ));
        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/4.jpg')} ));
        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/5.jpg')} ));
        Mat6.push(new THREE.MeshBasicMaterial( { map: load.load('images/argentina/6.jpg')} ));
         
        plan[0] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat1));
        plan[1] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat2));
        plan[2] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat3));
        plan[3] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat4));
        plan[4] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat5));
        plan[5] = new THREE.Mesh(geo,new THREE.MeshFaceMaterial(Mat6));

      

        //create gaze interaction manager
         //var reticle = vreticle.Reticle(camera);
         
         
         plan[0].ongazelong = function(){
            socket.emit('lookat', 'Paris');
            var names = 'paris';
            displayCurrentCityName(names);
             //this.material = reticle.get_random_hex_material();
         }

         plan[0].ongazeover = function(){
             socket.emit('lookat', 'Paris');
             //this.material = reticle.get_random_hex_material();
         }

         plan[0].ongazeout = function(){
            socket.emit('lookat', 'Paris');
            // this.material = reticle.default_material();
         }

          plan[1].ongazelong = function(){
            socket.emit('lookat', 'Tokio');
             //this.material = reticle.get_random_hex_material();
         }

         plan[1].ongazeover = function(){
             socket.emit('lookat', 'Tokio');
             //this.material = reticle.get_random_hex_material();
         }

         plan[1].ongazeout = function(){
            socket.emit('lookat', 'Tokio');
            // this.material = reticle.default_material();
         }

         plan[2].ongazelong = function(){
            socket.emit('lookat', 'Turquia');
             //this.material = reticle.get_random_hex_material();
         }

         plan[2].ongazeover = function(){
             socket.emit('lookat', 'Turquia');
             //this.material = reticle.get_random_hex_material();
         }

         plan[2].ongazeout = function(){
            socket.emit('lookat', 'Turquia');
            // this.material = reticle.default_material();
         }

          plan[3].ongazelong = function(){
            socket.emit('lookat', 'Republica Dominicana');
             //this.material = reticle.get_random_hex_material();
         }

         plan[3].ongazeover = function(){
             socket.emit('lookat', 'Republica Dominicana');
             //this.material = reticle.get_random_hex_material();
         }

         plan[3].ongazeout = function(){
            socket.emit('lookat', 'Republica Dominicana');
            // this.material = reticle.default_material();
         }

          plan[4].ongazelong = function(){
            socket.emit('lookat', 'New York');
             //this.material = reticle.get_random_hex_material();
         }

         plan[4].ongazeover = function(){
             socket.emit('lookat', 'New York');
             //this.material = reticle.get_random_hex_material();
         }

         plan[4].ongazeout = function(){
            socket.emit('lookat', 'New York');
            // this.material = reticle.default_material();
         }

          plan[5].ongazelong = function(){
            socket.emit('lookat', 'Argentina');
             //this.material = reticle.get_random_hex_material();
         }

         plan[5].ongazeover = function(){
             socket.emit('lookat', 'Argentina');
             //this.material = reticle.get_random_hex_material();
         }

         plan[5].ongazeout = function(){
            socket.emit('lookat', 'Argentina');
            // this.material = reticle.default_material();
         }

         // var planx = new THREE.Mesh( geo, new THREE.MeshBasicMaterial);
        for (var i = 0; i < 6; i++) {

          reticle.add_collider(plan[i])

            plan[i].position.z = -20;
            plan[i].position.y = 0.5;
            plan[i].position.x= (i * 8)+ (i +2);
            
            //reticle.add_collider(plan[i]);

            scene.add(plan[i]); 
        };

         //reticle.reticle_loop();

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

      // Update VR headset position and apply to camera.
      controls.update();

      // Render the scene.
      effect.render(scene, camera);

      reticle.reticle_loop();

      // Keep looping.
      requestAnimationFrame(animate);
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

    //---------------------More Documents---------------------//
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
        //document.body.appendChild( renderer.domElement  ); 
    //-------------------------------------------------------//

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


 ///-------------------Añadiendo sol-------------------------//
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

  function TheWorldTime(latitude, longitude){

        var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+latitude+","+longitude+"&timestamp=" + (Math.round((new Date().getTime()) / 1000)).toString() + "&sensor=false";
        $.ajax({
            url: url,
        }).done(function(response) {
            d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            nd = new Date(utc + (1000*response.rawOffset));
            alert("The time in London is " + nd.toLocaleString() +
        ".");
        });
    }

///------------------------------------------------//
//------Funcion para escribir texto en la scena-----//
 function displayCurrentCityName(name) {
    scene.remove(currentCityTextMesh);
    currentCityText = new THREE.TextGeometry(name, {
      size: 4,
      height: 1
      
    currentCityTextMesh.position.y = 0.5;
    currentCityTextMesh.position.z = -20;
    currentCityTextMesh.position.x = -10;
    currentCityTextMesh.rotation.x = 0;
    currentCityTextMesh.rotation.y = -180;
    scene.add(currentCityTextMesh);
    });
   
    
}




 ///-----------------------------------------------------//



    ///-----------------Añadiendo SKY-----------------------//
      function initSky() {
      // Add Sky Mesh
       sky = new THREE.Sky();
       scene.add( sky.mesh );

      TheWorldTime(51.509, -0.126);

      // Add Sun Helper
      sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
      );

      sunSphere.position.y = - 700000;
      sunSphere.visible = false;
      //scene.add( sunSphere );

      /// GUI
      var effectController  = {
        turbidity: 10,
        reileigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: ! true
      };

      var distance = 400000;
      function guiChanged() {

        //if(d < nd){
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
      /*}
      else{
        var uniforms = sky.uniforms;
        uniforms.turbidity.value = 1;
        uniforms.reileigh.value = 0;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.1;
        uniforms.mieDirectionalG.value = 0;
        var theta = Math.PI * ( effectController.inclination - 0.5 );
        var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
        sunSphere.position.x = distance * Math.cos( phi );
        sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
        sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
        sunSphere.visible = effectController.sun;
        sky.uniforms.sunPosition.value.copy( sunSphere.position );

      }*/
      renderer.render( scene, camera );
  }
      //var gui = new dat.GUI();

      guiChanged();
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

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

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


///----------------------------------------------------------///


//function that creates player
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

    updateCameraPosition();

    objects.push( player );
    scene.add( player );

    camera.lookAt( player.position );
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
        camera.position.y *= -2; 
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
