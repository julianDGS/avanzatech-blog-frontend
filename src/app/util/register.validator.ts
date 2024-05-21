import { AbstractControl, FormControl } from "@angular/forms";

export class RegisterValidators {

    static matchPasswords(control: AbstractControl) {
      const password = control.get('password')?.value;
      const checkPassword: AbstractControl | null = control.get('confirm_password');
      if (password && checkPassword?.value){
          if (password === checkPassword.value) {
            checkPassword.setErrors(null)
            return null;
          }
          checkPassword.setErrors({incorrect: true})
      }
      return {confirm_password: true};
    }
}