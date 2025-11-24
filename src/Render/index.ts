import Konva from "konva";
//
import * as Types from "./types";
//
import * as Draws from "./draws";
import * as Handlers from "./handlers";
import * as Tools from "./tools";
//
import { RenderCore, RenderEvents, RenderUtils, RenderSettings } from "./core";

// 渲染器
export class Render {
	// 核心模块
	core: RenderCore;
	events: RenderEvents;
	utils: RenderUtils;
	settings: RenderSettings;

	// 向后兼容：暴露 core 的属性
	get stage() {
		return this.core.stage;
	}
	get layer() {
		return this.core.layer;
	}
	get layerFloor() {
		return this.core.layerFloor;
	}
	get layerCover() {
		return this.core.layerCover;
	}
	get groupTransformer() {
		return this.core.groupTransformer;
	}
	get transformer() {
		return this.core.transformer;
	}
	get selectRect() {
		return this.core.selectRect;
	}
	get rulerSize() {
		return this.core.rulerSize;
	}

	// 向后兼容：暴露 events 的方法
	get on() {
		return this.events.on;
	}
	get off() {
		return this.events.off;
	}
	get emit() {
		return this.events.emit;
	}

	// 配置
	config: Types.RenderConfig;

	// 附加工具
	draws: { [index: string]: (Types.Draw & Types.Handler) | undefined } = {};

	// 素材工具
	assetTool: Tools.AssetTool;

	// 选择工具
	selectionTool: Tools.SelectionTool;

	// 复制工具
	copyTool: Tools.CopyTool;

	// 磁贴工具
	attractTool: Tools.AttractTool;

	// 事件处理
	handlers: { [index: string]: Types.Handler } = {};

	// 参数
	bgSize = 20;
	previewSize = 0.2; // 预览框大小（比例）
	pointSize = 6;

	// 调试模式
	debug = false;

	// 画图类型
	graphType: Types.GraphType | undefined = undefined;

	// 添加文字中
	texting = false;

	changeDebug(v: boolean) {
		this.debug = v;
		this.emit("debug-change", this.debug);

		this.draws[Draws.AttractDraw.name]?.init();
		this.draws[Draws.RulerDraw.name]?.init();
		this.draws[Draws.ScaleInfoDraw.name]?.init();
		this.draws[Draws.RefLineDraw.name]?.init();
		this.draws[Draws.ContextmenuDraw.name]?.init();

		return this.debug;
	}

	constructor(stageEle: HTMLDivElement, config: Types.RenderConfig) {
		this.config = config;

		// 初始化核心模块
		this.core = new RenderCore(this, stageEle, config);
		this.events = new RenderEvents(this);
		this.utils = new RenderUtils(this);
		this.settings = new RenderSettings(this);

		// 附加工具
		if (!this.config.readonly && this.config.showBg) {
			this.draws[Draws.BgDraw.name] = new Draws.BgDraw(
				this,
				this.core.layerFloor,
				{
					size: this.bgSize,
				}
			);
		}

		this.draws[Draws.AttractDraw.name] = new Draws.AttractDraw(
			this,
			this.core.layerCover,
			{
				size: this.pointSize,
			}
		);

		if (!this.config.readonly && this.config.showRuler) {
			this.draws[Draws.RulerDraw.name] = new Draws.RulerDraw(
				this,
				this.core.layerCover,
				{
					size: this.core.rulerSize,
				}
			);
		}

		if (!this.config.readonly && this.config.showScaleInfo) {
			this.draws[Draws.ScaleInfoDraw.name] = new Draws.ScaleInfoDraw(
				this,
				this.core.layerCover,
				{
					//
				}
			);
		}

		if (!this.config.readonly && this.config.showRefLine) {
			this.draws[Draws.RefLineDraw.name] = new Draws.RefLineDraw(
				this,
				this.core.layerCover,
				{
					padding: this.core.rulerSize,
				}
			);
		}

		if (this.config.showContextmenu) {
			this.draws[Draws.ContextmenuDraw.name] = new Draws.ContextmenuDraw(
				this,
				this.core.layerCover,
				{
					//
				}
			);
		}

		// 素材工具
		this.assetTool = new Tools.AssetTool(this);

		// 选择工具
		this.selectionTool = new Tools.SelectionTool(this);

		// 复制工具
		this.copyTool = new Tools.CopyTool(this);

		// 磁贴工具
		this.attractTool = new Tools.AttractTool(this);

		// 事件处理
		this.handlers[Handlers.DragHandlers.name] = new Handlers.DragHandlers(this);
		this.handlers[Handlers.ZoomHandlers.name] = new Handlers.ZoomHandlers(this);

		if (!this.config.readonly) {
			this.handlers[Handlers.DragOutsideHandlers.name] =
				new Handlers.DragOutsideHandlers(this);
			this.handlers[Handlers.SelectionHandlers.name] =
				new Handlers.SelectionHandlers(this);
			this.handlers[Handlers.KeyMoveHandlers.name] =
				new Handlers.KeyMoveHandlers(this);
		}

		if (!this.config.readonly && this.config.showRefLine) {
			if (this.draws[Draws.RefLineDraw.name] !== void 0) {
				this.handlers[Draws.RefLineDraw.name] =
					this.draws[Draws.RefLineDraw.name]!;
			}
		}

		this.handlers[Handlers.ShutcutHandlers.name] = new Handlers.ShutcutHandlers(
			this
		);

		// 初始化
		this.init();
	}

