import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { CommonConstants } from '../../shared/classes/common-constants';
import { StorageKey } from '../../shared/enums/storage-key';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage!: Storage;

  constructor(private storage: Storage) {
  }

  /**
   * Initial storage
   */
  async init() {
    this._storage = await this.storage.create();
  }

  /**
   * Set storage item
   * @param key
   * @param value
   */
  public async set<T>(key: string, value: T) {
    if (!this._storage) await this.init();
    if (!this._storage || !key || value == undefined) return;

    try {
      // stringify and encrypt data
      const valueString = JSON.stringify(value);
      const encryptedValue = CommonConstants.encrypt(valueString);
      await this._storage.set(key, encryptedValue);
    } catch (e: any) {
      console.error('[StorageService:set] Failed to save', key, e?.message);
    }
  }

  /**
   * Get storage by key
   * @param key
   */
  public async get<T>(key: string): Promise<T | undefined> {
    if (!this._storage) await this.init();
    if (!key) return undefined;

    try {
      const dataStr = await this._storage.get(key);
      if (!dataStr) return undefined;

      const decryptedData = CommonConstants.decrypt(dataStr);
      return JSON.parse(decryptedData);
    } catch (e: any) {
      console.error(key, e?.message);
      return undefined;
    }
  }

  /**
   * Remove storage by key
   * @param key
   */
  public remove(key: string) {
    return this._storage.remove(key);
  }

  /**
   * Clear storage ignore by keys
   * @param ignore
   */
  public async clear(ignore: Array<StorageKey> = []) {
    if (!ignore?.length) {
      return this._storage.clear();
    }

    const ignoreData: Array<{ key: string, value: string }> = [];
    const allKeys = await this._storage.keys();
    for (let key of ignore) {
      if (!allKeys.includes(key)) continue;
      const value = await this._storage.get(key);
      if (value) ignoreData.push({key: key, value: value});
    }

    await this._storage.clear();
    for (let item of ignoreData) {
      await this._storage.set(item.key, item.value);
    }
  }

  /**
   * Get all keys in storage
   */
  public keys() {
    return this._storage.keys();
  }

  /**
   * Get size of storage
   */
  public length() {
    return this._storage.length;
  }
}
