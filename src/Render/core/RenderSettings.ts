import Konva from "konva";
import type { Render } from "../index";
import * as Types from "../types";
import * as Draws from "../draws";

/**
 * Render 设置管理类
 * 管理页面、素材、连接线的设置
 */
export class RenderSettings {
	protected render: Render;

	// 页面设置默认值
	static readonly PageSettingsDefault: Types.PageSettings = {
		background: "transparent",
		stroke: "rgb(0,0,0)",
		strokeWidth: 1,
		fill: "rgb(0,0,0)",
		linkStroke: "rgb(0,0,0)",
		linkStrokeWidth: 1,
		fontSize: 24,
		textFill: "rgb(0,0,0)",
	};

	// 素材设置默认值
	static readonly AssetSettingsDefault: Types.AssetSettings = {
		stroke: "",
		strokeWidth: 0,
		fill: "",
		arrowStart: false,
		arrowEnd: false,
		fontSize: 0,
		textFill: "",
		text: "Text",
		x: 0,
		y: 0,
		rotation: 0,
		tension: 0,
	};

	// 连接线设置默认值
	static readonly LinkSettingsDefault: Types.LinkSettings = {
		stroke: "",
		strokeWidth: 0,
		arrowStart: false,
		arrowEnd: false,
		tension: 0,
	};

	constructor(render: Render) {
		this.render = render;
	}

	/**
	 * 获取页面设置
	 */
	getPageSettings(): Types.PageSettings {
		return (
			this.render.core.stage.attrs.pageSettings ?? {
				...RenderSettings.PageSettingsDefault,
			}
		);
	}

	/**
	 * 更新页面设置
	 */
	setPageSettings(settings: Types.PageSettings) {
		this.render.core.stage.setAttr("pageSettings", settings);
		this.updateBackground();

		// if (update) {
		// 	this.render.history.update();
		// }
	}

	/**
	 * 获取背景
	 */
	getBackground(): Konva.Rect | undefined {
		return this.render.draws[Draws.BgDraw.name]?.layer.findOne(
			`.${Draws.BgDraw.name}__background`
		) as Konva.Rect;
	}

	/**
	 * 更新背景
	 */
	updateBackground() {
		const background = this.getBackground();

		if (background) {
			background.fill(this.getPageSettings().background ?? "transparent");
		}

		this.render.draws[Draws.BgDraw.name]?.draw();
	}

	/**
	 * 获取素材设置
	 */
	getAssetSettings(asset?: Konva.Node): Types.AssetSettings {
		const base = asset?.attrs.assetSettings ?? {
			...RenderSettings.AssetSettingsDefault,
		};

		return {
			// 特定
			...base,
			// 继承全局
			stroke: base.stroke || this.getPageSettings().stroke,
			strokeWidth: base.strokeWidth || this.getPageSettings().strokeWidth,
			fontSize: base.fontSize || this.getPageSettings().fontSize,
			textFill: base.textFill || this.getPageSettings().textFill,
			// 绘制图形，默认不填充
			fill:
				base.fill ||
				(asset?.attrs.assetType === Types.AssetType.Graph
					? "transparent"
					: this.getPageSettings().fill),
			x: parseFloat((asset?.position().x ?? 0).toFixed(1)),
			y: parseFloat((asset?.position().y ?? 0).toFixed(1)),
			rotation: parseFloat((asset?.rotation() ?? 0).toFixed(1)),
			tension:
				asset?.attrs.assetType === Types.AssetType.Graph &&
				asset?.attrs.graphType === Types.GraphType.Curve
					? base.tension
					: undefined,
		};
	}

