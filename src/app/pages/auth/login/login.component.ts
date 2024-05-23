import { Component } from '@angular/core';
import { AuthFormComponent } from '../../../components/auth-form/auth-form.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRequest } from '../../../models/auth/login.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { StorageService } from '../../../services/util/storage.service';

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
    private storageSV: StorageService,
    private route: Router
  ) {}

  loginUser(request: AuthRequest){
    this.authSV.login(request)
    .pipe(
      tap(resp => this.storageSV.set('logged-user', resp.user.name))
    )
    .subscribe({
      next: (resp) => {
        this.route.navigate(['/']);
      }
    })
  }

}
