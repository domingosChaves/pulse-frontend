import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }
  next() {
    if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
  }
  go(p: number) {
    if (p >= 1 && p <= this.totalPages) this.pageChange.emit(p);
  }
}
