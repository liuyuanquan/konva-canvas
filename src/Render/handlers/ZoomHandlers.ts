import Konva from 'konva'
//
import { Render } from '../index'
import * as Types from '../types'
import * as Draws from '../draws'
import { BaseHandler } from './BaseHandler'

export class ZoomHandlers extends BaseHandler {
  static readonly name = 'Zoom'

  // zoom 速度
  scaleBy = 0.1
  // zoom 范围
  scaleMin = 0.2
  scaleMax = 5

  handlers = {
    stage: {
      wheel: (e: Konva.KonvaEventObject<GlobalEventHandlersEventMap['wheel']>) => {
        const { scale: oldScale } = this.render.getStageState()
        const isPinchToZoom = e.evt.ctrlKey

        const newScale = isPinchToZoom
          ? oldScale + (e.evt.deltaY < 0 ? this.scaleBy : -this.scaleBy)
          : oldScale

        const finalScale = Math.max(this.scaleMin, Math.min(this.scaleMax, newScale))

        if (finalScale !== oldScale) {
          const position = this.render.stage.getPosition()
          const point = { x: e.evt.offsetX, y: e.evt.offsetY }
          const mousePointTo = {
            x: (point.x - position.x) / oldScale,
            y: (point.y - position.y) / oldScale
          }

          const newPosition = {
            x: -(mousePointTo.x * finalScale - point.x),
            y: -(mousePointTo.y * finalScale - point.y)
          }

          this.render.emit('scale-change', finalScale)
          this.render.stage.scale({ x: finalScale, y: finalScale })
          this.render.stage.position(newPosition)
        } else if (!isPinchToZoom) {
          const position = this.render.stage.getPosition()
          this.render.stage.position({
            x: position.x - e.evt.deltaX,
            y: position.y - e.evt.deltaY
          })
        }

        // 重绘
        this.redraw([
          Draws.BgDraw.name,
          ...this.getCommonDrawNames(),
          Draws.RefLineDraw.name
        ])
      }
    }
  }
}
