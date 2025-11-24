import flatten from "lodash-es/flatten";
import Konva from "konva";
//
import * as Types from "../types";
import { BaseDraw } from "./BaseDraw";

export interface BgDrawOption {
	size: number;
}
export class BgDraw extends BaseDraw implements Types.Draw {
	option: BgDrawOption;

	constructor(render: Types.Render, layer: Konva.Layer, option: BgDrawOption) {
		super(render, layer);

		this.option = option;

		this.group.listening(false);
	}

	override draw() {
		this.clear();

		// stage 状态
		const stageState = this.getStageState();

		// 相关参数

		// 格子大小
		const cellSize = this.option.size;

		// 列数
		const lenX = Math.ceil(
			this.toStageValue(stageState.width + this.render.rulerSize) / cellSize
		);
		// 行数
		const lenY = Math.ceil(
			this.toStageValue(stageState.height + this.render.rulerSize) / cellSize
		);

		const startX = -Math.ceil(this.toStageValue(stageState.x) / cellSize);
		const startY = -Math.ceil(this.toStageValue(stageState.y) / cellSize);

		const group = new Konva.Group();

		group.add(
			new Konva.Rect({
				name: `${this.constructor.name}__background`,
				x: this.toStageValue(-stageState.x + this.render.rulerSize),
				y: this.toStageValue(-stageState.y + this.render.rulerSize),
				width: this.toStageValue(stageState.width),
				height: this.toStageValue(stageState.height),
				listening: false,
				fill: this.render.getPageSettings().background,
			})
		);

		group.add(
			new Konva.Rect({
				name: this.constructor.name,
				x: 0,
				y: 0,
				width: stageState.width,
				height: stageState.height,
				stroke: "rgba(255,0,0,0.2)",
				strokeWidth: this.toStageValue(2),
				listening: false,
				dash: [this.toStageValue(6), this.toStageValue(6)],
			})
		);

		// 竖线
		for (let x = startX; x < lenX + startX + 2; x++) {
			group.add(
				new Konva.Line({
					name: this.constructor.name,
					points: flatten([
						[
							cellSize * x,
							this.toStageValue(-stageState.y + this.render.rulerSize),
						],
						[
							cellSize * x,
							this.toStageValue(
								stageState.height - stageState.y + this.render.rulerSize
							),
						],
					]),
					stroke: "#ddd",
					strokeWidth: this.toStageValue(1),
					listening: false,
				})
			);
		}

		// 横线
		for (let y = startY; y < lenY + startY + 2; y++) {
			group.add(
				new Konva.Line({
					name: this.constructor.name,
					points: flatten([
						[
							this.toStageValue(-stageState.x + this.render.rulerSize),
							cellSize * y,
						],
						[
							this.toStageValue(
								stageState.width - stageState.x + this.render.rulerSize
							),
							cellSize * y,
						],
					]),
					stroke: "#ddd",
					strokeWidth: this.toStageValue(1),
					listening: false,
				})
			);
		}

		this.group.add(group);
	}
}
Object.defineProperty(BgDraw, "name", {
	value: "bg",
	writable: false,
	configurable: false,
});
