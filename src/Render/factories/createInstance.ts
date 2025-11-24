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
		bgSize,
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
		bgSize,
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

		// ========== 历史记录 ==========
		/**
		 * 更新历史记录
		 */
		updateHistory() {
			// TODO: 实现历史记录功能
		},

		/**
		 * 撤销历史
		 */
		prevHistory() {
			// TODO: 实现撤销功能
		},

		/**
		 * 重做历史
		 */
		nextHistory() {
			// TODO: 实现重做功能
		},

		// ========== 节点操作 ==========
		/**
		 * 删除节点
		 * @param nodes - 要删除的节点列表
		 */
		remove(nodes: Konva.Node[]) {
			for (const node of nodes) {
				if (node instanceof Konva.Transformer) {
					// 移除已选择的节点
					this.remove(this.selectionTool.selectingNodes);
				} else {
					// 移除相关连接线信息
					const groupId = node.id();

					for (const rn of this.layers.main.getChildren()) {
						if (rn.id() !== groupId && Array.isArray(rn.attrs.points)) {
							for (const point of rn.attrs.points) {
								if (Array.isArray(point.pairs)) {
									// 移除拐点记录
									if (rn.attrs.manualPointsMap) {
										point.pairs
											.filter(
												(pair: any) =>
													pair.from.groupId === groupId ||
													pair.to.groupId === groupId
											)
											.forEach((pair: any) => {
												rn.attrs.manualPointsMap[pair.id] = undefined;
											});
									}

									// 连接线信息
									point.pairs = point.pairs.filter(
										(pair: any) =>
											pair.from.groupId !== groupId &&
											pair.to.groupId !== groupId
									);
								}
							}

							rn.setAttr("points", rn.attrs.points);
						}
					}

					// 移除未选择的节点
					node.destroy();
				}
			}

			if (nodes.length > 0) {
				// 清除选择
				this.selectionTool.selectingClear();
				// this.linkTool.selectingClear();
				// TODO: 实现 linkTool

				// 更新历史
				this.updateHistory();

				// 重绘
				this.redraw();
			}
		},

		// ========== 工具 ==========
		// 占位，下面初始化
		selectionTool: null as any,
		copyTool: null as any,
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
