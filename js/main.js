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
	BLACK_X[i]=Math.sin(BLACK_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	BLACK_Y[i]=BOARD_THICKNESS/2+COIN_HEIGHT;
	BLACK_Z[i]=Math.cos(BLACK_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	black_sphere.position.set(BLACK_X[i],BLACK_Y[i],BLACK_Z[i]);
	scene.add(black_sphere);
}
for(var i=0;i<WHITE_COINS_NO;i++){
	var white_sphere=new THREE.Mesh(coin_geometry,white_sphere_material);
	WHITE_X[i]=Math.sin(WHITE_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	WHITE_Y[i]=BOARD_THICKNESS/2+COIN_HEIGHT;
	WHITE_Z[i]=Math.cos(WHITE_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	white_sphere.position.set(WHITE_X[i],WHITE_Y[i],WHITE_Z[i]);
	scene.add(white_sphere);
}

//Striker
var striker_geometry=new THREE.CylinderGeometry(STRIKER_RADIUS,STRIKER_RADIUS,STRIKER_HEIGHT,CIRCLE_SEGMENTS);
var striker_material=new THREE.MeshBasicMaterial( {color: 0x0000ff} );
var striker_mesh=new THREE.Mesh(striker_geometry, striker_material);
var striker=new THREE.Object3D();
striker.add(striker_mesh);
var translation_matrix = new THREE.Matrix4();
translation_matrix.makeTranslation(STRIKER_X,STRIKER_Y,STRIKER_Z);
striker.applyMatrix(translation_matrix);

//Arrow
var dir=new THREE.Vector3(ARROW_X,ARROW_Y,ARROW_Z);
var origin=new THREE.Vector3(STRIKER_X,STRIKER_Y,STRIKER_Z);
var length=50;
var hex=0x000000;
var arrowHelper=new THREE.ArrowHelper(dir,origin,length,hex);
scene.add(arrowHelper);

//Power Bar
var bar_geometry=new THREE.BoxGeometry( BAR_HEIGHT, BAR_THICKNESS, BAR_WIDTH );
var bar_texture=new THREE.ImageUtils.loadTexture(BAR_PATH); 
var bar_material=new THREE.MeshBasicMaterial( { map:bar_texture,side:THREE.DoubleSide } );
var bar = new THREE.Mesh( bar_geometry, bar_material );
bar.position.set(BAR_X, BAR_Y, BAR_Z);  
scene.add(bar);

//Cursor
var cursor_geometry=new THREE.BoxGeometry( CURSOR_HEIGHT, CURSOR_THICKNESS, CURSOR_WIDTH );
var cursor_texture=new THREE.ImageUtils.loadTexture(CURSOR_PATH); 
var cursor_material=new THREE.MeshBasicMaterial( { map:cursor_texture,side:THREE.DoubleSide } );
var cursor = new THREE.Mesh( cursor_geometry, cursor_material );

//Updating
function updateStriker(){
	switch(STRIKER_DIRECTION){
		case("L"):
			STRIKER_Z=Math.min(STRIKER_Z+2,INNER_RECTANGLE_MAXZ);
			break;
		case("R"):
			STRIKER_Z=Math.max(STRIKER_Z-2,INNER_RECTANGLE_MINZ);
			break;
	}
	if(STRIKER_MOV==1){
		var STRIKER_VELOCITYX=STRIKER_VELOCITY*Math.cos(STRIKER_ANGLE);
		var STRIKER_VELOCITYZ=STRIKER_VELOCITY*Math.sin(STRIKER_ANGLE);
		if(STRIKER_X>STRIKER_MAXX || STRIKER_X<STRIKER_MINX){
			STRIKER_VELOCITYX_F*=-1;
		}
		if(STRIKER_Z>STRIKER_MAXZ || STRIKER_Z<STRIKER_MINZ){
			STRIKER_VELOCITYZ_F*=-1;
		}
		STRIKER_VELOCITYX*=STRIKER_VELOCITYX_F
		STRIKER_VELOCITYZ*=STRIKER_VELOCITYZ_F
		STRIKER_X-=STRIKER_VELOCITYX;
		STRIKER_Z+=STRIKER_VELOCITYZ;
		STRIKER_VELOCITY=Math.max(STRIKER_VELOCITY-FRICTION,0);
		if(STRIKER_VELOCITY==0){
			striker_init();
		}
	}
	striker.position.set(STRIKER_X,STRIKER_Y,STRIKER_Z);
	scene.add(striker);
}
function updateArrow(){
	switch(ARROW_DIRECTION){
		case("L"):
			var a=new THREE.Euler(0,ARROW_ROTATION_ANGLE,0, 'XYZ' );
			var b=new THREE.Vector3(ARROW_X,ARROW_Y,ARROW_Z); 
			b.applyEuler(a);
			ARROW_X=b.x;
			ARROW_Z=b.z;
			STRIKER_ANGLE+=ARROW_ROTATION_ANGLE;
			break;
		case("R"):
			var a=new THREE.Euler(0,-ARROW_ROTATION_ANGLE,0, 'XYZ' );
			var b=new THREE.Vector3(ARROW_X,ARROW_Y,ARROW_Z); 
			b.applyEuler(a);
			ARROW_X=b.x;
			ARROW_Z=b.z;
			STRIKER_ANGLE-=ARROW_ROTATION_ANGLE;
			break;
	}
	scene.remove(arrowHelper);
	dir=new THREE.Vector3(ARROW_X,ARROW_Y,ARROW_Z);
	origin=new THREE.Vector3(STRIKER_X,STRIKER_Y,STRIKER_Z);
	length=50;
	hex=0x000000;
	arrowHelper=new THREE.ArrowHelper(dir,origin,length,hex);
	if(DIRECTION_SET==1)
		scene.add(arrowHelper);
}
function updateCursor(){
	cursor.position.set(CURSOR_X, CURSOR_Y, CURSOR_Z);  
	scene.add(cursor);
}

var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	document.addEventListener("keydown",keyDownHandler, false);	
	document.addEventListener("keyup",keyUpHandler, false);	
	document.addEventListener("mousemove",mouseHandler, false);	
	if(POWER_SET==1){
		CURSOR_XDIFF=(CURSOR_XDIFF+2)%CURSOR_MAXX;
		CURSOR_X=CURSOR_MINX-CURSOR_XDIFF;
	}
	updateStriker();
	updateArrow();
	updateCursor();
};

//Movements.
function keyDownHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);
	if(STRIKER_SET==1){
		switch (keyPressed){
			case "A":
				STRIKER_DIRECTION="L";
				break;
			case "D":
				STRIKER_DIRECTION="R";
				break;
		}
	}
	if(DIRECTION_SET==1){
		switch (keyPressed){
			case "A":
				ARROW_DIRECTION="L";
				break;
			case "D":
				ARROW_DIRECTION="R";
				break;
		}
	}
	if(event.keyCode==13 && POWER_SET==1){
		POWER_SET=0;
		STRIKER_VELOCITY=5*CURSOR_XDIFF/CURSOR_MAXX;
		STRIKER_MOV=1;
	}	
	if(event.keyCode==13 && DIRECTION_SET==1){
		DIRECTION_SET=0;
		DIRECTION_DIRECTION="N";
		POWER_SET=1;
	}
	if(event.keyCode==13 && STRIKER_SET==1){
		STRIKER_SET=0;
		STRIKER_DIRECTION="N";
		DIRECTION_SET=1;
	}
}
function keyUpHandler(event){
	STRIKER_DIRECTION="N";
	ARROW_DIRECTION="N";
}
function mouseHandler(event) {
	MOUSE_X=event.clientX;
	MOUSE_X=event.clientY;
}

//Rendering
camera.position.set(CAMERA_X,CAMERA_Y,CAMERA_Z);
camera.lookAt(new THREE.Vector3(0,0,0));
render();