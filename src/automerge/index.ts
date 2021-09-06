import * as Automerge from 'automerge';
import {Document} from '../types/automerge';

class AutomergeStore {
    private document: Automerge.FreezeObject<Document>;

    constructor(document: Automerge.FreezeObject<Document>) {
        this.document = document;
    }

    get items() {
        return this.document.items;
    }

    allChanges(): Automerge.Change[] | undefined {
        return Automerge.getAllChanges(this.document);
    }

    applyChanges(changes: string): void {

        this.document = Automerge.applyChanges(this.document,
            JSON.parse(changes));
    }
}

export default new AutomergeStore(Automerge.from({items: []}));
