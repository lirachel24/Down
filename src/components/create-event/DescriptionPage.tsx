import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading1, Heading2, Italic, Link2, List, ListOrdered, Loader2, Quote, Sparkles } from 'lucide-react';
import { CircleButton, PageHeader, PageShell } from './ui';
import { draftDescription } from '../../lib/api';
import { formatWhen, safeHtml } from '../../lib/format';
import { EventDraft } from './types';

interface DescriptionPageProps {
  draft: EventDraft;
  onSave: (html: string) => void;
}

export const DescriptionPage: React.FC<DescriptionPageProps> = ({ draft, onSave }) => {
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: true } })],
    content: draft.descriptionHtml,
    autofocus: 'end',
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[40vh] text-lg leading-relaxed text-ink focus:outline-none',
        'aria-label': 'Event description',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  });

  const save = () => onSave(editor && !editor.isEmpty ? safeHtml(editor.getHTML()) : '');

  const handleAi = async () => {
    if (!editor) return;
    setDrafting(true);
    setError(null);
    try {
      const html = await draftDescription({ title: draft.title, location: draft.place?.name, when: formatWhen(draft.start) });
      editor.commands.setContent(html);
    } catch {
      setError('Could not draft a description right now. Try again in a moment.');
    } finally {
      setDrafting(false);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') return void editor.chain().focus().unsetLink().run();
    const href = /^(https?:|mailto:)/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };

  const tools = editor
    ? [
        { label: 'Heading 1', icon: <Heading1 className="h-5 w-5" />, active: editor.isActive('heading', { level: 1 }), run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { label: 'Heading 2', icon: <Heading2 className="h-5 w-5" />, active: editor.isActive('heading', { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: 'Bold', icon: <Bold className="h-5 w-5" />, active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
        { label: 'Italic', icon: <Italic className="h-5 w-5" />, active: editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
        { label: 'Link', icon: <Link2 className="h-5 w-5" />, active: editor.isActive('link'), run: setLink },
        { label: 'Bulleted list', icon: <List className="h-5 w-5" />, active: editor.isActive('bulletList'), run: () => editor.chain().focus().toggleBulletList().run() },
        { label: 'Numbered list', icon: <ListOrdered className="h-5 w-5" />, active: editor.isActive('orderedList'), run: () => editor.chain().focus().toggleOrderedList().run() },
        { label: 'Quote', icon: <Quote className="h-5 w-5" />, active: editor.isActive('blockquote'), run: () => editor.chain().focus().toggleBlockquote().run() },
      ]
    : [];

  return (
    <PageShell label="Event description">
      <PageHeader
        title="Event Description"
        onBack={save}
        right={
          <CircleButton label="Write a draft with AI" onClick={handleAi} disabled={drafting || !editor}>
            {drafting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-pink" />}
          </CircleButton>
        }
      />

      <div className="relative flex-1 overflow-y-auto px-5 pb-6 pt-2" onClick={() => editor?.commands.focus()}>
        {editor?.isEmpty && (
          <p aria-hidden className="pointer-events-none absolute left-5 top-2 text-lg text-ink/35">
            What's the plan? Tap ✦ for an AI draft.
          </p>
        )}
        <EditorContent editor={editor} />
        {error && <p role="alert" className="mt-3 text-sm text-berry">{error}</p>}
      </div>

      <div className="border-t border-line bg-cream/95 px-3 pb-4 pt-2">
        <div role="toolbar" aria-label="Text formatting" className="no-scrollbar flex gap-1 overflow-x-auto">
          {tools.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-label={t.label}
              aria-pressed={t.active}
              onMouseDown={(e) => e.preventDefault()} // keep editor focus
              onClick={t.run}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.active ? 'bg-ink text-lime' : 'text-ink hover:bg-sand'}`}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={save}
          className="mt-2 min-h-[48px] w-full rounded-full bg-ink text-base font-semibold text-lime active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </PageShell>
  );
};
