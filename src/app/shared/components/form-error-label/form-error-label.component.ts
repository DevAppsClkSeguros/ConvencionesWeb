import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, input } from '@angular/core';
import { FormUtils } from '@core/utils/form-utils';

@Component({
  selector: 'shared-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabelComponent {
  control = input.required<AbstractControl>();

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;
  }
}
