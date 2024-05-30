import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/util/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'avanzatech_blog_frontend';
  isDarkTheme = signal(true);

  constructor(private storageSV: ThemeService) {}

  ngOnInit() {
    this.loadTheme();
  }

  loadTheme() {
    this.storageSV.theme$.subscribe(isDark => {
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
