import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IFamilyCommunicationQualitySurveyDetail, IFamilyCommunicationQualitySurveyQuestion } from '../../../../shared/interfaces/family-communication-quality-survey/family-communication-quality-survey.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { ForceTestData } from '../../../../shared/classes/force-test-data';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { FamilyCommunicationQualitySurveyService } from '../../../../services/family-communication-quality-survey/family-communication-quality-survey.service';

@Component({
  selector: 'app-family-communication-quality-survey-detail',
  templateUrl: './family-communication-quality-survey-detail.component.html',
  styleUrls: ['./family-communication-quality-survey-detail.component.scss'],
  standalone: false,
})
export class FamilyCommunicationQualitySurveyDetailComponent implements OnInit {
  surveyDetail!: IFamilyCommunicationQualitySurveyDetail;
  isLoading: boolean = true;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyCommunicationQualitySurveyService: FamilyCommunicationQualitySurveyService
  ) { }

  ngOnInit() {
    this.loadSurveyDetail();
  }

  /**
   * Load survey detail
   */
  private async loadSurveyDetail(): Promise<void> {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const surveyId = parseInt(id, 10);
      const surveyDetail = await this.familyCommunicationQualitySurveyService.getSurveyDetail(surveyId);
      if (surveyDetail) {
        this.surveyDetail = surveyDetail;
      } else {
        this.navigateBack();
      }
    } else {
      this.navigateBack();
    }
    this.isLoading = false;
  }

  /**
   * Navigate back to the survey list
   */
  public navigateBack(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_COMMUNICATION_QUALITY_SURVEY}`]);
  }

  /**
   * Format date
   * @param date Date
   */
  public formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get communication level emoji
   * @param communicationLevel Communication level
   */
  public getCommunicationLevelEmoji(communicationLevel: string): string {
    return ForceTestData.getCommunicationLevelEmoji(communicationLevel);
  }

  /**
   * Get selected option value
   * @param question Question
   */
  public getSelectedOptionValue(question: IFamilyCommunicationQualitySurveyQuestion): number {
    const selectedOption = question.options.find(o => o.selected);
    return selectedOption ? selectedOption.id : 0;
  }
}
