import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as async from 'async';
import File from 'src/app/interfaces/File';
import UploadedFile from 'src/app/interfaces/UploadedFile';
import { FilesService } from 'src/app/services/files.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  public uploadedFiles: File[] = [];
  public src: string;
  @Output() emitChange = new EventEmitter<any>();

  constructor(
    private filesService: FilesService,
    private loadingService: LoadingService
  ) {}

  onUpload($event, fileUpload) {
    const files = $event.currentFiles;
    const treatedFiles = this.uploadedFiles;
    this.loadingService.setLoading({
      text: 'Procesando archivos',
      isLoading: true,
    });
    if (files) {
      async.each(
        files,
        (file: any, done) => {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onloadend = () => {
            const count = (reader.result as string).match(
              /\/Type[\s]*\/Page[^s]/g
            ).length;

            this.filesService
              .upload(file)
              .subscribe((uploadedFile: UploadedFile) => {
                const newFile: File = {
                  id: uploadedFile.id,
                  pages: count,
                  name: file.name,
                  size: file.size,
                  url: uploadedFile.source_url,
                  original_filename: uploadedFile.title.raw,
                  source: 'local',
                  image: uploadedFile.media_details.sizes.medium.source_url,
                };
                treatedFiles.push(newFile);
                return done();
              });
          };
        },
        () => {
          this.loadingService.setLoading({
            isLoading: false,
          });
          this.uploadedFiles = treatedFiles;
          this.emitChange.emit(this.uploadedFiles);
          fileUpload.clear();
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
