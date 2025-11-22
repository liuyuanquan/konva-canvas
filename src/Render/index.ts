import type { RenderConfig, RenderInstance } from "./types";
import { createCore, createInstance } from "./factories";

/**
 * 创建渲染器实例
 */
export function createRender(
	container: HTMLDivElement,
	config: RenderConfig
): RenderInstance {
	// 1. 创建核心 Stage 和 Layers
	const core = createCore(container, config);

	// 2. 创建并初始化渲染实例
	const instance = createInstance(core, config);

	// 3. 返回公共 API
	return instance as RenderInstance;
}

// 导出类型
export type { RenderInstance, RenderConfig } from "./types";
