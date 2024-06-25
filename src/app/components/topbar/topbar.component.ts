import { Component, OnInit, signal } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/util/storage.service';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../services/util/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink, 

    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule

  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  
  dark_mode = signal<boolean>(true);
  loggedUser = signal<{id:number, name:string} | null>(null)

  constructor(
    private authSV: AuthService,
    private storageSV: StorageService,
    private themeSV: ThemeService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon('user',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/user.svg'
      )
    );
    this.matIconRegistry.addSvgIcon('logout',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/logout.svg'
      )
    );
    this.matIconRegistry.addSvgIcon('login',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/login.svg'
      )
    );
  }

  ngOnInit(): void {
    this.storageSV.get('logged-user').then(resp => {
      if(resp && resp !== null){
        this.loggedUser.set({id: resp.id, name: resp.nickname});
      }
    })
    
    this.storageSV.get('theme').then(resp => {
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
      this.openDialog()
    } else {
      this.router.navigate(['auth'])
    }
  }

  private logOutAction(){
    this.authSV.logout()
      .pipe(
        tap(() => this.storageSV.delete('logged-user'))
      ).subscribe(
        () => {
          this.toastr.success('Successful logout', 'Success')
          this.loggedUser.set(null)
          this.router.navigate(['/auth']).then(() => this.router.navigate(['/']))
      })
  }

  private openDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {
        title: 'Logout',
        item: 'Are you sure you want to logout?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.logOutAction();
      }
    });
  }

}
