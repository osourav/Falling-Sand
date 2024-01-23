class Sand {
   constructor(x, y, s, color, v = 1) {
      this.x = x;
      this.y = y;
      this.s = s;
      this.color = color;
   }

   draw(c) {
      c.fillStyle = this.color;
      c.fillRect(this.x * this.s, this.y * this.s, this.s, this.s);
   }

   update(y, x) {
      this.x = x;
      this.y = y;
   }
}