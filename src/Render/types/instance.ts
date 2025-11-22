import Konva from "konva";
import type { RenderConfig } from "./config";
import type { SelectionTool } from "../types";

/**
 * Stage 状态
 */
export interface StageState {
	width: number;
	height: number;
	scale: number;
	x: number;
	y: number;
}

/**
 * 渲染图层
 */
export interface RenderLayers {
	/** 底层图层（用于背景、网格等） */
	floor: Konva.Layer;
	/** 主图层（用于用户元素） */
	main: Konva.Layer;
	/** 覆盖层（用于标尺、辅助线等） */
	cover: Konva.Layer;
}

/**
 * 核心创建返回类型
 */
export interface CoreSetup {
	stage: Konva.Stage;
	layers: RenderLayers;
	rulerSize: number;
	groupTransformer: Konva.Group;
	transformer: Konva.Transformer;
	selectRect: Konva.Rect;
}

/**
 * 渲染实例接口（对外 API）
 */
export interface RenderInstance {
	// 配置信息（只读）
	readonly config: RenderConfig;

	// 画布操作
	resize: (width: number, height: number) => void;
	redraw: (drawNames?: string[]) => void;
	destroy: () => void;

	// 状态获取
	getStageState: () => StageState;

	// 坐标转换
	toStageValue: (boardPos: number) => number;
	toBoardValue: (stagePos: number) => number;

	// 元素操作
	changeDraggable: (draggable: boolean) => void;

	// 元素过滤（忽略特定类型的节点）
	ignore: (node: Konva.Node) => boolean;
	ignoreSelect: (node: Konva.Node) => boolean;
	ignoreDraw: (node: Konva.Node) => boolean;
	ignoreLink: (node: Konva.Node) => boolean;
}

/**
 * 内部实例接口（包含所有属性和方法）
 */
export interface InternalRenderInstance extends RenderInstance {
	// 内部属性
	stage: Konva.Stage;
	layers: RenderLayers;
	rulerSize: number;
	drawGroups: Map<string, Konva.Group>;

	// 选择相关
	groupTransformer: Konva.Group;
	transformer: Konva.Transformer;
	selectRect: Konva.Rect;

	// 工具
	selectionTool: SelectionTool;
}

/**
 * 绘制函数类型（接收内部实例）
 */
export type DrawFunction = (render: InternalRenderInstance) => void;
