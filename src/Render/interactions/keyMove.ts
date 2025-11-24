import type { InternalRenderInstance, EventHandlers } from "../types";
import { MoveKey, DrawGroupName } from "../types";

/**
 * 获取键盘移动的事件处理器
 * @param render - 内部渲染实例
 * @returns 事件处理器映射
 */
export function getKeyMoveHandlers(
	render: InternalRenderInstance
): EventHandlers {
	let speed = 1;
	const speedMax = 20;

	const change = () => {
		// 更新历史
		// render.updateHistory();
		// TODO: 实现历史记录功能
	};

	const handleKeyDown = (e: Event) => {
		const keyEvent = e as KeyboardEvent;
		if (!keyEvent.ctrlKey) {
			const moveKeys = Object.values(MoveKey) as string[];
			if (moveKeys.includes(keyEvent.code)) {
				if (keyEvent.code === MoveKey.上) {
					render.selectionTool.selectingNodesMove({ x: 0, y: -speed });
				} else if (keyEvent.code === MoveKey.左) {
					render.selectionTool.selectingNodesMove({ x: -speed, y: 0 });
				} else if (keyEvent.code === MoveKey.右) {
					render.selectionTool.selectingNodesMove({ x: speed, y: 0 });
				} else if (keyEvent.code === MoveKey.下) {
					render.selectionTool.selectingNodesMove({ x: 0, y: speed });
				}

				if (speed < speedMax) {
					speed++;
				}

				change();

				// 重绘
				// render.redraw([
				// 	DrawGroupName.GRAPH,
				// 	DrawGroupName.LINK,
				// 	DrawGroupName.ATTRACT,
				// 	DrawGroupName.RULER,
				// 	DrawGroupName.PREVIEW,
				// ]);
				// TODO: 实现 GraphDraw、LinkDraw、AttractDraw、PreviewDraw，或使用对应的 DrawGroupName
				render.redraw([DrawGroupName.RULER]);
			}
		}
	};

	const handleKeyUp = () => {
		// 重置速度
		speed = 1;
	};

	// 返回事件处理器映射
	return {
		dom: {
			keydown: handleKeyDown,
			keyup: handleKeyUp,
		},
		stage: {},
		transformer: {},
	};
}
