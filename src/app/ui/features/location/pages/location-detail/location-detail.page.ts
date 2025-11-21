import { afterNextRender, Component, inject, signal } from '@angular/core';
import { LocationStore } from '../../state/location.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '../../../../../domain/models/location.model';
@Component({
  selector: 'app-location-detail',
  imports: [RouterLink],
  templateUrl: './location-detail.page.html',
  styleUrl: './location-detail.page.css'
})
export class LocationDetailPage {
  private store = inject(LocationStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = this.store.loading;
  location = signal<Location | null>(null);
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      const lo = await this.store.findById (id);
      if (!lo) return;
      this.location.set(lo);
    }
  }
  goEdit() {
    const location = this.location();
    if (location === null) return;
    this.router.navigate(['/location', location.id, 'edit']);
  }
  delete() {
    const location = this.location();
    if (location === null) return;
    if (confirm('Seguro que quieres eliminar esta ubicacion?')) {
      this.store.remove(location.id);
      alert('Ubicacion eliminada correctamente');
      this.router.navigate(['/location']);
    }
  }
}


