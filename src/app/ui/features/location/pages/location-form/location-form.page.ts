import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '../../../../../domain/models/location.model';
import { LocationDTOInput, LocationDTOSchema } from '../../schemas/location.zod';

@Component({
  selector: 'app-location-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-form.page.html',
  styleUrl: './location-form.page.css'
})
export class LocationFormPage {
  private fb = inject(FormBuilder);
  public submitting = signal(false);
  public error = signal<string | null>(null);
  public success = signal(false);

  public form = this.fb.group({
    id: this.fb.control<string>(crypto.randomUUID(), { nonNullable: true }),
    code: this.fb.control<string>('', {
      nonNullable: true, validators: [Validators.required]
    }),
    name: this.fb.control<string>('', {
      nonNullable: true, validators: [Validators.required]
    }),
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

  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);

    try {
      const raw = this.form.getRawValue();
      const parsed: LocationDTOInput = LocationDTOSchema.parse(raw);
      const entity = Location.create(parsed as any);
      await new Promise(r => setTimeout(r, 500));
      console.log('Entidad lista para persistir:', entity);
      this.success.set(true);
      this.form.markAsPristine();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al guardar');
    } finally {
      this.submitting.set(false);
    }
  }
}
