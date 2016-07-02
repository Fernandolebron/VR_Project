var container, scene, camera, renderer, raycaster, objects = [];
var keyState = {};
var sphere;
var sky;
var d, nd;
var player, playerId, moveSpeed, turnSpeed;
var playerData;

var otherPlayers = [], otherPlayersId = [];
var plan = [], planid = [];

var loadWorld = function(){

// Apply VR headset positional data to camera.
var controls ;
var effect;
 
    function LondonTime(){

        var url = "https://maps.googleapis.com/maps/api/timezone/json?location=51.509,-0.126&timestamp=" + (Math.round((new Date().getTime()) / 1000)).toString() + "&sensor=false";
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

    LondonTime();

    init();
    animate();
    
    //create gaze interaction manager
    var reticle = vreticle.Reticle(camera);
    scene.add(camera);
    
    var cube = new THREE.Mesh(geometry, material);

    cube.ongazelong = function(){
        this.material = reticle.get_random_hex_material();
    }

    cube.ongazeover = function(){
        this.material = reticle.get_random_hex_material();
    }

    cube.ongazeout = function(){
        this.material = reticle.default_material();
    }

    reticle.add_collider(cube);

    reticle.reticle_loop();

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

        if(d < nd){
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
      }
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

      }
      renderer.render( scene, camera );
  }
      //var gui = new dat.GUI();

      guiChanged();
    }

    function planes(x,y,z){
        var geo = new THREE.CubeGeometry(2,2,2);
        var mat = [
            new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/SDQ.jpg')})
        ];
        var planx = new THREE.Mesh( geo, new THREE.MeshBasicMaterial);
        
        planx.position.x= x;
        planx.position.y = y;
        planx.position.z =-z;

        plan.push(planx);
        planid.push(planx);
        

        scene.add(planx); 
    }

    

    function init(){

        //Setup------------------------------------------
        container = document.getElementById('container');
            

        renderer = new THREE.WebGLRenderer( { alpha: true} );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 20000000);
        camera.position.set( 0, 100, 2000 );
        camera.lookAt( new THREE.Vector3(0,0,0));

        // Apply VR headset positional data to camera.
        controls = new THREE.VRControls(camera); 

        // // // Apply VR stereo rendering to renderer.
        effect = new THREE.VREffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);

        raycaster = new THREE.Raycaster();
        //Add Objects To the Scene HERE-------------------

        //Cubes position in the plane
        planes(5,0,15);
        planes(-5,0,25);
        planes(8,0,10);
        planes(10,0,30);
        planes(-8,0,22);
        planes(-12,0,8);
        

        //Sphere------------------
        var sphere_geometry = new THREE.SphereGeometry(1);
        var sphere_material = new THREE.MeshNormalMaterial();
        sphere = new THREE.Mesh( sphere_geometry, sphere_material );

        scene.add( sphere );
        objects.push( sphere ); //if you are interested in detecting an intersection with this sphere
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
        //controls.maxPolarAngle = Math.PI / 2;
        controls.enableZoom = false;
        controls.enablePan = false;

        
        initSky();


        var plane_geometry = new THREE.BoxGeometry( 400,400 );
        var plane_material = new THREE.MeshBasicMaterial( {color: 0xAA3939, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( plane_geometry, plane_material );
        plane.rotation.set(-Math.PI/2, Math.PI/2000, Math.PI);
        plane.position.y= -2;
        scene.add( plane );

        //window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
        window.addEventListener( 'resize', onWindowResize, false );
        //Events------------------------------------------
       
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
        document.body.appendChild( renderer.domElement  );  

       
        //Final touches-----------------------------------
        //container.appendChild( );

    }
// Request animation frame loop function

function animate() {
        requestAnimationFrame( animate );

        render();

         // Update VR headset position and apply to camera.
        controls.update();
        // Render the scene.
        effect.render(scene, camera);

        
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

    function render(){

        if ( player ){

            updateCameraPosition();

            checkKeyStates();

            camera.lookAt( player.position );

        }
        //Render Scene---------------------------------------
        //making cubes rotation
        for (var i = 0; i < plan.length; i++) {
            plan[i].rotation.y +=0.02;
        };
        

       

        renderer.clear();
        renderer.render( scene , camera );

              
    }

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

};

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
