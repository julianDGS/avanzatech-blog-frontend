import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get(key: string): Promise<any> {
    return new Promise(resolve => {
      const val = localStorage.getItem(key);
      if (val && val !== null) {
        resolve(JSON.parse(val));
      } else {
        resolve(null)
      }
    });
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }
}
