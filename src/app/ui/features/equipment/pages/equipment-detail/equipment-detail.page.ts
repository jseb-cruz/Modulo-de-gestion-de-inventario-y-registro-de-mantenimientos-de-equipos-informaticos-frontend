import { afterNextRender, Component, inject, signal } from '@angular/core';
import { EquipmentStore } from '../../state/equipment.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Equipment } from '../../../../../domain/models/equipment.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-equipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-detail.page.html',
  styleUrls: []
})
export class EquipmentDetailPage {
  private store = inject(EquipmentStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = this.store.loading;
  equipment = signal<Equipment | null>(null);
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      const eq = await this.store.findById(id);
      if (!eq) return;
      this.equipment.set(eq);
    }
  }
  goEdit() {
    const equipment = this.equipment();
    if (equipment === null) return;
    this.router.navigate(['/equipment', equipment.id, 'edit']);
  }
  delete() {
    const equipment = this.equipment();
    if (equipment === null) return;
    if (confirm('¿Seguro que quieres eliminar este equipo?')) {
      this.store.remove(equipment.id);
      alert('Equipo eliminado correctamente');
      this.router.navigate(['/equipment']);
    }
  }
}
