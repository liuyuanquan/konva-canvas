/**
 * 鼠标按钮常量
 */
export const MouseButton = {
	左键: 0,
	右键: 2,
} as const;

/**
 * 默认标尺大小（像素）
 */
export const DEFAULT_RULER_SIZE = 40;

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
