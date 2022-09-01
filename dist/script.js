let targets = [];
const moveable = new Moveable(document.querySelector(".viewport"), {
  target: [],
  draggable: true,
  scalable: true,
  rotatable: true,
  snappable: true,
  snapCenter: true
});
const helper = MoveableHelper.create();
moveable
  .on("dragStart", helper.onDragStart)
  .on("drag", helper.onDrag)
  .on("dragGroupStart", helper.onDragGroupStart)
  .on("dragGroup", helper.onDragGroup)
  .on("scaleStart", helper.onScaleStart)
  .on("scale", helper.onScale)
  .on("scaleGroupStart", helper.onScaleGroupStart)
  .on("scaleGroup", helper.onScaleGroup)
  .on("rotateStart", helper.onRotateStart)
  .on("rotate", helper.onRotate)
  .on("rotateGroupStart", helper.onRotateGroupStart)
  .on("rotateGroup", helper.onRotateGroup)

const horizontalGuides = new Guides(
  document.querySelector(".guides.horizontal"),
  {
    zoom: 37.7952,
    unit: 1,
    snapThreshold: 5,
    snaps: [0, 300, 600],
    displayDragPos: true,
    dragPosFormat: (v) => `${v}mm`
  }
).on("changeGuides", ({ guides }) => {
  moveable.horizontalGuidelines = guides;
});
const verticalGuides = new Guides(document.querySelector(".guides.vertical"), {
  type: "vertical",
  zoom: 37.7952,
  unit: 1,
  snapThreshold: 5,
  snaps: [0, 200, 400],
  displayDragPos: true,
  dragPosFormat: (v) => `${v}mm`
}).on("changeGuides", ({ guides }) => {
  moveable.verticalGuidelines = guides;
});

const viewer = new InfiniteViewer(
  document.querySelector(".viewer"),
  document.querySelector(".viewport"),
  {
    usePinch: true,
    pinchThreshold: 50
  }
)
.on("dragStart", (e) => {
  const target = e.inputEvent.target;
  if (
    target.nodeName === "A" ||
    moveable.isMoveableElement(target) ||
    targets.some((t) => t === target || t.contains(target))
  ) {
    e.stop();
  }
})
.on("dragEnd", (e) => {
  if (!e.isDrag) {
    selecto.clickTarget(e.inputEvent);
  }
})
.on("abortPinch", (e) => {
  selecto.triggerDragStart(e.inputEvent);
})
.on("scroll", (e) => {
  horizontalGuides.scroll(e.scrollLeft);
  horizontalGuides.scrollGuides(e.scrollTop);

  verticalGuides.scroll(e.scrollTop);
  verticalGuides.scrollGuides(e.scrollLeft);
  
  const thumbWidth = 0;
  console.log(e.scrollLeft);
})
.on("pinch", (e) => {
  const zoom = e.zoom;
  verticalGuides.zoom = zoom;
  horizontalGuides.zoom = zoom;
  viewer.zoom = zoom;
});



requestAnimationFrame(() => {
  viewer.scrollCenter();
});

window.addEventListener("resize", () => {
  horizontalGuides.resize();
  verticalGuides.resize();
});

document.querySelector(".reset").addEventListener("click", () => {
  viewer.scrollCenter();
});