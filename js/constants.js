var FOV=90;
var NEAR=0.1;
var FAR=1000;
var BACKGROUND=0xffffff;
var CIRCLE_SEGMENTS=32;
var CAMERA_X=0.0;
var CAMERA_Y=200.0;
var CAMERA_Z=0.0;

var BOARD_HEIGHT=350;
var BOARD_WIDTH=350;
var BOARD_THICKNESS=50;
var BOARD_X=0.0;
var BOARD_Y=0.0;
var BOARD_Z=0.0;
var BOARD_PATH="images/Carrom_Board.png";

var POCKET_RADIUS=20.0;
var POCKET_NO=4;
var POCKET_X=[-125.0,-125.0,125.0,125.0];
var POCKET_Y=[25.0,25.0,25.0,25.0];
var POCKET_Z=[120.0,-120.0,120.0,-120.0];

var INNER_CIRCLE_RADIUS=40.0;
var INNER_CIRCLE_X=0.0;
var INNER_CIRCLE_Y=25.0;
var INNER_CIRCLE_Z=0.0;

var INNER_RECTANGLE_HEIGHT=180;
var INNER_RECTANGLE_WIDTH=180;
var INNER_RECTANGLE_THICKNESS=0;
var INNER_RECTANGLE_X=0.0;
var INNER_RECTANGLE_Y=25.0;
var INNER_RECTANGLE_Z=0.0;

var EDGE_CIRCLE_RADIUS=10.0;
var EDGE_CIRCLES_NO=4;
var EDGE_CIRCLE_X=[-80.0,80.0,80.0,-80.0];
var EDGE_CIRCLE_Y=[25.0,25.0,25.0,25.0];
var EDGE_CIRCLE_Z=[79.5,-79.5,79.5,-79.5];

var COIN_RADIUS=5.0;
var COIN_HEIGHT=2.0;
var RED_X=0.0;
var RED_Y=BOARD_THICKNESS/2+COIN_HEIGHT;
var RED_Z=0.0;

var BLACK_COINS_NO=1;
var BLACK_X=[-16.0];
var BLACK_Y=[BOARD_THICKNESS/2+COIN_HEIGHT];
var BLACK_Z=[22.0];

var WHITE_COINS_NO=1;
var WHITE_X=[-16.0];
var WHITE_Y=[BOARD_THICKNESS/2+COIN_HEIGHT];
var WHITE_Z=[10.0];