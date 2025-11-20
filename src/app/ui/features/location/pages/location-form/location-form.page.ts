import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationDTOInput, LocationDTOSchema } from '../../schemas/location.zod';
import { LocationStore } from '../../state/location.store';
import { toRecord } from '../../../../../shared/utils/metadata.util';
import { Location } from '../../../../../domain/models/location.model';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './location-form.page.html',
  styleUrl: './location-form.page.css'
})
export class LocationFormPage {
  private fb = inject(FormBuilder);
  private store = inject(LocationStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form = this.fb.group({
    id: this.fb.control<string>(crypto.randomUUID(), { nonNullable: true }),
    code: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: this.fb.control<'Office' | 'Warehouse' | 'DataCenter' | 'Lab' | 'Remote' | 'Other'>(
      'Office', { nonNullable: true }),
    status: this.fb.control<'Active' | 'Inactive' | 'UnderMaintenance' | 'Deprecated'>(
      'Active', { nonNullable: true }),
    building: this.fb.control<string>('', { nonNullable: true }),
    floor: this.fb.control<string>('', { nonNullable: true }),
    room: this.fb.control<string>('', { nonNullable: true }),
    address: this.fb.control<string>('', { nonNullable: true }),
    metadata: this.fb.control<Record<string, unknown>>({}, { nonNullable: true })
  });

  isEdit = false;
  id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) return;
    this.isEdit = true;

    let location = this.store.items().find(l => l.id === this.id);
    const apply = (location: Location) => {
      this.form.patchValue({
        id: location.id,
        code: location.code,
        name: location.name,
        type: location.type as any,
        status: location.status as any,
        building: location.building ?? '',
        floor: location.floor ?? '',
        room: location.room ?? '',
        address: location.address ?? '',
        metadata: toRecord(location.metadata)
      });
    };

    if (location) {
      apply(location);
    } else {
      this.store.findById(this.id).then(found => {
        if (found) apply(found);
      });
    }
  }

  private normalizeOptional(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);
    try {
      const raw = this.form.getRawValue();
      const parsed: LocationDTOInput = LocationDTOSchema.parse(raw);
      const dto: LocationDTOInput = {
        ...parsed,
        building: this.normalizeOptional(parsed.building),
        floor: this.normalizeOptional(parsed.floor),
        room: this.normalizeOptional(parsed.room),
        address: this.normalizeOptional(parsed.address),
      };

      if (this.isEdit) {
        await this.store.update(this.id, dto);
        alert('Ubicacion actualizada');
      } else {
        await this.store.create(dto);
        alert('Ubicacion registrada');
      }

      this.success.set(true);
      this.form.markAsPristine();
      this.router.navigate(['/location']);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al guardar');
      if (this.form.invalid) alert('Por favor completa todos los campos.');
    } finally {
      this.submitting.set(false);
    }
  }
}
