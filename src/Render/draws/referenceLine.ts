import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { DrawGroupName } from "../types";

export interface ReferenceLineOptions {
	/** 参考线的内边距（标尺大小） */
	padding: number;
}

/**
 * 绘制坐标参考线（跟随鼠标的横竖十字线）
 * @param render - 内部渲染实例
 * @param options - 参考线选项
 */
export function drawReferenceLine(
	render: InternalRenderInstance,
	options: ReferenceLineOptions
): void {
	const layer = render.layers.cover;

	// 移除旧的参考线组
	const existingGroup = render.drawGroups.get(DrawGroupName.REFERENCE_LINE);
	if (existingGroup) {
		existingGroup.destroy();
	}

	// 获取鼠标位置
	const pos = render.stage.getPointerPosition();
	if (!pos) {
		// 鼠标不在 stage 上，不绘制
		return;
	}

	// 创建新的参考线组
	const group = new Konva.Group({ name: DrawGroupName.REFERENCE_LINE });
	group.listening(false);
	render.drawGroups.set(DrawGroupName.REFERENCE_LINE, group);

	// 获取 stage 状态
	const stageState = render.getStageState();

	// 绘制横线（水平线） - 只在鼠标 y 超过 padding 时绘制
	if (pos.y >= options.padding) {
		const horizontalLine = new Konva.Line({
			points: [
				render.toStageValue(-stageState.x),
				render.toStageValue(pos.y - stageState.y),
				render.toStageValue(stageState.width - stageState.x + render.rulerSize),
				render.toStageValue(pos.y - stageState.y),
			],
			stroke: "rgba(255,0,0,0.2)",
			strokeWidth: render.toStageValue(1),
			listening: false,
		});
		group.add(horizontalLine);
	}

	// 绘制竖线（垂直线） - 只在鼠标 x 超过 padding 时绘制
	if (pos.x >= options.padding) {
		const verticalLine = new Konva.Line({
			points: [
				render.toStageValue(pos.x - stageState.x),
				render.toStageValue(-stageState.y),
				render.toStageValue(pos.x - stageState.x),
				render.toStageValue(
					stageState.height - stageState.y + render.rulerSize
				),
			],
			stroke: "rgba(255,0,0,0.2)",
			strokeWidth: render.toStageValue(1),
			listening: false,
		});
		group.add(verticalLine);
	}

	// 添加到 cover 层
	layer.add(group);
}
