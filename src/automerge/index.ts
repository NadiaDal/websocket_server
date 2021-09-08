import * as Automerge from 'automerge';
import {Document} from '../types';

class AutomergeStore {
    private document: Automerge.FreezeObject<Document>;

    constructor(document: Automerge.FreezeObject<Document>) {
        this.document = document;
    }

    get items() {
        return this.document.items;
    }

    persist(): string {
        return Automerge.save(this.document);
    }


    restore(store: string | null): void {
        if (store) {
            this.document = Automerge.load(store);
        }
    }

    allChanges(): Automerge.Change[] {
        return Automerge.getAllChanges(this.document);
    }

    applyChanges(changes: string): void {

        this.document = Automerge.applyChanges(this.document,
            JSON.parse(changes));
    }
}

export default new AutomergeStore(Automerge.from({items: []}));
