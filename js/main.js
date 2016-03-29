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
	BLACK_SPHERE.push(black_sphere);
}
for(var i=0;i<WHITE_COINS_NO;i++){
	var white_sphere=new THREE.Mesh(coin_geometry,white_sphere_material);
	WHITE_X[i]=Math.sin(WHITE_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	WHITE_Y[i]=BOARD_THICKNESS/2+COIN_HEIGHT;
	WHITE_Z[i]=Math.cos(WHITE_ANGLE[i])*INNER_CIRCLE1_RADIUS;
	white_sphere.position.set(WHITE_X[i],WHITE_Y[i],WHITE_Z[i]);
	scene.add(white_sphere);
	WHITE_SPHERE.push(white_sphere);
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
			add_newarrow();
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
function coin_coin(flag_1,i,flag_2,j){
	if(flag_1==1){
		x1=BLACK_X[i];
		xv1=BLACK_VELOCITYX[i];
		z1=BLACK_Z[i];
		zv1=BLACK_VELOCITYZ[i];
	}
	else{
		x1=WHITE_X[i];
		xv1=WHITE_VELOCITYX[i];
		z1=WHITE_Z[i];
		zv1=WHITE_VELOCITYZ[i];
	}
	if(flag_2==1){
		x2=BLACK_X[j];
		xv2=BLACK_VELOCITYX[j];
		z2=BLACK_Z[j];
		zv2=BLACK_VELOCITYZ[j];
	}
	else{
		x2=WHITE_X[j];
		xv2=WHITE_VELOCITYX[j];
		z2=WHITE_Z[j];
		zv2=WHITE_VELOCITYZ[j];
	}
	if(Math.sqrt(Math.pow((x1-x2),2)+Math.pow((z1-z2),2))<(COIN_RADIUS+COIN_RADIUS)){
		var diffZ=Math.abs(z1-z2);
		var diffX=Math.abs(x1-x2);
		var alpha=Math.atan(diffZ/diffX);
		var velSA = xv1*Math.cos(alpha) + zv1*Math.sin(alpha);	
		var velSP = zv1*Math.cos(alpha) - xv1*Math.sin(alpha);
		var velCA = xv2*Math.cos(alpha) + zv2*Math.sin(alpha); 
		var velCP = zv2*Math.cos(alpha) - xv2*Math.sin(alpha);

		var temp = (1- COEFFICIENT_RES)*velCA + (1+COEFFICIENT_RES)*velSA;
		velSA = ((1-COEFFICIENT_RES)*velSA + (1+COEFFICIENT_RES)*velCA)/2 , velCA = temp/2;

		xv1=velSA*Math.cos(alpha)-velSP*Math.sin(alpha),zv1=velSP*Math.cos(alpha)+velSA*Math.sin(alpha);
		xv2 = velCA*Math.cos(alpha) - velCP*Math.sin(alpha);
		zv2 = velCP*Math.cos(alpha) + velCA*Math.sin(alpha);
	}	
	if(flag_1==1){
		BLACK_VELOCITYX[i]=xv1;
		BLACK_VELOCITYZ[i]=zv1;
	}
	else{
		WHITE_VELOCITYX[i]=xv1;
		WHITE_VELOCITYZ[i]=zv1;
	}
	if(flag_2==1){
		BLACK_VELOCITYX[j]=xv2;
		BLACK_VELOCITYZ[j]=zv2;
	}
	else{
		WHITE_VELOCITYX[j]=xv2;
		WHITE_VELOCITYZ[j]=zv2;
	}
}
function updateCollisions(){
	for(var j=0;j<4;j++){
		if(Math.sqrt(Math.pow((POCKET_X[j]-STRIKER_X),2)+Math.pow((POCKET_Z[j]-STRIKER_Z),2))<(POCKET_RADIUS+STRIKER_RADIUS)){
			SCORE-=20;
			striker_init();
		}
	}
	for(var i=0;i<BLACK_COINS_NO;i++){
		if(Math.sqrt(Math.pow((STRIKER_X-BLACK_X[i]),2)+Math.pow((STRIKER_Z-BLACK_Z[i]),2))<(STRIKER_RADIUS+COIN_RADIUS)){
			var diffZ=Math.abs(STRIKER_Z-BLACK_Z[i]);
			var diffX=Math.abs(STRIKER_X-BLACK_X[i]);
			var alpha=Math.atan(diffZ/diffX);
			var velSA = STRIKER_VELOCITYX*Math.cos(alpha) + STRIKER_VELOCITYZ*Math.sin(alpha);	
			var velSP = STRIKER_VELOCITYZ*Math.cos(alpha) - STRIKER_VELOCITYX*Math.sin(alpha);
			var velCA = BLACK_VELOCITYX[i]*Math.cos(alpha) + BLACK_VELOCITYZ[i]*Math.sin(alpha); 
			var velCP = BLACK_VELOCITYZ[i]*Math.cos(alpha) - BLACK_VELOCITYX[i]*Math.sin(alpha);

			var temp = (1- COEFFICIENT_RES)*velCA + (1+COEFFICIENT_RES)*velSA; // switch S with C and visa versa
			velSA = ((1-COEFFICIENT_RES)*velSA + (1+COEFFICIENT_RES)*velCA)/2 , velCA = temp/2; // and these

			STRIKER_VELOCITYX=velSA*Math.cos(alpha)-velSP*Math.sin(alpha),STRIKER_VELOCITYZ=velSP*Math.cos(alpha)+velSA*Math.sin(alpha);
			BLACK_VELOCITYX[i] = velCA*Math.cos(alpha) - velCP*Math.sin(alpha);
			BLACK_VELOCITYZ[i] = velCP*Math.cos(alpha) + velCA*Math.sin(alpha);
		}	
		for(var j=0;j<BLACK_COINS_NO;j++){
			if(i!=j){
				if(Math.sqrt(Math.pow((BLACK_X[j]-BLACK_X[i]),2)+Math.pow((BLACK_Z[j]-BLACK_Z[i]),2))<(COIN_RADIUS+COIN_RADIUS)){
					coin_coin(1,i,1,j);
				}
			}
		}
		for(var j=0;j<WHITE_COINS_NO;j++){
			coin_coin(1,i,0,j);
		}
	}
	for(var i=0;i<WHITE_COINS_NO;i++){
		if(Math.sqrt(Math.pow((STRIKER_X-WHITE_X[i]),2)+Math.pow((STRIKER_Z-WHITE_Z[i]),2))<(STRIKER_RADIUS+COIN_RADIUS)){
			var diffZ=Math.abs(STRIKER_Z-WHITE_Z[i]);
			var diffX=Math.abs(STRIKER_X-WHITE_X[i]);
			var alpha=Math.atan(diffZ/diffX);
			var velSA = STRIKER_VELOCITYX*Math.cos(alpha) + STRIKER_VELOCITYZ*Math.sin(alpha);	
			var velSP = STRIKER_VELOCITYZ*Math.cos(alpha) - STRIKER_VELOCITYX*Math.sin(alpha);
			var velCA = WHITE_VELOCITYX[i]*Math.cos(alpha) + WHITE_VELOCITYZ[i]*Math.sin(alpha); 
			var velCP = WHITE_VELOCITYZ[i]*Math.cos(alpha) - WHITE_VELOCITYX[i]*Math.sin(alpha);

			var temp = (1- COEFFICIENT_RES)*velCA + (1+COEFFICIENT_RES)*velSA; // switch S with C and visa versa
			velSA = ((1-COEFFICIENT_RES)*velSA + (1+COEFFICIENT_RES)*velCA)/2 , velCA = temp/2; // and these

			STRIKER_VELOCITYX=velSA*Math.cos(alpha)-velSP*Math.sin(alpha),STRIKER_VELOCITYZ=velSP*Math.cos(alpha)+velSA*Math.sin(alpha);
			WHITE_VELOCITYX[i] = velCA*Math.cos(alpha) - velCP*Math.sin(alpha);
			WHITE_VELOCITYZ[i] = velCP*Math.cos(alpha) + velCA*Math.sin(alpha);
		}
		for(var j=0;j<WHITE_COINS_NO;j++){
			if(i!=j){
				coin_coin(0,i,0,j);
			}
		}
	}
}
function updateCoins(){
	for(var i=0;i<BLACK_COINS_NO;i++){
			if(BLACK_X[i]>STRIKER_MAXX || BLACK_X[i]<STRIKER_MINX){
				BLACK_VELOCITYX_F[i]*=-1;
			}
			if(BLACK_Z[i]>STRIKER_MAXZ || BLACK_Z[i]<STRIKER_MINZ){
				BLACK_VELOCITYZ_F[i]*=-1;
			}
			BLACK_VELOCITYX[i]*=BLACK_VELOCITYX_F[i];
			BLACK_VELOCITYZ[i]*=BLACK_VELOCITYZ_F[i];
			BLACK_X[i]-=BLACK_VELOCITYX[i];
			BLACK_Z[i]+=BLACK_VELOCITYZ[i];
			BLACK_VELOCITYX[i]=Math.max(BLACK_VELOCITYX[i]-FRICTION,0);
			BLACK_VELOCITYZ[i]=Math.max(BLACK_VELOCITYZ[i]-FRICTION,0);
			BLACK_SPHERE[i].position.set(BLACK_X[i],BLACK_Y[i],BLACK_Z[i]);
			for(var j=0;j<4;j++){
				if(Math.sqrt(Math.pow((POCKET_X[j]-BLACK_X[i]),2)+Math.pow((POCKET_Z[j]-BLACK_Z[i]),2))<(POCKET_RADIUS+COIN_RADIUS)){
					SCORE-=20*BLACK_VISIBLE[j];
					BLACK_VISIBLE[j]=0;
					scene.remove(BLACK_SPHERE);
				}
			}
			if(BLACK_VISIBLE[i]==1)
				scene.add(BLACK_SPHERE[i]);
	}	
	for(var i=0;i<WHITE_COINS_NO;i++){
			if(WHITE_X[i]>STRIKER_MAXX || WHITE_X[i]<STRIKER_MINX){
				WHITE_VELOCITYX_F[i]*=-1;
			}
			if(WHITE_Z[i]>STRIKER_MAXZ || WHITE_Z[i]<STRIKER_MINZ){
				WHITE_VELOCITYZ_F[i]*=-1;
			}
			WHITE_VELOCITYX[i]*=WHITE_VELOCITYX_F[i]
			WHITE_VELOCITYZ[i]*=WHITE_VELOCITYZ_F[i]
			WHITE_X[i]-=WHITE_VELOCITYX[i];
			WHITE_Z[i]+=WHITE_VELOCITYZ[i];
			WHITE_VELOCITYX[i]=Math.max(WHITE_VELOCITYX[i]-FRICTION,0);
			WHITE_VELOCITYZ[i]=Math.max(WHITE_VELOCITYZ[i]-FRICTION,0);
			WHITE_SPHERE[i].position.set(WHITE_X[i],WHITE_Y[i],WHITE_Z[i]);
			for(var j=0;j<4;j++){
				if(Math.sqrt(Math.pow((POCKET_X[j]-WHITE_X[i]),2)+Math.pow((POCKET_Z[j]-WHITE_Z[i]),2))<(POCKET_RADIUS+COIN_RADIUS)){
					SCORE+=5*WHITE_VISIBLE[j];
					WHITE_VISIBLE[j]=0;
					scene.remove(WHITE_SPHERE);
				}
			}
			if(WHITE_VISIBLE[i]==1)
				scene.add(WHITE_SPHERE[i]);
	}
}
function updateCamera(){
	if(CAMERA_MOV==0){
		camera.position.set(0,200,0);
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
	else if(CAMERA_MOV==1){
		camera.position.set(200,100,0);
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
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
	if(CAMERA_MOV==2){
		camera.position.set(BLACK_X[BLACK_COINVIEWNO],100,BLACK_Z[BLACK_COINVIEWNO]);
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
	if(CAMERA_MOV==3){
		camera.position.set(WHITE_X[WHITE_COINVIEWNO],100,WHITE_Z[WHITE_COINVIEWNO]);
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
	updateCamera();
	updateStriker();
	updateArrow();
	updateCursor();
	updateCollisions();
	updateCoins();
	var text = document.createElement('div');
	text.style.position = 'absolute';
	//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text.style.width = 500;
	text.style.height = 500;
	text.style.backgroundColor = "white";
	text.innerHTML = SCORE;
	text.style.top =50 + 'px';
	text.style.left = 1950 + 'px';
	document.body.appendChild(text);
};
function timer(){
	SCORE-=1;
	setTimeout(timer,5000);
}
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
	if(keyPressed=="1" && STRIKER_SET==1){
		CAMERA_MOV=0;
	}
	if(keyPressed=="2" && STRIKER_SET==1){
		CAMERA_MOV=1;
	}
	if(keyPressed=="3" && STRIKER_SET==1){
		CAMERA_MOV=2;
		BLACK_COINVIEWNO=(BLACK_COINVIEWNO+1)%4;
	}
	if(keyPressed=="4" && STRIKER_SET==1){
		CAMERA_MOV=3;
		WHITE_COINVIEWNO=(WHITE_COINVIEWNO+1)%4;
	}
	if(keyPressed=="R" && STRIKER_MOV==1){
		striker_init();
		add_newarrow();
	}
	if(event.keyCode==13 && POWER_SET==1){
		POWER_SET=0;
		STRIKER_VELOCITY=7*CURSOR_XDIFF/CURSOR_MAXX;
		STRIKER_VELOCITYX=STRIKER_VELOCITY*Math.cos(STRIKER_ANGLE);
		STRIKER_VELOCITYZ=STRIKER_VELOCITY*Math.sin(STRIKER_ANGLE);
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
var text = document.createElement('div');
text.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text.style.width = 500;
text.style.height = 500;
text.style.backgroundColor = "white";
text.innerHTML = SCORE;
text.style.top =50 + 'px';
text.style.left = 1950 + 'px';
document.body.appendChild(text);

timer();
//Rendering
camera.position.set(CAMERA_X,CAMERA_Y,CAMERA_Z);
camera.lookAt(new THREE.Vector3(0,0,0));
render();