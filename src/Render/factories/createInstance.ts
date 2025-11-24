import Konva from "konva";
import type {
	InternalRenderInstance,
	StageState,
	CoreSetup,
	RenderConfig,
} from "../types";
import { DrawGroupName } from "../types";
import { registerDraws } from "./registerDraws";
import { registerTools } from "./registerTools";
import { registerEvents } from "./registerEvents";
import { ignore, ignoreSelect, ignoreDraw, ignoreLink } from "../utils";

/**
 * 创建 InternalRenderInstance 对象
 * @param core - 核心设置（Stage、Layers 等）
 * @param config - 渲染器配置
 * @returns 内部渲染实例
 */
export function createInstance(
	core: CoreSetup,
	config: RenderConfig
): InternalRenderInstance {
	const {
		stage,
		layers,
		rulerSize,
		groupTransformer,
		transformer,
		selectRect,
	} = core;

	// 创建内部状态
	const drawGroups = new Map<string, Konva.Group>();
	const drawFunctions = new Map<string, () => void>();
	const cleanupFunctions: (() => void)[] = [];

	// 创建内部实例（包含所有属性）
	const internalRender: InternalRenderInstance = {
		// ========== 内部属性 ==========
		stage,
		layers,
		config,
		rulerSize,
		drawGroups,

		// ========== 选择相关 ==========
		groupTransformer,
		transformer,
		selectRect,

		// ========== 画布操作 ==========
		/**
		 * 调整画布尺寸
		 * @param width - 画布宽度
		 * @param height - 画布高度
		 */
		resize(width: number, height: number) {
			stage.setAttrs({ width, height });
			internalRender.redraw();
		},

		/**
		 * 重绘画布（可选择性重绘指定部分）
		 * @param drawNames - 需要重绘的绘制组名称数组，不传则重绘全部
		 */
		redraw(drawNames?: string[]) {
			const allDrawNames = Array.from(drawFunctions.keys());

			if (Array.isArray(drawNames)) {
				// 选择性重绘（保持顺序）
				for (const name of allDrawNames) {
					if (drawNames.includes(name)) {
						drawFunctions.get(name)?.();
					}
				}
			} else {
				// 全部重绘
				for (const drawFn of drawFunctions.values()) {
					drawFn();
				}
			}
		},

		/**
		 * 销毁渲染实例
		 */
		destroy() {
			// 清理所有事件
			for (const cleanup of cleanupFunctions) {
				cleanup();
			}
			cleanupFunctions.length = 0;

			// 清理所有绘制组
			for (const group of drawGroups.values()) {
				group.destroy();
			}
			drawGroups.clear();
			drawFunctions.clear();

			// 销毁 stage
			stage.destroy();
		},

		// ========== 状态获取 ==========
		/**
		 * 获取 Stage 状态
		 * @returns Stage 状态信息
		 */
		getStageState(): StageState {
			return {
				width: stage.width() - rulerSize,
				height: stage.height() - rulerSize,
				scale: stage.scaleX(),
				x: stage.x(),
				y: stage.y(),
			};
		},

		// ========== 坐标转换 ==========
		/**
		 * 相对大小（基于 stage，且无视 scale）
		 * @param boardPos - 画板坐标值
		 * @returns Stage 坐标值
		 */
		toStageValue(boardPos: number): number {
			return boardPos / stage.scaleX();
		},

		/**
		 * 绝对大小（基于可视区域像素）
		 * @param stagePos - Stage 坐标值
		 * @returns 画板坐标值
		 */
		toBoardValue(stagePos: number): number {
			return stagePos * stage.scaleX();
		},

		// ========== 元素操作 ==========
		/**
		 * 切换 main 层所有节点的可拖拽状态
		 * @param draggable - 是否可拖拽
		 */
		changeDraggable(draggable: boolean) {
			layers.main.getChildren().forEach((node) => {
				node.draggable(draggable);
			});
		},

		// ========== 元素过滤 ==========
		/**
		 * 忽略非素材
		 */
		ignore,

		/**
		 * 忽略选择时的辅助元素
		 */
		ignoreSelect,

		/**
		 * 忽略各 draw 的根 group
		 */
		ignoreDraw,

		/**
		 * 忽略连接线相关元素
		 */
		ignoreLink,

		// ========== 工具 ==========
		// 占位，下面初始化
		selectionTool: null as any,
	};

	// 注册绘制功能
	registerDraws(internalRender, config, drawFunctions);

	// 注册工具
	registerTools(internalRender, config);

	// 注册交互事件
	registerEvents(internalRender, config, cleanupFunctions);

	// 触发初始渲染（不包括参考线，参考线只在鼠标移动时绘制）
	const initialDrawKeys = Array.from(drawFunctions.keys()).filter(
		(key) => key !== DrawGroupName.REFERENCE_LINE
	);
	internalRender.redraw(initialDrawKeys);

	return internalRender;
}
