import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Maintenance } from '../../../../../domain/models/maintenance.model';
import { MaintenanceDTOInput, MaintenanceDTOSchema } from '../../schemas/maintenance.zod';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaintenanceStore } from '../../state/maintenance.store';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { EquipmentStore } from '../../../equipment/state/equipment.store';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './maintenance-form.page.html',
  styleUrls: []
})
export class MaintenanceFormPage {
  private fb = inject(FormBuilder);
  public submitting = signal(false);
  public error = signal<string | null>(null);
  public success = signal(false);
  private equipmentStore = inject(EquipmentStore);
  equipments = this.equipmentStore.items;

  public form = this.fb.group({
    id: this.fb.control<string>(crypto.randomUUID(), { nonNullable: true }),
    equipmentId: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: this.fb.control<
      'Inspection' | 'Preventive' | 'Corrective' | 'Predictive' | 'Proactive' | 'Reactive' | 'Scheduled' | 'Automated'
    >('Inspection', { nonNullable: true }),
    scheduledAt: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    performedAt: this.fb.control<string | null>(null),
    technician: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    status: this.fb.control<'Active' | 'Inactive' | 'InProgress' | 'Done' | 'Scheduled'>(
      'Scheduled', { nonNullable: true }
    ),
    cost: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    notes: this.fb.control<string | null>(null),
  });

  private store = inject(MaintenanceStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isEdit = false;
  id = '';

  ngOnInit(): void {
    if (this.equipmentStore.items().length === 0) {
      this.equipmentStore.fetchAll();
    }
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id) {
      this.isEdit = true;
      const cached = this.store.items().find(m => m.id === this.id);
      const apply = (m: Maintenance) => {
        this.form.patchValue({
          id: m.id,
          equipmentId: m.equipmentId,
          type: m.type as any,
          scheduledAt: this.toDateTimeLocal(m.scheduledAt),
          performedAt: m.performedAt ? this.toDateTimeLocal(m.performedAt) : null,
          technician: m.technician,
          status: m.status as any,
          cost: m.cost ?? null,
          notes: m.notes ?? null,
        });
      };
      if (cached) {
        apply(cached);
      } else {
        this.store.findById(this.id).then(found => { if (found) apply(found); });
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

  private toDateTimeLocal(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);
    try {
      const raw = this.form.getRawValue();
      // Normaliza opcionales antes de validar
      const toValidate = {
        ...raw,
        cost: raw.cost == null ? undefined : raw.cost,
        performedAt: !raw.performedAt ? undefined : raw.performedAt,
        notes: raw.notes == null || raw.notes === '' ? undefined : raw.notes,
      } as any;
      const parsed: MaintenanceDTOInput = MaintenanceDTOSchema.parse(toValidate);
      const dto = {
        id: parsed.id,
        equipmentId: parsed.equipmentId,
        type: parsed.type,
        scheduledAt: new Date(parsed.scheduledAt as any),
        performedAt: parsed.performedAt ? new Date(parsed.performedAt as any) : undefined,
        technician: parsed.technician,
        status: parsed.status,
        cost: parsed.cost,
        notes: parsed.notes,
      } as const;

      if (this.isEdit) {
        await this.store.update(this.id, dto as any);
        alert('Mantenimiento actualizado');
      } else {
        await this.store.create(dto as any);
        alert('Mantenimiento registrado');
      }
      this.success.set(true);
      this.form.markAsPristine();
      this.router.navigate(['/maintenance']);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al guardar');
    } finally {
      this.submitting.set(false);
    }
  }
}
