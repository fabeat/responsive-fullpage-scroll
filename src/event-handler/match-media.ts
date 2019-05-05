"use strict";

import { EventHandlerInterface } from "./interface";

export class MatchMediaEventHandler implements EventHandlerInterface{
    target: MediaQueryList;
    matchesCallback: Function;
    noMatchesCallback: Function;

    constructor(mql: MediaQueryList, matchesCallback: Function, noMatchesCallback: Function) {
        this.target = mql;
        this.matchesCallback = matchesCallback;
        this.noMatchesCallback = noMatchesCallback;
    }

    addEventListeners = () => {
        this.target.addEventListener('change', this.changeEventHandler);
    };

    removeEventListeners = () => {
        this.target.removeEventListener('change', this.changeEventHandler);
    };

    private changeEventHandler = (event: UIEvent) => {
        event.stopPropagation();
        if (this.target.matches){
            this.matchesCallback();
        } else {
            this.noMatchesCallback();
        }
    };
}