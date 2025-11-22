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

	// 背景
	if (!config.readonly && config.showBg) {
		drawFunctions.set(DrawGroupName.BG, () => drawBg(render, { size: 20 }));
	}

	// 标尺
	if (!config.readonly && config.showRuler) {
		drawFunctions.set(DrawGroupName.RULER, () =>
			drawRuler(render, { size: rulerSize })
		);
	}

	// 左上角缩放信息
	if (!config.readonly && config.showScaleInfo) {
		drawFunctions.set(DrawGroupName.SCALE_INFO, () => drawScaleInfo(render));
	}

	// 参考线
	if (!config.readonly && config.showRefLine) {
		drawFunctions.set(DrawGroupName.REFERENCE_LINE, () =>
			drawReferenceLine(render, { padding: rulerSize })
		);
	}
}
