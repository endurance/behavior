import { useState } from 'react';
import { boundMethod } from 'autobind-decorator';

export class AppViewState {
  loading = true;
  errors: any;
}

export interface ViewStateWrapper<VS extends Partial<AppViewState> = Partial<AppViewState>,
  Props = any> {
  viewState: VS;
  props: Props;
  setViewState: Function;
}

export abstract class BaseBehavior<ViewState, Props = any> {
  constructor(protected readonly state: ViewStateWrapper<ViewState, Props>) {}
  
  public get viewState() {
    return this.state.viewState;
  }
  
  public get props() {
    return this.state.props;
  }
  
  public get loading() {
    // @ts-ignore
    return this.viewState?.loading;
  }
  
  @boundMethod
  public setter(name: keyof ViewState, value: any) {
    this.state.setViewState((p: any) => {
      return {
        ...p,
        [name]: value,
      };
    });
  }
  
  @boundMethod
  public toggle(field: keyof ViewState) {
    const currentValue = this.viewState[field];
    this.setter(field, !currentValue);
  }
  
  public eventSetter = (name: keyof ViewState) => (e: any) => {
    this.state.setViewState((p: any) => {
      return {
        ...p,
        [name]: e.target.value,
      };
    });
  };
  
  @boundMethod
  public setMultiple(change: Partial<Record<keyof ViewState, any>>) {
    this.state.setViewState((p: any) => {
      return {
        ...p,
        ...change,
      };
    });
  }
  
  @boundMethod
  public async handleUserAction(cb: Function, actionsToManage?: Array<keyof ViewState>) {
    const setValue = (b: boolean) =>
      actionsToManage.reduce((prev, curr, index, list) => {
        return {
          ...prev,
          [curr]: b,
        };
      }, {});
    try {
      this.setMultiple(setValue(true));
      return await cb();
    } catch (e) {
      throw e;
    } finally {
      this.setMultiple(setValue(false));
    }
  }
}

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

export class DefaultBehavior<VS, P> extends BaseBehavior<VS, P> {
}

export function useSimpleBehavior<VS extends AppViewState, P>(props: P, vsClass: VS) {
  const [viewState, setViewState] = useState(vsClass);
  return new DefaultBehavior<VS, P>({
    props,
    viewState,
    setViewState,
  });
}
