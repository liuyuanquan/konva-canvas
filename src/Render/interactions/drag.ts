import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { MouseButton } from "../types";

/**
 * 启用右键拖拽画布功能
 * @param render - 内部渲染实例
 * @returns 清理函数
 */
export function enableDrag(render: InternalRenderInstance): () => void {
	const stage = render.stage;

	let mousedownRight = false;
	let mousedownStagePos = { x: 0, y: 0 };
	let mousedownPointerPos = { x: 0, y: 0 };

	// 阻止右键菜单
	const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
	};

	// 鼠标按下
	const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		if (
			e.evt.button === MouseButton.右键 ||
			(e.evt.ctrlKey && e.evt.button === MouseButton.左键) // mac 拖动画布快捷键
		) {
			// stage 状态
			const stageState = render.getStageState();

			// 鼠标右键
			mousedownRight = true;

			// 暂停元素 draggable
			render.changeDraggable(false);

			mousedownStagePos = { x: stageState.x, y: stageState.y };

			const pos = stage.getPointerPosition();
			if (pos) {
				mousedownPointerPos = { x: pos.x, y: pos.y };
			}

			document.body.style.cursor = "grab";
		}
	};

	// 鼠标移动
	const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		if (mousedownRight) {
			// 鼠标右键拖动
			const pos = stage.getPointerPosition();
			if (pos) {
				const offsetX = pos.x - mousedownPointerPos.x;
				const offsetY = pos.y - mousedownPointerPos.y;

				// 移动 stage
				stage.position({
					x: mousedownStagePos.x + offsetX,
					y: mousedownStagePos.y + offsetY,
				});

				// 重绘
				render.redraw();
			}
		}
	};

	// 鼠标松开
	const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		if (mousedownRight) {
			mousedownRight = false;

			// 恢复元素 draggable
			render.changeDraggable(true);

			document.body.style.cursor = "default";
		}
	};

	// 绑定事件
	stage.on("contextmenu", handleContextMenu);
	stage.on("mousedown", handleMouseDown);
	stage.on("mousemove", handleMouseMove);
	stage.on("mouseup", handleMouseUp);

	// 返回清理函数
	return () => {
		stage.off("contextmenu", handleContextMenu);
		stage.off("mousedown", handleMouseDown);
		stage.off("mousemove", handleMouseMove);
		stage.off("mouseup", handleMouseUp);
	};
}
