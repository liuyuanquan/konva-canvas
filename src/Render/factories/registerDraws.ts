import type { InternalRenderInstance, RenderConfig } from "../types";
import { DrawGroupName } from "../types";
import { drawBg, drawRuler, drawScaleInfo, drawReferenceLine } from "../draws";

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
		drawFunctions.set(DrawGroupName.BG, () => drawBg(render, { size: 20 }));
	}

	// 注册标尺绘制
	if (!config.readonly && config.showRuler) {
		drawFunctions.set(DrawGroupName.RULER, () =>
			drawRuler(render, { size: rulerSize })
		);
	}

	// 注册缩放信息绘制
	if (!config.readonly && config.showScaleInfo) {
		drawFunctions.set(DrawGroupName.SCALE_INFO, () => drawScaleInfo(render));
	}

	// 注册参考线绘制
	if (!config.readonly && config.showRefLine) {
		drawFunctions.set(DrawGroupName.REFERENCE_LINE, () =>
			drawReferenceLine(render, { padding: rulerSize })
		);
	}
}
