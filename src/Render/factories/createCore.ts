import Konva from "konva";
import type { RenderConfig, CoreSetup } from "../types";
import { DEFAULT_RULER_SIZE } from "../types";

/**
 * 创建 Konva Stage 和 Layers
 * @param container - 画布容器元素
 * @param config - 渲染器配置
 * @returns 核心设置对象
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

	// 创建多选器层
	const groupTransformer = new Konva.Group();
	const transformer = new Konva.Transformer({
		shouldOverdrawWholeArea: true, // 是否覆盖整个区域
		borderDash: [4, 4],
		padding: 1,
		rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315, 360],
		flipEnabled: false,
	});
	const selectRect = new Konva.Rect({
		id: "selectRect",
		fill: "rgba(0,0,255,0.1)",
		visible: false,
	});
	groupTransformer.add(transformer);
	groupTransformer.add(selectRect);
	layers.cover.add(groupTransformer);

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

	return {
		stage,
		layers,
		rulerSize,
		groupTransformer,
		transformer,
		selectRect,
	};
}
