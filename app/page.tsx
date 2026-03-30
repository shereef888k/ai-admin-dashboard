import { redirect } from "next/navigation";

export default function HomePage() {
    console.log("Loading home page...");

  redirect("/dashboard");
}