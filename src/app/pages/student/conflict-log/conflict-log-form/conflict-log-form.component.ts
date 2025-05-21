import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { ConflictLogService } from '../../../../services/conflict-log/conflict-log.service';
import { IConflictLogDetail, IConflictLogFormData } from '../../../../shared/interfaces/conflict-log/conflict-log.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { IHeaderAnimeImage } from 'src/app/shared/interfaces/header/header';

@Component({
  selector: 'app-conflict-log-form',
  templateUrl: './conflict-log-form.component.html',
  styleUrls: ['./conflict-log-form.component.scss'],
  standalone: false,
})
export class ConflictLogFormComponent implements OnInit {
  logForm!: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  isNewLog: boolean = true;
  logId: number = 0;
  logDetail?: IConflictLogDetail;
  animeImage!: IHeaderAnimeImage;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conflictLogService: ConflictLogService,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initForm();
    this.checkFormType();
    this.setupHeaderAnimation();
  }

  private setupHeaderAnimation() {
    this.animeImage = {
      imageUrl: '/assets/images/rank/ranking.png',
      name: this.translate.instant('TITLE.conflict_log'),
      width: '120px',
      height: '120px',
      position: {
        position: 'absolute',
        right: '0'
      }
    };
  }

  /**
   * Initialize form
   */
  private initForm() {
    this.logForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      solution: [''],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      progressDescription: ['']
    });
  }

  /**
   * Check form type (new log or update progress)
   */
  private async checkFormType() {
    const logId = this.route.snapshot.paramMap.get('id');
    
    if (logId) {
      this.isNewLog = false;
      this.logId = Number(logId);
      await this.loadLogDetail();
    } else {
      this.isNewLog = true;
    }
  }

  /**
   * Load log detail for progress update
   */
  private async loadLogDetail() {
    this.isLoading = true;
    
    try {
      const logDetail = await this.conflictLogService.getConflictLogDetail(this.logId);
      if (!logDetail) {
        this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_NOT_FOUND));
        this.navigateBack();
        return;
      }

      this.logDetail = logDetail;
      
      // Update form for progress update
      this.logForm.get('title')?.disable();
      this.logForm.get('description')?.disable();
      this.logForm.get('solution')?.disable();
      
      this.logForm.patchValue({
        title: logDetail.title,
        description: logDetail.description,
        progress: logDetail.progress
      });

      // Make progress and progressDescription required for progress update
      this.logForm.get('progress')?.setValidators([Validators.required, Validators.min(logDetail.progress), Validators.max(100)]);
      this.logForm.get('progressDescription')?.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(500)]);
      this.logForm.get('progress')?.updateValueAndValidity();
      this.logForm.get('progressDescription')?.updateValueAndValidity();

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading conflict log detail:', error);
      this.isLoading = false;
      this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_SERVER));
    }
  }

  /**
   * Submit form
   */
  async onSubmit() {
    if (this.logForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.logForm.controls).forEach(key => {
        const control = this.logForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    try {
      const formData: IConflictLogFormData = {
        title: this.logForm.get('title')?.value,
        description: this.logForm.get('description')?.value,
        solution: this.logForm.get('solution')?.value,
        progress: this.logForm.get('progress')?.value,
        progressDescription: this.logForm.get('progressDescription')?.value,
        relatedLogId: this.isNewLog ? undefined : this.logId
      };

      let success = false;

      if (this.isNewLog) {
        const newLog = await this.conflictLogService.createConflictLog(formData);
        success = !!newLog;
      } else {
        success = await this.conflictLogService.updateConflictLogProgress(this.logId, formData);
      }

      if (success) {
        this.showSuccessToast();
        this.navigateBack();
      } else {
        this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_SERVER));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showErrorToast(this.translate.instant(TranslateKeys.ERROR_SERVER));
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Navigate back
   */
  navigateBack() {
    if (this.isNewLog) {
      this.router.navigate([`/${PageRoutes.CONFLICT_LOG}`]);
    } else {
      this.router.navigate([`/${PageRoutes.CONFLICT_LOG}/${this.logId}`]);
    }
  }

  /**
   * Show success toast
   */
  private async showSuccessToast() {
    const message = this.isNewLog 
      ? 'Ghi nhật ký xung đột thành công' 
      : 'Cập nhật tiến độ thành công';
    
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  /**
   * Show error toast
   * @param message Error message
   */
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
