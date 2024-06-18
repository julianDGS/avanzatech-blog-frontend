import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/util/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'avanzatech_blog_frontend';
  subscription?: Subscription;

  constructor(private themeSV: ThemeService) {}
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
    this.loadTheme();
  }

  loadTheme() {
    this.subscription = this.themeSV.theme$.subscribe(isDark => {
      if(!isDark){
        document.body.classList.remove('dark')
        document.body.classList.add('light')
      } else {
        document.body.classList.remove('light')
        document.body.classList.add('dark')
      }
    })
  }
}