	// 初始化
	init() {
		this.core.initLayers();
		this.draws[Draws.BgDraw.name]?.init();
		this.draws[Draws.AttractDraw.name]?.init();
		this.draws[Draws.RulerDraw.name]?.init();
		this.draws[Draws.ScaleInfoDraw.name]?.init();
		this.draws[Draws.RefLineDraw.name]?.init();
		this.draws[Draws.ContextmenuDraw.name]?.init();

		// 事件绑定
		this.eventBind();
	}

	// 更新 stage 尺寸
	resize(width: number, height: number) {
		this.core.resize(width, height);
		// 重绘
		this.redraw();
	}

	// 移除元素
	remove(nodes: Konva.Node[]) {
		for (const node of nodes) {
			if (node instanceof Konva.Transformer) {
				// 移除已选择的节点
				this.remove(this.selectionTool.selectingNodes);
			} else {
				// 移除相关联系线信息
				const groupId = node.id();

				for (const rn of this.layer.getChildren()) {
					if (rn.id() !== groupId && Array.isArray(rn.attrs.points)) {
						for (const point of rn.attrs.points) {
							if (Array.isArray(point.pairs)) {
								// 移除拐点记录
								if (rn.attrs.manualPointsMap) {
									point.pairs
										.filter(
											(pair: Types.LinkDrawPair) =>
												pair.from.groupId === groupId ||
												pair.to.groupId === groupId
										)
										.forEach((pair: Types.LinkDrawPair) => {
											rn.attrs.manualPointsMap[pair.id] = undefined;
										});
								}

								// 连接线信息
								point.pairs = point.pairs.filter(
									(pair: Types.LinkDrawPair) =>
										pair.from.groupId !== groupId && pair.to.groupId !== groupId
								);
							}
						}

						rn.setAttr("points", rn.attrs.points);
					}
				}

				// 移除未选择的节点
				node.destroy();
			}
		}

		if (nodes.length > 0) {
			// 清除选择
			this.selectionTool.selectingClear();
			// this.linkTool.selectingClear() // LinkTool 已删除

			// 重绘
			this.redraw();
		}
	}

	// 向后兼容：历史记录方法
	prevHistory() {
		// TODO: 实现历史记录功能
	}

	nextHistory() {
		// TODO: 实现历史记录功能
	}

	updateHistory() {
		// TODO: 实现历史记录功能
	}

	// 事件绑定
	eventBind() {
		for (const event of [
			"mousedown",
			"mouseup",
			"mousemove",
			"wheel",
			"contextmenu",
			"pointerclick",
		]) {
			this.stage.on(event, (e) => {
				e?.evt?.preventDefault();

				for (const k in this.draws) {
					this.draws[k]?.handlers?.stage?.[event]?.(e);
				}

				for (const k in this.handlers) {
					this.handlers[k]?.handlers?.stage?.[event]?.(e);
				}
			});
		}

		const container = this.stage.container();
		container.tabIndex = 1;
		container.focus();
		for (const event of [
			"mouseenter",
			"dragenter",
			"mousemove",
			"mouseout",
			"dragenter",
			"dragover",
			"drop",
			"keydown",
			"keyup",
		]) {
			container.addEventListener(event, (e) => {
				e?.preventDefault();

				if (["mouseenter", "dragenter"].includes(event)) {
					// 激活 dom 事件
					this.stage.container().focus();
				}

				for (const k in this.draws) {
					this.draws[k]?.handlers?.dom?.[event]?.(e);
				}

				for (const k in this.handlers) {
					this.handlers[k]?.handlers?.dom?.[event]?.(e);
				}
			});
		}

		for (const event of [
			"mousedown",
			"transformstart",
			"transform",
			"transformend",
			"dragstart",
			"dragmove",
			"dragend",
			"mousemove",
			"mouseleave",
			"dblclick",
		]) {
			this.transformer.on(event, (e) => {
				e?.evt?.preventDefault();

				for (const k in this.draws) {
					this.draws[k]?.handlers?.transformer?.[event]?.(e);
				}

				for (const k in this.handlers) {
					this.handlers[k]?.handlers?.transformer?.[event]?.(e);
				}
			});
		}

		const selectionHandler = this.handlers[Handlers.SelectionHandlers.name];
		if (selectionHandler?.transformerConfig?.anchorDragBoundFunc) {
			this.transformer.anchorDragBoundFunc(
				selectionHandler.transformerConfig.anchorDragBoundFunc
			);
		}
	}

