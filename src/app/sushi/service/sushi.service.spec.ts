import { TestBed } from '@angular/core/testing';

import { SushiService } from './sushi.service';

describe('SushiService', () => {
  let service: SushiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SushiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
