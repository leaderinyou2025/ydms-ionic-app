import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFamilyConflictSurveyDetail, IFamilyConflictSurveyQuestion, IFamilyConflictSurveyOption } from '../../../../shared/interfaces/family-conflict-survey/family-conflict-survey.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from "../../../../shared/enums/page-routes";
import { FamilyConflictSurveyService } from '../../../../services/family-conflict-survey/family-conflict-survey.service';
import { ConflictLevel } from '../../../../shared/enums/family-conflict-survey/conflict-level';

@Component({
  selector: 'app-family-conflict-survey-detail',
  templateUrl: './family-conflict-survey-detail.component.html',
  styleUrls: ['./family-conflict-survey-detail.component.scss'],
  standalone: false,
})
export class FamilyConflictSurveyDetailComponent implements OnInit {
  surveyDetail!: IFamilyConflictSurveyDetail;
  isLoading: boolean = true;

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyConflictSurveyService: FamilyConflictSurveyService
  ) { }

  ngOnInit() {
    this.loadSurveyDetail();
  }

  /**
   * Navigate back to the survey list
   */
  public navigateBack(): void {
    this.router.navigate([`/${PageRoutes.FAMILY_CONFLICT_SURVEY}`]);
  }

  /**
   * Load survey detail from the service
   */
  private async loadSurveyDetail(): Promise<void> {
    this.isLoading = true;

    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        throw new Error('Survey ID not provided');
      }

      const surveyDetail = await this.familyConflictSurveyService.getSurveyDetail(Number(id));

      if (!surveyDetail) {
        throw new Error('Failed to load survey detail');
      }

      this.surveyDetail = surveyDetail;
    } catch (error) {
      console.error('ERROR:', error);
      this.navigateBack();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Format date
   * @param date Date
   */
  public formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Get conflict level emoji
   * @param conflictLevel Conflict level
   */
  public getConflictLevelEmoji(conflictLevel: string): string {
    switch (conflictLevel) {
      case ConflictLevel.Low:
        return '😊'; // Happy face
      case ConflictLevel.Medium:
        return '😐'; // Neutral face
      case ConflictLevel.High:
        return '😟'; // Worried face
      default:
        return '🤔'; // Thinking face
    }
  }

  /**
   * Get selected option value
   * @param question Question
   */
  public getSelectedOptionValue(question: IFamilyConflictSurveyQuestion): number {
    const selectedOption = question.options.find(o => o.selected);
    return selectedOption ? selectedOption.id : 0;
  }

}
