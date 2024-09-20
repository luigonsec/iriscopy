import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import { OrderDetailsComponent } from 'src/app/components/order-details/order-details.component';
import Customer from 'src/app/interfaces/Customer';
import Order from 'src/app/interfaces/Order';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss'],
  providers: [DialogService],
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  customer$: any;
  customer: Customer;
  orders: Order[];
  statusTranslations: {} = {
    processing: 'Procesando',
    'on-hold': 'En espera',
    refunded: 'Reembolsado',
    failed: 'Fallido',
    trash: 'Eliminado',
    cancelled: 'Cancelado',
    pending: 'Pendiente de pago',
    completed: 'Completado',
  };
  public moment = moment;

  constructor(
    private store: Store,
    private ordersService: OrdersService,
    private dialogService: DialogService,
    private loadingService: LoadingService
  ) {}

  ngOnDestroy(): void {
    if (this.customer$) {
      this.customer$.unsubscribe();
    }
  }

  showDetails(order) {
    this.dialogService.open(OrderDetailsComponent, {
      width: '80%',
      header: 'Detalles del pedido',
      data: {
        order,
      },
    });
  }

  loadOrders() {
    this.loadingService.setLoading({
      isLoading: true,
      text: 'Cargando...',
    });
    this.ordersService.getByCustomer(this.customer.id).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.loadingService.stopLoading();
      },
      error: () => {
        this.loadingService.stopLoading();
      },
    });
  }

  getStatusName(name) {
    return this.statusTranslations[name] || name;
  }

  ngOnInit(): void {
    this.customer$ = this.store
      .select(selectCustomer)
      .subscribe((customer: Customer) => {
        this.customer = customer;
        this.loadOrders();
      });
  }
}
