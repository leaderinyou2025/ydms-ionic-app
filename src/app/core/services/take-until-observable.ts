import { Subject } from 'rxjs';

export default class TakeUntilObservable {
    private event: Subject<void> = new Subject()
    public eventTakeUntil$ = this.event.asObservable()

    emitEventUnSubscribe() {
        this.event.next();
        this.event.complete()
    }

    destroyService() {
        this.emitEventUnSubscribe();
    }
}
