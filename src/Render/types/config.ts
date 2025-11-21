/**
 * 缩放配置
 */
export interface ZoomConfig {
	/** 是否启用缩放功能 */
	enabled?: boolean;
	/** 缩放速度（默认 0.1） */
	scaleBy?: number;
	/** 最小缩放比例（默认 0.2） */
	scaleMin?: number;
	/** 最大缩放比例（默认 5） */
	scaleMax?: number;
}

/**
 * 渲染器配置
 */
export interface RenderConfig {
	/** 画布宽度（像素） */
	width: number;
	/** 画布高度（像素） */
	height: number;

	/** 是否显示背景网格 */
	showBg?: boolean;
	/** 是否显示标尺 */
	showRuler?: boolean;
	/** 是否显示参考线 */
	showRefLine?: boolean;
	/** 是否显示预览 */
	showPreview?: boolean;
	/** 是否显示右键菜单 */
	showContextmenu?: boolean;

	/** 调整大小时是否启用吸附 */
	attractResize?: boolean;
	/** 是否吸附到背景网格 */
	attractBg?: boolean;
	/** 是否吸附到其他节点 */
	attractNode?: boolean;

	/** 是否为只读模式 */
	readonly?: boolean;

	/** 缩放相关配置 */
	zoom?: ZoomConfig;
}
