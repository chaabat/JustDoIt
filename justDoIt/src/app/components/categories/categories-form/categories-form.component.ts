import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css'],
})
export class CategoriesFormComponent {
  @Input() editMode = false;
  @Input() initialName = '';
  @Output() formSubmit = new EventEmitter<string>();
  @Output() formCancel = new EventEmitter<void>();

  categoryName = '';

  ngOnInit(): void {
    this.categoryName = this.initialName;
  }

  onSubmit(): void {
    if (this.categoryName.trim()) {
      this.formSubmit.emit(this.categoryName.trim());
      this.categoryName = '';
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.categoryName = '';
  }
}
