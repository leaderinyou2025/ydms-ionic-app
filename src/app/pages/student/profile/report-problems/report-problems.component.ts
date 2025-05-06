import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';

@Component({
  selector: 'app-report-problems',
  templateUrl: './report-problems.component.html',
  styleUrls: ['./report-problems.component.scss'],
  standalone: false
})
export class ReportProblemsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
