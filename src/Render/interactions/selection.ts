import Konva from "konva";
import type { InternalRenderInstance } from "../types";
import { MouseButton, DrawGroupName } from "../types";

/**
 * 选择框状态
 */
interface SelectionState {
	/** 是否正在选择 */
	selecting: boolean;
	/** 选择框起始 X 坐标 */
	startX: number;
	/** 选择框起始 Y 坐标 */
	startY: number;
	/** 选择框结束 X 坐标 */
	endX: number;
	/** 选择框结束 Y 坐标 */
	endY: number;
}

/**
 * 启用选择框功能
 */
export function enableSelection(render: InternalRenderInstance): () => void {
	const stage = render.stage;
	const transformer = render.transformer;

	// 选择框状态
	const state: SelectionState = {
		selecting: false,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
	};

	// 拖动前的位置
	let transformerMousedownPos: Konva.Vector2d = { x: 0, y: 0 };
	// 标记为已使用（将在后续功能中使用）
	void transformerMousedownPos;

	// 通过偏移量移动【目标节点】
	const selectingNodesPositionByOffset = (_offset: Konva.Vector2d) => {
		// TODO: 实现通过偏移量移动选中节点的逻辑
		// for (const node of render.selectionTool.selectingNodes) {
		// 	if (node.attrs.nodeMousedownPos) {
		// 		const x = node.attrs.nodeMousedownPos.x + offset.x;
		// 		const y = node.attrs.nodeMousedownPos.y + offset.y;
		// 		node.x(x);
		// 		node.y(y);
		// 	}
		// }
	};
	// 标记为已使用（将在后续功能中使用）
	void selectingNodesPositionByOffset;

	const reset = () => {
		// 对齐线清除
		// this.render.attractTool.alignLinesClear()
		// this.transformerStateReset()
		// this.selectingNodesPositionReset()
	};

	// 鼠标按下
	const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
		const parent = e.target.getParent();

		if (e.target === render.stage) {
			// 点击空白处

			// 清除选择
			render.selectionTool.selectingClear();

			// render.linkTool.selectingClear();

			// 选择框（判断 ctrlKey 为了排查 mac 拖动快捷键）
			if (e.evt.button === MouseButton.左键 && !e.evt.ctrlKey) {
				const pos = render.stage.getPointerPosition();
				if (pos) {
					// 初始化选择框状态
					state.startX = pos.x;
					state.startY = pos.y;
					state.endX = pos.x;
					state.endY = pos.y;
				}

				render.selectRect.setAttrs({
					width: 0,
					height: 0,
					visible: true,
				});

				state.selecting = true;
			}

			// 隐藏连接点
			// render.linkTool.pointsVisible(false)
		} else if (parent instanceof Konva.Transformer) {
			// transformer 点击事件交给 transformer 自己的 handler
		} else if (parent instanceof Konva.Group) {
			// （判断 ctrlKey 为了排查 mac 拖动快捷键）
			if (e.evt.button === MouseButton.左键 && !e.evt.ctrlKey) {
				if (!render.ignore(parent) && !render.ignoreDraw(e.target)) {
					if (e.evt.ctrlKey || e.evt.metaKey) {
						// 新增多选
						render.selectionTool.select([
							...render.selectionTool.selectingNodes,
							parent,
						]);
					} else {
						// 单选
						render.selectionTool.select([parent]);

						// 单选时无法通过 transformer 获取拖动初始位置
						// 此时直接取目标的 getClientRect 位置
						const rect = parent.getClientRect();
						transformerMousedownPos = { x: rect.x, y: rect.y };
					}
				}
			} else {
				render.selectionTool.selectingClear();
			}
		}
	};

	// 鼠标移动
	const handleMouseMove = () => {
		// stage 状态
		const stageState = render.getStageState();

		// 选择框
		if (state.selecting) {
			// 选择区域中
			const pos = render.stage.getPointerPosition();

			if (pos) {
				// 选择移动后的坐标
				state.endX = pos.x;
				state.endY = pos.y;
			}

			// 调整【选择框】的位置和大小
			render.selectRect.setAttrs({
				visible: true,
				x: render.toStageValue(
					Math.min(state.startX, state.endX) - stageState.x
				),
				y: render.toStageValue(
					Math.min(state.startY, state.endY) - stageState.y
				),
				width: render.toStageValue(Math.abs(state.endX - state.startX)),
				height: render.toStageValue(Math.abs(state.endY - state.startY)),
			});
		}
	};

	// 鼠标松开
	const handleMouseUp = () => {
		// 选择框

		// 重叠计算
		const box = render.selectRect.getClientRect();
		if (box.width > 0 && box.height > 0) {
			// 区域有面积

			// 获取所有图形
			const shapes = render.layers.main.getChildren((node) => {
				return !render.ignore(node);
			});

			// 提取重叠部分
			const selected = shapes.filter((shape) =>
				// 关键 api
				Konva.Util.haveIntersection(box, shape.getClientRect())
			);

			// 多选
			render.selectionTool.select(selected);
		}

		// 重置
		render.selectRect.setAttrs({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			visible: false,
		});

		// 选择区域结束
		state.selecting = false;
	};

	const handleTransformerMouseDown = (
		e: Konva.KonvaEventObject<MouseEvent>
	) => {
		const anchor = render.transformer.getActiveAnchor();

		if (!anchor) {
			// 非变换
			if (e.evt.ctrlKey || e.evt.metaKey) {
				// 选择
				if (render.selectionTool.selectingNodes.length > 0) {
					const pos = render.stage.getPointerPosition();

					if (pos) {
						const keeps: Konva.Node[] = [];
						const removes: Konva.Node[] = [];

						// 从高到低，逐个判断 已选节点 和 鼠标点击位置 是否重叠
						let finded = false;
						for (const node of render.selectionTool.selectingNodes.sort(
							(a, b) => b.zIndex() - a.zIndex()
						)) {
							if (
								!finded &&
								Konva.Util.haveIntersection(node.getClientRect(), {
									...pos,
									width: 1,
									height: 1,
								})
							) {
								// 记录需要移除选择的节点
								removes.unshift(node);
								finded = true;
							} else {
								keeps.unshift(node);
							}
						}

						if (removes.length > 0) {
							// 取消选择
							render.selectionTool.select(keeps);
						} else {
							// 从高到低，逐个判断 未选节点 和 鼠标点击位置 是否重叠
							let finded = false;
							const adds: Konva.Node[] = [];

							for (const node of render.layers.main
								.getChildren()
								.filter((node) => !render.ignore(node))
								.sort((a, b) => b.zIndex() - a.zIndex())) {
								if (
									!finded &&
									Konva.Util.haveIntersection(node.getClientRect(), {
										...pos,
										width: 1,
										height: 1,
									})
								) {
									// 记录需要增加选择的节点
									adds.unshift(node);
									finded = true;
								}
							}

							if (adds.length > 0) {
								// 新增选择
								render.selectionTool.select([
									...render.selectionTool.selectingNodes,
									...adds,
								]);
							}
						}
					}
				}
			} else {
				if (render.selectionTool.selectingNodes.length > 0) {
					// 拖动前
					// 重置状态
					reset();
				}
			}
		} else {
			// 变换前
			// 重置状态
			reset();
		}
	};

	const handleTransformerMouseMove = () => {
		const pos = render.stage.getPointerPosition();

		if (pos) {
			// 获取所有图形
			const shapes = render.transformer.nodes();

			// 隐藏 hover 框
			for (const shape of shapes) {
				if (shape instanceof Konva.Group) {
					shape.findOne("#hoverRect")?.visible(false);
				}
			}

			// 多选
			if (shapes.length > 1) {
				// zIndex 倒序（大的优先）
				shapes.sort((a, b) => b.zIndex() - a.zIndex());

				// 提取重叠目标
				const selected = shapes.find((shape) =>
					// 关键 api
					Konva.Util.haveIntersection(
						{ ...pos, width: 1, height: 1 },
						shape.getClientRect()
					)
				);

				// 显示 hover 框
				if (selected) {
					if (selected instanceof Konva.Group) {
						selected.findOne("#hoverRect")?.visible(true);
					}
				}
			}
		}
	};

	const handleTransformerMouseLeave = () => {
		// 隐藏 hover 框
		for (const shape of render.transformer.nodes()) {
			if (shape instanceof Konva.Group) {
				shape.findOne("#hoverRect")?.visible(false);
			}
		}
	};

	const handleTransformerDragStart = () => {
		// 拖动开始
		// 记录拖动前的位置
		const backElement = render.transformer.findOne(".back");
		if (backElement) {
			const rect = backElement.getClientRect();
			transformerMousedownPos = { x: rect.x, y: rect.y };
		}
	};

	const handleTransformerDragMove = () => {
		// 拖动中
		const backElement = render.transformer.findOne(".back");
		if (!backElement) return;
	};

	const handleTransformerDragEnd = () => {
		// 重置状态
		reset();

		// 更新历史
		// render.updateHistory();
		// TODO: 实现历史记录功能

		// 重绘
		// render.redraw([
		// 	DrawGroupName.GRAPH,
		// 	DrawGroupName.LINK,
		// 	DrawGroupName.RULER,
		// 	DrawGroupName.PREVIEW,
		// ]);
		// TODO: 实现 GraphDraw、LinkDraw、PreviewDraw，或使用对应的 DrawGroupName
		render.redraw([DrawGroupName.RULER]);
	};

	const handleTransformerTransformStart = () => {
		// 变换开始（缩放、旋转等）
		// TODO: 实现变换开始时的逻辑
	};

	const handleTransformerTransform = () => {
		// 变换中（缩放、旋转等）
		// TODO: 实现变换中的逻辑
	};

	const handleTransformerTransformEnd = () => {
		// 变换结束（缩放、旋转等）
		// 重置状态
		reset();

		// 更新历史
		// render.updateHistory();
		// TODO: 实现历史记录功能

		// 重绘
		// render.redraw([
		// 	DrawGroupName.GRAPH,
		// 	DrawGroupName.LINK,
		// 	DrawGroupName.RULER,
		// 	DrawGroupName.PREVIEW,
		// ]);
		// TODO: 实现 GraphDraw、LinkDraw、PreviewDraw，或使用对应的 DrawGroupName
		// render.redraw([DrawGroupName.RULER]);
	};

	// 绑定事件
	stage.on("mousedown", handleMouseDown);
	stage.on("mousemove", handleMouseMove);
	stage.on("mouseup", handleMouseUp);

	transformer.on("mousedown", handleTransformerMouseDown);
	transformer.on("mousemove", handleTransformerMouseMove);
	transformer.on("mouseleave", handleTransformerMouseLeave);
	transformer.on("dragstart", handleTransformerDragStart);
	transformer.on("dragmove", handleTransformerDragMove);
	transformer.on("dragend", handleTransformerDragEnd);
	transformer.on("transformstart", handleTransformerTransformStart);
	transformer.on("transform", handleTransformerTransform);
	transformer.on("transformend", handleTransformerTransformEnd);

	// 返回清理函数
	return () => {
		stage.off("mousedown", handleMouseDown);
		stage.off("mousemove", handleMouseMove);
		stage.off("mouseup", handleMouseUp);
		transformer.off("mousedown", handleTransformerMouseDown);
		transformer.off("mousemove", handleTransformerMouseMove);
		transformer.off("mouseleave", handleTransformerMouseLeave);
		transformer.off("dragstart", handleTransformerDragStart);
		transformer.off("dragmove", handleTransformerDragMove);
		transformer.off("dragend", handleTransformerDragEnd);
		transformer.off("transformstart", handleTransformerTransformStart);
		transformer.off("transform", handleTransformerTransform);
		transformer.off("transformend", handleTransformerTransformEnd);
	};
}
