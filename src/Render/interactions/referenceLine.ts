import type { InternalRenderInstance } from "../types";

/**
 * 启用参考线功能（监听鼠标移动）
 */
export function enableReferenceLine(
	render: InternalRenderInstance
): () => void {
	const handleMouseMove = () => {
		render.redraw(["referenceLine"]);
	};

	const handleMouseOut = () => {
		// 鼠标移出时，清除参考线
		const group = render.drawGroups.get("referenceLine");
		if (group) {
			group.destroy();
			render.drawGroups.delete("referenceLine");
		}
	};

	render.stage.on("mousemove", handleMouseMove);
	render.stage.on("mouseout", handleMouseOut);

	// 返回清理函数
	return () => {
		render.stage.off("mousemove", handleMouseMove);
		render.stage.off("mouseout", handleMouseOut);
	};
}
