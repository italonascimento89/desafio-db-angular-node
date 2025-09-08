export type ValidatorKeys =
  | 'required'
  | 'minlength'
  | 'maxlength'
  | 'pattern'
  | 'invalidText'
  | 'invalidNumber'
  | 'invalidCPF'
  | 'minSessionTime';

export type ValidationMessages = Record<ValidatorKeys, string>;
