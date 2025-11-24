import Konva from "konva";
import type { InternalRenderInstance, RenderConfig } from "../types";
import {
	enableDrag,
	enableZoom,
	enableReferenceLine,
	enableDragOutside,
	enableSelection,
	enableKeyMove,
	enableAttractResize,
} from "../interactions";

/**
 * 注册所有事件处理（拖拽、缩放等）
 * @param render - 内部渲染实例
 * @param config - 渲染器配置
 * @param cleanupFunctions - 清理函数数组
 */
export function registerEvents(
	render: InternalRenderInstance,
	config: RenderConfig,
	cleanupFunctions: (() => void)[]
): void {
	const container = render.stage.container();
	// 设置容器焦点
	container.focus();

	// 收集所有容器（DOM）事件处理器
	const containerEventHandlers = new Map<string, Set<(e: Event) => void>>();
	// 收集所有 Stage（Konva）事件处理器
	const stageEventHandlers = new Map<
		string,
		Set<(e: Konva.KonvaEventObject<any>) => void>
	>();
	// 收集所有 Transformer（Konva）事件处理器
	const transformerEventHandlers = new Map<
		string,
		Set<(e: Konva.KonvaEventObject<any>) => void>
	>();

	/**
	 * 合并事件处理器到对应的 Map
	 */
	const mergeHandlers = (handlers: {
		dom: Record<string, (e: Event) => void>;
		stage: Record<string, (e: Konva.KonvaEventObject<any>) => void>;
		transformer: Record<string, (e: Konva.KonvaEventObject<any>) => void>;
	}) => {
		// 合并 DOM 事件处理器
		Object.entries(handlers.dom).forEach(([eventType, handler]) => {
			if (!containerEventHandlers.has(eventType)) {
				containerEventHandlers.set(eventType, new Set());
			}
			containerEventHandlers.get(eventType)!.add(handler);
		});

		// 合并 Stage 事件处理器
		Object.entries(handlers.stage).forEach(([eventType, handler]) => {
			if (!stageEventHandlers.has(eventType)) {
				stageEventHandlers.set(eventType, new Set());
			}
			stageEventHandlers.get(eventType)!.add(handler);
		});

		// 合并 Transformer 事件处理器
		Object.entries(handlers.transformer).forEach(([eventType, handler]) => {
			if (!transformerEventHandlers.has(eventType)) {
				transformerEventHandlers.set(eventType, new Set());
			}
			transformerEventHandlers.get(eventType)!.add(handler);
		});
	};

	/**
	 * 绑定容器（DOM）事件
	 */
	const bindContainerEvents = (
		handlers: Map<string, Set<(e: Event) => void>>
	) => {
		handlers.forEach((handlerSet, eventType) => {
			const unifiedHandler = (e: Event) => {
				e.preventDefault();
				handlerSet.forEach((handler) => handler(e));
			};
			container.addEventListener(eventType, unifiedHandler);
			cleanupFunctions.push(() => {
				container.removeEventListener(eventType, unifiedHandler);
			});
		});
	};

	/**
	 * 绑定 Konva 事件（Stage 或 Transformer）
	 */
	const bindKonvaEvents = (
		target: Konva.Stage | Konva.Transformer,
		handlers: Map<string, Set<(e: Konva.KonvaEventObject<any>) => void>>
	) => {
		handlers.forEach((handlerSet, eventType) => {
			const unifiedHandler = (e: Konva.KonvaEventObject<any>) => {
				e.evt.preventDefault();
				handlerSet.forEach((handler) => handler(e));
			};
			target.on(eventType, unifiedHandler);
			cleanupFunctions.push(() => {
				target.off(eventType, unifiedHandler);
			});
		});
	};

	// 设置容器焦点的事件处理器
	const handleFocus = (_e: Event) => {
		container.focus();
	};

	// 基础焦点事件
	containerEventHandlers.set("mouseenter", new Set([handleFocus]));
	containerEventHandlers.set("dragenter", new Set([handleFocus]));

	// 启用基础功能（始终启用）
	mergeHandlers(enableDrag(render));
	mergeHandlers(enableZoom(render));

	if (!config.readonly) {
		// 启用只读模式下禁用的功能
		mergeHandlers(enableDragOutside(render));
		mergeHandlers(enableSelection(render));
		mergeHandlers(enableKeyMove(render));

		// 启用可选功能
		if (config.attractResize) {
			const cleanupAttractResize = enableAttractResize(render);
			cleanupFunctions.push(cleanupAttractResize);
		}

		if (config.showRefLine) {
			mergeHandlers(enableReferenceLine(render));
		}
	}

	// 统一绑定容器（DOM）事件
	bindContainerEvents(containerEventHandlers);

	// 统一绑定 Stage（Konva）事件
	bindKonvaEvents(render.stage, stageEventHandlers);

	// 统一绑定 Transformer（Konva）事件
	bindKonvaEvents(render.transformer, transformerEventHandlers);
}
