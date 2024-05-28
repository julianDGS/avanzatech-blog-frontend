import { Component } from '@angular/core';
import { AuthFormComponent } from '../../../components/auth-form/auth-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRequest } from '../../../models/auth/login.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private authSV: AuthService,
    private route: Router,
    private messageSV: ToastrService
  ){ }

  registerUser(request: AuthRequest){
    this.authSV.register(request).subscribe({
      next: () => {
        this.messageSV.success('User created', 'Success', {
          progressBar: true
        })
        this.route.navigate(['auth']);
      },
      error: () => {
        this.route.navigate(['auth']);
      }
    })
  }

}
