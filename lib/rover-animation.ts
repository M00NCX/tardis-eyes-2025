export interface RoverAnimationOptions {
  startPosition: { lat: number; lng: number };
  endPosition: { lat: number; lng: number };
  duration: number;
  onComplete?: () => void;
}

export class RoverAnimation {
  private startTime: number | null = null;
  private animationFrame: number | null = null;
  private marker: any = null;

  constructor(private map: any) {}

  setMarker(marker: any) {
    this.marker = marker;
  }

  start(options: RoverAnimationOptions) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.startTime = null;
    this.animate(performance.now(), options);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private animate = (timestamp: number, options: RoverAnimationOptions) => {
    if (!this.startTime) this.startTime = timestamp;

    const progress = Math.min(
      (timestamp - this.startTime) / options.duration,
      1
    );

    // Easing function
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    const lat =
      options.startPosition.lat +
      (options.endPosition.lat - options.startPosition.lat) * easeProgress;

    const lng =
      options.startPosition.lng +
      (options.endPosition.lng - options.startPosition.lng) * easeProgress;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }

    if (progress < 1) {
      this.animationFrame = requestAnimationFrame((ts) =>
        this.animate(ts, options)
      );
    } else {
      if (this.marker) {
        this.marker.setLatLng([
          options.endPosition.lat,
          options.endPosition.lng,
        ]);
      }
      options.onComplete?.();
      this.animationFrame = null;
    }
  };
}
