import Konva from "konva";
import flatten from "lodash-es/flatten";
import type { InternalRenderInstance } from "../types";
import { DrawGroupName } from "../types";

/**
 * 背景选项
 */
export interface BgOptions {
	/** 网格大小 */
	size: number;
}

/**
 * 绘制背景网格
 * @param render - 内部渲染实例
 * @param options - 背景选项
 */
export function drawBg(
	render: InternalRenderInstance,
	options: BgOptions = { size: 20 }
): void {
	const layer = render.layers.floor;
	const cellSize = options.size;

	// 清除之前的背景组
	const existingGroup = render.drawGroups.get(DrawGroupName.BG);
	if (existingGroup) {
		existingGroup.destroy();
	}

	// 创建新的背景组
	const group = new Konva.Group({ name: DrawGroupName.BG });
	group.listening(false);
	render.drawGroups.set(DrawGroupName.BG, group);

	// 获取 stage 状态
	const stageState = render.getStageState();

	// 列数
	const lenX = Math.ceil(
		render.toStageValue(stageState.width + render.rulerSize) / cellSize
	);
	// 行数
	const lenY = Math.ceil(
		render.toStageValue(stageState.height + render.rulerSize) / cellSize
	);

	const startX = -Math.ceil(render.toStageValue(stageState.x) / cellSize);
	const startY = -Math.ceil(render.toStageValue(stageState.y) / cellSize);

	// group.add(
	// 	new Konva.Rect({
	// 		name: "bg-border",
	// 		x: 0,
	// 		y: 0,
	// 		width: stageState.width,
	// 		height: stageState.height,
	// 		stroke: "rgba(255,0,0,0.2)",
	// 		strokeWidth: render.toStageValue(2),
	// 		listening: false,
	// 		dash: [render.toStageValue(6), render.toStageValue(6)],
	// 	})
	// );

	// 绘制背景矩形
	group.add(
		new Konva.Rect({
			name: "bg-background",
			x: render.toStageValue(-stageState.x + render.rulerSize),
			y: render.toStageValue(-stageState.y + render.rulerSize),
			width: render.toStageValue(stageState.width),
			height: render.toStageValue(stageState.height),
			listening: false,
			fill: "transparent",
		})
	);

	// 绘制竖线
	for (let x = startX; x < lenX + startX + 2; x++) {
		group.add(
			new Konva.Line({
				name: "bg-line",
				points: flatten([
					[cellSize * x, render.toStageValue(-stageState.y + render.rulerSize)],
					[
						cellSize * x,
						render.toStageValue(
							stageState.height - stageState.y + render.rulerSize
						),
					],
				]),
				stroke: "#ddd",
				strokeWidth: render.toStageValue(1),
				listening: false,
			})
		);
	}

	// 绘制横线
	for (let y = startY; y < lenY + startY + 2; y++) {
		group.add(
			new Konva.Line({
				name: "bg-line",
				points: flatten([
					[render.toStageValue(-stageState.x + render.rulerSize), cellSize * y],
					[
						render.toStageValue(
							stageState.width - stageState.x + render.rulerSize
						),
						cellSize * y,
					],
				]),
				stroke: "#ddd",
				strokeWidth: render.toStageValue(1),
				listening: false,
			})
		);
	}

	// 绘制背景边框
	group.add(
		new Konva.Rect({
			name: "bg-border",
			x: 0,
			y: 0,
			width: stageState.width,
			height: stageState.height,
			stroke: "rgba(255,0,0,0.2)",
			strokeWidth: render.toStageValue(1),
			listening: false,
			dash: [render.toStageValue(6), render.toStageValue(6)],
		})
	);

	layer.add(group);
}
