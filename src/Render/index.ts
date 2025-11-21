import type {
	RenderConfig,
	RenderInstance,
	InternalRenderInstance,
} from "./types";
import {
	createCore,
	createInstance,
	registerDraws,
	registerEvents,
} from "./factories";

/**
 * 创建渲染器实例
 */
export function createRender(
	container: HTMLDivElement,
	config: RenderConfig
): RenderInstance {
	// 1. 创建核心 Stage 和 Layers
	const { stage, layers, rulerSize } = createCore(container, config);

	// 2. 准备内部状态
	const drawGroups = new Map();
	const drawFunctions = new Map<string, () => void>();
	const cleanupFunctions: (() => void)[] = [];

	// 3. 创建渲染实例（内部实例）
	const internalRender = createInstance({
		stage,
		layers,
		config,
		rulerSize,
		drawGroups,
		drawFunctions,
		cleanupFunctions,
	});

	// 4. 注册绘制功能
	registerDraws(internalRender, config, drawFunctions);

	// 5. 注册交互事件
	registerEvents(internalRender, config, cleanupFunctions);

	// 6. 触发初始渲染
	internalRender.redraw();

	// 7. 返回公共 API
	return internalRender as RenderInstance;
}

// 导出类型
export type { RenderInstance, RenderConfig } from "./types";
