import { Component } from '@angular/core';
import { AuthFormComponent } from '../../../components/auth-form/auth-form.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRequest } from '../../../models/auth/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private authSV: AuthService,
    private route: Router
  ) {}

  loginUser(request: AuthRequest){
    this.authSV.login(request).subscribe({
      next: (resp) => {
        console.log(resp)
        this.route.navigate(['p']);
      }
    })
  }

}
