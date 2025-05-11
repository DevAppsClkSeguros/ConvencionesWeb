import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings/settings.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init/password-reset-init.component';

export const AccountRoutes: Routes = [
  {
    path: 'configuracion',
    component: SettingsComponent,
  },
  {
    path: 'recuperar-password',
    component: PasswordResetInitComponent,
  }
];

export default AccountRoutes;
