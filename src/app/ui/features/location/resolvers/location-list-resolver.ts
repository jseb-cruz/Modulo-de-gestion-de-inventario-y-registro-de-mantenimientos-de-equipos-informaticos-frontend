import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LocationStore } from '../state/location.store';
export const equipmentListResolver: ResolveFn<boolean> = async (route, state) => {
  const store = inject(LocationStore);
  if (store.items().length === 0) {
    await store.fetchAll();
  }
  return true;
};
