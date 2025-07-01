import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-print-guide',
  templateUrl: './print-guide.component.html',
  styleUrls: ['./print-guide.component.scss'],
})
export class PrintGuideComponent implements OnInit, OnChanges {
  @Input() width: number = 85; // Ancho en mm
  @Input() height: number = 55; // Alto en mm

  totalWidth: number = 0;
  totalHeight: number = 0;
  safeWidth: number = 0;
  safeHeight: number = 0;

  ngOnInit(): void {
    this.calculateDimensions();
  }

  ngOnChanges(): void {
    this.calculateDimensions();
  }

  private calculateDimensions(): void {
    // Tamaño total del PDF (original + 3mm por cada lado = +6mm total)
    this.totalWidth = this.width + 6; // 3mm de sangría por cada lado
    this.totalHeight = this.height + 6; // 3mm de sangría por cada lado

    // Área segura (sin los márgenes internos de 3mm por cada lado = -6mm total)
    this.safeWidth = this.width - 6; // 3mm de margen por cada lado
    this.safeHeight = this.height - 6; // 3mm de margen por cada lado
  }
}
