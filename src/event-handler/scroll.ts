"use strict";

import {SlideEventHandlerInterface} from "./interface";

export interface WheelOptions {
    newScrollThreshold?: number
}

export const defaultWheelOptions:WheelOptions = {
    newScrollThreshold: 400
};


export class ScrollEventHandler implements SlideEventHandlerInterface{
    target: EventTarget;
    nextCallback: Function;
    previousCallback: Function;
    options: WheelOptions;
    private lastCall: number;

    constructor(target: EventTarget, nextCallback: Function, previousCallback: Function, options?: WheelOptions) {
        this.target = target;
        this.nextCallback = nextCallback;
        this.previousCallback = previousCallback;
        this.options = {
            ...defaultWheelOptions,
            ...options
        }
    }

    addEventListeners = () => {
        this.target.addEventListener('wheel', this.wheelEventHandler);
    };

    removeEventListeners = () => {
        this.target.removeEventListener('wheel', this.wheelEventHandler);
    };

    private wheelEventHandler = (event: WheelEvent) => {
        let time = new Date().getTime();
        // The scroll event has to pause for at least options.newScrollThreshold.
        let diff = time-this.lastCall;
        this.lastCall = time;
        if (diff < this.options.newScrollThreshold) {
            return;
        }
        event.stopPropagation();
        if (event.deltaY < 0) {
            this.previousCallback();
        }
        if (event.deltaY > 0) {
            this.nextCallback();
        }
    };
}