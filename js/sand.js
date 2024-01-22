class Sand {
   constructor(x, y, s, color, v = 1) {
      this.x = x;
      this.y = y;
      this.s = s;
      this.color = color;
   }

   draw(c) {
      c.fillStyle = this.color;
      // c.beginPath();
      // c.arc(this.x, this.y, this.s / 2, 0, Math.PI * 2, false);
      // c.fill()
      c.fillRect(this.x * this.s, this.y * this.s, this.s, this.s);
   }

   update(x = 0) {
      this.x += x;
      this.y++;
   }
}