"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

// Define styles for the editor
const editorStyles = `
  .tiptap-editor {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    min-height: 200px;
    padding: 1rem;
  }
  
  .tiptap-editor:focus-within {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .tiptap-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: #f8fafc;
  }
  
  .tiptap-toolbar button {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .tiptap-toolbar button:hover {
    background-color: #f1f5f9;
  }
  
  .tiptap-toolbar button.is-active {
    background-color: #e0e7ff;
    border-color: #818cf8;
  }
  
  .tiptap-content p {
    margin-bottom: 0.75rem;
  }
  
  .tiptap-content ul, .tiptap-content ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .tiptap-content h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }
  
  .tiptap-content h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }
  
  .tiptap-content h3 {
    font-size: 1.125rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }
  
  .tiptap-content blockquote {
    border-left: 3px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
  }
  
  .tiptap-content a {
    color: #3b82f6;
    text-decoration: underline;
  }
`;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  if (!mounted) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>;
  }

  if (!editor) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>;
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{editorStyles}</style>
      
      <div className="tiptap-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          type="button"
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          type="button"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          type="button"
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          type="button"
        >
          Ordered List
        </button>
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={editor.isActive('link') ? 'is-active' : ''}
          type="button"
        >
          Link
        </button>
        <button
          onClick={() => setShowImageInput(!showImageInput)}
          type="button"
        >
          Image
        </button>
      </div>
      
      {showLinkInput && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button 
            onClick={addLink}
            className="px-3 py-2 bg-blue-500 text-white rounded"
            type="button"
          >
            Add Link
          </button>
        </div>
      )}
      
      {showImageInput && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button 
            onClick={addImage}
            className="px-3 py-2 bg-blue-500 text-white rounded"
            type="button"
          >
            Add Image
          </button>
        </div>
      )}
      
      <div className="tiptap-editor">
        <EditorContent editor={editor} className="tiptap-content" />
      </div>
    </div>
  );
}
