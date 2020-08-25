import { useState } from 'react';
import { BaseBehavior } from '../base-behavior';

export function useBehavior<P, T extends BaseBehavior<any, any>>(
  props: P,
  Behavior: { new(...args): T },
  vsClass?: T['viewState'] | (() => T['viewState']),
) {
  const [viewState, setViewState] = useState(vsClass);
  return new Behavior({
    props,
    viewState,
    setViewState,
  });
}
