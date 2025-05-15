import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ISelfDiscoverySurveyDetail, ISelfDiscoverySurveyQuestion } from '../../../../shared/interfaces/self-discovery-survey/self-discovery-survey.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { ForceTestData } from '../../../../shared/classes/force-test-data';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { SelfDiscoverySurveyService } from '../../../../services/self-discovery-survey/self-discovery-survey.service';

@Component({
  selector: 'app-self-discovery-survey-detail',
  templateUrl: './self-discovery-survey-detail.component.html',
  styleUrls: ['./self-discovery-survey-detail.component.scss'],
  standalone: false,
})
export class SelfDiscoverySurveyDetailComponent implements OnInit {
  surveyDetail!: ISelfDiscoverySurveyDetail;
  isLoading: boolean = true;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private selfDiscoverySurveyService: SelfDiscoverySurveyService
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
      const surveyDetail = await this.selfDiscoverySurveyService.getSurveyDetail(surveyId);
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
    this.router.navigate([`/${PageRoutes.SELF_DISCOVERY_SURVEY}`]);
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
   * Get discovery level emoji
   * @param discoveryLevel Discovery level
   */
  public getDiscoveryLevelEmoji(discoveryLevel: string): string {
    return ForceTestData.getDiscoveryLevelEmoji(discoveryLevel);
  }

  /**
   * Get selected option value
   * @param question Question
   */
  public getSelectedOptionValue(question: ISelfDiscoverySurveyQuestion): number {
    const selectedOption = question.options.find(option => option.selected);
    return selectedOption ? selectedOption.id : -1;
  }
}
