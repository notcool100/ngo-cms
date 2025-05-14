"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "@/components/ui/toggle";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Heading2,
	Undo,
	Redo,
} from "lucide-react";

const extensions = [
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false,
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false,
		},
	}),
];

type EditorProps = {
	value: string;
	onChange: (value: string) => void;
};

const MenuBar = ({ editor }: { editor: any }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="border border-input bg-transparent rounded-t-md">
			<div className="flex items-center gap-1 p-1">
				<Toggle
					size="sm"
					pressed={editor.isActive("bold")}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
				>
					<Bold className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("italic")}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
				>
					<Italic className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("heading")}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					<Heading2 className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("bulletList")}
					onPressedChange={() =>
						editor.chain().focus().toggleBulletList().run()
					}
				>
					<List className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("orderedList")}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<ListOrdered className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					onPressedChange={() => editor.chain().focus().undo().run()}
				>
					<Undo className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					onPressedChange={() => editor.chain().focus().redo().run()}
				>
					<Redo className="h-4 w-4" />
				</Toggle>
			</div>
		</div>
	);
};

export function Editor({ value, onChange }: EditorProps) {
	const editor = useEditor({
		extensions,
		content: value,
		editorProps: {
			attributes: {
				class:
					"min-h-[150px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
			},
		},
		onUpdate({ editor }) {
			onChange(editor.getHTML());
		},
	});

	return (
		<div className="w-full">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}
