import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { DrawGroupName } from "../types";

/**
 * 绘制缩放信息（左上角显示）
 */
export function drawScaleInfo(render: InternalRenderInstance): void {
	const layer = render.layers.cover;

	// 移除旧的缩放信息组
	const existingGroup = render.drawGroups.get(DrawGroupName.SCALE_INFO);
	if (existingGroup) {
		existingGroup.destroy();
	}

	// 获取当前缩放比例
	const stageState = render.getStageState();
	const scale = stageState.scale;
	const scaleText = `x${scale.toFixed(1)}`;

	const fontSize = 12;

	// 创建新的缩放信息组（y 值与标尺文字高度一致）
	const group = new Konva.Group({
		name: DrawGroupName.SCALE_INFO,
		x: render.toStageValue(-stageState.x + 10),
		y: render.toStageValue(-stageState.y + render.rulerSize / 2 - fontSize),
	});
	group.listening(false);
	render.drawGroups.set(DrawGroupName.SCALE_INFO, group);

	// 创建文本
	const text = new Konva.Text({
		x: 0,
		y: 0,
		text: scaleText,
		fontSize: render.toStageValue(fontSize),
		fill: "blue",
		listening: false,
		align: "center",
		verticalAlign: "middle",
		lineHeight: 1.6,
	});

	group.add(text);

	// 添加到 cover 层
	layer.add(group);
}
