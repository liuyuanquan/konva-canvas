import type { InternalRenderInstance, RenderConfig } from "../types";
import { drawBg, drawRuler } from "../draws";

/**
 * 注册所有绘制函数
 */
export function registerDraws(
	render: InternalRenderInstance,
	config: RenderConfig,
	drawFunctions: Map<string, () => void>
): void {
	const { rulerSize } = render;

	// 注册背景绘制
	if (!config.readonly && config.showBg) {
		drawFunctions.set("bg", () => drawBg(render, { size: 20 }));
	}

	// 注册标尺绘制
	if (!config.readonly && config.showRuler) {
		drawFunctions.set("ruler", () => drawRuler(render, { size: rulerSize }));
	}
}
