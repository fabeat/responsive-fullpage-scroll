"use strict";

import {SlideEventHandlerInterface} from "./interface";

export class ScrollEventHandler implements SlideEventHandlerInterface{
    target: EventTarget;
    nextCallback: Function;
    previousCallback: Function;

    constructor(target: EventTarget, nextCallback: Function, previousCallback: Function) {
        this.target = target;
        this.nextCallback = nextCallback;
        this.previousCallback = previousCallback;
    }

    addEventListeners = () => {
        this.target.addEventListener('wheel', this.wheelEventHandler);
    };

    removeEventListeners = () => {
        this.target.removeEventListener('wheel', this.wheelEventHandler);
    };

    private wheelEventHandler = (event: WheelEvent) => {
        event.stopPropagation();
        if (event.deltaY < 0) {
            this.previousCallback();
        }
        if (event.deltaY > 0) {
            this.nextCallback();
        }
    };
}