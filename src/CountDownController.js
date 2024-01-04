export default class CountdownController {
  duration = 0;
  fontSize = 35; // Font size in pixels

  constructor(scene, label) {
    this.scene = scene;
    this.label = label;
  }

  start(callback, duration = 100000) {
    this.stop();

    this.finishedCallback = callback;
    this.duration = duration;

    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        this.label.text = "0";

        this.stop();

        if (callback) {
          callback();
        }
      },
    });
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }

  update() {
    if (!this.timerEvent || this.duration <= 0) {
      return;
    }

    const elapsed = this.timerEvent.getElapsed();
    const remaining = this.duration - elapsed;
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    this.label.text = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;

    this.label.setStyle({
      fontSize: `${this.fontSize}px`,
      position: "absolute",
      left: "70%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "black",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    });
  }
}
