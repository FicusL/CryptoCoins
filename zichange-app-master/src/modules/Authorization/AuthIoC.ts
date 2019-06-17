import { LoginStore } from './modules/Login/LoginStore';
import { RegisterStore } from './modules/Register/RegisterStore';
import { ResetPasswordChangeStore } from './modules/ResetPassword/Change/ResetPasswordChangeStore';
import { ResetPasswordRequestStore } from './modules/ResetPassword/Request/ResetPasswordRequestStore';
import { VerifyEmailStore } from './modules/VerifyEmail/VerifyEmailStore';
import { ConfirmEmailStore } from './modules/ConfirmEmail/ConfirmEmailStore';
import TwoFaStore from './modules/TwoFa/TwoFaStore';
import { InviteCodesStore } from './modules/Register/InviteCodesStore';

export const authSingletons = [
  LoginStore,

  InviteCodesStore,
  RegisterStore,

  ResetPasswordRequestStore,
  ResetPasswordChangeStore,

  VerifyEmailStore,
  ConfirmEmailStore,
  TwoFaStore,
];