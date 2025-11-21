import type { InternalRenderInstance } from "../types";
import { DrawGroupName } from "../types";

/**
 * 启用参考线功能（监听鼠标移动）
 */
export function enableReferenceLine(
	render: InternalRenderInstance
): () => void {
	const handleMouseMove = () => {
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	const handleMouseOut = () => {
		// 鼠标移出时，清除参考线
		const group = render.drawGroups.get(DrawGroupName.REFERENCE_LINE);
		if (group) {
			group.destroy();
			render.drawGroups.delete(DrawGroupName.REFERENCE_LINE);
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
