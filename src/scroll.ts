"use strict";

import {SwipeOptions, SwipeEventHandler} from './event-handler/swipe';
import {WheelOptions, ScrollEventHandler} from './event-handler/scroll';
import {MatchMediaEventHandler} from './event-handler/match-media';
import {EventTarget, defineEventAttribute} from "event-target-shim"

export interface ScrollOptions {
    transitionTime?: number,
    goToTopOnLast?: boolean,
    mediaQuery?: string,
    slideSelector?: string,
    swipeOptions?: SwipeOptions,
    wheelOptions?: WheelOptions
}

export const defaultScrollOptions:ScrollOptions = {
    transitionTime: 1000,
    goToTopOnLast: true,
    mediaQuery: "screen",
    slideSelector: "section"
};

export class FullPageScroll extends EventTarget{
    wrapperElement: HTMLElement;
    mediaQueryList: MediaQueryList;
    currentSlide: number;
    isActive: boolean;
    readonly slides: NodeListOf<HTMLElement>;
    readonly options: ScrollOptions;
    private waitForAnimation: boolean;
    private swipeEventHandler: SwipeEventHandler;
    private scrollEventHandler: ScrollEventHandler;
    private matchMediaEventHandler: MatchMediaEventHandler;

    constructor(wrapperElementOrId: HTMLElement | string, options?: ScrollOptions) {
        super();
        this.wrapperElement = null;
        this.waitForAnimation = false;
        this.currentSlide = 0;
        this.isActive = false;
        // defaunt transition time: 1 second
        this.options = defaultScrollOptions;
        if (options) {
            this.options = {
                ...this.options,
                ...options
            }
        }
        this.mediaQueryList = window.matchMedia(this.options.mediaQuery);
        if (wrapperElementOrId instanceof HTMLElement) {
            this.wrapperElement = wrapperElementOrId;
        } else if (typeof wrapperElementOrId === "string") {
            this.wrapperElement = document.getElementById(wrapperElementOrId);
        } 
        if (null === this.wrapperElement){
            throw "An Element with the given ID could not be found.";
        }
        this.slides = this.wrapperElement.querySelectorAll(this.options.slideSelector);
        this.matchMediaEventHandler = new MatchMediaEventHandler(this.mediaQueryList, this.addStylesAndEvents, this.removeStylesAndEvents);
        this.swipeEventHandler = new SwipeEventHandler(this.wrapperElement, this.nextSlide, this.previousSlide, this.options.swipeOptions);
        this.scrollEventHandler = new ScrollEventHandler(this.wrapperElement, this.nextSlide, this.previousSlide, this.options.wheelOptions);
        if (this.mediaQueryList.matches) {
            this.addStylesAndEvents();
        }
        // Always watch for media query match changes
        this.matchMediaEventHandler.addEventListeners();
    }


    private addStylesAndEvents = () => {
        // Reset any scroll positions
        window.scroll(0, 0);
        this.currentSlide = 0;
        document.body.style.overflow = "hidden";
        this.wrapperElement.style.transform = 'translateY(0)';
        this.wrapperElement.style.transition = this.options.transitionTime.toString()+"ms cubic-bezier(0.5, 0, 0.5, 1)";
        this.swipeEventHandler.addEventListeners();
        this.scrollEventHandler.addEventListeners();
        this.isActive = true;
        this.dispatchEvent(new Event('activate'));
    };

    private removeStylesAndEvents = () => {
        document.body.style.overflow = "auto";
        this.wrapperElement.style.transform = "none";
        this.wrapperElement.style.transition = "none";
        this.swipeEventHandler.removeEventListeners();
        this.scrollEventHandler.removeEventListeners();
        this.isActive = false;
        this.dispatchEvent(new Event('deactivate'));
    };

    goToSlide = (num: number) => {
        if (num === this.currentSlide || num < 0) {
            return;
        }
        if (num >= this.slides.length) {
            if (this.options.goToTopOnLast) {
                num = 0;
            } else {
                return;
            }
        }
        if (this.waitForAnimation === false) {
            let slideEvent = new Event("slide");
            this.waitForAnimation = true;
            let newScrollPosition = -num*100;
            this.currentSlide = num;
            this.wrapperElement.style.transform = 'translateY(' + newScrollPosition + 'vh)';
            this.dispatchEvent(slideEvent);
            setTimeout(() => {
                this.waitForAnimation = false;
            }, 1000);
        }
    };

    goToFirstSlide = () => {
        this.goToSlide(0);
    };

    nextSlide = () => {
        this.goToSlide(this.currentSlide+1);
    };

    previousSlide = () => {
        this.goToSlide(this.currentSlide-1);
    };
}

defineEventAttribute(FullPageScroll.prototype, "deactivate");
defineEventAttribute(FullPageScroll.prototype, "activate");
defineEventAttribute(FullPageScroll.prototype, "slide");

(<any>window).FullPageScroll = FullPageScroll;