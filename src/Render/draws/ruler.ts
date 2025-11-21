import Konva from "konva";
import flatten from "lodash-es/flatten";
import type { InternalRenderInstance } from "../types";

export interface RulerOptions {
	size: number;
}

/**
 * 绘制标尺
 */
export function drawRuler(
	render: InternalRenderInstance,
	options: RulerOptions = { size: 40 }
): void {
	const layer = render.layers.cover;
	const cellSize = 20;
	const fontSizeMax = 12;

	// 清除之前的标尺组
	const existingGroup = render.drawGroups.get("ruler");
	if (existingGroup) {
		existingGroup.destroy();
	}

	// 创建新的标尺组
	const group = new Konva.Group({ name: "ruler" });
	group.listening(false);
	render.drawGroups.set("ruler", group);

	// 获取 stage 状态
	const stageState = render.getStageState();

	// 列数
	const lenX = Math.ceil(render.toStageValue(stageState.width) / cellSize);
	// 行数
	const lenY = Math.ceil(render.toStageValue(stageState.height) / cellSize);

	const startX = -Math.ceil(
		render.toStageValue(stageState.x - options.size) / cellSize
	);
	const startY = -Math.ceil(
		render.toStageValue(stageState.y - options.size) / cellSize
	);

	// 比例尺 - 上
	const groupTop = new Konva.Group({
		x: render.toStageValue(-stageState.x + options.size),
		y: render.toStageValue(-stageState.y),
		width: render.toStageValue(
			stageState.width - options.size + render.rulerSize
		),
		height: render.toStageValue(options.size),
	});

	// 比例尺 - 左
	const groupLeft = new Konva.Group({
		x: render.toStageValue(-stageState.x),
		y: render.toStageValue(-stageState.y + options.size),
		width: render.toStageValue(options.size),
		height: render.toStageValue(
			stageState.height - options.size + render.rulerSize
		),
	});

	// 绘制顶部标尺
	{
		groupTop.add(
			new Konva.Rect({
				name: "ruler-top",
				x: 0,
				y: 0,
				width: groupTop.width(),
				height: groupTop.height(),
				fill: "#ddd",
			})
		);

		for (let x = lenX + startX - 1; x >= startX; x--) {
			const nx = -groupTop.x() + cellSize * x;
			const long = (render.toStageValue(options.size) / 5) * 4;
			const short = (render.toStageValue(options.size) / 5) * 3;

			if (nx >= 0) {
				groupTop.add(
					new Konva.Line({
						name: "ruler-line",
						points: flatten([
							[nx, x % 5 ? long : short],
							[nx, render.toStageValue(options.size)],
						]),
						stroke: "#999",
						strokeWidth: render.toStageValue(1),
						listening: false,
					})
				);

				if (x % 5 === 0) {
					let fontSize = fontSizeMax;
					const text = new Konva.Text({
						name: "ruler-text",
						y: render.toStageValue(options.size / 2 - fontSize),
						text: (x * cellSize).toString(),
						fontSize: render.toStageValue(fontSize),
						fill: "#999",
						align: "center",
						verticalAlign: "middle",
						lineHeight: 1.6,
					});

					while (
						render.toStageValue(text.width()) >
						render.toStageValue(cellSize) * 4.6
					) {
						fontSize -= 1;
						text.fontSize(render.toStageValue(fontSize));
						text.y(render.toStageValue(options.size / 2 - fontSize));
					}

					text.x(nx - text.width() / 2);
					groupTop.add(text);
				}
			}
		}
	}

	// 绘制左侧标尺
	{
		groupLeft.add(
			new Konva.Rect({
				name: "ruler-left",
				x: 0,
				y: 0,
				width: groupLeft.width(),
				height: groupLeft.height(),
				fill: "#ddd",
			})
		);

		for (let y = lenY + startY - 1; y >= startY; y--) {
			const ny = -groupLeft.y() + cellSize * y;
			const long = (render.toStageValue(options.size) / 5) * 4;
			const short = (render.toStageValue(options.size) / 5) * 3;

			if (ny >= 0) {
				groupLeft.add(
					new Konva.Line({
						name: "ruler-line",
						points: flatten([
							[y % 5 ? long : short, ny],
							[render.toStageValue(options.size), ny],
						]),
						stroke: "#999",
						strokeWidth: render.toStageValue(1),
						listening: false,
					})
				);

				if (y % 5 === 0) {
					let fontSize = fontSizeMax;
					const text = new Konva.Text({
						name: "ruler-text",
						x: 0,
						y: ny,
						text: (y * cellSize).toString(),
						fontSize: render.toStageValue(fontSize),
						fill: "#999",
						align: "right",
						verticalAlign: "bottom",
						lineHeight: 1.6,
						wrap: "none",
					});

					while (text.width() > short * 0.8) {
						fontSize -= 1;
						text.fontSize(render.toStageValue(fontSize));
					}

					text.y(ny - text.height() / 2);
					text.width(short - render.toStageValue(1));
					groupLeft.add(text);
				}
			}
		}
	}

	// 绘制左上角
	group.add(
		new Konva.Rect({
			name: "ruler-corner",
			x: render.toStageValue(-stageState.x),
			y: render.toStageValue(-stageState.y),
			width: render.toStageValue(options.size),
			height: render.toStageValue(options.size),
			fill: "#ddd",
		})
	);

	group.add(groupTop);
	group.add(groupLeft);

	layer.add(group);
}
