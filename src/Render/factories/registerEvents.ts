import type { InternalRenderInstance, RenderConfig } from "../types";
import { DEFAULT_ZOOM_CONFIG } from "../types";
import {
	enableDrag,
	enableZoom,
	enableReferenceLine,
	enableDragOutside,
} from "../interactions";

/**
 * 注册所有事件处理（拖拽、缩放等）
 */
export function registerEvents(
	render: InternalRenderInstance,
	config: RenderConfig,
	cleanupFunctions: (() => void)[]
): void {
	// 启用右键拖拽功能
	if (!config.readonly) {
		const cleanupDrag = enableDrag(render);
		cleanupFunctions.push(cleanupDrag);
	}

	// 启用缩放功能
	if (!config.readonly && config.zoom?.enabled !== false) {
		const cleanupZoom = enableZoom(render, {
			scaleBy: config.zoom?.scaleBy ?? DEFAULT_ZOOM_CONFIG.scaleBy,
			scaleMin: config.zoom?.scaleMin ?? DEFAULT_ZOOM_CONFIG.scaleMin,
			scaleMax: config.zoom?.scaleMax ?? DEFAULT_ZOOM_CONFIG.scaleMax,
		});
		cleanupFunctions.push(cleanupZoom);
	}

	// 启用参考线功能（监听鼠标移动）
	if (!config.readonly && config.showRefLine) {
		const cleanupReferenceLine = enableReferenceLine(render);
		cleanupFunctions.push(cleanupReferenceLine);
	}

	// 启用外部拖拽放置功能（从素材面板拖拽到画布）
	if (!config.readonly && config.onDrop) {
		const cleanupDragOutside = enableDragOutside(render, config.onDrop);
		cleanupFunctions.push(cleanupDragOutside);
	}
}
