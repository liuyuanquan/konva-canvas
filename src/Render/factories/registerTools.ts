import type { InternalRenderInstance, RenderConfig } from "../types";
import { createSelection } from "../tools";

/**
 * 注册所有工具
 */
export function registerTools(
	render: InternalRenderInstance,
	// @ts-ignore
	config: RenderConfig
): void {
	// 选择工具
	render.selectionTool = createSelection(render);
}
