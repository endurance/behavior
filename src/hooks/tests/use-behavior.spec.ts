import {renderHook, act} from '@testing-library/react-hooks'
import { BaseBehavior } from '../../base-behavior';
import { useSimpleBehavior } from '../simple-behavior';
import { AppViewState } from '../../helper-types';

// class Behavior extends BaseBehavior<any> {}

describe('Test behavior hooks', () => {
  it('should be able to render and check hook', () => {
    const { result } = renderHook(() =>
      useSimpleBehavior({}, new AppViewState())
    );
    let behavior = result.current;
    
    expect(behavior.viewState.loading).toBe(true);
    
    act(() => {
      behavior.setter('loading', false);
    });
    behavior = result.current;
    expect(behavior.viewState.loading).toBe(false);
  });
});
