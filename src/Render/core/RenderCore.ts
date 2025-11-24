import Konva from 'konva'
import type { Render } from '../index'
import * as Types from '../types'

/**
 * Render 核心类
 * 管理 Stage、Layers 和基础初始化
 */
export class RenderCore {
  protected render: Render

  // Stage
  stage: Konva.Stage

  // 主要层
  layer: Konva.Layer = new Konva.Layer({ id: 'main' })
  // 辅助层 - 背景
  layerFloor: Konva.Layer = new Konva.Layer()
  // 辅助层 - 连接线、对齐线
  layerCover: Konva.Layer = new Konva.Layer({ id: 'cover' })

  // 多选器层
  groupTransformer: Konva.Group = new Konva.Group()
  // 多选器
  transformer: Konva.Transformer = new Konva.Transformer({
    shouldOverdrawWholeArea: true,
    borderDash: [4, 4],
    padding: 1,
    rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315, 360],
    flipEnabled: false
  })
  // 选择框
  selectRect: Konva.Rect = new Konva.Rect({
    id: 'selectRect',
    fill: 'rgba(0,0,255,0.1)',
    visible: false
  })

  // 参数
  rulerSize = 0

  constructor(render: Render, stageEle: HTMLDivElement, config: Types.RenderConfig) {
    this.render = render

    if (config.showRuler) {
      this.rulerSize = 40
    }

    this.stage = new Konva.Stage({
      container: stageEle,
      x: this.rulerSize,
      y: this.rulerSize,
      width: config.width,
      height: config.height
    })

    // 辅助层 - 顶层
    this.groupTransformer.add(this.transformer)
    this.groupTransformer.add(this.selectRect)
    this.layerCover.add(this.groupTransformer)
  }

  /**
   * 初始化 layers
   */
  initLayers() {
    this.stage.add(this.layerFloor)
    this.stage.add(this.layer)
    this.stage.add(this.layerCover)
  }

  /**
   * 更新 stage 尺寸
   */
  resize(width: number, height: number) {
    this.stage.setAttrs({
      width: width,
      height: height
    })
  }

  /**
   * 获取 stage 状态
   */
  getStageState() {
    return {
      width: this.stage.width() - this.rulerSize,
      height: this.stage.height() - this.rulerSize,
      scale: this.stage.scaleX(),
      x: this.stage.x(),
      y: this.stage.y()
    }
  }

  /**
   * 相对大小（基于 stage，且无视 scale）
   */
  toStageValue(boardPos: number) {
    return boardPos / this.stage.scaleX()
  }

  /**
   * 绝对大小（基于可视区域像素）
   */
  toBoardValue(stagePos: number) {
    return stagePos * this.stage.scaleX()
  }
}

