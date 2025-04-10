import { Injectable } from '@angular/core';
import { IAuthData } from '../../shared/interfaces/auth/auth-data';
import { OdooService } from '../odoo/odoo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private odooService: OdooService,
  ) {
  }

  public getAuthData(): IAuthData {
    return {
      id: 0,
      password: '',
    };
  }

  public isAuthenticated(): boolean {
    return false;
  }

  public login(): boolean {
    return true;
  }
}
