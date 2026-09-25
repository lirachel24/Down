import React, { useState } from 'react';
import { Beacon } from '../../types';
import { currentUser } from '../../data/mockData';
import { saveEvent } from '../../lib/api';
import { htmlToText, nextFullHour } from '../../lib/format';
import { EventDraft } from './types';
import { COVERS, EventFormPage } from './EventFormPage';
import { LocationPage } from './LocationPage';
import { DescriptionPage } from './DescriptionPage';
import { SuccessPage } from './SuccessPage';

interface CreateEventFlowProps {
  onClose: () => void;
  onCreated: (event: Beacon) => void;
  onViewEvent: (event: Beacon) => void;
}

type Page = 'form' | 'location' | 'description' | 'success';

const newDraft = (): EventDraft => {
  const start = nextFullHour();
  return {
    title: '',
    cover: COVERS[0],
    start,
    end: start + 3600_000,
    place: null,
    descriptionHtml: '',
    requireApproval: false,
    priceCents: 0,
    visibility: 'public',
    capacity: null,
  };
};

export const CreateEventFlow: React.FC<CreateEventFlowProps> = ({ onClose, onCreated, onViewEvent }) => {
  const [page, setPage] = useState<Page>('form');
  const [draft, setDraft] = useState<EventDraft>(newDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<Beacon | null>(null);

  const update = (patch: Partial<EventDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      if ('title' in patch) delete next.title;
      if ('place' in patch) delete next.place;
      if ('start' in patch || 'end' in patch) delete next.end;
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!draft.title.trim()) e.title = 'Give your event a name.';
    if (!draft.place) e.place = 'Choose where it is happening.';
    if (draft.end <= draft.start) e.end = 'The end time has to be after the start time.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (submitting || !validate()) return;
    const place = draft.place!;
    const pinned = Number.isFinite(place.lat) && Number.isFinite(place.lng);
    const text = htmlToText(draft.descriptionHtml);

    const event: Beacon = {
      id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: draft.title.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
        companyOrSchool: currentUser.companyOrSchool,
        tier: 'villager',
        sweatpantsApproved: true,
      },
      activityCategory: 'after-work',
      categoryLabel: 'Hangout',
      locationName: place.name,
      address: place.address,
      distance: 'Just posted',
      coords: { x: 50, y: 50 },
      startTime: draft.start,
      durationMinutes: Math.round((draft.end - draft.start) / 60000),
      expiresAt: draft.end,
      spotsTotal: draft.capacity ?? 999,
      spotsFilled: 1,
      attendees: [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }],
      whatAreWeWearing: 'Come as you are (sweatpants fully approved)',
      convinceMeReason:
        text.slice(0, 220) ||
        "You don't need plans. You just need to be down. Show up as you are, stay as long as you like, and head home feeling lighter.",
      icebreakerQuestions: [
        "What's the funniest thing that went wrong with your week so far?",
        'If you could teleport anywhere for one hour right now, where would you go?',
        "What's a small win you haven't told anyone about yet?",
      ],
      depositRequired: draft.priceCents > 0,
      image: draft.cover,
      isHost: true,
      joined: true,
      description: draft.descriptionHtml || undefined,
      lat: pinned ? place.lat : undefined,
      lng: pinned ? place.lng : undefined,
      locationInstructions: place.instructions.trim() || undefined,
      exactLocationApprovedOnly: place.exactOnlyApproved,
      requireApproval: draft.requireApproval,
      priceCents: draft.priceCents,
      visibility: draft.visibility,
      capacity: draft.capacity,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      await saveEvent(event);
      setCreated(event);
      onCreated(event);
      setPage('success');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (page === 'location') {
    return (
      <LocationPage
        place={draft.place}
        onBack={() => setPage('form')}
        onSave={(place) => {
          update({ place });
          setPage('form');
        }}
      />
    );
  }

  if (page === 'description') {
    return (
      <DescriptionPage
        draft={draft}
        onSave={(descriptionHtml) => {
          update({ descriptionHtml });
          setPage('form');
        }}
      />
    );
  }

  if (page === 'success' && created) {
    return <SuccessPage event={created} onClose={onClose} onViewEvent={() => onViewEvent(created)} />;
  }

  return (
    <EventFormPage
      draft={draft}
      update={update}
      errors={errors}
      submitting={submitting}
      submitError={submitError}
      onOpenLocation={() => setPage('location')}
      onOpenDescription={() => setPage('description')}
      onSubmit={submit}
      onClose={onClose}
    />
  );
};
