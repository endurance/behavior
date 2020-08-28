import { useState } from 'react';
import { BaseBehavior } from '../base-behavior';

export class DefaultBehavior<VS, P> extends BaseBehavior<VS, P> {
}

export function useSimpleBehavior<VS, P>(props: P, vsClass?: VS) {
  const [viewState, setViewState] = useState(vsClass);
  return new DefaultBehavior<VS, P>({
    props,
    viewState,
    setViewState,
  });
}
