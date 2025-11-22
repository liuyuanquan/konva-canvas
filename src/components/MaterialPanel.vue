<script setup lang="ts">
import {
	PictureFilled,
	Grid,
	VideoCamera,
	Management,
	MoreFilled,
} from "@element-plus/icons-vue";

interface MaterialCategory {
	id: string;
	title: string;
	icon: any;
	items: MaterialItem[];
}

interface ConnectionPoint {
	x: number;
	y: number;
	direction?: "top" | "bottom" | "left" | "right";
}

interface MaterialItem {
	id: string;
	name: string;
	icon?: any; // Element Plus 图标组件
	text?: string; // 文本/Emoji
	preview?: string; // 图片预览路径（支持 SVG、PNG、JPG、GIF）
	points?: ConnectionPoint[]; // 连接点信息
}

// 素材分类数据
const categories = shallowRef<MaterialCategory[]>([
	{
		id: "vector",
		title: "矢量图",
		icon: markRaw(Grid),
		items: [
			{
				id: "ARRESTER_1",
				name: "ARRESTER_1",
				preview: "./img/svg/ARRESTER_1.svg",
				points: [
					{ x: 101, y: 1, direction: "top" },
					{ x: 101, y: 199, direction: "bottom" },
				],
			},
			{
				id: "ARRESTER_2",
				name: "ARRESTER_2",
				preview: "./img/svg/ARRESTER_2.svg",
				points: [
					{ x: 101, y: 1, direction: "top" },
					{ x: 101, y: 199, direction: "bottom" },
				],
			},
			{
				id: "ARRESTER_2_1",
				name: "ARRESTER_2_1",
				preview: "./img/svg/ARRESTER_2_1.svg",
				points: [
					{ x: 101, y: 1, direction: "top" },
					{ x: 101, y: 199, direction: "bottom" },
				],
			},
			{
				id: "BREAKER_CLOSE",
				name: "BREAKER_CLOSE",
				preview: "./img/svg/BREAKER_CLOSE.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "BREAKER_OPEN",
				name: "BREAKER_OPEN",
				preview: "./img/svg/BREAKER_OPEN.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "CAPACITOR",
				name: "CAPACITOR",
				preview: "./img/svg/CAPACITOR.svg",
				points: [
					{ x: 99, y: 1, direction: "top" },
					{ x: 99, y: 199, direction: "bottom" },
				],
			},
			{
				id: "CT_1",
				name: "CT1",
				preview: "./img/svg/CT_1.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "CT_2",
				name: "CT2",
				preview: "./img/svg/CT_2.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "HL",
				name: "HL",
				preview: "./img/svg/HL.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "POTENTIAL_TRANSFORMER_2",
				name: "POTENTIAL_TRANSFORMER_2",
				preview: "./img/svg/POTENTIAL_TRANSFORMER_2.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "POT_TRANS_3_WINDINGS",
				name: "POT_TRANS_3_WINDINGS",
				preview: "./img/svg/POT_TRANS_3_WINDINGS.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 70, y: 199, direction: "bottom" },
					{ x: 130, y: 199, direction: "bottom" },
				],
			},
			{
				id: "PT",
				name: "PT",
				preview: "./img/svg/PT.svg",
				points: [
					{ x: 34, y: 100, direction: "left" },
					{ x: 98, y: 100, direction: "right" },
				],
			},
			{
				id: "PT_1",
				name: "PT1",
				preview: "./img/svg/PT_1.svg",
				points: [
					{ x: 101, y: 1, direction: "top" },
					{ x: 101, y: 199, direction: "bottom" },
				],
			},
			{
				id: "REACTOR",
				name: "REACTOR",
				preview: "./img/svg/REACTOR.svg",
				points: [
					{ x: 98, y: 1, direction: "left" },
					{ x: 98, y: 199, direction: "right" },
				],
			},
			{
				id: "REGYCAPACITOR",
				name: "REGYCAPACITOR",
				preview: "./img/svg/REGYCAPACITOR.svg",
				points: [
					{ x: 1, y: 101, direction: "left" },
					{ x: 199, y: 101, direction: "right" },
				],
			},
			{
				id: "SERIES_CAPACITOR",
				name: "SERIES_CAPACITOR",
				preview: "./img/svg/SERIES_CAPACITOR.svg",
				points: [
					{ x: 1, y: 101, direction: "left" },
					{ x: 199, y: 101, direction: "right" },
				],
			},
			{
				id: "SHUNT_REACTOR",
				name: "SHUNT_REACTOR",
				preview: "./img/svg/SHUNT_REACTOR.svg",
				points: [
					{ x: 98, y: 1, direction: "top" },
					{ x: 98, y: 199, direction: "bottom" },
				],
			},
			{
				id: "SHUNT_REACTOR_1",
				name: "SHUNT_REACTOR_1",
				preview: "./img/svg/SHUNT_REACTOR_1.svg",
				points: [
					{ x: 98, y: 1, direction: "top" },
					{ x: 98, y: 199, direction: "bottom" },
				],
			},
			{
				id: "SIX_CIRCLE",
				name: "SIX_CIRCLE",
				preview: "./img/svg/SIX_CIRCLE.svg",
				points: [
					{ x: 99, y: 1, direction: "top" },
					{ x: 99, y: 199, direction: "bottom" },
				],
			},
			{
				id: "ST",
				name: "ST",
				preview: "./img/svg/ST.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "THERR_CIRCLE",
				name: "THERR_CIRCLE",
				preview: "./img/svg/THERR_CIRCLE.svg",
				points: [
					{ x: 99, y: 43, direction: "top" },
					{ x: 99, y: 157, direction: "bottom" },
				],
			},
			{
				id: "combin",
				name: "combin",
				preview: "./img/svg/combin.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "combin3",
				name: "combin3",
				preview: "./img/svg/combin3.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "combin4",
				name: "combin4",
				preview: "./img/svg/combin4.svg",
				points: [
					{ x: 101, y: 1, direction: "top" },
					{ x: 101, y: 199, direction: "bottom" },
				],
			},
			{
				id: "combin5",
				name: "combin5",
				preview: "./img/svg/combin5.svg",
				points: [
					{ x: 99, y: 1, direction: "top" },
					{ x: 99, y: 199, direction: "bottom" },
				],
			},
			{
				id: "xianshideng",
				name: "xianshideng",
				preview: "./img/svg/xianshideng.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
				],
			},
			{
				id: "MEMRISTOR_1",
				name: "MEMRISTOR_1",
				preview: "./img/svg/MEMRISTOR_1.svg",
				points: [
					{ x: 1, y: 101, direction: "left" },
					{ x: 199, y: 101, direction: "right" },
				],
			},
			{
				id: "guangfufadian",
				name: "guangfufadian",
				preview: "./img/svg/guangfufadian.svg",
				points: [
					{ x: 100, y: 62, direction: "top" },
					{ x: 100, y: 138, direction: "bottom" },
					{ x: 27, y: 100, direction: "left" },
					{ x: 173, y: 100, direction: "right" },
				],
			},
			{
				id: "REGUINDUCTOR",
				name: "REGUINDUCTOR",
				preview: "./img/svg/REGUINDUCTOR.svg",
				points: [
					{ x: 100, y: 66, direction: "top" },
					{ x: 100, y: 134, direction: "bottom" },
					{ x: 1, y: 100, direction: "left" },
					{ x: 199, y: 100, direction: "right" },
				],
			},
			{
				id: "AC_2",
				name: "AC_2",
				preview: "./img/svg/AC_2.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
					{ x: 1, y: 100, direction: "left" },
					{ x: 199, y: 100, direction: "right" },
				],
			},
			{
				id: "AC_SOURCE",
				name: "AC_SOURCE",
				preview: "./img/svg/AC_SOURCE.svg",
				points: [
					{ x: 100, y: 1, direction: "top" },
					{ x: 100, y: 199, direction: "bottom" },
					{ x: 1, y: 100, direction: "left" },
					{ x: 199, y: 100, direction: "right" },
				],
			},
			{
				id: "EQUIVALENTSOURCE",
				name: "EQUIVALENTSOURCE",
				preview: "./img/svg/EQUIVALENTSOURCE.svg",
				points: [{ x: 100, y: 100 }],
			},
		],
	},
	{
		id: "image",
		title: "图片",
		icon: markRaw(PictureFilled),
		items: [
			{ id: "jpg_big", name: "大图", preview: "./img/jpg/big.jpg" },
			{ id: "png_1", name: "图片1", preview: "./img/png/1.png" },
			{ id: "png_2", name: "图片2", preview: "./img/png/2.png" },
			{ id: "png_3", name: "图片3", preview: "./img/png/3.png" },
			{ id: "png_7", name: "图片7", preview: "./img/png/7.png" },
			{ id: "png_9", name: "图片9", preview: "./img/png/9.png" },
		],
	},
	{
		id: "gif",
		title: "GIF",
		icon: markRaw(VideoCamera),
		items: [
			{ id: "gif_5", name: "动画5", preview: "./img/gif/5.gif" },
			{ id: "gif_6", name: "动画6", preview: "./img/gif/6.gif" },
			{ id: "gif_8", name: "动画8", preview: "./img/gif/8.gif" },
		],
	},
	{
		id: "group",
		title: "图形组合",
		icon: markRaw(Management),
		items: [
			{ id: "group_1", name: "组合1", preview: "./json/1.png" },
			{ id: "group_2", name: "组合2", preview: "./json/2.png" },
			{ id: "group_3", name: "组合3", preview: "./json/3.png" },
			{ id: "group_4", name: "组合4", preview: "./json/4.png" },
			{ id: "group_5", name: "组合5", preview: "./json/5.png" },
			{ id: "group_6", name: "组合6", preview: "./json/6.png" },
			{ id: "group_7", name: "组合7", preview: "./json/7.png" },
		],
	},
	{
		id: "more",
		title: "更多",
		icon: markRaw(MoreFilled),
		items: [
			{
				id: "a-CT2xianghu",
				name: "CT2相互",
				preview: "./img/svg/a-CT2xianghu.svg",
			},
			{
				id: "a-CTsanxiang",
				name: "CT三相",
				preview: "./img/svg/a-CTsanxiang.svg",
			},
			{ id: "combin2", name: "组合2", preview: "./img/svg/combin2.svg" },
			{
				id: "ARCSUPPCOIL",
				name: "消弧线圈",
				preview: "./img/svg/ARCSUPPCOIL.svg",
			},
			{ id: "INDUCTOR", name: "电感器", preview: "./img/svg/INDUCTOR.svg" },
			{
				id: "IRONCOREGAPINDUCTOR",
				name: "铁芯间隙电感",
				preview: "./img/svg/IRONCOREGAPINDUCTOR.svg",
			},
			{
				id: "IRONCOREINDUCTOR",
				name: "铁芯电感",
				preview: "./img/svg/IRONCOREINDUCTOR.svg",
			},
			{
				id: "IRONCOREVARINDUCTOR",
				name: "铁芯可变电感",
				preview: "./img/svg/IRONCOREVARINDUCTOR.svg",
			},
			{ id: "CT", name: "电流互感器", preview: "./img/svg/CT.svg" },
			{ id: "GROUND", name: "接地", preview: "./img/svg/GROUND.svg" },
			{ id: "LOAD", name: "负载", preview: "./img/svg/LOAD.svg" },
			{
				id: "PROTECT_GROUND",
				name: "保护接地",
				preview: "./img/svg/PROTECT_GROUND.svg",
			},
			{ id: "CT_3", name: "CT3", preview: "./img/svg/CT_3.svg" },
			{ id: "DDCT", name: "DDCT", preview: "./img/svg/DDCT.svg" },
			{
				id: "FLANGED_CONNECTION",
				name: "法兰连接",
				preview: "./img/svg/FLANGED_CONNECTION.svg",
			},
			{
				id: "jiedidaozha",
				name: "接地刀闸",
				preview: "./img/svg/jiedidaozha.svg",
			},
			{
				id: "sukeduanluqi",
				name: "塑壳断路器",
				preview: "./img/svg/sukeduanluqi.svg",
			},
			{
				id: "DELTAWINDING",
				name: "三角形绕组",
				preview: "./img/svg/DELTAWINDING.svg",
			},
			{ id: "MULTIPLIER", name: "乘法器", preview: "./img/svg/MULTIPLIER.svg" },
			{ id: "WINDING", name: "绕组", preview: "./img/svg/WINDING.svg" },
			{ id: "WINDINGX", name: "绕组X", preview: "./img/svg/WINDINGX.svg" },
			{ id: "YWINDING", name: "Y型绕组", preview: "./img/svg/YWINDING.svg" },
			{ id: "png_3", name: "图片3", preview: "./img/png/3.png" },
			{ id: "png_7", name: "图片7", preview: "./img/png/7.png" },
			{ id: "png_9", name: "图片9", preview: "./img/png/9.png" },
		],
	},
]);

