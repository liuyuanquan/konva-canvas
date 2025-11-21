import type {
	InternalRenderInstance,
	StageState,
	InstanceContext,
} from "../types";

/**
 * 创建 InternalRenderInstance 对象
 */
export function createInstance(
	context: InstanceContext
): InternalRenderInstance {
	const {
		stage,
		layers,
		config,
		rulerSize,
		drawGroups,
		drawFunctions,
		cleanupFunctions,
	} = context;

	// 创建内部实例（包含所有属性）
	const internalRender: InternalRenderInstance = {
		// 内部属性
		stage,
		layers,
		config,
		rulerSize,
		drawGroups,

		// 画布操作
		resize(width: number, height: number) {
			stage.setAttrs({ width, height });
			internalRender.redraw();
		},

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

		// 状态获取
		getStageState(): StageState {
			return {
				width: stage.width() - rulerSize,
				height: stage.height() - rulerSize,
				scale: stage.scaleX(),
				x: stage.x(),
				y: stage.y(),
			};
		},

		// 相对大小（基于 stage，且无视 scale）
		toStageValue(boardPos: number): number {
			return boardPos / stage.scaleX();
		},

		// 绝对大小（基于可视区域像素）
		toBoardValue(stagePos: number): number {
			return stagePos * stage.scaleX();
		},

		// 元素操作
		changeDraggable(draggable: boolean) {
			// 暂停/恢复 main layer 上所有节点的拖拽功能
			layers.main.getChildren().forEach((node) => {
				node.draggable(draggable);
			});
		},
	};

	return internalRender;
}
