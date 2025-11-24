import mitt, { type Emitter } from 'mitt'
import type { Render } from '../index'
import * as Types from '../types'

/**
 * Render 事件管理类
 * 管理所有事件相关的逻辑
 */
export class RenderEvents {
  protected render: Render
  protected emitter: Emitter<Types.RenderEvents> = mitt()

  on: Emitter<Types.RenderEvents>['on']
  off: Emitter<Types.RenderEvents>['off']
  emit: Emitter<Types.RenderEvents>['emit']

  constructor(render: Render) {
    this.render = render
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
  }
}

