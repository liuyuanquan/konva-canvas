import type { Render } from '../index'
import * as Draws from '../draws'

/**
 * 工具类基类
 * 提供公共方法和属性
 */
export abstract class BaseTool {
  static readonly name: string

  protected render: Render

  constructor(render: Render) {
    this.render = render
  }

  /**
   * 重绘指定的 Draw
   */
  protected redraw(drawNames?: string[]) {
    this.render.redraw(drawNames)
  }

  /**
   * 更新历史记录
   */
  protected updateHistory() {
    // TODO: 实现历史记录功能
    // this.render.history.update()
  }

  /**
   * 获取常用 Draw 名称数组
   */
  protected getCommonDrawNames(): string[] {
    return [
      Draws.RulerDraw.name
    ]
  }
}

