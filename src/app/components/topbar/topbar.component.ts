import { Component, signal } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  
  dark_mode = signal<boolean>(true);

  constructor(
    private authSV: AuthService,
    private router: Router
  ){}

  toggleTheme(){
    this.dark_mode.update(prev => !prev)
  }

  onLogout(){
    this.authSV.logout().subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigate(['auth'])
      
    })
  }

}
