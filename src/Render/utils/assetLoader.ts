import Konva from "konva";

const gifler = window.gifler;

/**
 * 加载 SVG 并创建 Konva.Image
 * @param src - SVG 文件路径
 * @returns Promise<Konva.Image>
 */
export async function loadSvg(src: string): Promise<Konva.Image> {
	const svgXML = await (await fetch(src)).text();

	const blob = new Blob([svgXML], { type: "image/svg+xml" });
	const url = URL.createObjectURL(blob);

	return new Promise<Konva.Image>((resolve) => {
		Konva.Image.fromURL(url, (imageNode) => {
			imageNode.setAttrs({
				svgXML,
			});
			resolve(imageNode);
		});
	});
}

/**
 * 加载 GIF 并创建 Konva.Image（支持动画）
 * @param src - GIF 文件路径
 * @param onFrame - 每帧回调函数（可选）
 * @returns Promise<Konva.Image>
 */
export function loadGif(
	src: string,
	onFrame?: (frame: any, frameIndex: number) => void
): Promise<Konva.Image> {
	return new Promise<Konva.Image>((resolve) => {
		// 创建临时 img 元素，用于获取 GIF 尺寸
		const img = document.createElement("img");
		let frameIndex = 0;

		img.onload = () => {
			// 创建 canvas 用于绘制 GIF 动画帧
			const canvas = document.createElement("canvas");

			// 设置 canvas 尺寸为 GIF 的原始尺寸
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;

			// 使用 gifler 解析 GIF 并逐帧播放
			const gif = gifler(src);

			// 监听每一帧的绘制
			gif.frames(canvas, (ctx: CanvasRenderingContext2D, frame: any) => {
				// 将当前帧绘制到 canvas 上
				// frame.buffer 是当前帧的图像数据
				// frame.x, frame.y 是帧在 GIF 中的位置偏移
				ctx.drawImage(frame.buffer, frame.x, frame.y);

				// 调用用户提供的回调（如果有）
				if (onFrame) {
					onFrame(frame, frameIndex);
				}

				frameIndex++;
			});

			// 移除临时 img 元素
			img.remove();

			resolve(
				new Konva.Image({
					image: canvas, // 使用 canvas 作为图片源（动态更新）
					gif: src, // 保存 GIF 源地址，用于序列化
				})
			);
		};

		// 触发图片加载
		img.src = src;
	});
}

/**
 * 加载普通图片（JPG/PNG）并创建 Konva.Image
 * @param src - 图片文件路径
 * @returns Promise<Konva.Image>
 */
export function loadImg(src: string): Promise<Konva.Image> {
	return new Promise<Konva.Image>((resolve) => {
		Konva.Image.fromURL(src, (imageNode) => {
			imageNode.setAttrs({ src });
			resolve(imageNode);
		});
	});
}

/**
 * 播放 GIF 动画
 * 需要在 Image 添加到 Layer 之后调用
 * @param imageNode - GIF 图片节点
 * @param layer - 图片所在的 Layer
 * @param onFrame - 每帧回调函数（可选）
 * @returns 动画实例（可用于停止动画）
 */
export function playGif(
	imageNode: Konva.Image,
	layer: Konva.Layer,
	onFrame?: () => void
): Konva.Animation {
	const anim = new Konva.Animation(() => {
		// 调用用户提供的回调（如果有）
		if (onFrame) {
			onFrame();
		}
		// gifler 会在后台更新 canvas，Konva.Animation 会触发 layer 重绘
	}, layer);
	anim.start();

	// 保存动画引用到节点，以便后续停止
	imageNode.setAttr("gifAnimation", anim);

	return anim;
}

/**
 * 根据文件类型自动选择加载方法
 * @param src - 文件路径
 * @param type - 文件类型（svg/gif/png/jpg 等）
 * @param onFrame - 每帧回调函数（可选，仅 GIF 有效）
 * @returns Promise<Konva.Image>
 */
export async function loadAsset(
	src: string,
	type: string,
	onFrame?: (frame: any, frameIndex: number) => void
): Promise<Konva.Image> {
	const lowerType = type.toLowerCase();

	switch (lowerType) {
		case "svg":
			return loadSvg(src);
		case "gif":
			return loadGif(src, onFrame);
		case "png":
		case "jpg":
		case "jpeg":
		case "webp":
			return loadImg(src);
		default:
			console.warn(`Unknown asset type: ${type}, using loadImg as fallback`);
			return loadImg(src);
	}
}

/**
 * 预加载多个资源
 * @param assets - 资源列表 [{ src, type }, ...]
 * @returns Promise<Konva.Image[]>
 */
export async function preloadAssets(
	assets: Array<{ src: string; type: string }>
): Promise<Konva.Image[]> {
	return Promise.all(assets.map((asset) => loadAsset(asset.src, asset.type)));
}
