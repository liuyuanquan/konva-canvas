import Konva from "konva";

/**
 * 事件处理器映射类型
 */
export interface EventHandlers {
	/** 容器（DOM）事件处理器 */
	dom: Record<string, (e: Event) => void>;
	/** Stage（Konva）事件处理器 */
	stage: Record<string, (e: Konva.KonvaEventObject<any>) => void>;
	/** Transformer（Konva）事件处理器 */
	transformer: Record<string, (e: Konva.KonvaEventObject<any>) => void>;
}
