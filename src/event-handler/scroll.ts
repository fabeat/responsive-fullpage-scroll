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
    private lastDelta: number;

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
        // has the user changed the scroll direction? => no pause necessary
        let currentDelta = event.deltaY;
        let deltaChange = (currentDelta > 0 && this.lastDelta < 0) || (currentDelta < 0 && this.lastDelta > 0);
        this.lastDelta = currentDelta;
        let time = new Date().getTime();
        // The scroll event has to pause for at least options.newScrollThreshold.
        let diff = time-this.lastCall;
        this.lastCall = time;
        if (!deltaChange && diff < this.options.newScrollThreshold) {
            return;
        }
        event.stopPropagation();
        if (currentDelta < 0) {
            this.previousCallback();
        }
        if (currentDelta > 0) {
            this.nextCallback();
        }
    };
}