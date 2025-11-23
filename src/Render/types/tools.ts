import type Konva from "konva";

/**
 * 选择工具接口
 */
export interface SelectionTool {
	/** 选中的节点列表 */
	selectingNodes: Konva.Node[];
	/** 选择节点 */
	select: (nodes: Konva.Node[]) => void;
	/** 清除所有选择 */
	selectingClear: (slient?: boolean) => void;
	/** 通过偏移量移动选中的节点 */
	selectingNodesMove: (offset: Konva.Vector2d) => void;
}
