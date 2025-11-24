import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { DrawGroupName, MouseButton } from "../types";

/**
 * 菜单项类型
 */
interface MenuItem {
	name: string;
	action: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

/**
 * 右键菜单状态（内部状态）
 */
let contextMenuState: {
	/** 目标节点 */
	target: Konva.Node | null;
	/** 菜单是否按下 */
	menuIsMousedown: boolean;
} = {
	target: null,
	menuIsMousedown: false,
};

/**
 * 绘制右键菜单
 * @param render - 内部渲染实例
 */
export function drawContextMenu(render: InternalRenderInstance): void {
	const layer = render.layers.cover;

	// 移除旧的右键菜单组
	const existingGroup = render.drawGroups.get(DrawGroupName.CONTEXT_MENU);
	if (existingGroup) {
		existingGroup.destroy();
		render.drawGroups.delete(DrawGroupName.CONTEXT_MENU);
	}

	if (!contextMenuState.target) {
		return;
	}

	// 菜单数组
	const menus: MenuItem[] = [];

	if (contextMenuState.target === render.stage) {
		// 空白处
		menus.push({
			name: "自适应大小",
			action: () => {
				// render.positionTool.positionFit();
				// TODO: 实现 positionTool
			},
		});
		menus.push({
			name: "恢复位置",
			action: () => {
				// render.positionTool.positionReset();
				// TODO: 实现 positionTool
			},
		});
		menus.push({
			name: "恢复大小位置",
			action: () => {
				// render.positionTool.positionZoomReset();
				// TODO: 实现 positionTool
			},
		});
	} else if (!render.config.readonly) {
		if (contextMenuState.target.name() === "link-line") {
			menus.push({
				name: "删除",
				action: () => {
					// render.linkTool.remove(contextMenuState.target as Konva.Line);
					// TODO: 实现 linkTool
				},
			});
		} else {
			// 未选择：真实节点，即素材的容器 group
			// 已选择：transformer
			const target = contextMenuState.target.getParent();

			// 目标
			menus.push({
				name: "复制",
				action: () => {
					if (target) {
						// render.copyTool.copy([target]);
						// TODO: 实现 copyTool.copy 方法（目前只有 pasteStart/pasteEnd）
					}
				},
			});
			menus.push({
				name: "删除",
				action: () => {
					if (target) {
						render.remove([target]);
					}
				},
			});
			menus.push({
				name: "上移",
				action: () => {
					if (target) {
						// render.zIndexTool.up([target]);
						// TODO: 实现 zIndexTool
					}
				},
			});
			menus.push({
				name: "下移",
				action: () => {
					if (target) {
						// render.zIndexTool.down([target]);
						// TODO: 实现 zIndexTool
					}
				},
			});
			menus.push({
				name: "置顶",
				action: () => {
					if (target) {
						// render.zIndexTool.top([target]);
						// TODO: 实现 zIndexTool
					}
				},
			});
			menus.push({
				name: "置底",
				action: () => {
					if (target) {
						// render.zIndexTool.bottom([target]);
						// TODO: 实现 zIndexTool
					}
				},
			});

			if (target instanceof Konva.Transformer) {
				const pos = render.stage.getPointerPosition();

				if (pos) {
					// 获取所有图形
					const shapes = target.nodes();
					if (shapes.length > 1) {
						// zIndex 倒序（大的优先）
						shapes.sort((a, b) => b.zIndex() - a.zIndex());

						// 提取重叠目标
						const selected = shapes.find((shape) =>
							Konva.Util.haveIntersection(
								{ ...pos, width: 1, height: 1 },
								shape.getClientRect()
							)
						);

						// 对齐菜单
						menus.push({
							name: "垂直居中" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.垂直居中, selected);
								// TODO: 实现 alignTool
							},
						});
						menus.push({
							name: "左对齐" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.左对齐, selected);
								// TODO: 实现 alignTool
							},
						});
						menus.push({
							name: "右对齐" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.右对齐, selected);
								// TODO: 实现 alignTool
							},
						});
						menus.push({
							name: "水平居中" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.水平居中, selected);
								// TODO: 实现 alignTool
							},
						});
						menus.push({
							name: "上对齐" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.上对齐, selected);
								// TODO: 实现 alignTool
							},
						});
						menus.push({
							name: "下对齐" + (selected ? "于目标" : ""),
							action: () => {
								// render.alignTool.align(Types.AlignType.下对齐, selected);
								// TODO: 实现 alignTool
							},
						});
					}
				}
			}
		}
	}

	// stage 状态
	const stageState = render.getStageState();

	// 绘制右键菜单
	const group = new Konva.Group({
		name: "contextmenu",
		width: stageState.width,
		height: stageState.height,
	});

	let top = 0;
	// 菜单每项高度
	const lineHeight = 30;

	const pos = render.stage.getPointerPosition();
	if (pos) {
		for (const menu of menus) {
			// 框
			const rect = new Konva.Rect({
				x: render.toStageValue(pos.x - stageState.x),
				y: render.toStageValue(pos.y + top - stageState.y),
				width: render.toStageValue(150),
				height: render.toStageValue(lineHeight),
				fill: "#fff",
				stroke: "#999",
				strokeWidth: render.toStageValue(1),
				name: "contextmenu",
			});

			// 标题
			const text = new Konva.Text({
				x: render.toStageValue(pos.x - stageState.x),
				y: render.toStageValue(pos.y + top - stageState.y),
				text: menu.name,
				name: "contextmenu",
				listening: false,
				fontSize: render.toStageValue(16),
				fill: "#333",
				width: render.toStageValue(150),
				height: render.toStageValue(lineHeight),
				align: "center",
				verticalAlign: "middle",
			});

			group.add(rect);
			group.add(text);

			// 菜单事件
			rect.on("pointerclick", (e) => {
				if (e.evt.button === MouseButton.左键) {
					// 触发事件
					menu.action(e);

					// 移除菜单
					const contextMenuGroup = render.drawGroups.get(
						DrawGroupName.CONTEXT_MENU
					);
					if (contextMenuGroup) {
						contextMenuGroup.destroy();
						render.drawGroups.delete(DrawGroupName.CONTEXT_MENU);
					}

					contextMenuState.target = null;
				}

				e.evt.preventDefault();
				e.evt.stopPropagation();
			});

			rect.on("mousedown", (e) => {
				if (e.evt.button === MouseButton.左键) {
					contextMenuState.menuIsMousedown = true;
					// 按下效果
					rect.fill("#dfdfdf");
				}

				e.evt.preventDefault();
				e.evt.stopPropagation();
			});

			rect.on("mouseup", (e) => {
				if (e.evt.button === MouseButton.左键) {
					contextMenuState.menuIsMousedown = false;
				}
			});

			rect.on("mouseenter", (e) => {
				if (contextMenuState.menuIsMousedown) {
					rect.fill("#dfdfdf");
				} else {
					// hover in
					rect.fill("#efefef");
				}

				e.evt.preventDefault();
				e.evt.stopPropagation();
			});

			rect.on("mouseout", () => {
				// hover out
				rect.fill("#fff");
			});

			rect.on("contextmenu", (e) => {
				e.evt.preventDefault();
				e.evt.stopPropagation();
			});

			top += lineHeight - 1;
		}
	}

	layer.add(group);
	render.drawGroups.set(DrawGroupName.CONTEXT_MENU, group);
}

/**
 * 设置右键菜单目标
 * @param target - 目标节点
 */
export function setContextMenuTarget(target: Konva.Node | null): void {
	contextMenuState.target = target;
}

/**
 * 清除右键菜单
 */
export function clearContextMenu(): void {
	contextMenuState.target = null;
}
