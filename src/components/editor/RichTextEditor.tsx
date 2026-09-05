import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Describe your project idea in detail...',
  disabled = false,
  minHeight = '240px',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#2E86DE] underline font-bold hover:text-[#1B6CA8]',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);

    if (url === null) return; // cancelled

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const formattedUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;

    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] p-4 text-xs font-mono font-bold text-gray-500 animate-pulse">
        Initializing Rich Text Editor...
      </div>
    );
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, isActive = false, disabled: btnDisabled = false, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={btnDisabled || disabled}
      title={title}
      className={`p-2 rounded-xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer select-none flex items-center justify-center ${
        isActive
          ? 'bg-[#FFE600] text-[#121316] shadow-pop-sm'
          : 'bg-white hover:bg-gray-100 text-[#121316]'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full rounded-3xl bg-white border-3 border-[#121316] shadow-pop overflow-hidden focus-within:ring-4 focus-within:ring-[#FFE600] transition-all">
      {/* TOOLBAR */}
      <div className="p-2.5 bg-[#FAF7F0] border-b-3 border-[#121316] flex flex-wrap items-center gap-1.5 select-none">
        {/* Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <div className="w-[2px] h-6 bg-[#121316]/20 mx-1 hidden sm:block" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <div className="w-[2px] h-6 bg-[#121316]/20 mx-1 hidden sm:block" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        {/* Blockquote & Code */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        <div className="w-[2px] h-6 bg-[#121316]/20 mx-1 hidden sm:block" />

        {/* Link Actions */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Insert / Edit Link"
        >
          <LinkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
        </ToolbarButton>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Unlink className="w-3.5 h-3.5 stroke-[2.5] text-red-600" />
          </ToolbarButton>
        )}

        {/* Undo / Redo */}
        <div className="ml-auto flex items-center gap-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5 stroke-[2.5]" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5 stroke-[2.5]" />
          </ToolbarButton>
        </div>
      </div>

      {/* EDITOR CONTENT AREA */}
      <div className="p-4 sm:p-6 bg-white min-h-[220px]">
        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="prose prose-sm sm:prose-base max-w-none focus:outline-none text-[#121316] font-medium leading-relaxed"
        />
      </div>

      {/* FOOTER HELPER */}
      <div className="px-4 py-2 bg-[#FAF7F0] border-t border-[#121316]/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>💡 Rich text supported (Headings, Lists, Code, Links)</span>
        <span>{editor.getText().length} characters</span>
      </div>
    </div>
  );
};
