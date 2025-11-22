/**
 * 全局类型声明
 */

/**
 * gifler 库类型声明
 * 通过 <script> 标签加载，挂载到 window 对象上
 * @see public/js/gifler.js
 */
declare global {
	interface Window {
		gifler: (src: string) => {
			frames: (
				canvas: HTMLCanvasElement,
				callback: (ctx: CanvasRenderingContext2D, frame: any) => void
			) => void;
		};
	}
}

export {};
