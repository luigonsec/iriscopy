import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as async from 'async';
import { MessageService } from 'primeng/api';
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
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  onUpload($event, fileUpload) {
    const files = $event.currentFiles;
    const treatedFiles = this.uploadedFiles;
    if (files) {
      this.loadingService.setLoading({
        text: 'Procesando archivos',
        isLoading: true,
      });
      async.each(
        files,
        (file: any, done) => {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onloadend = () => {
            try {
              this.filesService.upload(file).subscribe(
                (uploadedFile: UploadedFile) => {
                  const newFile: File = {
                    id: uploadedFile.id,
                    pages: uploadedFile.pages,
                    name: file.name,
                    size: file.size,
                    url: uploadedFile.source_url,
                    original_filename: uploadedFile.title.raw,
                    source: 'local',
                    image: uploadedFile.media_details.sizes.medium.source_url,
                  };
                  treatedFiles.push(newFile);
                  return done();
                },
                (err) => {
                  return done(err);
                }
              );
            } catch (err) {
              this.messageService.add({
                severity: 'error',
                detail: 'El PDF adjunto no es v??lido.',
                summary: 'Error',
              });
              return done(err);
            }
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
