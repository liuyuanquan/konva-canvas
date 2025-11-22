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
	/** 是否显示坐标参考线（跟随鼠标的十字线） */
	showRefLine?: boolean;
	/** 是否显示预览 */
	showPreview?: boolean;
	/** 是否显示右键菜单 */
	showContextmenu?: boolean;
	/** 是否显示缩放信息 */
	showScaleInfo?: boolean;

	/** 调整大小时是否启用吸附 */
	attractResize?: boolean;
	/** 是否吸附到背景网格 */
	attractBg?: boolean;
	/** 是否吸附到其他节点 */
	attractNode?: boolean;

	/** 是否为只读模式 */
	readonly?: boolean;
}
