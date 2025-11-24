import type { InternalRenderInstance } from "../types";
import { MoveKey, DrawGroupName } from "../types";

/**
 * 启用键盘移动功能
 * @param render - 内部渲染实例
 * @returns 清理函数
 */
export function enableKeyMove(render: InternalRenderInstance): () => void {
	const container = render.stage.container();

	let speed = 1;
	const speedMax = 20;

	const change = () => {
		// 更新历史
		// render.updateHistory();
		// TODO: 实现历史记录功能
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!e.ctrlKey) {
			const moveKeys = Object.values(MoveKey) as string[];
			if (moveKeys.includes(e.code)) {
				if (e.code === MoveKey.上) {
					render.selectionTool.selectingNodesMove({ x: 0, y: -speed });
				} else if (e.code === MoveKey.左) {
					render.selectionTool.selectingNodesMove({ x: -speed, y: 0 });
				} else if (e.code === MoveKey.右) {
					render.selectionTool.selectingNodesMove({ x: speed, y: 0 });
				} else if (e.code === MoveKey.下) {
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

	const handleKeyUp = (e: KeyboardEvent) => {
		e.preventDefault();
		// 重置速度
		speed = 1;
	};

	// 绑定事件
	container.addEventListener("keydown", handleKeyDown);
	container.addEventListener("keyup", handleKeyUp);

	// 返回清理函数
	return () => {
		container.removeEventListener("keydown", handleKeyDown);
		container.removeEventListener("keyup", handleKeyUp);
	};
}
