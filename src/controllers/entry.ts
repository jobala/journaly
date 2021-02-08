import { Entry, IEntry, IUpdatePayload } from '../models/entry';

export class EntryController {
    private entryModel: Entry;

    constructor() {
      this.entryModel = new Entry();
    }

    public addEntry(entry: IEntry): Promise<IEntry> {
      return this.entryModel.add(entry);
    }

    public updateEntry(payload: IUpdatePayload): Promise<string> {
      return this.entryModel.update(payload);
    }

    public getAll() {
      return this.entryModel.find();
    }
}
