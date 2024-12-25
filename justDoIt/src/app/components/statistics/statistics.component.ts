import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Tableau de bord</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Tâches accomplies</h3>
          <p class="text-3xl font-bold text-green-600">
            {{ (statistics$ | async)?.completedPercentage | number : '1.0-0' }}%
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Tâches en cours</h3>
          <p class="text-3xl font-bold text-blue-600">
            {{ (statistics$ | async)?.pendingPercentage | number : '1.0-0' }}%
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Tâches en retard</h3>
          <p class="text-3xl font-bold text-red-600">
            {{ (statistics$ | async)?.overdueTasks }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class StatisticsComponent implements OnInit {
  statistics$: Observable<{
    completedPercentage: number;
    pendingPercentage: number;
    overdueTasks: number;
  }>;

  constructor(private taskService: TaskService) {
    this.statistics$ = this.taskService.getStatistics();
  }

  ngOnInit(): void {}
}
