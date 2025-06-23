import { TestBed } from '@angular/core/testing';

import { ConfigTiendaPublicServiceService } from './config-tienda-public-service.service';

describe('ConfigTiendaPublicServiceService', () => {
  let service: ConfigTiendaPublicServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigTiendaPublicServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
