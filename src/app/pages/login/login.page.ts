import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { StorageKey } from '../../shared/enums/storage-key';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  defaultLang!: string;

  constructor(
    public platform: Platform,
    private authService: AuthService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
  ) {
    this.initializeTranslation();
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onClickLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('Form hợp lệ:', this.loginForm.value);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.localStorageService.set(StorageKey.LANGUAGE, lang);
  }

  initializeTranslation() {
    this.translate.addLangs(['en', 'vi']);
    this.defaultLang = this.localStorageService.get<string>(StorageKey.LANGUAGE) || 'vi';
    this.translate.resetLang(this.defaultLang);
    this.translate.use(this.defaultLang);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }
}
