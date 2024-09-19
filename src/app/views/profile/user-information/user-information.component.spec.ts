import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationComponent } from './user-information.component';
import { CustomersService } from 'src/app/services/customers.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UserInformationComponent', () => {
  let component: UserInformationComponent;
  let fixture: ComponentFixture<UserInformationComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomersService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockCustomerService = jasmine.createSpyObj('CustomersService', ['update']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [
      'queryParams',
    ]);

    mockActivatedRoute.queryParams = of({});
    await TestBed.configureTestingModule({
      declarations: [UserInformationComponent],
      providers: [
        { provide: CustomersService, useValue: mockCustomerService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
