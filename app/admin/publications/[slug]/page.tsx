"use client";

import { useParams } from "next/navigation";
import { PublicationForm } from "./components/publication-form";
import { usePublication } from "@/hooks/use-publications";

export default function PublicationPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: publication, isLoading } = usePublication(
		slug === "new" ? null : slug,
	);

	const title = slug === "new" ? "Create publication" : "Edit publication";
	const description =
		slug === "new" ? "Add a new publication" : "Edit an existing publication";

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<PublicationForm initialData={publication} isLoading={isLoading} />
			</div>
		</div>
	);
}
