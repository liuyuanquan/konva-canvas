import type { InternalRenderInstance, OnDropCallback } from "../types";
import { DrawGroupName } from "../types";

/**
 * 启用外部拖拽放置功能（从素材面板拖拽到画布）
 */
export function enableDragOutside(
	render: InternalRenderInstance,
	onDrop?: OnDropCallback
): () => void {
	const container = render.stage.container();

	// 处理拖拽进入
	const handleDragEnter = (e: GlobalEventHandlersEventMap["dragenter"]) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "none";
		}
		render.stage.setPointersPositions(e);

		// 更新参考线
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	// 处理拖拽悬停
	const handleDragOver = (e: GlobalEventHandlersEventMap["dragover"]) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "none";
		}
		render.stage.setPointersPositions(e);

		// 更新参考线
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	// 处理放置
	const handleDrop = (e: GlobalEventHandlersEventMap["drop"]) => {
		e.preventDefault();
		if (e.dataTransfer && onDrop) {
			try {
				const data = JSON.parse(e.dataTransfer.getData("application/json"));

				console.log(data);

				// // 获取相对于 stage 的坐标
				// const rect = container.getBoundingClientRect();
				// const x = e.clientX - rect.left;
				// const y = e.clientY - rect.top;

				// // 转换为 stage 坐标（考虑缩放和偏移）
				// const stageState = render.getStageState();
				// const stageX = (x - stageState.x) / stageState.scale;
				// const stageY = (y - stageState.y) / stageState.scale;

				// // 调用回调
				// onDrop(data, { x: stageX, y: stageY });

				// // 同时在控制台打印（用于调试）
				// console.log("Drop data:", {
				// 	url: data.url || data.preview,
				// 	type: data.type,
				// 	position: { x: stageX, y: stageY },
				// 	fullData: data,
				// });
			} catch (error) {
				console.error("Failed to parse drop data:", error);
			}
		}
	};

	// 绑定事件
	container.addEventListener("dragenter", handleDragEnter);
	container.addEventListener("dragover", handleDragOver);
	container.addEventListener("drop", handleDrop);

	// 返回清理函数
	return () => {
		container.removeEventListener("dragenter", handleDragEnter);
		container.removeEventListener("dragover", handleDragOver);
		container.removeEventListener("drop", handleDrop);
	};
}
