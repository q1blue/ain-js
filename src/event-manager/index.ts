import { EventEmitter } from 'events';
import Ain from '../ain';
import {
  BlockchainEventTypes,
  BlockFinalizedEventConfig,
  EventChannelConnectionOption,
  EventConfigType,
  TxStateChangedEventConfig,
  ValueChangedEventConfig,
} from '../types';
import EventFilter from './event-filter';
import EventChannelClient from './event-channel-client';
import { PushId } from '../ain-db/push-id';
import EventCallbackManager from './event-callback-manager';

export default class EventManager {
  private _ain: Ain;
  private readonly _filters: { [filterId: string]: EventFilter };
  private readonly _eventEmitters: { [filterId: string]: EventEmitter };
  private readonly _eventCallbackManager: EventCallbackManager;
  private readonly _eventChannelClient: EventChannelClient;

  constructor(ain: Ain) {
    this._filters = {};
    this._eventEmitters = {};
    this._ain = ain;
    this._eventCallbackManager = new EventCallbackManager(this);
    this._eventChannelClient = new EventChannelClient(ain, this._eventCallbackManager);
  }

  async connect(connectionOption?: EventChannelConnectionOption) {
    await this._eventChannelClient.connect(connectionOption || {});
  }

  getEventEmitter(filterId: string) {
    return this._eventEmitters[filterId];
  }

  disconnect() {
    this._eventChannelClient.disconnect();
  }

  buildFilterId() {
    return PushId.generate();
  }

  subscribe(
      eventType: 'BLOCK_FINALIZED',
      config: BlockFinalizedEventConfig): EventEmitter;
  subscribe(
      eventType: 'VALUE_CHANGED',
      config: ValueChangedEventConfig): EventEmitter;
  subscribe(
      eventType: 'TX_STATE_CHANGED',
      config: TxStateChangedEventConfig): EventEmitter;
  subscribe(eventTypeStr: string, config: EventConfigType): EventEmitter {
    if (!this._eventChannelClient.isConnected) {
      throw Error(`Event channel is not connected! You must call ain.eh.connect() before using subscribe()`);
    }
    const eventType = eventTypeStr as BlockchainEventTypes;
    const eventEmitter = new EventEmitter();
    switch (eventType) {
      case BlockchainEventTypes.BLOCK_FINALIZED:
        const filterId = this.buildFilterId();
        if (this._filters[filterId]) { // TODO(cshcomcom): Retry logic
          throw Error(`Already existing filter id in filters (${filterId})`);
        }
        if (this._eventEmitters[filterId]) {
          throw Error(`Already existing event emitter (${filterId})`);
        }
        const filter = new EventFilter(filterId, eventType, config);
        this._eventChannelClient.registerFilter(filter);
        this._filters[filterId] = filter;
        this._eventEmitters[filterId] = eventEmitter;
        break;
      case BlockchainEventTypes.VALUE_CHANGED: // TODO(cshcomcom): Implement
        throw Error(`Not implemented`);
      case BlockchainEventTypes.TX_STATE_CHANGED: // TODO(cshcomcom): Implement
        throw Error(`Not implemented`);
      default:
        throw Error(`Invalid event type (${eventType})`);
    }
    return eventEmitter;
  }
}
