// Isometric rendering engine - to be implemented
export default class IsometricEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }
}
