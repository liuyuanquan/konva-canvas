# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2024-11-22

### ✨ Added

#### 素材面板与拖拽功能

- **MaterialPanel 组件** - 基于 Element Plus 的素材管理面板
  - 矢量图形（Vector Graphics）- 支持 SVG 加载，最多 32 个
  - 图片素材（Images）- 支持 JPG/PNG 加载
  - GIF 动图（GIFs）- 支持 GIF 动画加载与播放
  - 图形组合（Graphic Combinations）- 支持 JSON 配置加载
  - 更多素材（More）- 扩展素材区域
  - 手风琴式折叠面板（同时仅展开一个分类）
  - 无滚动条设计
  - 响应式卡片布局

- **外部拖拽功能（Drag Outside）**
  - 从素材面板拖拽到画布
  - 支持 `dragenter`、`dragover`、`drop` 事件处理
  - 自动居中鼠标位置放置素材
  - 与参考线联动（拖拽时显示参考线）

#### 素材加载系统

- **统一素材加载器（Asset Loader）**
  - `loadSvg()` - SVG 加载（支持 Blob URL + svgXML 存储）
  - `loadImg()` - 图片加载（JPG/PNG）
  - `loadGif()` - GIF 加载（支持 gifler 库 + onFrame 回调）
  - `loadAsset()` - 统一加载入口
  - `preloadAssets()` - 批量预加载
  - `playGif()` - GIF 动画播放（基于 Konva.Animation）
  
- **GIF 动画支持**
  - 使用 `gifler.js` 解析 GIF 帧
  - Canvas 缓冲区渲染
  - Konva.Animation 驱动帧刷新
  - 支持每帧回调（`onFrame`）
  - 自动管理动画生命周期

- **SVG 增强加载**
  - Fetch SVG XML 内容
  - 创建 Blob URL 避免跨域问题
  - 保存 `svgXML` 属性到节点，支持高级功能（序列化、动态编辑、矢量导出）

### 🏗️ Architecture

#### 新增模块

- `components/MaterialPanel.vue` - 素材面板组件
- `interactions/dragOutside.ts` - 外部拖拽交互
- `utils/assetLoader.ts` - 素材加载工具
- `types/global.d.ts` - 全局类型声明（gifler）

#### 依赖管理

- 新增 `@element-plus/icons-vue` - Element Plus 图标库
- 新增 `element-plus` - Vue 3 UI 组件库
- 新增 `unplugin-auto-import` - API 自动导入插件
- 新增 `unplugin-vue-components` - 组件自动导入插件
- 新增 `gifler.js`（全局脚本加载）- GIF 动画解析库

#### API 改进

- **移除 `onDrop` 回调** - 拖拽逻辑完全内置到 Render 模块
- **简化 RenderConfig** - 移除 `DropMaterialData` 和 `OnDropCallback` 类型
- **增强 `loadAsset`** - 支持 `onFrame` 回调参数

### 🔧 Changed

#### 函数重命名

- `setupGifAnimation()` → `playGif()` - 更简洁直观的命名

#### 加载策略优化

- **统一使用 `Konva.Image.fromURL`** - 所有图片加载统一接口
- **SVG Blob 化** - 提升 SVG 处理能力和安全性
- **GIF 帧缓存** - 使用 Canvas 缓冲区提升性能

#### 交互改进

- **智能参考线** - 拖拽素材时自动显示参考线
- **移除冗余 `batchDraw()`** - 依赖 Konva 内置重绘机制和 Animation

### 🐛 Bug Fixes

- **修复 GIF 首次拖拽不显示问题** - 通过 Konva.Animation 持续刷新
- **修复 gifler 模块导入错误** - 改用全局脚本加载避免 ES Module 问题
- **修复拖拽时 tooltip 阻挡问题** - 移除所有 tooltip
- **修复拖拽时鼠标样式异常** - 优化 `dragenter` 事件处理

### 🎨 UI/UX

- **Element Plus 设计系统** - 统一 UI 风格
- **方形卡片布局** - 使用 `aspect-ratio` 实现正方形素材卡片
- **无滚动条设计** - `scrollbar-width: none` + `-ms-overflow-style: none`
- **手风琴效果** - 同时仅展开一个素材分类
- **拖拽反馈** - 拖拽时显示参考线，提供视觉引导

