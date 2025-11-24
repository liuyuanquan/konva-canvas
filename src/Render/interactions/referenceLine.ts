import type { InternalRenderInstance, EventHandlers } from "../types";
import { DrawGroupName } from "../types";

/**
 * 启用参考线功能（监听鼠标移动）
 * @param render - 内部渲染实例
 * @returns 事件处理器映射
 */
export function enableReferenceLine(
	render: InternalRenderInstance
): EventHandlers {
	const handleMouseMove = () => {
		render.redraw([DrawGroupName.REFERENCE_LINE]);
	};

	const handleMouseEnter = () => {
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

	// 返回事件处理器映射
	return {
		dom: {
			mouseenter: handleMouseEnter,
			mousemove: handleMouseMove,
			mouseout: handleMouseOut,
		},
		stage: {},
		transformer: {},
	};
}
