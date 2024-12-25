import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-6">
      <div class="relative">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()"
          placeholder="Rechercher une tâche..."
          class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  `,
})
export class TaskSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery = '';

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }
}
