import type { InternalRenderInstance, EventHandlers } from "../types";
import { ShortcutKey } from "../types";

/**
 * 获取快捷键的事件处理器
 * @param render - 内部渲染实例
 * @returns 事件处理器映射
 */
export function getShortcutHandlers(
	render: InternalRenderInstance
): EventHandlers {
	const handleKeyDown = (e: Event) => {
		const keyEvent = e as KeyboardEvent;
		const { code, ctrlKey, metaKey, shiftKey } = keyEvent;
		const isModifier = ctrlKey || metaKey;

		// 全局快捷键（不受 readonly 限制）
		if (code === ShortcutKey.R && isModifier) {
			window.location.reload();
			return;
		}

		// 只读模式下禁用其他快捷键
		if (render.config.readonly) {
			return;
		}

		// 带修饰键的快捷键
		if (isModifier) {
			switch (code) {
				case ShortcutKey.C:
					render.copyTool.pasteStart();
					return;
				case ShortcutKey.V:
					render.copyTool.pasteEnd();
					return;
				case ShortcutKey.Z:
					if (shiftKey) {
						render.nextHistory();
					} else {
						render.prevHistory();
					}
					return;
				case ShortcutKey.A:
					render.selectionTool.selectAll();
					return;
			}
		}

		// 不带修饰键的快捷键
		switch (code) {
			case ShortcutKey.删除:
			case ShortcutKey.Backspace:
				render.remove(render.selectionTool.selectingNodes);
				// render.linkTool.remove();
				// TODO: 实现 linkTool
				return;
			case ShortcutKey.Esc:
				render.selectionTool.selectingClear();
				// render.linkTool.selectingClear();
				// TODO: 实现 linkTool
				return;
		}
	};

	// 返回事件处理器映射
	return {
		dom: {
			keydown: handleKeyDown,
		},
		stage: {},
		transformer: {},
	};
}
