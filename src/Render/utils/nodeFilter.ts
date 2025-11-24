import Konva from "konva";
import { DrawGroupName } from "../types";

/**
 * 忽略选择时的辅助元素
 */
export function ignoreSelect(node: Konva.Node): boolean {
	return node.id() === "selectRect" || node.id() === "hoverRect";
}

/**
 * 忽略各 draw 的根 group
 * @param node - Konva 节点
 * @returns 是否忽略
 */
export function ignoreDraw(node: Konva.Node): boolean {
	return (
		node.name() === DrawGroupName.BG ||
		node.name() === DrawGroupName.RULER ||
		node.name() === DrawGroupName.SCALE_INFO ||
		node.name() === DrawGroupName.REFERENCE_LINE
	);
}

/**
 * 忽略连接线相关元素
 * @param node - Konva 节点
 * @returns 是否忽略
 */
export function ignoreLink(node: Konva.Node): boolean {
	return (
		node.name() === "link-anchor" ||
		node.name() === "linking-line" ||
		node.name() === "link-point" ||
		node.name() === "link-line" ||
		node.name() === "link-manual-point"
	);
}

/**
 * 忽略非素材
 * @param node - Konva 节点
 * @returns 是否忽略
 */
export function ignore(node: Konva.Node): boolean {
	// 素材有各自根 group
	const isGroup = node instanceof Konva.Group;
	return !isGroup || ignoreSelect(node) || ignoreDraw(node) || ignoreLink(node);
}
