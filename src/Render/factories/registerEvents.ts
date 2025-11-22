import type { InternalRenderInstance, RenderConfig } from "../types";
import {
	enableDrag,
	enableZoom,
	enableReferenceLine,
	enableDragOutside,
	enableSelection,
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
	const cleanupDrag = enableDrag(render);
	cleanupFunctions.push(cleanupDrag);

	// 启用缩放功能
	const cleanupZoom = enableZoom(render);
	cleanupFunctions.push(cleanupZoom);

	if (!config.readonly) {
		// 启用外部拖拽放置功能（从素材面板拖拽到画布）
		const cleanupDragOutside = enableDragOutside(render);
		cleanupFunctions.push(cleanupDragOutside);

		// 启用多选器功能
		const cleanupSelection = enableSelection(render);
		cleanupFunctions.push(cleanupSelection);
	}

	// 启用参考线功能（监听鼠标移动）
	if (!config.readonly && config.showRefLine) {
		const cleanupReferenceLine = enableReferenceLine(render);
		cleanupFunctions.push(cleanupReferenceLine);
	}
}
