import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as async from 'async';
import File from 'src/app/interfaces/File';
import * as uuid from 'uuid';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  public uploadedFiles: File[] = [];
  public src: string;
  @Output() emitChange = new EventEmitter<any>();

  constructor() {}

  onUpload($event) {
    const reader = new FileReader();
    const files = $event.currentFiles;
    const treatedFiles = [];
    if (files) {
      async.eachSeries(
        files,
        (file: any, done) => {
          reader.readAsBinaryString(file);
          reader.onloadend = () => {
            const count = (reader.result as string).match(
              /\/Type[\s]*\/Page[^s]/g
            ).length;
            const newFile: File = {
              id: uuid.v4(),
              pages: count,
              name: file.name,
              size: file.size,
            };
            treatedFiles.push(newFile);
            return done();
          };
        },
        () => {
          this.uploadedFiles = treatedFiles;
          this.emitChange.emit(this.uploadedFiles);
        }
      );
    }
  }

  removeFile(id) {
    this.uploadedFiles = this.uploadedFiles.filter((x) => x.id !== id);
    this.emitChange.emit(this.uploadedFiles);
  }

  clear() {
    this.uploadedFiles = [];
    this.emitChange.emit(this.uploadedFiles);
  }

  ngOnInit(): void {
    if (this.uploadedFiles.length) {
      const files = this.uploadedFiles;
      this.emitChange.emit(files);
    }
  }
}
