/** Callback type for state change listeners. */
export type IStateListener<T> = (state: T) => void;

/**
 * Generic observable state container using a simple pub-sub pattern.
 *
 * State updates are synchronous. Subscribers are notified immediately
 * after each `setState` call with the new merged state.
 */
export class StateManager<T extends object> {
  private state: T;
  private listeners: Set<IStateListener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /** Returns the current state snapshot. */
  getState(): T {
    return this.state;
  }

  /**
   * Updates state by shallow-merging the partial result of `updater`
   * into the current state. Notifies all subscribers synchronously.
   */
  setState(updater: (current: T) => Partial<T>): void {
    const partial = updater(this.state);
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  /**
   * Registers a listener that fires on every state change.
   * Returns an unsubscribe function.
   */
  subscribe(listener: IStateListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Removes all subscriptions. */
  destroy(): void {
    this.listeners.clear();
  }
}
