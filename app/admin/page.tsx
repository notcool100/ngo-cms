import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/admin/dashboard");
	} else {
		redirect("/admin/login");
	}
}
