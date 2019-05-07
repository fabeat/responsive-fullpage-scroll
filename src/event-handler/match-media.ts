"use strict";

import { EventHandlerInterface } from "./interface";

export class MatchMediaEventHandler implements EventHandlerInterface{
    target: MediaQueryList;
    matchesCallback: Function;
    noMatchesCallback: Function;
    private tagetMatches: boolean;

    constructor(mql: MediaQueryList, matchesCallback: Function, noMatchesCallback: Function) {
        this.target = mql;
        this.tagetMatches = this.target.matches;
        this.matchesCallback = matchesCallback;
        this.noMatchesCallback = noMatchesCallback;
    }

    addEventListeners = () => {
        if ('addEventListener' in this.target) {
            this.target.addEventListener('change', this.changeEventHandler);
        } else {
            window.addEventListener('resize', this.resizeEventHandler);
        }
    };

    removeEventListeners = () => {
        if ('removeEventListener' in this.target) {
            this.target.removeEventListener('change', this.changeEventHandler);
        } else {
            window.removeEventListener('resize', this.resizeEventHandler);
        }
    };

    /**
     * This handler is a workaround for browsers that do not support addEventListener for MediaQueryList
     * @param event
     */
    private resizeEventHandler = (event: UIEvent) => {
        if (this.tagetMatches !== this.target.matches) {
            this.tagetMatches = this.target.matches;
            if (this.target.matches){
                this.matchesCallback();
            } else {
                this.noMatchesCallback();
            }
        }
    };

    private changeEventHandler = (event: UIEvent) => {
        event.stopPropagation();
        this.tagetMatches = this.target.matches;
        if (this.target.matches){
            this.matchesCallback();
        } else {
            this.noMatchesCallback();
        }
    };
}