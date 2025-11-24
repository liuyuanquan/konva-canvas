/**
 * 鼠标按钮常量
 */
export const MouseButton = {
	左键: 0,
	右键: 2,
} as const;

/**
 * 移动键常量（键盘按键代码）
 */
export const MoveKey = {
	上: "ArrowUp",
	下: "ArrowDown",
	左: "ArrowLeft",
	右: "ArrowRight",
} as const;

/**
 * 快捷键常量（键盘按键代码）
 */
export const ShortcutKey = {
	C: "KeyC",
	V: "KeyV",
	Z: "KeyZ",
	A: "KeyA",
	R: "KeyR",
	删除: "Delete",
	Backspace: "Backspace",
	Esc: "Escape",
} as const;

/**
 * 默认标尺大小（像素）
 */
export const DEFAULT_RULER_SIZE = 40;

/**
 * 默认背景网格大小（像素）
 */
export const DEFAULT_BG_SIZE = 40;

/**
 * 默认缩放配置
 */
export const DEFAULT_ZOOM_CONFIG = {
	/** 缩放速度 */
	scaleBy: 0.1,
	/** 最小缩放比例 */
	scaleMin: 0.2,
	/** 最大缩放比例 */
	scaleMax: 5,
} as const;

/**
 * 绘制组名称常量
 */
export const DrawGroupName = {
	/** 背景网格 */
	BG: "bg",
	/** 标尺 */
	RULER: "ruler",
	/** 缩放信息 */
	SCALE_INFO: "scaleInfo",
	/** 坐标参考线 */
	REFERENCE_LINE: "referenceLine",
	/** 右键菜单 */
	CONTEXT_MENU: "contextMenu",
} as const;

/**
 * 绘制函数键名类型（从 DrawGroupName 的值中提取）
 */
export type DrawGroupNameType =
	(typeof DrawGroupName)[keyof typeof DrawGroupName];
