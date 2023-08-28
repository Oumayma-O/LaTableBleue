import { Guest } from './models/guest.model';

export class GuestDeletedEvent {
  constructor(public readonly deletedGuest: Guest) {}
}
