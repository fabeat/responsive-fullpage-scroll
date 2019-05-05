"use strict";

import {SlideEventHandlerInterface} from "./interface";

enum SwipeDirection {
    NONE    = "NONE",
    UP      = "UP",
    DOWN    = "DOWN",
    LEFT    = "LEFT",
    RIGHT   = "RIGHT",
}

interface TouchEventStatus {
    swipeDirection: SwipeDirection,
    touchstartPageX?: number,
    touchstartPageY?: number,
    touchstartTime?: number,
}

export interface SwipeOptions {
    /**
     * Minimum distance to be considered a swipe
     */
    swipeMinDistance: number,

    /**
     * Maximum swipe time
     */
    maxSwipeTime: number
}

export class SwipeEventHandler implements SlideEventHandlerInterface{
    target: EventTarget;
    nextCallback: Function;
    previousCallback: Function;
    private readonly swipeOptions: SwipeOptions;
    private touchEvent: TouchEventStatus;
    
    constructor(target: EventTarget, nextCallback: Function, previousCallback: Function, options?: SwipeOptions) {
        this.target = target;
        this.nextCallback = nextCallback;
        this.previousCallback = previousCallback;
        this.swipeOptions = {
            swipeMinDistance: 30,
            maxSwipeTime: 500,
        };
        if (options) {
            this.swipeOptions = {
                ...this.swipeOptions,
                ...options
            }
        }
        this.touchEvent = {
            swipeDirection: <SwipeDirection> SwipeDirection.NONE
        };
    }

    addEventListeners = () => {
        this.target.addEventListener('touchstart', this.touchstartEventHandler);
        this.target.addEventListener('touchend', this.touchendEventHandler);
        this.target.addEventListener('touchmove', this.touchmoveEventHandler);
    };

    removeEventListeners = () => {
        this.target.removeEventListener('touchstart', this.touchstartEventHandler);
        this.target.removeEventListener('touchend', this.touchendEventHandler);
        this.target.removeEventListener('touchmove', this.touchmoveEventHandler);
    };
    
    private touchstartEventHandler = (event: TouchEvent) => {
        let touches = event.changedTouches[0];
        this.touchEvent.swipeDirection = SwipeDirection.NONE;
        this.touchEvent.touchstartPageX = touches.pageX;
        this.touchEvent.touchstartPageY = touches.pageY;
        this.touchEvent.touchstartTime = new Date().getTime();
    };

    private touchendEventHandler = (event: TouchEvent) => {
        let swipeDirection:SwipeDirection = SwipeDirection.NONE;
        let touches = event.changedTouches[0];
        let diffPageX = touches.pageX - this.touchEvent.touchstartPageX;
        let diffPageY = touches.pageY - this.touchEvent.touchstartPageY;
        let swipeDuration = new Date().getTime() - this.touchEvent.touchstartTime;
        if (swipeDuration <= this.swipeOptions.maxSwipeTime) {
            if (Math.abs(diffPageX) > Math.abs(diffPageY)){
                // Horizontal swipe
                if (Math.abs(diffPageX) > this.swipeOptions.swipeMinDistance) {
                    swipeDirection = (diffPageX < 0) ? SwipeDirection.LEFT : SwipeDirection.RIGHT;
                }
            } else {
                // Vertical swipe
                if (Math.abs(diffPageY) > this.swipeOptions.swipeMinDistance) {
                    swipeDirection = (diffPageY < 0) ? SwipeDirection.UP : SwipeDirection.DOWN;
                }
            }
            if (swipeDirection === SwipeDirection.UP) {
                this.nextCallback();
            } else if (swipeDirection === SwipeDirection.DOWN) {
                this.previousCallback();
            }
            event.stopPropagation();
        }
    };

    private touchmoveEventHandler = (event: TouchEvent) => {
        event.preventDefault();
    };
}