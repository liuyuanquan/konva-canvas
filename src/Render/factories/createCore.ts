import Konva from "konva";
import type { RenderConfig, CoreSetup } from "../types";
import { DEFAULT_RULER_SIZE } from "../types";

/**
 * 创建 Konva Stage 和 Layers
 */
export function createCore(
	container: HTMLDivElement,
	config: RenderConfig
): CoreSetup {
	const rulerSize = config.showRuler ? DEFAULT_RULER_SIZE : 0;

	// 创建 stage
	const stage = new Konva.Stage({
		container,
		x: rulerSize,
		y: rulerSize,
		width: config.width,
		height: config.height,
	});

	// 创建 layers
	const layers = {
		floor: new Konva.Layer({ id: "floor" }),
		main: new Konva.Layer({ id: "main" }),
		cover: new Konva.Layer({ id: "cover" }),
	};

	// 添加 layers 到 stage
	stage.add(layers.floor);
	stage.add(layers.main);
	stage.add(layers.cover);

	// 设置 data 属性
	layers.floor
		.getNativeCanvasElement()
		.setAttribute("data-layer-type", "floor");
	layers.main.getNativeCanvasElement().setAttribute("data-layer-type", "main");
	layers.cover
		.getNativeCanvasElement()
		.setAttribute("data-layer-type", "cover");

	return { stage, layers, rulerSize };
}
