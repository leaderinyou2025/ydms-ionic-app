import { Injectable, OnDestroy } from '@angular/core';
import TakeUntilObservable from './take-until-observable';

@Injectable()
export class DestroyService extends TakeUntilObservable implements OnDestroy {
    constructor() { super() }

    ngOnDestroy(): void {
        this.emitEventUnSubscribe()
    }
}
