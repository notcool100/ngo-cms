"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill"), {
	ssr: false,
	loading: () => (
		<div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
	),
});

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }],
		[{ align: [] }],
		["link", "image"],
		["clean"],
	],
};

const formats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"list",
	"bullet",
	"indent",
	"align",
	"link",
	"image",
];

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export default function RichTextEditor({
	value,
	onChange,
}: RichTextEditorProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>;
	}

	return (
		<div className="rich-text-editor">
			<QuillEditor
				value={value}
				onChange={onChange}
				modules={modules}
				formats={formats}
				theme="snow"
				className="min-h-[200px]"
			/>
		</div>
	);
}
