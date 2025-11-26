import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '../../state/user.store';
import { UserTable } from '../../components/user-table/user-table';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserTable, RouterLink],
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.css']
})
export class UserListPage {
  private store = inject(UserStore);
  private router = inject(Router);
  loading = this.store.loading;
  error = this.store.error;
  filtered = this.store.filtered;
  total = this.store.total;
  roles = ['All', 'Admin', 'User'] as const;
  statuses = ['All', 'Active', 'Inactive'] as const;

  ngOnInit() {
    this.store.fetchAll();
  }

  onQuery(event: Event) {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }
  onRole(event: Event) {
    this.store.setRole((event.target as HTMLSelectElement).value as any);
  }
  onStatus(event: Event) {
    this.store.setStatus((event.target as HTMLSelectElement).value as any);
  }

  onEdit = (user: any) => {
    this.router.navigate(['/users', user.id, 'edit']);
  };

  onDelete = (user: any) => {
    if (confirm('Eliminar usuario?')) {
      this.store.remove(user.id);
    }
  };
}
