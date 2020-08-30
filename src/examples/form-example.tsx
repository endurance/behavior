import React from "react";
import { TextField } from '@material-ui/core';
import { AppViewState } from '../helper-types';
import { useSimpleBehavior } from '..';

class FormData {
  public name: string;
  public phoneNumber: string;
}

class LocalState extends AppViewState {
  public formData: FormData;
}

export const FormExample = (props: object) => {
  const b = useSimpleBehavior(props, new LocalState());
  const { formData: { name, phoneNumber } } = b.viewState;
  return (
    <>
      <TextField
        label={'Name'}
        value={name}
        onChange={b.eventSetter('formData.name')}
      />
      <TextField
        label={'Phone Number'}
        value={phoneNumber}
        onChange={b.eventSetter('formData.phoneNumber')}
      />
    </>
  )
}
