import { Component, Input, OnInit, signal } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterValidators } from '../../util/register.validator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthRequest } from '../../models/auth/login.model';


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
export class AuthFormComponent implements OnInit {

  authForm!: FormGroup;
  hide = signal(true)
  hideConfirm = signal(true)

  @Input() login?: boolean;

  constructor(
    private fb: FormBuilder
  ){ }
  
  ngOnInit(): void {
    this.buildForm();
  }

  changeHide(confirm=false){
    if(confirm){
      this.hideConfirm.update(current => !current);
    } else {
      this.hide.update(current => !current);
    }
  }

  onSubmit(){
    if(!this.authForm.pristine){
      if(this.login){
        const request: AuthRequest = this.authForm.value;
        request.username = this.authForm.value.email;
        delete request.email;
        delete request.name;
        delete request.last_name;
        delete request.confirm_password;
        console.log(request);
      } else {

      }
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

    if(this.login){
      this.authForm.clearValidators();
      this.authForm.updateValueAndValidity()
      this.authForm.get('name')?.clearValidators()
      this.authForm.get('last_name')?.clearValidators()
      this.authForm.get('confirm_password')?.clearValidators()
      this.authForm.get('name')?.updateValueAndValidity()
      this.authForm.get('last_name')?.updateValueAndValidity()
      this.authForm.get('confirm_password')?.updateValueAndValidity()
    }
  }

}
