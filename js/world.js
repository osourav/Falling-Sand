class World {
   constructor(ww, wh, s, threshold = 2) {
      this.ww = ww;
      this.wh = wh;
      this.s = s;
      this.v = 3;

      this.grid = [];
      this.sands = [];
      this.placedSands = [];
      this.topSands = [];
      this.#setup();
      this.#eventHandler();
      this.isHolding = false;
      this.color = "#fff";
      this.threshold = threshold;
      this.randomness = 0.9;
   }

   #setup() {
      for (let i = 0; i < this.ww; i++) {
         this.topSands.push(this.wh);
      }
      for (let j = 0; j < this.wh; j++) {
         this.grid[j] = [];
         for (let i = 0; i < this.ww; i++)  this.grid[j][i] = 0;
      }

      setInterval(() => {
         this.#drawAll();
      }, 500);

      setInterval(() => {
         this.#updateAll();
      }, 200);
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
      window.addEventListener("touchstart", (e) => {
         this.isHolding = true;
         this.color = `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`;
         this.#setSend(Math.floor(e.touches[0].clientX / this.s), Math.floor(e.touches[0].clientY / this.s));
      });
      window.addEventListener("touchmove", (e) => {
         if (this.isHolding) {
            this.#setSend(Math.floor(e.touches[0].clientX / this.s), Math.floor(e.touches[0].clientY / this.s));
         }
      });
      window.addEventListener("touchend", (e) => {
         this.isHolding = false
      });
   }

   #setSend(x, y) {
      for (let r = 1; r < this.threshold; r++) {
         for (let i = 1; i < 360; i++) {
            const nx = x + Math.floor(Math.cos(toRadian(i)) * r);
            const ny = y + Math.floor(Math.sin(toRadian(i)) * r);

            if (nx < 0 || ny < 0) continue;
            else if (this.grid[ny][nx] == 0) {
               this.grid[ny][nx] = new Sand(nx, ny, this.s, this.color);
            }
         }
      }
      for (let r = 1; r < this.threshold; r++) {
         for (let i = 1; i < 360; i += (this.threshold - r)) {
            const nx = x + Math.floor(Math.cos(toRadian(i)) * r);
            const ny = y + Math.floor(Math.sin(toRadian(i)) * r);

            if (nx < 0 || ny < 0) continue;
            else if (Math.random() > this.randomness) {
               this.grid[ny][nx] = 0;
            }
         }
      }

   }

   #drawAll() {
      ctx.clearRect(0, 0, this.ww * this.s, this.wh * this.s);
      this.grid.forEach(g => g.forEach(sand => {
         if (sand != 0) {
            sand.draw(ctx);
         }
      }));
   }

   draw(ctx) {
      for (let i = 0; i < this.ww; i++) {
         ctx.clearRect(i * this.s, 0, this.s, this.topSands[i] * this.s);
      }

      for (let i = 0; i < this.ww; i++) {
         for (let j = this.topSands[i] - 1; j >= 0; j--) {
            const sand = this.grid[j][i];
            if (sand != 0) {
               sand.draw(ctx);
            }
         }
      }
   }

   #updateXY(sand, y, x, dx = 0, e = 0) {
      this.grid[y][x] = 0;
      this.grid[y + 1 + e][x + dx] = sand;
      sand.update(y + 1 + e, x + dx);
   }

   #leftRightUpdate(sand, j, i) {
      const lEmpty = [[j, i - 1], [j + 1, i - 1], [j + 2, i - 1]]
      .every(([y, x]) => y < this.wh && x < this.ww && this.grid[y][x] == 0);

      const rEmpty = [[j, i + 1], [j + 1, i + 1], [j + 2, i + 1]]
      .every(([y, x]) => y < this.wh && x < this.ww && this.grid[y][x] == 0);

      if (lEmpty && rEmpty) {
         // chose any one side randomly
         const isRight = Math.random() > 0.5;
         if (isRight) {
            this.#updateXY(sand, j, i, 1, -1);
         } else {
            this.#updateXY(sand, j, i, -1);
         }
         
      } else if (lEmpty) {
         this.#updateXY(sand, j, i, -1);
      } else if (rEmpty) {
         this.#updateXY(sand, j, i, 1, -1);
      } else {
         this.topSands[i] = sand.y;
      }
   }

   update() {
      for (let _ = 0; _ < this.v; _++) {
         for (let i = 0; i < this.ww; i++) {
            for (let j = this.topSands[i] - 1; j >= 0; j--) {

               const sand = this.grid[j][i];
               if (sand != 0) {

                  if (j + 1 < this.wh && this.grid[j + 1][i] == 0) {
                     this.#updateXY(sand, j, i);
                  } else {
                     this.#leftRightUpdate(sand, j, i);
                  }
               }
            }
         }
      }
   }

   #updateAll() {
      for (let i = 0; i < this.ww; i++) {
         for (let j = this.wh - 1; j >= 0; j--) {

            const sand = this.grid[j][i];
            if (sand != 0) {

               if (j + 1 < this.wh && this.grid[j + 1][i] == 0) {
                  this.#updateXY(sand, j, i);
               } else {
                  this.#leftRightUpdate(sand, j, i);
               }
            }
         }
      }
   }
}