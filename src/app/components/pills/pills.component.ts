import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-pills',
  templateUrl: './pills.component.html',
  styleUrls: ['./pills.component.scss'],
})
export class PillsComponent {
  @Input('pills')
  pills: MenuItem[] = [];
  isDragging = false;
  startX: number;
  scrollLeft: number;

  startDragging(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement; // Correct type assertion
    this.isDragging = true;
    this.startX = event.pageX - element.offsetLeft;
    this.scrollLeft = element.scrollLeft;
  }

  stopDragging() {
    this.isDragging = false;
  }

  drag(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault(); // Prevents selecting text during drag
    const element = event.currentTarget as HTMLElement; // Correct type assertion
    const x = event.pageX - element.offsetLeft;
    const walk = x - this.startX; // *2 for faster scrolling
    element.scrollLeft = this.scrollLeft - walk;
  }

  activePill(item: MenuItem) {
    if (this.isDragging) return;
    this.pills.forEach((pill) => {
      pill.styleClass = undefined;
    });
    item.styleClass = 'active';
    item.command();
  }
}
