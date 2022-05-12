import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

const cloudinaryConfig = {
  cloudName: "koki-develop",
  cardId: "OGP Messenger/card",
  fontId: "Sawarabi Gothic",
};

const buildOgpImageUrl = (text: string | null): string | null => {
  if (!text) return null;
  const trimmedText = text.trim();
  if (trimmedText === "") return null;

  const { cloudName, cardId, fontId } = cloudinaryConfig;
  return `https://res.cloudinary.com/${encodeURIComponent(
    cloudName
  )}/image/upload/c_fit,w_1000,h_480,l_text:${encodeURIComponent(
    fontId
  )}_56:${encodeURIComponent(
    encodeURIComponent(trimmedText)
  )}/fl_layer_apply/v1/${encodeURIComponent(cardId)}`;
};

export const meta: MetaFunction = ({ data }) => {
  const { url, text } = data;

  const siteName = "OGP Messenger";

  const baseTitle = "OGP Messenger";
  const title = (() => {
    if (!text) return baseTitle;
    const trimmedText = text.trim();
    if (trimmedText === "") return baseTitle;
    return `${text} | ${baseTitle}`;
  })();

  const description = "OGP 画像でメッセージを発信できるツール";

  const imageUrl = buildOgpImageUrl(text);

  return {
    title,
    "og:title": title,

    description,
    "og:description": description,

    "og:site_name": siteName,
    "og:type": "website",
    "og:locale": "ja_JP",
    "og:url": url,

    "twitter:card": "summary_large_image",
    "twitter:site": "@koki_develop",
    "og:image": imageUrl,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");

  return json({ text });
};

const Index = () => {
  const { text } = useLoaderData<{ text: string | null }>();

  return (
    <div className="relative min-h-screen pb-24">
      <div className="bg-white border-b-2 border-gray-100 mb-4 flex justify-center py-2 px-6">
        <div className="flex w-full sm:w-10/12">
          <img
            className="mr-1"
            src="/logo64.png"
            alt="Logo"
            height={24}
            width={24}
          />
          <h1 className="font-bold" style={{ fontFamily: '"Sawarabi Gothic"' }}>
            OGP Messenger
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
