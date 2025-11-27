import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Equipment } from '../../../../../domain/models/equipment.model';
import { EquipmentDTOInput, EquipmentDTOSchema } from
  '../../schemas/equipment.zod';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipmentStore } from '../../state/equipment.store';
import { toRecord } from '../../../../../shared/utils/metadata.util';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { LocationStore } from '../../../location/state/location.store';



@Component({
  selector: 'app-equipment-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './equipment-form.page.html',
  styleUrls: []
})
export class EquipmentFormPage {
  private fb = inject(FormBuilder);
  public submitting = signal(false);
  public error = signal<string | null>(null);
  public success = signal(false);
  private locationStore = inject(LocationStore);
  locations = this.locationStore.items;

  public form = this.fb.group({
    id: this.fb.control<string>(crypto.randomUUID(), { nonNullable: true }),
    assetTag: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    serialNumber: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    model: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    type: this.fb.control<'Laptop' | 'Desktop' | 'Printer' | 'Monitor' | 'Server'
      | 'Other'>('Laptop', { nonNullable: true }),
    status: this.fb.control<'Available' | 'InUse' | 'InRepair' | 'Retired'>(
      'Available', { nonNullable: true }),
    locationId: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    purchaseDate: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    warrantyEnd: this.fb.control<string>('', {
      nonNullable: true, validators: [
        Validators.required]
    }),
    metadata: this.fb.control<Record<string, unknown>>({}, { nonNullable: true }
    ),
  });


  private store = inject(EquipmentStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isEdit = false;
  id = '';
  ngOnInit(): void {
    if (this.locationStore.items().length === 0) {
      this.locationStore.fetchAll();
    }
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id) {
      this.isEdit = true;
      let equipment = this.store.items().find(e => e.id === this.id);
      const apply = (equipment: Equipment) => {
        this.form.patchValue({
          id: equipment.id,
          assetTag: equipment.assetTag,
          serialNumber: equipment.serialNumber,
          model: equipment.model,
          type: equipment.type as any,
          status: equipment.status as any,
          locationId: equipment.locationId,
          purchaseDate: this.toDateInput(equipment.purchaseDate),
          warrantyEnd: this.toDateInput(equipment.warrantyEnd),
          metadata: toRecord(equipment.metadata),
        });
      };
      if (equipment) {
        apply(equipment);
      } else {
        this.store.findById(this.id).then(found => {
          if (found) apply(found);
        });
      }
    }
  }
  private toDateInput(d: Date): string {                        //metodo que faltaba
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${year}-${month}-${day}`;
  }
  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);
    try {
      const raw = this.form.getRawValue();
      const parsed: EquipmentDTOInput = EquipmentDTOSchema.parse(raw);
      const dto = {
        id: parsed.id,
        assetTag: parsed.assetTag,
        serialNumber: parsed.serialNumber,
        model: parsed.model,
        type: parsed.type,
        status: parsed.status,
        locationId: parsed.locationId,
        purchaseDate: new Date(parsed.purchaseDate as any),
        warrantyEnd: new Date(parsed.warrantyEnd as any),
        metadata: parsed.metadata as any,
      };
      if (this.isEdit) {
        await this.store.update(this.id, dto as any);
        alert("Equipo actualizado");
      } else {
        await this.store.create(dto as any);
        alert('Equipo registrado');
      }
      this.success.set(true);
      this.form.markAsPristine();
      this.router.navigate(['/equipment']);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al guardar');
      if (this.form.invalid) return alert('Por favor completa todos los campos.');
    } finally {
      this.submitting.set(false);
    }
  }
}

