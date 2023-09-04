let sketchAspectRatio;
let sketchContainerId;

const setSketchContainer = (aspectRatio, id) => {
  sketchAspectRatio = aspectRatio;
  sketchContainerId = id;
  const canvasContainer = select(`#${sketchContainerId}`);
  const canvas = createCanvas(
    canvasContainer.width,
    (canvasContainer.width * 1) / sketchAspectRatio
  );
  canvas.parent(canvasContainer);
};

// function windowResized() {
//   const canvasContainer = select(`#${sketchContainerId}`);
//   resizeCanvas(
//     canvasContainer.width,
//     (canvasContainer.width * 1) / sketchAspectRatio
//   );
// }
