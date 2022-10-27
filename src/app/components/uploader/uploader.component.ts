import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as async from 'async';
import * as uuid from 'uuid';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  public uploadedFiles: any[] = [];
  public src: string;
  @Output() emitChange = new EventEmitter<any>();

  constructor() {}

  onUpload($event) {
    const reader = new FileReader();
    const files = $event.currentFiles;
    this.uploadedFiles = files;

    if (files) {
      async.eachSeries(
        files,
        (file: any, done) => {
          reader.readAsBinaryString(file);
          reader.onloadend = () => {
            const count = (reader.result as string).match(
              /\/Type[\s]*\/Page[^s]/g
            ).length;
            file.id = uuid.v4();
            file.pages = count;
            return done();
          };
        },
        () => {
          this.emitChange.emit(files);
        }
      );
    }
  }

  removeFile(id) {
    this.uploadedFiles = this.uploadedFiles.filter((x) => x.id !== id);
    this.emitChange.emit(this.uploadedFiles);
  }

  ngOnInit(): void {
    if (this.uploadedFiles.length) {
      const files = this.uploadedFiles;
      this.emitChange.emit(files);
    }
  }
}
