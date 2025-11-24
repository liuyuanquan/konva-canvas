import type { Render } from "../index";
import * as Types from "../types";
import * as Draws from "../draws";

/**
 * Handler 基类
 * 提供公共方法和属性
 */
export abstract class BaseHandler implements Types.Handler {
	static readonly name: string;

	protected render: Render;

	// Handler 接口的可选属性，由子类实现
	handlers?: Types.Handler["handlers"];
	transformerConfig?: Types.Handler["transformerConfig"];

	constructor(render: Render) {
		this.render = render;
	}

	/**
	 * 重绘指定的 Draw
	 */
	protected redraw(drawNames?: string[]) {
		this.render.redraw(drawNames);
	}

	/**
	 * 获取常用 Draw 名称数组
	 */
	protected getCommonDrawNames(): string[] {
		return [Draws.RulerDraw.name, Draws.ScaleInfoDraw.name];
	}
}