### 📝 Documentation

- 完善素材加载 API 注释
- 添加 GIF 加载详细注释
- 说明 Blob URL 使用原因

### 🔐 Type Safety

- 新增 `global.d.ts` 全局类型声明
- 完善 `loadAsset` 函数类型签名
- 移除 `DropMaterialData`、`OnDropCallback` 类型定义

---

## [1.0.1] - 2024-11-22

### ✨ Added

#### 缩放信息显示

- **缩放倍数显示** - 在画布左上角显示当前缩放比例（蓝色，12px）
  - 位置与标尺文字高度一致
  - 实时跟随缩放更新
  - 支持配置开关 `showScaleInfo`

#### 坐标参考线

- **鼠标参考线** - 跟随鼠标的十字坐标线
  - 半透明红色实线 `rgba(255,0,0,0.2)`
  - 智能判断：只在鼠标超过标尺区域时显示对应的线
  - 参考线从画布边界开始（包括标尺区域）
  - 鼠标移出时自动清除
  - 支持配置开关 `showRefLine`

### 🏗️ Architecture

#### 新增模块

- `draws/scaleInfo.ts` - 缩放信息绘制
- `draws/referenceLine.ts` - 参考线绘制
- `interactions/referenceLine.ts` - 参考线事件处理

#### 配置项

- `showScaleInfo?: boolean` - 是否显示缩放信息
- `showRefLine?: boolean` - 是否显示坐标参考线

### 🔧 Changed

#### 依赖更新

- **Konva** - 降级至 `9.3.14`（从 10.0.11）
  - 固定版本号，移除 `^` 符号
  - 保证版本稳定性

#### 代码优化

- 统一交互模块架构风格
  - `enableDrag()` - 拖拽
  - `enableZoom()` - 缩放
  - `enableReferenceLine()` - 参考线
- 改进事件注册模式
- 保持代码风格一致性

### 📝 Documentation

- 更新 README.md（添加新功能说明）
- 完善类型注释

### 🎨 UI/UX

- 缩放信息与标尺对齐，视觉统一
- 参考线半透明设计，不遮挡内容
- 智能显示/隐藏参考线

---

## [1.0.0] - 2024-11-21

### 🎉 Initial Release

首个正式版本发布，基于 Vue 3 + TypeScript + Konva.js 的画布渲染器。

### ✨ Features

#### 核心功能

- **多图层管理** - 支持 floor（底层）、main（主层）、cover（覆盖层）三层结构
- **背景网格绘制** - 可配置的网格背景，支持自定义网格大小
- **标尺系统** - 辅助定位的标尺功能
- **响应式布局** - 自适应容器大小，支持窗口调整

#### 交互功能

- **右键拖拽** - 支持右键或 Ctrl+左键拖拽画布
- **滚轮缩放** - 鼠标滚轮缩放画布，支持以鼠标位置为中心缩放
- **缩放配置** - 可配置缩放速度、最小/最大缩放比例

#### 技术特性

- **完整的 TypeScript 支持** - 所有 API 都有完善的类型定义
- **函数式编程风格** - 使用纯函数和工厂模式
- **模块化架构** - 清晰的目录结构和职责分离
- **完善的封装** - 区分公共 API 和内部实现

### 🏗️ Architecture

#### 目录结构

```
src/Render/
├── types/              # 类型定义
│   ├── config.ts       # 配置类型（RenderConfig, ZoomConfig）
│   ├── instance.ts     # 实例类型（RenderInstance, InternalRenderInstance）
│   ├── constants.ts    # 常量（MouseButton, DEFAULT_RULER_SIZE, DEFAULT_ZOOM_CONFIG）
│   └── index.ts        # 统一导出
├── factories/          # 工厂函数
│   ├── createCore.ts   # 创建 Konva Stage 和 Layers
│   ├── createInstance.ts   # 创建渲染实例
│   ├── registerDraws.ts    # 注册绘制函数
│   └── registerEvents.ts   # 注册事件处理
├── draws/              # 绘制功能
│   ├── background.ts   # 背景网格绘制
│   └── ruler.ts        # 标尺绘制
├── interactions/       # 交互功能
│   ├── drag.ts         # 拖拽功能
│   └── zoom.ts         # 缩放功能
└── index.ts            # 主入口
```

