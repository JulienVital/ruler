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
    snapThreshold: 5,
    snaps: [0, 300, 600],
    displayDragPos: true,
    dragPosFormat: (v) => `${v}px`
  }
).on("changeGuides", ({ guides }) => {
  moveable.horizontalGuidelines = guides;
});
const verticalGuides = new Guides(document.querySelector(".guides.vertical"), {
  type: "vertical",
  snapThreshold: 5,
  snaps: [0, 200, 400],
  displayDragPos: true,
  dragPosFormat: (v) => `${v}px`
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

const selecto = new Selecto({
  container: document.querySelector(".app"),
  dragContainer: ".viewer",
  hitRate: 0,
  selectableTargets: ["[data-moveable]"],
  toggleContinueSelect: ["shift"],
  scrollOptions: {
    container: viewer.getContainer(),
    threshold: 30,
    throttleTime: 30,
    getScrollPosition: ({ direction }) => {
      return [viewer.getScrollLeft(), viewer.getScrollTop()];
    }
  }
})
.on("dragStart", (e) => {
  if (!document.hasFocus()) {
    e.stop();
  }
  const inputEvent = e.inputEvent;
  const target = inputEvent.target;
  if (
    target.nodeName === "A" ||
    inputEvent.type === "touchstart" ||
    moveable.isMoveableElement(target) ||
    targets.some((t) => t === target || t.contains(target))
  ) {
    e.stop();
  }
})
.on("scroll", ({ direction }) => {
  viewer.scrollBy(direction[0] * 10, direction[1] * 10);
})
.on("selectEnd", (e) => {
  targets = e.selected;
  moveable.target = targets;

  if (e.isDragStart) {
    e.inputEvent.preventDefault();

    setTimeout(() => {
      moveable.dragStart(e.inputEvent);
    });
  }
});

requestAnimationFrame(() => {
  viewer.scrollCenter();
});

window.addEventListener("resize", () => {
  horizontalGuides.resize();
  verticalGuides.resize();
});

keycon.global.keydown(["shift"], e => {
  moveable.throttleDragRotate = 45;
  moveable.throttleRotate = 30;
  moveable.keepRatio = true;
}).keyup(["shift"], e => {
  moveable.throttleDragRotate = 0;
  moveable.throttleRotate = 0;
  moveable.keepRatio = undefined;
});
window.addEventListener(
  "wheel",
  (e) => {
    if (keycon.global.altKey) {
      const zoom = Math.max(0.1, viewer.zoom + e.deltaY / 300);
      e.preventDefault();
      viewer.zoom = zoom;
      verticalGuides.zoom = zoom;
      horizontalGuides.zoom = zoom;
    }
  },
  {
    passive: false
  }
);
document.querySelector(".reset").addEventListener("click", () => {
  viewer.scrollCenter();
});