// 默认展开第一个分类（手风琴模式：一次只能展开一个）
const activeNames = ref("vector");

// 拖拽素材
const handleDragStart = (item: MaterialItem, e: DragEvent) => {
	if (e.dataTransfer) {
		e.dataTransfer.effectAllowed = "copy";
		// 传递素材数据
		const dragData = {
			url: item.preview,
			type: item.preview?.split(".").pop() || "unknown",
			...item,
		};
		e.dataTransfer.setData("application/json", JSON.stringify(dragData));
	}
};
</script>

<template>
	<div class="material-panel">
		<el-collapse v-model="activeNames" class="material-collapse" accordion>
			<el-collapse-item
				v-for="category in categories"
				:key="category.id"
				:name="category.id"
			>
				<template #title>
					<div class="category-title">
						<el-icon :size="18" class="category-icon">
							<component :is="category.icon" />
						</el-icon>
						<span>{{ category.title }}</span>
						<el-tag size="small" type="info" class="count-tag">
							{{ category.items.length }}
						</el-tag>
					</div>
				</template>

				<div class="material-grid">
					<el-card
						v-for="item in category.items"
						:key="item.id"
						shadow="hover"
						class="material-card"
						:body-style="{ padding: '0' }"
						draggable="true"
						@dragstart="handleDragStart(item, $event)"
					>
						<!-- 图片预览（支持 SVG、PNG、JPG、GIF） -->
						<el-image
							v-if="item.preview"
							:src="item.preview"
							:alt="item.name"
							fit="contain"
							class="item-preview"
						/>
						<!-- Element Plus 图标 -->
						<div v-else-if="item.icon" class="item-icon-component">
							<el-icon :size="48">
								<component :is="item.icon" />
							</el-icon>
						</div>
						<!-- 文本/Emoji -->
						<div v-else-if="item.text" class="item-text">
							{{ item.text }}
						</div>
					</el-card>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<style scoped>
