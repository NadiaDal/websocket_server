export type UUID = string;

export interface NoteItem {
    id: UUID;
    name: string;
    description?: string;
    createdAt: number;
}

export interface Document {
    items: NoteItem[];
}
