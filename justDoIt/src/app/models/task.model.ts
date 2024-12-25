export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum Status {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
