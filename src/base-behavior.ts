import { boundMethod } from 'autobind-decorator';
import { ViewStateWrapper } from './helper-types';

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
  
  /**
   * Can set an individual key on Local State
   * @param name
   * @param value
   */
  @boundMethod
  public setter(name: keyof ViewState, value: any) {
    this.state.setViewState((p: any) => {
      return {
        ...p,
        [name]: value,
      };
    });
  }
  
  /**
   * Functional Setter
   * @param name
   */
  @boundMethod
  public setterFp(name: keyof ViewState) {
    return (value: any) => {
      this.setter(name, value);
    }
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
