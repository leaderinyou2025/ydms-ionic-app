import { TestBed } from '@angular/core/testing';

import { TextZoomService } from './text-zoom.service';

describe('TextZoomService', () => {
  let service: TextZoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextZoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
