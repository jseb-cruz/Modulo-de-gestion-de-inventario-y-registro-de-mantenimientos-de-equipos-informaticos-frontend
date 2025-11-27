import { afterNextRender, Component, inject, signal } from '@angular/core';
import { MaintenanceStore } from '../../state/maintenance.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Maintenance } from '../../../../../domain/models/maintenance.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-maintenance-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-detail.page.html',
  styleUrls: []
})
export class MaintenanceDetailPage {
  private store = inject(MaintenanceStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = this.store.loading;
  maintenance = signal<Maintenance | null>(null);
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      const eq = await this.store.findById(id);
      if (!eq) return;
      this.maintenance.set(eq);
    }
  }
  goEdit() {
    const maintenance = this.maintenance();
    if (maintenance === null) return;
    this.router.navigate(['/maintenance', maintenance.id, 'edit']);
  }
  delete() {
    const maintenance = this.maintenance();
    if (maintenance === null) return;
    if (confirm('¿Seguro que quieres eliminar este mantenimiento?')) {
      this.store.remove(maintenance.id);
      alert('Mantenimiento eliminado correctamente');
      this.router.navigate(['/maintenance']);
    }
  }
}
