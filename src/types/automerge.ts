export type UUID = string;

export interface AutomergeNoteItem {
    id: UUID;
    name: string;
    description?: string;
    priority: number;
    createdAt: number;
}

export interface Document {
    items: AutomergeNoteItem[];
}
