import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { DEFAULT_ZOOM_CONFIG } from "../types";

/**
 * 启用滚轮缩放功能（使用默认配置）
 * @param render - 内部渲染实例
 * @returns 清理函数
 */
export function enableZoom(render: InternalRenderInstance): () => void {
	const { scaleBy, scaleMin, scaleMax } = DEFAULT_ZOOM_CONFIG;

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
