import { Injectable } from '@angular/core';
import { StorageKey } from '../../shared/enums/storage-key';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  /**
   * Parse string value and set to localStorage by key
   * @param key
   * @param value
   */
  set<T>(key: string, value: T): void {
    if (!key || !value) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Get and parse value on localStorage by key
   * @param key
   */
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

  /**
   * Remove localStorage by key
   * @param key
   */
  remove(key: string): void {
    if (!key) {
      return;
    }

    localStorage.removeItem(key);
  }

  /**
   * Clear all localStorage, ignore by key
   * @param ignore
   */
  clear(ignore: Array<string> = []): void {
    if (!ignore?.length) {
      localStorage.clear();
      return;
    }

    const keys = this.keys();
    if (!keys?.length) return;

    for (const key of keys) {
      if (ignore.includes(key) || !Object.values(StorageKey).includes(key as StorageKey)) continue;
      this.remove(key);
    }
  }

  /**
   * Return all localStorage keys
   */
  keys(): Array<string> {
    const keys = new Array<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }
}
