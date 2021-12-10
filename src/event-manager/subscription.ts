import { EventEmitter } from 'events';
import { ErrorFirstCallback } from '../types';
import EventFilter from './event-filter';

export default class Subscription extends EventEmitter {
  private readonly _id: string;
  private readonly _filter: EventFilter;

  constructor(id: string, filter: EventFilter) {
    super();
    this._id = id;
    this._filter = filter;
  }

  get filter(): EventFilter {
    return this._filter;
  }

  unsubscribe(callback: ErrorFirstCallback<boolean>) {
    // TODO(cshcomcom): Implement logic
    callback(new Error(`Not implemented!`));
  }
}
