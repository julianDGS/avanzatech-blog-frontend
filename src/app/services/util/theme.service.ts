import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkTheme = new BehaviorSubject<boolean>(this.loadTheme());
  theme$ = this.isDarkTheme.asObservable();

  constructor(
    private storageSV: StorageService
  ){}

  toggleTheme() {
    this.saveTheme(!this.isDarkTheme.value);
    this.isDarkTheme.next(!this.isDarkTheme.value);
  }

  private loadTheme(): boolean {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== null ? JSON.parse(savedTheme) === 'dark' : true;
  }

  private saveTheme(isDark: boolean) {
    this.storageSV.set('theme', isDark ? 'dark' : 'light');
  }
}