	// 向后兼容：委托给 core
	getStageState() {
		return this.core.getStageState();
	}

	toStageValue(boardPos: number) {
		return this.core.toStageValue(boardPos);
	}

	toBoardValue(stagePos: number) {
		return this.core.toBoardValue(stagePos);
	}

	// 向后兼容：委托给 utils
	ignore(node: Konva.Node) {
		return this.utils.ignore(node);
	}

	ignoreSelect(node: Konva.Node) {
		return this.utils.ignoreSelect(node);
	}

	ignoreDraw(node: Konva.Node) {
		return this.utils.ignoreDraw(node);
	}

	ignoreLink(node: Konva.Node) {
		return this.utils.ignoreLink(node);
	}

	// 重绘（可选择）
	redraw(drawNames?: string[]) {
		const all = [
			// layerFloor
			Draws.BgDraw.name, // 更新背景
			// layerCover（按先后顺序）
			Draws.AttractDraw.name, // 更新磁贴
			Draws.RulerDraw.name, // 更新比例尺
			Draws.ScaleInfoDraw.name, // 更新缩放信息
			Draws.RefLineDraw.name, // 更新参考线
			Draws.ContextmenuDraw.name, // 更新右键菜单
		];

		// // 可以以此发现缺失的 draw
		// console.log('redraw', drawNames)
		// console.trace()

		if (Array.isArray(drawNames) && !this.debug) {
			// 选择性 draw 也要保持顺序
			for (const name of all) {
				if (drawNames.includes(name)) {
					this.draws[name]?.draw();
				}
			}
		} else {
			for (const name of all) {
				this.draws[name]?.draw();
			}
		}
	}

	changeDraggable(disabled: boolean) {
		this.layer.children.forEach((asset) => {
			asset.draggable(disabled);
		});
	}

	// 改变画图类型
	changeGraphType(type?: Types.GraphType) {
		if (type) {
			this.texting = false;
			this.emit("texting-change", this.texting);
		}

		this.graphType = type;
		this.emit("graph-type-change", this.graphType);

		// 绘制 Graph 的时候，不允许直接拖动其他素材
		this.changeDraggable(!this.config.readonly && this.graphType === void 0);
	}

	// 添加文字状态
	changeTexting(texting: boolean) {
		if (texting) {
			this.graphType = undefined;
			this.emit("graph-type-change", this.graphType);
		}

		this.texting = texting;
		this.emit("texting-change", this.texting);

		document.body.style.cursor = this.texting ? "text" : "default";
	}

	// 向后兼容：委托给 settings
	static get PageSettingsDefault() {
		return RenderSettings.PageSettingsDefault;
	}

	static get AssetSettingsDefault() {
		return RenderSettings.AssetSettingsDefault;
	}

	static get LinkSettingsDefault() {
		return RenderSettings.LinkSettingsDefault;
	}

	getPageSettings(): Types.PageSettings {
		return this.settings.getPageSettings();
	}

	setPageSettings(settings: Types.PageSettings) {
		this.settings.setPageSettings(settings);
	}

	getBackground() {
		return this.settings.getBackground();
	}

	updateBackground() {
		this.settings.updateBackground();
	}

	getAssetSettings(asset?: Konva.Node): Types.AssetSettings {
		return this.settings.getAssetSettings(asset);
	}

	setSvgXMLSettings(xml: string, settings: Types.AssetSettings) {
		return this.utils.setSvgXMLSettings(xml, settings);
	}

	rotatePoint({ x, y }: { x: number; y: number }, rad: number) {
		return this.utils.rotatePoint({ x, y }, rad);
	}

	rotateAroundCenter(node: Konva.Node, rotation: number) {
		this.utils.rotateAroundCenter(node, rotation);
	}

	async setAssetSettings(asset: Konva.Node, settings: Types.AssetSettings) {
		return this.settings.setAssetSettings(asset, settings);
	}

	async setLinkSettings(link: Konva.Line, settings: Types.LinkSettings) {
		return this.settings.setLinkSettings(link, settings);
	}

	getLinkSettings(link?: Konva.Line): Types.LinkSettings {
		return this.settings.getLinkSettings(link);
	}
}
