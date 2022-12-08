import { Component, OnInit } from '@angular/core';
import { ShopcartService } from 'src/app/services/shopcart.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(private shopcart: ShopcartService) {}

  ngOnInit(): void {
    this.shopcart.clearCart();
  }
}
