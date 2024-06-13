import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import File from 'src/app/interfaces/File';
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
  @Output() emitChange = new EventEmitter<unknown>();

  constructor(
    private filesService: FilesService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  // onUpload($event, fileUpload) {
  //   const files = $event.currentFiles;
  //   const treatedFiles = this.uploadedFiles;
  //   if (files) {
  //     this.loadingService.setLoading({
  //       text: 'Procesando archivos',
  //       isLoading: true,
  //     });
  //     async.each(
  //       files,
  //       (file: any, done) => {
  //         const reader = new FileReader();
  //         reader.readAsBinaryString(file);
  //         reader.onloadend = () => {
  //           try {
  //             this.filesService.upload(file).subscribe(
  //               (uploadedFile: UploadedFile) => {
  //                 const newFile: File = {
  //                   id: uploadedFile.id,
  //                   pages: uploadedFile.pages,
  //                   name: file.name,
  //                   size: file.size,
  //                   url: uploadedFile.source_url,
  //                   original_filename: uploadedFile.title.raw,
  //                   source: 'local',
  //                   image: uploadedFile.media_details.sizes.medium.source_url,
  //                 };
  //                 treatedFiles.push(newFile);
  //                 return done();
  //               },
  //               (err: HttpErrorResponse) => {
  //                 return done(err);
  //               }
  //             );
  //           } catch (err) {
  //             this.messageService.add({
  //               severity: 'error',
  //               detail: 'El PDF adjunto no es válido.',
  //               summary: 'Error',
  //             });
  //             return done(err);
  //           }
  //         };
  //       },
  //       (err: HttpErrorResponse) => {
  //         if (err && err.status && err.status === 413) {
  //           this.messageService.add({
  //             summary: 'Error',
  //             detail: 'El archivo es demasiado grande',
  //             severity: 'error',
  //           });
  //         }
  //         this.loadingService.setLoading({
  //           isLoading: false,
  //         });
  //         this.uploadedFiles = treatedFiles;
  //         this.emitChange.emit(this.uploadedFiles);
  //         fileUpload.clear();
  //       }
  //     );
  //   }
  // }

  onUpload($event, fileUpload) {
    const files = $event.currentFiles;
    const treatedFiles = this.uploadedFiles;
    if (files) {
      this.loadingService.setLoading({
        text: 'Procesando archivos',
        isLoading: true,
      });
      this.processFiles(files, treatedFiles, fileUpload);
    }
  }

  async processFiles(files, treatedFiles, fileUpload) {
    try {
      for (const file of files) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        const uploadedFile = await this.filesService.upload(file).toPromise();
        const newFile = this.createFileObject(uploadedFile, file);
        treatedFiles.push(newFile);
      }
    } catch (err) {
      this.handleError(err);
    } finally {
      this.uploadedFiles = treatedFiles;
      this.emitChange.emit(this.uploadedFiles);
      fileUpload.clear();
      this.loadingService.setLoading({
        isLoading: false,
      });
    }
  }

  createFileObject(uploadedFile, file) {
    return {
      id: uploadedFile.id,
      pages: uploadedFile.pages,
      name: file.name,
      size: file.size,
      url: uploadedFile.source_url,
      original_filename: uploadedFile.title.raw,
      source: 'local',
      image: uploadedFile.media_details.sizes.medium.source_url,
    };
  }

  handleError(err) {
    if (err && err.status && err.status === 413) {
      this.messageService.add({
        summary: 'Error',
        detail: 'El archivo es demasiado grande',
        severity: 'error',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        detail: 'El PDF adjunto no es válido.',
        summary: 'Error',
      });
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
