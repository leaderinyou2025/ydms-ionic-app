import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage!: Storage;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any) {
    if (!this._storage) await this.init();
    if (!this._storage) return;

    if (!key || !value) {
      return;
    }

    if (typeof value != 'string') {
      value = JSON.stringify(value);
    }

    const keys = await this._storage.keys();
    if (keys.indexOf(key) > -1) {
      await this._storage.remove(key);
      await this._storage.set(key, value);
    } else {
      await this._storage?.set(key, value);
    }
  }

  public async get<T>(key: string, parseJson = true): Promise<T | undefined> {
    if (!this._storage) await this.init();

    if (!key) {
      return undefined;
    }

    const dataStr = await this._storage.get(key);
    if (!dataStr) {
      return undefined;
    }

    if (parseJson) {
      try {
        return JSON.parse(dataStr);
      } catch (e: any) {
        console.error(e?.message);
        return undefined;
      }
    }

    return dataStr;
  }

  public remove(key: string) {
    return this._storage.remove(key);
  }

  public clear() {
    return this._storage.clear();
  }

  public keys() {
    return this._storage.keys();
  }

  public length() {
    return this._storage.length;
  }
}
