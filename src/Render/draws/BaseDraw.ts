import Konva from 'konva'
import type { Render } from '../index'
import * as Types from '../types'

/**
 * Draw 基类
 * 所有 Draw 类都应该继承此类
 */
export abstract class BaseDraw implements Types.Draw {
  protected render: Render
  readonly layer: Konva.Layer
  protected group: Konva.Group

  // Types.Draw 接口要求
  abstract option: { [index: string]: any }

  constructor(render: Render, layer: Konva.Layer) {
    this.render = render
    this.layer = layer
    this.group = new Konva.Group()
  }

  /**
   * 初始化 Draw
   */
  init() {
    this.layer.add(this.group)
    this.draw()
  }

  /**
   * 绘制方法，子类需要实现
   */
  abstract draw(): void

  /**
   * 清除绘制内容
   */
  clear() {
    // 保存 group 的 name
    const name = this.group.name()
    
    // 销毁旧的 group
    this.group.destroy()
    
    // 创建新的 group
    this.group = new Konva.Group({ name })
    this.layer.add(this.group)
  }

  /**
   * 获取 stage 状态
   */
  protected getStageState() {
    return this.render.getStageState()
  }

  /**
   * 转换为 stage 值（相对大小）
   */
  protected toStageValue(boardPos: number) {
    return this.render.toStageValue(boardPos)
  }

  /**
   * 转换为 board 值（绝对大小）
   */
  protected toBoardValue(stagePos: number) {
    return this.render.toBoardValue(stagePos)
  }
}

