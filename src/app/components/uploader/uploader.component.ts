import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  public uploadedFiles: any[] = [];
  public pages: number = 0;
  public src: string;
  @Output() emitChange = new EventEmitter<any>();

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

      this.emitChange.emit(file);
    }
  }

  ngOnInit(): void {
    if (this.uploadedFiles.length) this.emitChange.emit(this.uploadedFiles[0]);
  }
}
