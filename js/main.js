//Initializing the scene.
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(FOV, window.innerWidth/window.innerHeight, NEAR, FAR);
var renderer=new THREE.WebGLRenderer({alpha: true });
renderer.setClearColor( BACKGROUND, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Carrom Board
var board_geometry=new THREE.BoxGeometry( BOARD_HEIGHT, BOARD_THICKNESS, BOARD_WIDTH );
var board_texture=new THREE.ImageUtils.loadTexture(BOARD_PATH); 
var board_material=new THREE.MeshBasicMaterial( { map:board_texture,side:THREE.DoubleSide } );
var board = new THREE.Mesh( board_geometry, board_material );
board.position.set(BOARD_X, BOARD_Y, BOARD_Z); 
scene.add(board);

//Pockets
var pocket_geometry=new THREE.CylinderGeometry(POCKET_RADIUS,POCKET_RADIUS,0.0,CIRCLE_SEGMENTS);
var pocket_material=new THREE.MeshBasicMaterial( {color: 0x808080} );
for(var i=0;i<POCKET_NO;i++){
	var pocket=new THREE.Mesh(pocket_geometry, pocket_material);
	pocket.position.set(POCKET_X[i],POCKET_Y[i],POCKET_Z[i]);
	scene.add(pocket);
}

//Inner Circle
var inner_circle_geometry=new THREE.CylinderGeometry(INNER_CIRCLE_RADIUS,INNER_CIRCLE_RADIUS,0.0,CIRCLE_SEGMENTS);
var inner_circle_material=new THREE.MeshBasicMaterial( {color: 0xD99857} );
var inner_circle=new THREE.Mesh(inner_circle_geometry, inner_circle_material);
inner_circle.position.set(INNER_CIRCLE_X,INNER_CIRCLE_Y,INNER_CIRCLE_Z);
scene.add(inner_circle);

//Playing Rectangle
var inner_rectangle_geometry=new THREE.BoxGeometry( INNER_RECTANGLE_HEIGHT, INNER_RECTANGLE_THICKNESS, INNER_RECTANGLE_WIDTH );
var inner_rectangle_material=new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.0} );
var inner_rectangle=new THREE.Mesh( inner_rectangle_geometry, inner_rectangle_material );
inner_rectangle.position.set(INNER_RECTANGLE_X, INNER_RECTANGLE_Y, INNER_RECTANGLE_Z); 
var edges = new THREE.EdgesHelper(inner_rectangle, 0x000000 );
scene.add(inner_rectangle);
scene.add(edges);

//Edge Circle
var edge_circle_geometry=new THREE.CylinderGeometry(EDGE_CIRCLE_RADIUS,EDGE_CIRCLE_RADIUS,0.0,CIRCLE_SEGMENTS);
var edge_circle_material=new THREE.MeshBasicMaterial({color: 0xff6a80});
for(var i=0;i<EDGE_CIRCLES_NO;i++){
	var edge_circle=new THREE.Mesh(edge_circle_geometry,edge_circle_material);
	edge_circle.position.set(EDGE_CIRCLE_X[i],EDGE_CIRCLE_Y[i],EDGE_CIRCLE_Z[i]);
	scene.add(edge_circle);
}


//Coins
var coin_geometry=new THREE.CylinderGeometry(COIN_RADIUS,COIN_RADIUS,COIN_HEIGHT,CIRCLE_SEGMENTS);
var coin_material=new THREE.MeshBasicMaterial( {color: 0xff0000} );
var coin=new THREE.Mesh(coin_geometry, coin_material);
coin.position.set(RED_X,RED_Y,RED_Z);
scene.add(coin);

var black_sphere_material=new THREE.MeshBasicMaterial({color: 0x000000});
var white_sphere_material=new THREE.MeshBasicMaterial({color: 0xffffff});
for(var i=0;i<BLACK_COINS_NO;i++){
	var black_sphere=new THREE.Mesh(coin_geometry,black_sphere_material);
	black_sphere.position.set(BLACK_X[i],BLACK_Y[i],BLACK_Z[i]);
	scene.add(black_sphere);
}
for(var i=0;i<WHITE_COINS_NO;i++){
	var white_sphere=new THREE.Mesh(coin_geometry,white_sphere_material);
	white_sphere.position.set(WHITE_X[i],WHITE_Y[i],WHITE_Z[i]);
	scene.add(white_sphere);
}

//Rendering
camera.position.set(CAMERA_X,CAMERA_Y,CAMERA_Z);
camera.lookAt(new THREE.Vector3(0,0,0));

var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

render();