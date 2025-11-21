<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import { createRender, type RenderInstance } from "./Render";

// 容器
const boardElement = ref<HTMLDivElement>();

// 渲染器
let render = shallowRef<RenderInstance | null>(null);

const resizer = (() => {
	// 监听器实例
	let resizeObserver: ResizeObserver | null = null;
	// 当前监听的目标元素
	let currentTarget: HTMLDivElement | null = null;
	// 回调函数
	let resizeCallback: ((w: number, h: number) => void) | null = null;

	// 初始化
	function init(
		target: HTMLDivElement,
		config: {
			resize: (w: number, h: number) => void;
		}
	) {
		// 如果已经在监听同一个元素，先清理
		if (currentTarget === target && resizeObserver) {
			resizeObserver.disconnect();
		}

		// 保存目标元素和回调
		currentTarget = target;
		resizeCallback = config.resize;

		// 创建新的监听器
		resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				// 调用回调，传递尺寸信息
				resizeCallback?.(width, height);
			}
		});

		// 开始监听
		resizeObserver.observe(target);
	}

	// 暂停监听
	function pause() {
		resizeObserver?.disconnect();
	}

	// 恢复监听
	function resume() {
		if (currentTarget && resizeObserver) {
			resizeObserver.observe(currentTarget);
		}
	}

	// 销毁监听器
	function destroy() {
		resizeObserver?.disconnect();
		resizeObserver = null;
		currentTarget = null;
		resizeCallback = null;
	}

	return {
		init,
		pause,
		resume,
		destroy,
	};
})();

const readonly = false;

const init = () => {
	if (!boardElement.value) return;
	resizer.init(boardElement.value, {
		resize: (width, height) => {
			if (!render.value) {
				// 初始化渲染
				render.value = createRender(boardElement.value!, {
					width,
					height,
					//
					showBg: true,
					showRuler: true,
					showRefLine: true,
					showPreview: true,
					showContextmenu: true,
					//
					attractResize: true,
					attractBg: true,
					attractNode: true,
					//
					readonly,
					//
					zoom: {
						enabled: true,
						scaleBy: 0.1,
						scaleMin: 0.2,
						scaleMax: 5,
					},
				});
			} else {
				render.value.resize(width, height);
			}
		},
	});
};

onMounted(() => {
	init();
});
</script>

<template>
	<div class="w-full flex flex-col">
		<header class="shrink-0 h-[93px] flex items-center justify-center">
			顶栏
		</header>
		<section class="h-0 grow-1 flex">
			<header
				class="shrink-0 w-[221px] overflow-y-auto flex items-center justify-center border-r border-solid border-[#ccc]"
			>
				素材面板
			</header>
			<section
				class="flex-1 min-w-0 overflow-hidden bg-[rgba(0,0,0,0.05)]"
				ref="boardElement"
			></section>
			<footer class="shrink-0 w-[227px] flex items-center justify-center">
				属性面板
			</footer>
		</section>
		<footer
			class="shrink-0 h-[0px] flex items-center justify-center overflow-hidden"
		>
			底栏
		</footer>
	</div>
</template>

<style scoped>
:deep(.konvajs-content) {
	max-width: 100% !important;
	max-height: 100% !important;
}
</style>
