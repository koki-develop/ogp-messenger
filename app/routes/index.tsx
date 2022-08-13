import { json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import Layout from "~/components/Layout/Layout";
import CopyButton from "~/components/util/CopyButton";
import OgpPreview from "~/components/util/OgpPreview";
import ShareButton from "~/components/util/ShareButton";
import TextArea from "~/components/util/TextArea";
import { buildOgpImageUrl } from "~/lib/ogp";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = ({ data }) => {
  const { url, text } = data;

  const siteName = "OGP Messenger";

  const description = "OGP 画像でメッセージを発信できるツール";

  const imageUrl = text && buildOgpImageUrl(text);

  return {
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

type LoaderData = {
  currentUrl: string;
  text: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");

  return json<LoaderData>({ currentUrl: url.href, text });
};

const Index = () => {
  const { currentUrl, text: defaultText } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const [text, setText] = useState<string>(defaultText ?? "");
  const trimmedText = useMemo(() => {
    return text.trim();
  }, [text]);

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.currentTarget.value
        .replace(/\r?\n*/g, "")
        .substring(0, 255);
      setText(text);

      const trimmedText = text.trim();
      if (trimmedText === "") {
        navigate({ search: "" }, { replace: true });
      } else {
        navigate(
          { search: `text=${encodeURIComponent(text)}` },
          { replace: true }
        );
      }
    },
    [navigate]
  );

  return (
    <Layout>
      <div className="mb-2">
        <TextArea value={text} onChange={handleChangeText} />
      </div>
      {trimmedText !== "" && (
        <div className="mb-2">
          <ShareButton sns="twitter" url={currentUrl} />
          <ShareButton sns="facebook" url={currentUrl} />
          <CopyButton text={currentUrl} />
        </div>
      )}
      <div>
        <OgpPreview text={trimmedText} />
      </div>
    </Layout>
  );
};

export default Index;
