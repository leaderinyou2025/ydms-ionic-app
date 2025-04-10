import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  set<T>(key: string, value: T): void {
    if (!key || !value) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | undefined {
    if (!key) {
      return undefined;
    }

    try {
      const valueStr = localStorage.getItem(key);
      if (!valueStr || !valueStr?.length) return undefined;
      return JSON.parse(valueStr);
    } catch (e: any) {
      console.error(e.message);
      return undefined;
    }
  }

  remove(key: string): void {
    if (!key) {
      return;
    }

    localStorage.removeItem(key);
  }
}
