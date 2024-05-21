import { Component, signal } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterValidators } from '../../util/register.validator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent {

  authForm!: FormGroup;
  hide = signal(true)
  hideConfirm = signal(true)

  constructor(
    private fb: FormBuilder
  ){
    this.buildForm();
  }

  changeHide(confirm=false){
    if(confirm){
      this.hideConfirm.update(current => !current);
    } else {
      this.hide.update(current => !current);
    }
  }

  register(){
    if(!this.authForm.pristine){
      const request = this.authForm.value;
      console.log(request);
    }
  }

  private buildForm(){
    this.authForm = this.fb.group({
      email: [
        '', 
        [Validators.required, Validators.email]
      ],
      name: [
        '', 
        [Validators.required, Validators.minLength(3)]
      ],
      last_name: [
        '', 
        [Validators.required, Validators.minLength(3)]
      ],
      password: [
        '', 
        [Validators.required, Validators.minLength(5)]
      ],
      confirm_password: [
        '', 
        [Validators.required, Validators.minLength(5)]
      ]
    },
    {
      validators: RegisterValidators.matchPasswords
    })
  }

}
