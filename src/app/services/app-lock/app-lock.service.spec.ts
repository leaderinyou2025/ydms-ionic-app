import { TestBed } from '@angular/core/testing';

import { AppLockService } from './app-lock.service';

describe('AppLockService', () => {
  let service: AppLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
