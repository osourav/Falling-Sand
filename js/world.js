class World {
   constructor(ww, wh, s) {
      this.ww = ww;
      this.wh = wh;
      this.s = s;
      this.v = 1;

      this.sands = [];
      this.placedSands = [];
      this.topPlacedSands = [];
      this.#fillTopPlacedSands();
      this.#eventHandler();
      this.isHolding = false;
      this.color = "#fff";
      this.threshold = 6;
   }

   #fillTopPlacedSands() {
      for (let i = 0; i < this.ww; i++) {
         this.topPlacedSands.push(this.wh);
      }
   }

   #eventHandler() {
      window.addEventListener("mousedown", (e) => {
         this.isHolding = true;
         this.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
         this.#setSend(Math.floor(e.clientX / this.s), Math.floor(e.clientY / this.s));
      });
      window.addEventListener("mousemove", (e) => {
         if (this.isHolding) {
            this.#setSend(Math.floor(e.clientX / this.s), Math.floor(e.clientY / this.s));
         }
      });
      window.addEventListener("mouseup", (e) => {
         this.isHolding = false
      });
   }

   #setSend(x, y) {
      const sands = [];
      for (let r = 1; r < this.threshold; r++) {
         for (let i = 1; i < 360; i++) {
            if (Math.random() > 0.96) {
               const nx = x + Math.floor(Math.cos(toRadian(i)) * r);
               const ny = y + Math.floor(Math.sin(toRadian(i)) * r);
               const isEmpty = !sands.some(e => e.x == nx && e.y == ny);

               if (isEmpty) sands.push(new Sand(nx, ny, this.s, this.color));
            }
         }
      }
      this.sands.push(...sands);
   }

   draw(ctx) {
      ctx.clearRect(0, 0, this.ww * this.s, this.wh * this.s);
      this.sands.concat(this.placedSands).forEach((sand) => {
         sand.draw(ctx);
      })
   }

   #moveXupdate(isRight, sand, fi, i) {
      if (isRight) {
         sand.update(1);
         if (this.topPlacedSands[fi + 1] == sand.y + 1) {
            this.topPlacedSands[fi + 1] = sand.y;
            this.placedSands.push(this.sands.splice(i, 1)[0]);
         }
      } else {
         sand.update(-1);
         if (this.topPlacedSands[fi - 1] == sand.y + 1) {
            this.topPlacedSands[fi - 1] = sand.y;
            this.placedSands.push(this.sands.splice(i, 1)[0]);
         }
      }
   }

   update() {
      for (let _ = 0; _ < this.v; _++) {
         for (let i = this.sands.length - 1; i >= 0; i--) {
            const sand = this.sands[i];
            const topIndex = sand.x - 1;
            const val = this.topPlacedSands[topIndex];

            if (val == sand.y + 1) {
               const left = this.topPlacedSands[topIndex - 1];
               const main = this.topPlacedSands[topIndex];
               const right = this.topPlacedSands[topIndex + 1];

               if (main < left && main < right) {
                  // chose any one side randomly
                  const isRight = Math.random() > 0.5;
                  this.#moveXupdate(isRight, sand, topIndex, i);
               } else if (main < left) {
                  this.#moveXupdate(false, sand, topIndex, i);
               } else if (main < right) {
                  this.#moveXupdate(true, sand, topIndex, i);
               } else {
                  this.topPlacedSands[topIndex] = sand.y;
                  this.placedSands.push(this.sands.splice(i, 1)[0]);
               }
            } else {
               sand.update();
            }
         }
      }
   }
}