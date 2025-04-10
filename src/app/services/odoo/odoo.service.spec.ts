import { TestBed } from '@angular/core/testing';

import { OdooService } from './odoo.service';

describe('OdooServicesService', () => {
  let service: OdooService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdooService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
