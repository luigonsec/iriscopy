import { Component, OnInit } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  public uploadedFiles: any[] = [];
  public pages: number = 0;
  public src: string;
  constructor() {}

  onUpload($event) {
    const reader = new FileReader();
    const file = $event.currentFiles[0];
    this.uploadedFiles = [file];
    if (file) {
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        const count = (reader.result as string).match(
          /\/Type[\s]*\/Page[^s]/g
        ).length;

        this.pages = count;
      };
    }
  }
  ngOnInit(): void {}
}
