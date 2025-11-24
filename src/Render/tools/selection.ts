import Konva from "konva";
import type { InternalRenderInstance, SelectionTool } from "../types";

/**
 * 创建选择工具
 * 管理节点的选择状态和 Transformer
 * @param render - 内部渲染实例
 * @returns 选择工具实例
 */
export function createSelection(render: InternalRenderInstance): SelectionTool {
	// 选中的节点列表
	let selectingNodes: Konva.Node[] = [];

	/**
	 * 选择节点
	 * @param nodes - 要选择的节点数组
	 */
	function select(nodes: Konva.Node[]): void {
		if (nodes.length > 1) {
			// 多选 不能改变大小/旋转
			render.transformer.resizeEnabled(false);
			render.transformer.rotateEnabled(false);
		} else {
			if (nodes.length === 1) {
				const target = nodes[0] as Konva.Node;
				// 图形 不能改变大小
				render.transformer.resizeEnabled(
					target.attrs.assetType === "Graph" ? false : true
					// TODO: 使用 Types.AssetType.Graph
				);
				render.transformer.rotateEnabled(
					target.attrs.assetType === "Graph" &&
						(target.attrs.graphType === "Line" ||
							target.attrs.graphType === "Curve" ||
							target.attrs.graphType === "Bezier")
						? false
						: true
					// TODO: 使用 Types.AssetType.Graph 和 Types.GraphType
				);
			} else {
				render.transformer.resizeEnabled(true);
			}
		}

		// 清除连接线选中
		// render.linkTool.selectingClear()
		// TODO: 实现 linkTool

		// 选择变化了
		// render.emit('selection-change', nodes)
		// TODO: 实现事件系统

		selectingClear(true);

		if (nodes.length > 0) {
			// 最大zIndex
			const maxZIndex = Math.max(
				...render.layers.main
					.getChildren((node) => {
						return !render.ignore(node);
					})
					.map((o) => o.zIndex())
			);

			// 记录状态
			for (const node of nodes) {
				node.setAttrs({
					nodeMousedownPos: node.position(), // 后面用于移动所选
					lastOpacity: node.opacity(), // 选中时，下面会使其变透明，记录原有的透明度
					lastZIndex: node.zIndex(), // 记录原有的层次，后面暂时提升所选节点的层次
					selectingZIndex: undefined,
					selected: true, // 选择中
					listening: false, // 不可交互
					opacity: node.opacity() * 0.8, // 设置透明度
				});
			}

			// 提升层次
			for (const node of nodes.sort((a, b) => a.zIndex() - b.zIndex())) {
				node.setAttrs({
					zIndex: maxZIndex, // 提升层次
				});
			}

			// 选中的节点
			selectingNodes = nodes;

			// 选中的节点，放进 transformer
			render.transformer.nodes(selectingNodes);
		}

		// 重绘
		// render.redraw([DrawGroupName.GRAPH, DrawGroupName.LINK])
		// TODO: 确定需要重绘的 draw 名称
	}

	/**
	 * 清空已选
	 * @param slient - 是否静默清空（不触发事件）
	 */
	function selectingClear(slient = false): void {
		// 选择变化了
		if (selectingNodes.length > 0) {
			console.log("🚀 ~ selectingClear ~ slient:", slient);
			// !slient && render.emit('selection-change', [])
			// TODO: 实现事件系统
		}

		// 清空选择
		render.transformer.nodes([]);

		// 恢复透明度、层次、可交互
		for (const node of [...selectingNodes].sort(
			(a, b) => a.attrs.lastZIndex - b.attrs.lastZIndex
		)) {
			node.setAttrs({
				listening: true,
				opacity: node.attrs.lastOpacity ?? 1,
				zIndex: node.attrs.lastZIndex,
			});
		}

		// 清空状态
		for (const node of selectingNodes) {
			node.setAttrs({
				nodeMousedownPos: undefined,
				lastOpacity: undefined,
				lastZIndex: undefined,
				selectingZIndex: undefined,
				selected: false,
			});
		}

		// 清空选择节点
		selectingNodes = [];

		// 隐藏连接点
		// render.linkTool.pointsVisible(false)
		// TODO: 实现 linkTool

		// 重绘
		// render.redraw([DrawGroupName.GRAPH, DrawGroupName.LINK])
		// TODO: 确定需要重绘的 draw 名称
	}

	/**
	 * 通过偏移量移动选中的节点
	 * @param offset - 偏移量
	 */
	function selectingNodesMove(offset: Konva.Vector2d) {
		for (const node of render.selectionTool.selectingNodes) {
			node.x(node.x() + offset.x);
			node.y(node.y() + offset.y);
		}
		// render.emit('asset-position-change', render.selectionTool.selectingNodes)
	}

	/**
	 * 全选所有节点
	 */
	function selectAll(): void {
		const nodes = render.layers.main.find(".asset") as Konva.Node[];
		select(nodes);
	}

	// 返回选择工具接口
	return {
		get selectingNodes() {
			return selectingNodes;
		},
		selectingClear,
		select,
		selectingNodesMove,
		selectAll,
	};
}
