import {renderHook, act} from '@testing-library/react-hooks'
import { useSimpleBehavior } from '../hooks/simple-behavior';
import { AppViewState } from '../helper-types';

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
