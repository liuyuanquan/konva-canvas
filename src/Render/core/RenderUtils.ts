import Konva from "konva";
import type { Render } from "../index";
import * as Types from "../types";
import * as Draws from "../draws";

/**
 * Render 工具方法类
 * 包含各种工具函数
 */
export class RenderUtils {
	protected render: Render;

	constructor(render: Render) {
		this.render = render;
	}

	/**
	 * 忽略非素材
	 */
	ignore(node: Konva.Node): boolean {
		// 素材有各自根 group
		const isGroup = node instanceof Konva.Group;
		return (
			!isGroup ||
			this.ignoreSelect(node) ||
			this.ignoreDraw(node) ||
			this.ignoreLink(node)
		);
	}

	/**
	 * 忽略选择时的辅助元素
	 */
	ignoreSelect(node: Konva.Node): boolean {
		return node.id() === "selectRect" || node.id() === "hoverRect";
	}

	/**
	 * 忽略各 draw 的根 group
	 */
	ignoreDraw(node: Konva.Node): boolean {
		return (
			node.name() === Draws.BgDraw.name ||
			node.name() === Draws.RulerDraw.name ||
			node.name() === Draws.RefLineDraw.name ||
			node.name() === Draws.ContextmenuDraw.name ||
			node.name() === Draws.AttractDraw.name
		);
	}

	/**
	 * 忽略连接线相关元素
	 */
	ignoreLink(node: Konva.Node): boolean {
		return (
			node.name() === "link-anchor" ||
			node.name() === "linking-line" ||
			node.name() === "link-point" ||
			node.name() === "link-line" ||
			node.name() === "link-manual-point"
		);
	}

	/**
	 * 旋转点
	 */
	rotatePoint({ x, y }: { x: number; y: number }, rad: number) {
		const rCos = Math.cos(rad);
		const rSin = Math.sin(rad);
		return { x: x * rCos - y * rSin, y: y * rCos + x * rSin };
	}

	/**
	 * 围绕中心旋转节点
	 */
	rotateAroundCenter(node: Konva.Node, rotation: number) {
		const topLeft = { x: -node.width() / 2, y: -node.height() / 2 };
		const current = this.rotatePoint(topLeft, Konva.getAngle(node.rotation()));
		const rotated = this.rotatePoint(topLeft, Konva.getAngle(rotation));
		const dx = rotated.x - current.x;
		const dy = rotated.y - current.y;

		node.rotation(rotation);
		node.x(node.x() + dx);
		node.y(node.y() + dy);
	}

	/**
	 * 设置 SVG XML 样式（部分）
	 */
	setSvgXMLSettings(xml: string, settings: Types.AssetSettings): string {
		const reg =
			/<(circle|ellipse|line|path|polygon|rect|text|textPath|tref|tspan)[^>/]*\/?>/g;

		const shapes = xml.match(reg);

		const regStroke = / stroke="([^"]*)"/;
		const regFill = / fill="([^"]*)"/;

		for (const shape of shapes ?? []) {
			let result = shape;

			if (settings.stroke) {
				if (regStroke.test(shape)) {
					result = result.replace(regStroke, ` stroke="${settings.stroke}"`);
				} else {
					result = result.replace(
						/(<[^>/]*)(\/?>)/,
						`$1 stroke="${settings.stroke}" $2`
					);
				}
			}

			if (settings.fill) {
				if (regFill.test(shape)) {
					result = result.replace(regFill, ` fill="${settings.fill}"`);
				} else {
					result = result.replace(
						/(<[^>/]*)(\/?>)/,
						`$1 fill="${settings.fill}" $2`
					);
				}
			}

			xml = xml.replace(shape, result);
		}

		return xml;
	}
}