	/**
	 * 更新素材设置
	 */
	async setAssetSettings(asset: Konva.Node, settings: Types.AssetSettings) {
		asset.setAttr("assetSettings", settings);

		if (asset instanceof Konva.Group) {
			if (asset.attrs.imageType === Types.ImageType.svg) {
				const node = asset.children[0] as Konva.Shape;
				if (node instanceof Konva.Image) {
					if (node.attrs.svgXML) {
						const n = await this.render.assetTool.loadSvgXML(
							this.render.utils.setSvgXMLSettings(node.attrs.svgXML, settings)
						);
						node.parent?.add(n);
						node.remove();
						node.destroy();
						n.zIndex(0);
					}
				}
			} else if (asset.attrs.assetType === Types.AssetType.Graph) {
				const node = asset.findOne(".graph");
				if (node instanceof Konva.Shape) {
					node.strokeWidth(settings.strokeWidth);
					node.stroke(settings.stroke);
					if (node instanceof Konva.Arrow) {
						// 箭头跟随 stroke
						node.fill(settings.stroke);
					} else {
						node.fill(settings.fill);
					}
					if (node instanceof Konva.Arrow) {
						node.pointerAtBeginning(settings.arrowStart);
						node.pointerAtEnding(settings.arrowEnd);
					}
					if (
						node instanceof Konva.Arrow &&
						asset.attrs.graphType === Types.GraphType.Curve
					) {
						node.tension(settings.tension);
					}
				}
			} else if (asset.attrs.assetType === Types.AssetType.Text) {
				const node = asset.findOne("Text");
				const rect = asset.findOne("Rect");

				if (node instanceof Konva.Text && rect instanceof Konva.Rect) {
					let sizeChanged = false;
					if (
						node.fontSize() !== settings.fontSize ||
						node.text() !== settings.text
					) {
						sizeChanged = true;
					}

					node.fill(settings.textFill);
					node.fontSize(settings.fontSize);
					node.text(settings.text);

					// 内容为空时，给一个半透明背景色
					rect.fill(node.text().trim() ? "" : "rgba(0,0,0,0.1)");
					rect.width(Math.max(node.width(), settings.fontSize));
					rect.height(Math.max(node.height(), settings.fontSize));

					// 刷新 transformer 大小
					if (sizeChanged) {
						this.render.selectionTool.select([asset]);
					}
				}
			}

			// rotate 会影响 position，不能同时改变
			// 区分属性面板正在调整
			if (Math.abs(settings.rotation - asset.rotation()) >= 0.1) {
				this.render.utils.rotateAroundCenter(asset, settings.rotation);

				// 同步 position 的变化
				this.render.emit("asset-position-change", [asset]);
			} else {
				const prevSettings = this.getAssetSettings(asset);

				asset.position({
					x: parseFloat(settings.x.toFixed(1)),
					y: parseFloat(settings.y.toFixed(1)),
				});

				// 外部调用变化同步
				if (settings.x !== prevSettings.x || settings.y !== prevSettings.y) {
					this.render.emit("asset-position-change", [asset]);
				}
			}
		}

		// if (update) {
		// 	this.render.history.update();
		// }

		this.render.draws[Draws.BgDraw.name]?.draw();
	}

	/**
	 * 获取连接线设置
	 */
	getLinkSettings(link?: Konva.Line): Types.LinkSettings {
		let settings: (Konva.LineConfig & Types.LinkSettings) | undefined =
			undefined;

		if (link) {
			const group = this.render.core.layer.findOne(`#${link.attrs.groupId}`);
			if (Array.isArray(group?.attrs.points)) {
				const point = (group?.attrs.points as Types.LinkDrawPoint[]).find(
					(o: Types.LinkDrawPoint) => o.id === link.attrs.pointId
				);
				if (point) {
					const pair = point.pairs.find((o) => o.id === link.attrs.pairId);
					if (pair) {
						settings = pair.style;
					}
				}
			}
		}

		const base = settings ?? { ...RenderSettings.LinkSettingsDefault };

		return {
			// 特定
			...base,
			// 继承全局
			stroke: (base.stroke as string) || this.getPageSettings().linkStroke,
			strokeWidth: base.strokeWidth || this.getPageSettings().linkStrokeWidth,
		};
	}

	/**
	 * 更新连接线设置
	 */
	async setLinkSettings(link: Konva.Line, settings: Types.LinkSettings) {
		const group = this.render.core.layer.findOne(`#${link.attrs.groupId}`);
		if (Array.isArray(group?.attrs.points)) {
			const point = (group?.attrs.points as Types.LinkDrawPoint[]).find(
				(o: Types.LinkDrawPoint) => o.id === link.attrs.pointId
			);
			if (point) {
				const pair = point.pairs.find((o) => o.id === link.attrs.pairId);
				if (pair) {
					pair.style = {
						...pair.style,
						...settings,
					};

					group.setAttr("points", group?.attrs.points);
				}
			}
		}

		// if (update) {
		// 	this.render.history.update();
		// }

		this.render.draws[Draws.BgDraw.name]?.draw();
	}
}
