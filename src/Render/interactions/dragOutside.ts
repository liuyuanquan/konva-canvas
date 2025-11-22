import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { DrawGroupName } from "../types";
import { loadAsset, playGif } from "../utils";

/**
 * 启用外部拖拽放置功能（从素材面板拖拽到画布）
 */
export function enableDragOutside(render: InternalRenderInstance): () => void {
	const container = render.stage.container();

	// 处理拖拽进入
	const handleDragEnter = (e: GlobalEventHandlersEventMap["dragenter"]) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "copy";
		}
		render.stage.setPointersPositions(e);

		// 更新参考线
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	// 处理拖拽悬停
	const handleDragOver = (e: GlobalEventHandlersEventMap["dragover"]) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "copy";
		}
		render.stage.setPointersPositions(e);

		// 更新参考线
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	// 处理放置
	const handleDrop = (e: GlobalEventHandlersEventMap["drop"]) => {
		e.preventDefault();
		if (!e.dataTransfer) return;
		try {
			const data = JSON.parse(e.dataTransfer.getData("application/json"));

			// 从中取出 src 和 type
			const src = data.url || data.preview;
			const type = data.type;

			if (src && type) {
				const stageState = render.getStageState();

				render.stage.setPointersPositions(e);

				const pos = render.stage.getPointerPosition();
				if (pos) {
					// 转换为 stage 坐标
					const stageX = render.toStageValue(pos.x - stageState.x);
					const stageY = render.toStageValue(pos.y - stageState.y);

					// 加载素材
					loadAsset(src, type)
						.then((image) => {
							// 创建 Group 容器
							const group = new Konva.Group({
								id: `asset-${Date.now()}`,
								width: image.width(),
								height: image.height(),
							});

							// 添加到 main layer
							render.layers.main.add(group);

							// 设置图片位置（相对于 Group）
							image.setAttrs({
								x: 0,
								y: 0,
							});

							// 将图片添加到 Group
							group.add(image);

							// 计算 Group 位置（居中于鼠标）
							const x = stageX - group.width() / 2;
							const y = stageY - group.height() / 2;

							// 设置 Group 位置
							group.setAttrs({
								x,
								y,
							});

							// 如果是 GIF，启动动画
							if (type.toLowerCase() === "gif") {
								playGif(image, render.layers.main);
							}
						})
						.catch((error) => {
							console.error("❌ Failed to load asset:", error);
						});
				}
			}
		} catch (error) {
			console.error("Failed to parse drop data:", error);
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
