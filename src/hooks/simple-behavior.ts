import { useState } from 'react';
import { BaseBehavior } from '../base-behavior';
import { AppViewState } from '../helper-types';

export class DefaultBehavior<VS, P> extends BaseBehavior<VS, P> {
}

export function useSimpleBehavior<VS extends AppViewState, P>(props: P, vsClass?: VS) {
  const [viewState, setViewState] = useState(vsClass);
  return new DefaultBehavior<VS, P>({
    props,
    viewState,
    setViewState,
  });
}
