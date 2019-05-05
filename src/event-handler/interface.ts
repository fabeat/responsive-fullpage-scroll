"use strict";

export interface EventHandlerInterface {
    target: EventTarget;
    addEventListeners(): void;
    removeEventListeners(): void;
}

export interface SlideEventHandlerInterface extends EventHandlerInterface {
    target: EventTarget;
    nextCallback: Function;
    previousCallback: Function;
}

