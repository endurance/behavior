import { boundMethod } from 'autobind-decorator';
import { ViewStateWrapper } from './helper-types';
import cloneDeep from 'lodash.clonedeep';
import lodashSet from 'lodash.set';

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
  
  private _nestedSetter(propertyPath: string, value: any) {
    const initialState = cloneDeep(this.viewState) as unknown as object;
    const newState = lodashSet(initialState, propertyPath, value);
    this.state.setViewState(newState);
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
   * Set a field nested in a state object.
   * @param propertyPath
   * @param value
   */
  @boundMethod
  public nestedSetter(propertyPath: string, value: any) {
    this._nestedSetter(propertyPath, value);
  }
  
  /**
   * Curried Functional Setter for the use cases where you want a function back rather than to run it immediately.
   * @param name
   */
  @boundMethod
  public setterFp(name: keyof ViewState) {
    return (value: any) => {
      this.setter(name, value);
    }
  }
  
  /**
   * Toggle a state field from True -> False or vice versa.
   * @param field
   */
  @boundMethod
  public toggle(field: keyof ViewState) {
    const currentValue = this.viewState[field];
    this.setter(field, !currentValue);
  }
  
  /**
   * Set state based off an event. This is a very common line of code found all over the place
   * in React applications. It would be nice to just reuse instead of redo.
   * @param propertyPath
   */
  @boundMethod
  public eventSetter<T>(propertyPath: string) {
    return (e: any) => {
      this._nestedSetter(propertyPath, e.target.value);
    }
  };
  
  
  /**
   * Set multiple keys on the state the Behavior is intending to manage.
   * @param change
   */
  @boundMethod
  public setMultiple(change: Partial<Record<keyof ViewState, any>>) {
    this.state.setViewState((p: any) => {
      return {
        ...p,
        ...change,
      };
    });
  }
  
  /**
   * This function is for handling the use case where you want to set some state initially, do an action,
   * and then unset some state.
   *
   * E.X. Say you want to load some data. It's nice to be able to set some "loading" state to TRUE,
   * perform your loadData action, and then set you "loading" state to FALSE when done.
   * @param cb: Callback to run
   * @param actionsToManage: State to set to true
   */
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