#### 设计模式

- **工厂模式** - `createCore`, `createInstance`, `createRender`
- **观察者模式** - 事件监听和处理机制
- **策略模式** - 不同的绘制和交互策略
- **封装原则** - `RenderInstance` (公共) vs `InternalRenderInstance` (内部)

### 🔧 API

#### RenderInstance (公共 API)

- `config: RenderConfig` - 渲染器配置（只读）
- `resize(width, height): void` - 调整画布尺寸
- `redraw(drawNames?): void` - 重绘画布（支持选择性重绘）
- `destroy(): void` - 销毁渲染实例
- `getStageState(): StageState` - 获取当前 Stage 状态
- `toStageValue(boardPos): number` - 坐标转换（Board → Stage）
- `toBoardValue(stagePos): number` - 坐标转换（Stage → Board）
- `changeDraggable(draggable): void` - 切换元素拖拽状态

#### 配置选项

- `width`, `height` - 画布尺寸（必填）
- `showBg` - 是否显示背景网格
- `showRuler` - 是否显示标尺
- `readonly` - 是否为只读模式
- `zoom.enabled` - 是否启用缩放
- `zoom.scaleBy` - 缩放速度（默认 0.1）
- `zoom.scaleMin` - 最小缩放比例（默认 0.2）
- `zoom.scaleMax` - 最大缩放比例（默认 5）

### 📝 Code Quality

#### TypeScript

- ✅ 提取 `RenderLayers` 类型，消除重复定义
- ✅ 提取常量 `DEFAULT_RULER_SIZE` 和 `DEFAULT_ZOOM_CONFIG`
- ✅ 完善所有配置字段的 JSDoc 注释
- ✅ 修复 `any` 类型，使用正确的 `Konva.KonvaEventObject<MouseEvent>`
- ✅ 移除不必要的类型断言

#### 注释优化

- ✅ 为所有接口添加清晰的中文注释
- ✅ 为配置项添加默认值说明
- ✅ 为图层添加用途说明（floor/main/cover）

#### 代码规范

- ✅ 使用 `??` 代替 `||` 处理默认值
- ✅ 提取魔法值为常量
- ✅ 统一代码风格（Tab 缩进）

### 📚 Documentation

- ✅ 完善的 README.md
  - 项目介绍和技术栈
  - 快速开始指南
  - 完整的项目结构说明
  - 核心功能列表
  - 使用示例代码
  - 架构设计说明
  - 配置选项文档
  - 交互操作说明
  - 开发规范

### 🎨 UI/UX

- ✅ Tailwind CSS 样式系统
- ✅ 响应式布局（Flexbox）
- ✅ 画布自适应容器大小
- ✅ 流畅的拖拽和缩放体验

### 🔐 Type Safety

- ✅ 严格的 TypeScript 类型检查
- ✅ 完整的类型定义导出
- ✅ 区分公共 API 和内部实现的类型
- ✅ 使用 `as const` 确保常量类型

### 📦 Dependencies

- Vue 3
- TypeScript
- Vite
- Konva 10.0.11
- Tailwind CSS
- lodash-es

---

## Future Plans

### 🔮 Planned Features

- [ ] 参考线（RefLine）功能
- [ ] 吸附功能（Attract）
- [ ] 右键菜单（ContextMenu）
- [ ] 预览模式（Preview）
- [ ] 撤销/重做（Undo/Redo）
- [ ] 快捷键系统
- [ ] 元素选择和编辑
- [ ] 多选和批量操作
- [ ] 导出为图片/PDF

### 🚀 Performance Optimization

- [ ] 虚拟渲染优化
- [ ] 大量元素性能优化
- [ ] 懒加载策略

### 🧪 Testing

- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E 测试

---

[1.0.0]: https://github.com/yourusername/konva-canvas/releases/tag/v1.0.0
