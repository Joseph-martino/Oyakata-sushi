import { TestBed } from '@angular/core/testing';

import { DisplayHeaderService } from './display-header.service';

describe('DisplayHeaderService', () => {
  let service: DisplayHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
