import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { IAccountHistory } from '../../shared/interfaces/function-data/account-history';
import { StorageKey } from '../../shared/enums/storage-key';

@Injectable({
  providedIn: 'root'
})
export class AccountHistoryService {

  constructor(
    private storageService: StorageService
  ) {
  }

  async getAccountHistory(): Promise<Array<IAccountHistory>> {
    const results = await this.storageService.get<Array<IAccountHistory>>(StorageKey.ACCOUNT_HISTORY);
    return results || [];
  }

  async addAccount(account: IAccountHistory): Promise<void> {
    const accounts = await this.getAccountHistory();
    const existAccountIndex = accounts.findIndex((item) => item.username === account.username);
    if (existAccountIndex === -1) {
      accounts.unshift(account);
    } else {
      accounts[existAccountIndex].updated_at = Date.now();
    }
    await this.storageService.set(StorageKey.ACCOUNT_HISTORY, accounts);
  }

  async removeAccount(username: string): Promise<void> {
    const accounts = await this.getAccountHistory();
    const updated = accounts.filter(acc => acc.username !== username);
    await this.storageService.set(StorageKey.ACCOUNT_HISTORY, updated);
  }

  async clearAll(): Promise<void> {
    await this.storageService.remove(StorageKey.ACCOUNT_HISTORY);
  }
}
