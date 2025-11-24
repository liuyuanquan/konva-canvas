import Konva from "konva";
import { nanoid } from "nanoid";
import cloneDeep from "lodash-es/cloneDeep";
import type { InternalRenderInstance, CopyTool } from "../types";

/**
 * 创建复制工具
 * 管理节点的复制功能
 * @param render - 内部渲染实例
 * @returns 复制工具实例
 */
export function createCopy(render: InternalRenderInstance): CopyTool {
	// 粘贴缓存（复制的节点列表）
	let pasteCache: Konva.Node[] = [];
	// 粘贴次数（用于定义新节点的偏移距离）
	let pasteCount = 1;

	/**
	 * 开始粘贴（复制选中的节点）
	 */
	function pasteStart(): void {
		pasteCache = render.selectionTool.selectingNodes.map((o) => {
			const copy = o.clone();
			// 恢复透明度、可交互
			copy.setAttrs({
				listening: true,
				opacity: copy.attrs.lastOpacity ?? 1,
			});
			// 清空状态
			copy.setAttrs({
				nodeMousedownPos: undefined,
				lastOpacity: undefined,
				lastZIndex: undefined,
				selectingZIndex: undefined,
				selected: false,
			});
			return copy;
		});
		pasteCount = 1;
	}

	/**
	 * 刷新节点 ID 和事件绑定
	 * @param nodes - 节点列表
	 */
	function nodesIdCover(nodes: Konva.Group[]): void {
		let deepAssets: Konva.Node[] = [...nodes];
		const idMap = new Map<string, string>();

		// 第一遍：收集所有需要映射的 ID
		while (deepAssets.length > 0) {
			const asset = deepAssets.shift();
			if (asset && asset instanceof Konva.Group) {
				// 处理 points 和 pairs
				if (Array.isArray(asset.attrs.points)) {
					for (const point of asset.attrs.points) {
						if (Array.isArray(point.pairs)) {
							for (const pair of point.pairs) {
								if (!idMap.has(pair.id)) {
									idMap.set(pair.id, "pr:" + nanoid());
								}
								if (pair.from.groupId && !idMap.has(pair.from.groupId)) {
									idMap.set(pair.from.groupId, "g:" + nanoid());
								}
								if (pair.to.groupId && !idMap.has(pair.to.groupId)) {
									idMap.set(pair.to.groupId, "g:" + nanoid());
								}
								if (pair.from.pointId && !idMap.has(pair.from.pointId)) {
									idMap.set(pair.from.pointId, "p:" + nanoid());
								}
								if (pair.to.pointId && !idMap.has(pair.to.pointId)) {
									idMap.set(pair.to.pointId, "p:" + nanoid());
								}
							}
						}
						if (point.id) {
							if (!idMap.has(point.id)) {
								idMap.set(point.id, "p:" + nanoid());
							}
						}
						if (point.groupId) {
							if (!idMap.has(point.groupId)) {
								idMap.set(point.groupId, "g:" + nanoid());
							}
						}
					}
				}

				// 处理 anchors
				if (Array.isArray(asset.attrs.anchors)) {
					for (const anchor of asset.attrs.anchors) {
						if (anchor.groupId && !idMap.has(anchor.groupId)) {
							idMap.set(anchor.groupId, "g:" + nanoid());
						}
					}
				}

				// 处理节点自身 ID
				if (asset.id()) {
					if (!idMap.has(asset.id())) {
						idMap.set(asset.id(), "n:" + nanoid());
					}
				}

				// 递归处理子节点
				if (asset instanceof Konva.Group) {
					const children = asset.getChildren();
					deepAssets.push(...children);
				}
			}
		}

		// 第二遍：应用 ID 映射
		deepAssets = [...nodes];

		while (deepAssets.length > 0) {
			const asset = deepAssets.shift();
			if (asset && asset instanceof Konva.Group) {
				// 更新节点自身 ID
				if (idMap.has(asset.id())) {
					asset.id(idMap.get(asset.id())!);
				}

				// 处理 points 和 pairs
				if (Array.isArray(asset.attrs.points)) {
					asset.attrs.points = cloneDeep(asset.attrs.points ?? []);
					for (const point of asset.attrs.points) {
						if (Array.isArray(point.pairs)) {
							for (const pair of point.pairs) {
								pair.id = idMap.get(pair.id)!;
								if (idMap.has(pair.from.groupId)) {
									pair.from.groupId = idMap.get(pair.from.groupId)!;
								}
								if (idMap.has(pair.to.groupId)) {
									pair.to.groupId = idMap.get(pair.to.groupId)!;
								}
								if (idMap.has(pair.from.pointId)) {
									pair.from.pointId = idMap.get(pair.from.pointId)!;
								}
								if (idMap.has(pair.to.pointId)) {
									pair.to.pointId = idMap.get(pair.to.pointId)!;
								}
							}
						}
						if (idMap.has(point.id)) {
							if (asset instanceof Konva.Group) {
								const anchor = asset.findOne(`#${point.id}`);
								anchor?.id(idMap.get(point.id)!);
							}
							point.id = idMap.get(point.id)!;
							point.visible = false;
						}
						if (idMap.has(point.groupId)) {
							point.groupId = idMap.get(point.groupId)!;
						}
					}
				}

				// 处理 anchors
				if (Array.isArray(asset.attrs.anchors)) {
					asset.attrs.anchors = cloneDeep(asset.attrs.anchors ?? []);
					for (const anchor of asset.attrs.anchors) {
						if (idMap.has(anchor.groupId)) {
							anchor.groupId = idMap.get(anchor.groupId)!;
						}
					}
				}

				// 递归处理子节点
				if (asset instanceof Konva.Group) {
					const children = asset.getChildren();
					deepAssets.push(...children);
				}
			}
		}

		// 第三遍：绑定事件和设置偏移
		for (const node of nodes) {
			if (node instanceof Konva.Group) {
				// 绑定 mouseenter 事件
				node.off("mouseenter");
				node.on("mouseenter", () => {
					// 显示连接点
					// render.linkTool.pointsVisible(true, node);
					// TODO: 实现 linkTool
				});

				// 绑定 mouseleave 事件
				node.off("mouseleave");
				node.on("mouseleave", () => {
					// 隐藏连接点
					// render.linkTool.pointsVisible(false, node);
					// TODO: 实现 linkTool
					// 隐藏 hover 框
					node.findOne("#hoverRect")?.visible(false);
				});

				// 使新节点产生偏移
				node.setAttrs({
					x: node.x() + render.toStageValue(render.bgSize) * pasteCount,
					y: node.y() + render.toStageValue(render.bgSize) * pasteCount,
				});

				// 拐点也需要偏移
				if (node.attrs.manualPointsMap) {
					const manualPointsMap: Record<string, any> = {};
					const offset = render.toStageValue(render.bgSize) * pasteCount;

					// 替换 pairId
					for (const pairId in node.attrs.manualPointsMap) {
						const newPairId = idMap.get(pairId) || pairId;
						manualPointsMap[newPairId] = node.attrs.manualPointsMap[pairId];
					}

					// 应用偏移
					for (const pairId in manualPointsMap) {
						const manualPoints = manualPointsMap[pairId];
						if (Array.isArray(manualPoints)) {
							manualPointsMap[pairId] = manualPoints.map((o: any) => ({
								x: o.x + offset,
								y: o.y + offset,
							}));
						}
					}

					node.setAttr("manualPointsMap", manualPointsMap);
				}
			}
		}
	}

	/**
	 * 复制节点到画布（实际粘贴操作）
	 * @param nodes - 要复制的节点列表
	 */
	function copy(nodes: Konva.Node[]): void {
		const clones: Konva.Group[] = [];

		for (const node of nodes) {
			if (node instanceof Konva.Transformer) {
				// 复制已选择
				const backup = [...render.selectionTool.selectingNodes];
				render.selectionTool.selectingClear();
				// render.linkTool.selectingClear();
				// TODO: 实现 linkTool
				copy(backup);
				return;
			} else {
				// 复制未选择（先记录，后处理）
				if (node instanceof Konva.Group) {
					clones.push(node.clone() as Konva.Group);
				}
			}
		}

		// 刷新 id、事件
		nodesIdCover(clones);

		// 插入新节点
		render.layers.main.add(...clones);

		// 选中复制内容
		render.selectionTool.select(clones);

		// 更新历史
		render.updateHistory();

		// 重绘
		// render.redraw([DrawGroupName.GRAPH, DrawGroupName.LINK, DrawGroupName.PREVIEW]);
		// TODO: 实现 getCommonDrawNames 或使用对应的 DrawGroupName
		render.redraw();
	}

	/**
	 * 结束粘贴（将复制的节点添加到画布）
	 */
	function pasteEnd(): void {
		if (pasteCache.length > 0) {
			render.selectionTool.selectingClear();
			// render.linkTool.selectingClear();
			// TODO: 实现 linkTool
			copy(pasteCache);
			pasteCount++;
		}
	}

	// 返回复制工具接口
	return {
		pasteStart,
		pasteEnd,
	};
}
