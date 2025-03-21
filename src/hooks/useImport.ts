import { ref } from "vue";
import { storeToRefs } from "pinia";
import { type Shape, type Element, type ChartItem } from "pptxtojson";
// @ts-ignore
import { parse } from "./ppt/pptxtojson.js";
import { nanoid } from "nanoid";
import { useSlidesStore } from "@/store";
import { decrypt } from "@/utils/crypto";
import {
  type ShapePoolItem,
  SHAPE_LIST,
  SHAPE_PATH_FORMULAS,
} from "@/configs/shapes";
import useAddSlidesOrElements from "@/hooks/useAddSlidesOrElements";
import useSlideHandler from "@/hooks/useSlideHandler";
import message from "@/utils/message";
import { getSvgPathRange } from "@/utils/svgPathParser";
import type {
  Slide,
  TableCellStyle,
  TableCell,
  ChartType,
  SlideBackground,
  PPTShapeElement,
  PPTLineElement,
  ShapeTextAlign,
  PPTTextElement,
  ChartOptions,
} from "@/types/slides";

const convertFontSizePtToPx = (html: string, ratio: number) => {
  return html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    return `font-size: ${(parseFloat(p1) * ratio).toFixed(1)}px`;
  });
};

export default () => {
  const slidesStore = useSlidesStore();
  const { theme } = storeToRefs(useSlidesStore());

  const { addSlidesFromData } = useAddSlidesOrElements();
  const { isEmptySlide } = useSlideHandler();

  const exporting = ref(false);

  const pptistToFile = async (url: any, filename = "xxx.pptist") => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: "" });
    return file;
  };

  // 导入pptist文件
  const importSpecificFile = (url: FileList, cover = false) => {
    pptistToFile(url).then((file) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        try {
          const slides = JSON.parse(decrypt(reader.result as string));

          addSlidesFromData(slides);
          slidesStore.updateSlideIndex(0);
        } catch {
          message.error("无法正确读取 / 解析该文件");
        }
      });
      reader.readAsText(file);
    });
  };

  const parseLineElement = (el: Shape) => {
    let start: [number, number] = [0, 0];
    let end: [number, number] = [0, 0];

    if (!el.isFlipV && !el.isFlipH) {
      // 右下
      start = [0, 0];
      end = [el.width, el.height];
    } else if (el.isFlipV && el.isFlipH) {
      // 左上
      start = [el.width, el.height];
      end = [0, 0];
    } else if (el.isFlipV && !el.isFlipH) {
      // 右上
      start = [0, el.height];
      end = [el.width, 0];
    } else {
      // 左下
      start = [el.width, 0];
      end = [0, el.height];
    }

    const data: PPTLineElement = {
      type: "line",
      id: nanoid(10),
      width: el.borderWidth || 1,
      left: el.left,
      top: el.top,
      start,
      end,
      style: el.borderType,
      color: el.borderColor,
      points: ["", /straightConnector/.test(el.shapType) ? "arrow" : ""],
    };
    if (/bentConnector/.test(el.shapType)) {
      data.broken2 = [
        Math.abs(start[0] - end[0]) / 2,
        Math.abs(start[1] - end[1]) / 2,
      ];
    }

    return data;
  };

  const calculateRotatedPosition = (
    x: number,
    y: number,
    w: number,
    h: number,
    ox: number,
    oy: number,
    k: number
  ) => {
    const radians = k * (Math.PI / 180);

    const containerCenterX = x + w / 2;
    const containerCenterY = y + h / 2;

    const relativeX = ox - w / 2;
    const relativeY = oy - h / 2;

    const rotatedX =
      relativeX * Math.cos(radians) + relativeY * Math.sin(radians);
    const rotatedY =
      -relativeX * Math.sin(radians) + relativeY * Math.cos(radians);

    const graphicX = containerCenterX + rotatedX;
    const graphicY = containerCenterY + rotatedY;

    return { x: graphicX, y: graphicY };
  };

  const setBgColor = (el: any) => {
    return el.fillColor || "none";
  };
  const isCircle = (path: any) => {
    // 检查是否包含弧形 (A) 或贝塞尔曲线 (C/Q) 语法
    const hasArc =
      /A\s*[\d.]+,[\d.]+\s*[\d.]+\s*[01],[01]\s*[\d.-]+,[\d.-]+/i.test(path);
    const hasCurve = /[CQ]\s*[\d.-]+,[\d.-]+\s*[\d.-]+,[\d.-]+/i.test(path);

    // 如果路径只包含 M 和 L，说明是多边形，不可能是圆
    const isPolygon = /^[ML]\s*[\d.-]+,[\d.-]+\s*L\s*[\d.-]+,[\d.-]+/i.test(
      path
    );

    if (isPolygon) return false; // 直线多边形，肯定不是圆

    // 如果包含 A（弧线）或 C/Q（曲线），可能是圆
    return hasArc || hasCurve;
  };

  const isTriangle = (path: any) => {
    const points = path.match(/[\d.-]+,[\d.-]+/g);
    if (!points) return false;

    // 转换为唯一坐标点数组
    const uniquePoints = [...new Set(points)]; // 去重

    // 如果唯一顶点数为 3，则判定为三角形
    return uniquePoints.length === 3;
  };
  const isPentagon = (path: any) => {
    const points = path.match(/[\d.-]+,[\d.-]+/g);
    if (!points) return false;

    // 转换为唯一坐标点数组
    const uniquePoints = [...new Set(points)]; // 去重

    // 如果唯一顶点数为 5，则判定为五边形
    return uniquePoints.length === 5;
  };
  const pptximport = (url: any) => {
    urlToFile(
      url
      // "https://gslboep.cdn.hk.chinamobile.com/docs/963315c121eef12e279bdd35b4f3c9e3.pptx"
    ).then((file) => {
      // console.log(file);
      // const file = files[0]
      // if (!file) return;

      exporting.value = true;

      const shapeList: ShapePoolItem[] = [];
      for (const item of SHAPE_LIST) {
        shapeList.push(...item.children);
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const json = await parse(e.target!.result as ArrayBuffer);

        const ratio = 96 / 72;
        const width = json.size.width;

        slidesStore.setViewportSize(width * ratio);

        const slides: Slide[] = [];
        for (const item of json.slides) {
          const { type, value } = item.fill;
          let background: SlideBackground;
          if (type === "image") {
            background = {
              type: "image",
              image: {
                src: value.picBase64,
                size: "cover",
              },
            };
          } else if (type === "gradient") {
            background = {
              type: "gradient",
              gradient: {
                type: "linear",
                colors: value.colors.map((item: any) => ({
                  ...item,
                  pos: parseInt(item.pos),
                })),
                rotate: value.rot,
              },
            };
          } else {
            background = {
              type: "solid",
              color: value,
            };
          }

          const slide: Slide = {
            id: nanoid(10),
            elements: [],
            background,
            remark: item.note === "[object Object]" ? "" : item.note,
          };

          const parseElements = (elements: Element[]) => {
            const sortedElements = elements.sort((a, b) => a.order - b.order);

            for (const el of sortedElements) {
              const originWidth = el.width || 1;
              const originHeight = el.height || 1;
              const originLeft = el.left;
              const originTop = el.top;

              el.width = el.width * ratio;
              el.height = el.height * ratio;
              el.left = el.left * ratio;
              el.top = el.top * ratio;

              if (el.type === "text") {
                const textEl: PPTTextElement = {
                  type: "text",
                  id: nanoid(10),
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  rotate: el.rotate,
                  defaultFontName: theme.value.fontName,
                  defaultColor: theme.value.fontColor,
                  content: convertFontSizePtToPx(el.content, ratio),
                  lineHeight: 1,
                  outline: {
                    color: el.borderColor,
                    width: el.borderWidth,
                    style: el.borderType,
                  },
                  fill: el.fillColor,
                  vertical: el.isVertical,
                };
                if (el.shadow) {
                  textEl.shadow = {
                    h: el.shadow.h * ratio,
                    v: el.shadow.v * ratio,
                    blur: el.shadow.blur * ratio,
                    color: el.shadow.color,
                  };
                }
                slide.elements.push(textEl);
              } else if (el.type === "image") {
                slide.elements.push({
                  type: "image",
                  id: nanoid(10),
                  src: el.src,
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  fixedRatio: true,
                  rotate: el.rotate,
                  flipH: el.isFlipH,
                  flipV: el.isFlipV,
                });
              } else if (el.type === "audio") {
                slide.elements.push({
                  type: "audio",
                  id: nanoid(10),
                  src: el.blob,
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  rotate: 0,
                  fixedRatio: false,
                  color: theme.value.themeColor,
                  loop: false,
                  autoplay: false,
                });
              } else if (el.type === "video") {
                slide.elements.push({
                  type: "video",
                  id: nanoid(10),
                  src: (el.blob || el.src)!,
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  rotate: 0,
                  autoplay: false,
                });
              } else if (el.type === "shape") {
                if (el.shapType === "line" || /Connector/.test(el.shapType)) {
                  const lineElement = parseLineElement(el);
                  slide.elements.push(lineElement);
                } else {
                  if (el.shapType === "custom") {
                    // if (el.path!.indexOf("NaN") !== -1) element.path = "";
                    // else {
                    //   // element.special = true;
                    //   element.path = el.path!;

                    //   const { maxX, maxY } = getSvgPathRange(element.path);
                    //   element.viewBox = [
                    //     maxX || originWidth,
                    //     maxY || originHeight,
                    //   ];
                    // }

                    if (isPentagon(el.path)) {
                      el.path =
                        "M 50 0 L 150 0 Q 200 0 200 50 L 200 150 Q 200 200 150 200 L 50 200 Q 0 200 0 150 L 0 50 Q 0 0 50 0 Z";
                      el.pathFormula = "roundRect";
                      el.shapType = "roundRect";
                    }

                    if (isCircle(el.path)) {
                      el.path =
                        "M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z";
                      el.pathFormula = "ellipse";
                      el.shapType = "ellipse";
                    }
                    if (isTriangle(el.path)) {
                      el.path = "M 100 0 L 0 200 L 200 200 L 100 0 Z";
                      el.pathFormula = "triangle";
                      el.shapType = "triangle";
                    }

                    if (
                      el.path ==
                      " M14.325118110236218,5.625826771653542 M14.325118110236218,5.625826771653542 L8.939842519685037,5.5429921259842505 L7.199999999999998,0.48913385826771644 L5.460157480314959,5.5429921259842505 L0.0748818897637795,5.625826771653542 L4.383070866141732,8.857007874015746 L2.726062992125984,13.993700787401572 L7.117165354330707,10.84543307086614 L11.50818897637795,13.993700787401572 L9.851181102362203,8.857007874015746 L14.325118110236218,5.625826771653542z"
                    ) {
                      el.path =
                        "M1018.67652554 400.05983681l-382.95318779-5.89158658L512 34.78141155 388.27666225 394.16825023l-382.95318779 5.89158658L311.68602415 629.83174977l-117.83174978 365.27842665 312.25413766-223.88032637 312.25413904 223.88032637-117.83175116-365.27842665 318.14572563-229.77191296z";
                      el.pathFormula = "star5";
                      el.shapType = "star5";
                      el.special = true;
                    }
                  }
                  const shape = shapeList.find(
                    (item) => item.pptxShapeType === el.shapType
                  );

                  const vAlignMap: { [key: string]: ShapeTextAlign } = {
                    mid: "middle",
                    down: "bottom",
                    up: "top",
                  };

                  const element: PPTShapeElement = {
                    type: "shape",
                    id: nanoid(10),
                    width: el.width,
                    height: el.height,
                    left: el.left,
                    top: el.top,
                    viewBox: [200, 200],
                    path: "M 0 0 L 200 0 L 200 200 L 0 200 Z",
                    fill: setBgColor(el),
                    fixedRatio: false,
                    rotate: el.rotate,
                    outline: {
                      color:
                        el.borderColor === "#000"
                          ? "#00000000"
                          : el.borderColor,
                      width: el.borderWidth,
                      style: el.borderType,
                    },
                    text: {
                      content: convertFontSizePtToPx(el.content, ratio),
                      defaultFontName: theme.value.fontName,
                      defaultColor: theme.value.fontColor,
                      align: vAlignMap[el.vAlign] || "middle",
                    },
                    flipH: el.isFlipH,
                    flipV: el.isFlipV,
                  };
                  if (el.shadow) {
                    element.shadow = {
                      h: el.shadow.h * ratio,
                      v: el.shadow.v * ratio,
                      blur: el.shadow.blur * ratio,
                      color: el.shadow.color,
                    };
                  }

                  if (shape) {
                    element.path = shape.path;
                    element.viewBox = shape.viewBox;

                    if (shape.pathFormula) {
                      element.pathFormula = shape.pathFormula;
                      element.viewBox = [el.width, el.height];

                      const pathFormula =
                        SHAPE_PATH_FORMULAS[shape.pathFormula];
                      if ("editable" in pathFormula && pathFormula.editable) {
                        element.path = pathFormula.formula(
                          el.width,
                          el.height,
                          pathFormula.defaultValue
                        );
                        element.keypoints = pathFormula.defaultValue;
                      } else
                        element.path = pathFormula.formula(el.width, el.height);
                    }
                  }

                  if (element.path) slide.elements.push(element);
                }
              } else if (el.type === "table") {
                const row = el.data.length;
                const col = el.data[0].length;

                const style: TableCellStyle = {
                  fontname: theme.value.fontName,
                  color: theme.value.fontColor,
                };
                const data: TableCell[][] = [];
                for (let i = 0; i < row; i++) {
                  const rowCells: TableCell[] = [];
                  for (let j = 0; j < col; j++) {
                    const cellData = el.data[i][j];

                    let textDiv: HTMLDivElement | null =
                      document.createElement("div");
                    textDiv.innerHTML = cellData.text;
                    const p = textDiv.querySelector("p");
                    const align = p?.style.textAlign || "left";

                    const span = textDiv.querySelector("span");
                    const fontsize = span?.style.fontSize
                      ? (parseInt(span?.style.fontSize) * ratio).toFixed(1) +
                        "px"
                      : "";
                    const fontname = span?.style.fontFamily || "";
                    const color = span?.style.color || cellData.fontColor;

                    rowCells.push({
                      id: nanoid(10),
                      colspan: cellData.colSpan || 1,
                      rowspan: cellData.rowSpan || 1,
                      text: textDiv.innerText,
                      style: {
                        ...style,
                        align: ["left", "right", "center"].includes(align)
                          ? (align as "left" | "right" | "center")
                          : "left",
                        fontsize,
                        fontname,
                        color,
                        bold: cellData.fontBold,
                        backcolor: cellData.fillColor,
                      },
                    });
                    textDiv = null;
                  }
                  data.push(rowCells);
                }

                const colWidths: number[] = new Array(col).fill(1 / col);

                slide.elements.push({
                  type: "table",
                  id: nanoid(10),
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  colWidths,
                  rotate: 0,
                  data,
                  outline: {
                    width: el.borderWidth || 2,
                    style: el.borderType,
                    color: el.borderColor || "#eeece1",
                  },
                  cellMinHeight: 36,
                });
              } else if (el.type === "chart") {
                let labels: string[];
                let legends: string[];
                let series: number[][];

                if (
                  el.chartType === "scatterChart" ||
                  el.chartType === "bubbleChart"
                ) {
                  labels = el.data[0].map((item, index) => `坐标${index + 1}`);
                  legends = ["X", "Y"];
                  series = el.data;
                } else {
                  const data = el.data as ChartItem[];
                  labels = Object.values(data[0].xlabels);
                  legends = data.map((item) => item.key);
                  series = data.map((item) => item.values.map((v) => v.y));
                }

                const options: ChartOptions = {};

                let chartType: ChartType = "bar";

                switch (el.chartType) {
                  case "barChart":
                  case "bar3DChart":
                    chartType = "bar";
                    if (el.barDir === "bar") chartType = "column";
                    if (
                      el.grouping === "stacked" ||
                      el.grouping === "percentStacked"
                    )
                      options.stack = true;
                    break;
                  case "lineChart":
                  case "line3DChart":
                    if (
                      el.grouping === "stacked" ||
                      el.grouping === "percentStacked"
                    )
                      options.stack = true;
                    chartType = "line";
                    break;
                  case "areaChart":
                  case "area3DChart":
                    if (
                      el.grouping === "stacked" ||
                      el.grouping === "percentStacked"
                    )
                      options.stack = true;
                    chartType = "area";
                    break;
                  case "scatterChart":
                  case "bubbleChart":
                    chartType = "scatter";
                    break;
                  case "pieChart":
                  case "pie3DChart":
                    chartType = "pie";
                    break;
                  case "radarChart":
                    chartType = "radar";
                    break;
                  case "doughnutChart":
                    chartType = "ring";
                    break;
                  default:
                }

                slide.elements.push({
                  type: "chart",
                  id: nanoid(10),
                  chartType: chartType,
                  width: el.width,
                  height: el.height,
                  left: el.left,
                  top: el.top,
                  rotate: 0,
                  themeColors: [theme.value.themeColor],
                  textColor: theme.value.fontColor,
                  data: {
                    labels,
                    legends,
                    series,
                  },
                  options,
                });
              } else if (el.type === "group") {
                const elements = el.elements.map((_el) => {
                  let left = _el.left + originLeft;
                  let top = _el.top + originTop;

                  if (el.rotate) {
                    const { x, y } = calculateRotatedPosition(
                      originLeft,
                      originTop,
                      originWidth,
                      originHeight,
                      _el.left,
                      _el.top,
                      el.rotate
                    );
                    left = x;
                    top = y;
                  }

                  return {
                    ..._el,
                    left,
                    top,
                  };
                });
                parseElements(elements);
              } else if (el.type === "diagram") {
                const elements = el.elements.map((_el) => ({
                  ..._el,
                  left: _el.left + originLeft,
                  top: _el.top + originTop,
                }));
                parseElements(elements);
              }
            }
          };
          parseElements(item.elements);
          slides.push(slide);
        }
        slidesStore.updateSlideIndex(0);
        slidesStore.setSlides(slides);
        exporting.value = false;
      };
      reader.readAsArrayBuffer(file);
    });
  };
  function getFileType(fileUrl: any) {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    return fileExtension;
  }
  const urlToFile = async (url: any, filename = "xxx.pptx") => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  };
  // 导入PPTX文件
  const importPPTXFile = (url: any) => {
    if (getFileType(url) === "pptx") {
      pptximport(url);
    } else {
      importSpecificFile(url);
    }
  };

  return {
    importPPTXFile,
    exporting,
    getFileType,
  };
};
