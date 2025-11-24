import Konva from "konva";
import type { Render } from "./index";

export type ValueOf<T> = T[keyof T];

export interface RenderConfig {
	width: number;
	height: number;
	//
	showBg?: boolean;
	showRuler?: boolean;
	showScaleInfo?: boolean;
	showRefLine?: boolean;
	showPreview?: boolean;
	showContextmenu?: boolean;
	//
	attractResize?: boolean;
	attractBg?: boolean;
	attractNode?: boolean;
	//
	readonly?: boolean;
}

export type RenderEvents = {
	["history-change"]: { records: string[]; index: number };
	["selection-change"]: Konva.Node[];
	["debug-change"]: boolean;
	["link-type-change"]: LinkType;
	["scale-change"]: number;
	["loading"]: boolean;
	["graph-type-change"]: GraphType | undefined;
	["texting-change"]: boolean;
	//
	["page-settings-change"]: PageSettings;
	["link-selection-change"]: Konva.Line | undefined;
	["asset-position-change"]: Konva.Node[];
	["asset-rotation-change"]: Konva.Node[];
};

export interface Handler {
	handlers?: {
		stage?: {
			[index: string]: (e?: any) => void | boolean;
		};
		dom?: {
			[index: string]: (e?: any) => void;
		};
		transformer?: {
			[index: string]: (e?: any) => void;
		};
	};
	transformerConfig?: {
		anchorDragBoundFunc?: (
			oldPos: Konva.Vector2d,
			newPos: Konva.Vector2d,
			e: MouseEvent
		) => Konva.Vector2d;
		dragBoundFunc?: (newPos: Konva.Vector2d, e: MouseEvent) => Konva.Vector2d;
	};
}

export const MouseButton = {
	左键: 0,
	右键: 2,
} as const;

export type MouseButton = (typeof MouseButton)[keyof typeof MouseButton];

export interface Draw {
	readonly layer: Konva.Layer;

	option: {
		[index: string]: any;
	};
	init: () => void;
	draw: () => void;
	clear: () => void;
}

export type { Render };

export interface AssetInfoPoint {
	x: number;
	y: number;
	direction?: "top" | "bottom" | "left" | "right"; // 人为定义连接点属于元素的什么方向
	alias?: string;
}

export interface AssetInfo {
	url: string;
	avatar?: string; // 子素材需要额外的封面
	points?: Array<AssetInfoPoint>;
}

export const MoveKey = {
	上: "ArrowUp",
	左: "ArrowLeft",
	右: "ArrowRight",
	下: "ArrowDown",
} as const;

export type MoveKey = (typeof MoveKey)[keyof typeof MoveKey];

export const ShutcutKey = {
	删除: "Delete",
	C: "KeyC",
	V: "KeyV",
	Z: "KeyZ",
	A: "KeyA",
	R: "KeyR",
	Esc: "Escape",
	Backspace: "Backspace",
	Enter: "Enter",
} as const;

export type ShutcutKey = (typeof ShutcutKey)[keyof typeof ShutcutKey];

export const AlignType = {
	垂直居中: "Middle",
	左对齐: "Left",
	右对齐: "Right",
	水平居中: "Center",
	上对齐: "Top",
	下对齐: "Bottom",
} as const;

export type AlignType = (typeof AlignType)[keyof typeof AlignType];

// 连接线 类型
export const LinkType = {
	auto: "auto",
	straight: "straight", // 直线
	manual: "manual", // 折线
	curve: "curve", // 曲线
	bezier: "bezier", // 贝赛尔曲线
} as const;

export type LinkType = (typeof LinkType)[keyof typeof LinkType];

/**
 * 连接对
 */
export interface LinkDrawPair {
	id: string;
	from: {
		groupId: string;
		pointId: string;
		rawGroupId?: string; // 预留
	};
	to: {
		groupId: string;
		pointId: string;
		rawGroupId?: string; // 预留
	};
	disabled?: boolean; // 标记为 true，算法会忽略该 pair 的画线逻辑
	linkType?: LinkType; // 连接线类型
	style?: Konva.LineConfig & LinkSettings;
}

/**
 * 连接点
 */
export interface LinkDrawPoint {
	id: string;
	groupId: string;
	rawGroupId?: string; // 预留
	visible: boolean;
	pairs: LinkDrawPair[];
	x: number;
	y: number;
	direction?: "top" | "bottom" | "left" | "right"; // 人为定义连接点属于元素的什么方向
	alias?: string;
}

/**
 * 连接线 拐点
 */
export interface ManualPoint {
	x: number;
	y: number;
}

/**
 * 连接线 拐点 表
 */
export interface ManualPointsMap {
	[index: string]: ManualPoint[];
}

/**
 * 直线、折线 拐点
 */
export interface LineManualPoint {
	x: number;
	y: number;
	index: number;
}

/**
 * 图形类型
 */
export const GraphType = {
	Line: "Line", // 直线
	Curve: "Curve", // 曲线
	Rect: "Rect", // 矩形
	Circle: "Circle", // 圆/椭圆形
	Bezier: "Bezier", // 贝赛尔曲线
} as const;

export type GraphType = (typeof GraphType)[keyof typeof GraphType];

/**
 * 图形 的 调整点 信息
 */
export interface GraphAnchor {
	type?: GraphType;
	adjustType: string;
	//
	name?: string;
	groupId?: string;
	//
	adjusted?: boolean;
}

/**
 * 图形 的 调整点 图形、锚点关系
 */
export interface GraphAnchorShape {
	shape: Konva.Shape;
	anchorShadow: Konva.Circle;
}

/**
 * 素材类型
 */
export const AssetType = {
	Image: "Image",
	Json: "Json",
	Graph: "Graph",
	Text: "Text",
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

/**
 * 图片类型
 */
export const ImageType = {
	svg: "svg",
	gif: "gif",
	other: "other",
} as const;

export type ImageType = (typeof ImageType)[keyof typeof ImageType];

/**
 * 对齐信息
 */
export interface SortItem {
	id?: number; // 有 id 就是其他节点，否则就是 选择目标
	value: number; // 左、垂直中、右的 x 坐标值; 上、水平中、下的 y 坐标值；
}

/**
 * 页面设置
 */
export interface PageSettings {
	background: string;
	stroke: string;
	strokeWidth: number;
	fill: string;
	linkStroke: string;
	linkStrokeWidth: number;
	fontSize: number;
	textFill: string;
}

/**
 * 素材设置
 */
export interface AssetSettings {
	stroke: string;
	strokeWidth: number;
	fill: string;
	arrowStart: boolean;
	arrowEnd: boolean;
	fontSize: number;
	textFill: string;
	text: string;
	x: number;
	y: number;
	rotation: number;
	tension: number;
}

/**
 * 连接线设置
 */
export interface LinkSettings {
	stroke: string;
	strokeWidth: number;
	arrowStart: boolean;
	arrowEnd: boolean;
	tension: number;
}
