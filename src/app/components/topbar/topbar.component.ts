import { Component, OnInit, signal } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/util/storage.service';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../services/util/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  
  dark_mode = signal<boolean>(true);
  loggedUser = signal<string | null>(null)

  constructor(
    private authSV: AuthService,
    private storageSV: StorageService,
    private themeSV: ThemeService,
    private router: Router,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.storageSV.get('logged-user').then(resp => {
      if(resp && resp !== null){
        this.loggedUser.set(resp.nickname);
      }
      return this.storageSV.get('theme')
    }).then(resp => {
      if(resp && resp !== null && resp === 'light'){
        this.dark_mode.set(false)
      }
    })
  }

  toggleTheme(){
    this.themeSV.toggleTheme();
    this.dark_mode.update(prev => !prev)
  }

  onLogAction(){
    if(this.loggedUser()){
      this.authSV.logout()
      .pipe(
        tap(() => this.storageSV.delete('logged-user'))
      ).subscribe(
        () => {
          this.toastr.success('Successful logout', 'Success')
          this.loggedUser.set(null)
          this.router.navigate(['/auth']).then(() => this.router.navigate(['/']))
      })
    } else {
      this.router.navigate(['auth'])
    }
  }

}
