import * as _ from "lodash-es";
//
import * as Types from "../types";
import * as Draws from "../draws";
import { BaseHandler } from "./BaseHandler";

export class KeyMoveHandlers extends BaseHandler {
	static readonly name = "KeyMove";

	speed = 1;
	speedMax = 20;

	change = _.debounce(() => {
		// 更新历史
		this.render.updateHistory();
	}, 200);

	handlers = {
		dom: {
			keydown: (e: GlobalEventHandlersEventMap["keydown"]) => {
				if (!e.ctrlKey) {
					if (
						Object.values(Types.MoveKey)
							.map((o) => o.toString())
							.includes(e.code)
					) {
						if (e.code === Types.MoveKey.上) {
							this.render.selectionTool.selectingNodesMove({
								x: 0,
								y: -this.speed,
							});
						} else if (e.code === Types.MoveKey.左) {
							this.render.selectionTool.selectingNodesMove({
								x: -this.speed,
								y: 0,
							});
						} else if (e.code === Types.MoveKey.右) {
							this.render.selectionTool.selectingNodesMove({
								x: this.speed,
								y: 0,
							});
						} else if (e.code === Types.MoveKey.下) {
							this.render.selectionTool.selectingNodesMove({
								x: 0,
								y: this.speed,
							});
						}

						if (this.speed < this.speedMax) {
							this.speed++;
						}

						this.change();

						// 重绘
						this.render.redraw([Draws.AttractDraw.name, Draws.RulerDraw.name]);
					}
				}
			},
			keyup: () => {
				this.speed = 1;
			},
		},
	};
}
