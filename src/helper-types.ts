
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
