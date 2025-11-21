import Konva from "konva";
import type { InternalRenderInstance } from "../types";

export interface ZoomOptions {
	// 缩放速度
	scaleBy?: number;
	// 最小缩放比例
	scaleMin?: number;
	// 最大缩放比例
	scaleMax?: number;
}

/**
 * 启用滚轮缩放功能
 */
export function enableZoom(
	render: InternalRenderInstance,
	options: ZoomOptions = {}
): () => void {
	const { scaleBy = 0.1, scaleMin = 0.2, scaleMax = 5 } = options;

	const stage = render.stage;

	// 滚轮事件处理函数
	const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();

		const { scale: oldScale } = render.getStageState();
		const isPinchToZoom = e.evt.ctrlKey;

		const newScale = isPinchToZoom
			? oldScale + (e.evt.deltaY < 0 ? scaleBy : -scaleBy)
			: oldScale;

		const finalScale = Math.max(scaleMin, Math.min(scaleMax, newScale));

		if (finalScale !== oldScale) {
			const position = stage.getPosition();
			const point = { x: e.evt.offsetX, y: e.evt.offsetY };
			const mousePointTo = {
				x: (point.x - position.x) / oldScale,
				y: (point.y - position.y) / oldScale,
			};

			const newPosition = {
				x: -(mousePointTo.x * finalScale - point.x),
				y: -(mousePointTo.y * finalScale - point.y),
			};

			stage.scale({ x: finalScale, y: finalScale });
			stage.position(newPosition);

			// 重绘
			render.redraw();
		} else if (!isPinchToZoom) {
			const position = stage.getPosition();
			stage.position({
				x: position.x - e.evt.deltaX,
				y: position.y - e.evt.deltaY,
			});

			// 重绘
			render.redraw();
		}
	};

	// 绑定事件
	stage.on("wheel", handleWheel);

	// 返回清理函数
	return () => {
		stage.off("wheel", handleWheel);
	};
}
