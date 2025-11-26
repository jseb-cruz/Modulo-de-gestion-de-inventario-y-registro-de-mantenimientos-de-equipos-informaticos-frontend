import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../../../../domain/models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.html',
  styleUrls: ['./user-table.css']
})
export class UserTable {
  @Input() data: User[] = [];
  @Input() showActions = false;
  @Input() onEdit?: (user: User) => void;
  @Input() onDelete?: (user: User) => void;
}
