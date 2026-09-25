import { Place } from '../../lib/api';

export interface EventDraft {
  title: string;
  cover: string;
  start: number;
  end: number;
  place: (Place & { instructions: string; exactOnlyApproved: boolean }) | null;
  descriptionHtml: string;
  requireApproval: boolean;
  priceCents: number;
  visibility: 'public' | 'friends' | 'private';
  capacity: number | null;
}