.material-panel {
	height: 100%;
	overflow-y: auto;
	background: transparent;
}

.material-collapse {
	border: none;
}

.material-collapse :deep(.el-collapse-item__header) {
	padding: 0 16px;
	background: #fff;
	border-bottom: 1px solid #ebeef5;
	height: 48px;
	line-height: 48px;
	font-weight: 500;
}

.material-collapse :deep(.el-collapse-item__wrap) {
	border-bottom: 1px solid #ebeef5;
	background: #fafafa;
}

.material-collapse :deep(.el-collapse-item__content) {
	padding: 12px;
}

.category-title {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
}

.category-icon {
	color: var(--el-color-primary);
}

.count-tag {
	margin-left: auto;
}

.material-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
}

.material-card {
	cursor: move;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border-radius: 12px;
	aspect-ratio: 1 / 1;
	overflow: hidden;
	position: relative;
	border: 2px solid transparent;
}

.material-card:hover {
	transform: translateY(-6px) scale(1.05);
	border-color: var(--el-color-primary);
	box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2) !important;
}

.material-card:active {
	transform: translateY(-2px) scale(0.98);
}

.material-card :deep(.el-card__body) {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
	position: relative;
}

.material-card:hover :deep(.el-card__body) {
	background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.item-preview {
	width: 100%;
	height: 100%;
	border-radius: 0;
	padding: 12%;
}

.item-preview :deep(img) {
	transition: transform 0.3s;
	object-fit: contain !important;
}

.material-card:hover .item-preview :deep(img) {
	transform: scale(1.08);
}

.item-icon-component {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--el-color-primary);
	transition: all 0.3s;
}

.item-icon-component :deep(.el-icon) {
	transition: all 0.3s;
	filter: drop-shadow(0 2px 8px rgba(64, 158, 255, 0.3));
}

.material-card:hover .item-icon-component :deep(.el-icon) {
	transform: scale(1.15) rotate(5deg);
	color: var(--el-color-primary-light-3);
}

.item-text {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48px;
	color: var(--el-color-primary);
	transition: all 0.3s;
	text-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.material-card:hover .item-text {
	font-size: 56px;
	transform: rotate(5deg);
	color: var(--el-color-primary-light-3);
}

/* 隐藏滚动条 */
.material-panel::-webkit-scrollbar {
	display: none;
}

.material-panel {
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
}
</style>
