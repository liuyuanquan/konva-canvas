import type { InternalRenderInstance, RenderConfig } from "../types";
import { createSelection, createCopy } from "../tools";

/**
 * 注册所有工具
 * @param render - 内部渲染实例
 * @param config - 渲染器配置
 */
export function registerTools(
	render: InternalRenderInstance,
	// @ts-ignore
	config: RenderConfig
): void {
	// 选择工具
	render.selectionTool = createSelection(render);

	// 复制工具
	render.copyTool = createCopy(render);
}
