const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");

const SCALE_SIZE = 2;
const WIN_W = window.innerWidth;
const WIN_H = window.innerHeight;
const CVS_WIDTH = Math.floor(WIN_W / SCALE_SIZE);
const CVS_HEIGHT = Math.floor(WIN_H / SCALE_SIZE);
const FPS = 60;

cvs.width = WIN_W;
cvs.height = WIN_H;

const ani = new Animation(FPS, animate);
const world = new World(CVS_WIDTH, CVS_HEIGHT, SCALE_SIZE, 10);

function animate() {
   world.draw(ctx);
   world.update();

}

ani.start();
