"use strict"

//use cssRoot.style.setProperty("key", "value");
const cssRoot = document.querySelector(':root');

// when run this app in mobile is return true
const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

// minimum window size
const minSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;

const toRadian = degree => (degree * Math.PI) / 180;// degree to radian
const toDegree = radian => (radian * 180) / Math.PI;// radian to Degree

Math.rnd = (start = 0, end = 1, int_floor = false) => {
   const result = start + (Math.random() * (end - start));
   return int_floor ? Math.floor(result) : result;
}

/* e.x 
(0 start) -------.------ (10 end) input . = 5
(10 min) ----------------.---------------- (30 max) output . = 20
*/
Math.map = (point, start, end, min, max) => {
   return ((max - min) * (point - start) / (end - start)) + min;
}

/* ----  local storage set and get ---- */
function setDataFromLocalStorage(key, object) {
   var data = JSON.stringify(object);
   localStorage.setItem(key, data);
}

function getDataFromLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key))
}

function seedRandom(seed) {
   const a = 1664525;
   const c = 1013904223;
   const m = Math.pow(2, 32);

   let currentSeed = seed;

   return function () {
      currentSeed = (a * currentSeed + c) % m;
      return currentSeed / m;
   };
}

class Animation {
   constructor(fps, fun) {
      this.fps = fps;
      this.run = false;
      this.fun = fun;
   }

   #animate() {
      setTimeout(() => {
         if (this.run) {
            this.fun();
            this.#animate(this.fun);
         }
      }, 1000 / this.fps);
   }

   start() {
      this.run = true;
      this.#animate(this.fun);
   }

   stop() {
      this.run = false;
   }
}

