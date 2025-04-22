import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-additional-comment',
  templateUrl: './additional-comment.component.html',
  styleUrls: ['./additional-comment.component.scss'],
})
export class AdditionalCommentComponent implements OnInit {
  @Output() emitChange = new EventEmitter<any>();
  public text: string;

  constructor() {}

  handleChange($event) {
    const text = $event.target.value;
    this.emitChange.emit(text);
  }

  ngOnInit(): void {
    this.text = '';
    this.emitChange.emit(this.text);
  }
}
