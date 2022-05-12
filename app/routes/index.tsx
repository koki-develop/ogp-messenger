import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");

  return json({ text });
};

const Index = () => {
  const { text } = useLoaderData<{ text: string | null }>();

  return <div>text: {JSON.stringify(text)}</div>;
};

export default Index;
