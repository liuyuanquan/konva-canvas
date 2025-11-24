import Konva from "konva";
import * as Types from "../types";
import { BaseDraw } from "./BaseDraw";

export interface ScaleInfoDrawOption {
	// 暂无配置项
}

export class ScaleInfoDraw extends BaseDraw implements Types.Draw {
	option: ScaleInfoDrawOption;

	constructor(
		render: Types.Render,
		layer: Konva.Layer,
		option: ScaleInfoDrawOption
	) {
		super(render, layer);

		this.option = option;

		this.group.listening(false);
	}

	override draw() {
		this.clear();

		// 获取当前缩放比例
		const stageState = this.render.getStageState();
		const scale = stageState.scale;
		const scaleText = `x${scale.toFixed(1)}`;

		const fontSize = 12;

		// 设置 group 的位置和缩放
		this.group.setAttrs({
			x: this.render.toStageValue(-stageState.x + 10),
			y: this.render.toStageValue(
				-stageState.y + this.render.rulerSize / 2 - fontSize
			),
		});

		// 创建文本（相对于 group，位置在左上角）
		// 由于 group 已经抵消了 scale，所以 fontSize 使用固定像素值
		const text = new Konva.Text({
			name: this.constructor.name,
			x: 0,
			y: 0,
			text: scaleText,
			fontSize: this.render.toStageValue(fontSize),
			fill: "blue",
			listening: false,
			align: "center",
			verticalAlign: "middle",
			lineHeight: 1.6,
		});

		this.group.add(text);
	}
}
Object.defineProperty(ScaleInfoDraw, "name", {
	value: "scaleInfo",
	writable: false,
	configurable: false,
});
