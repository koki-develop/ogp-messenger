import { json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import Layout from "~/components/Layout/Layout";
import OgpPreview from "~/components/util/OgpPreview";
import ShareButton from "~/components/util/ShareButton";
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

  const [showCopied, setShowCopied] = useState<boolean>(false);

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

  const handleCopyLink = useCallback(() => {
    setShowCopied(true);
  }, []);

  useEffect(() => {
    if (!showCopied) return;
    const timeoutId = setTimeout(() => {
      setShowCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showCopied]);

  return (
    <Layout>
      {/* メイン */}
      <div className="mb-2">
        <textarea
          rows={3}
          className="w-full resize-none rounded border p-2 shadow outline-none"
          placeholder="テキスト"
          value={text}
          onChange={handleChangeText}
        />
      </div>
      {trimmedText !== "" && (
        <div className="mb-2">
          <ShareButton sns="twitter" url={currentUrl} />
          <ShareButton sns="facebook" url={currentUrl} />

          <CopyToClipboard text={currentUrl} onCopy={handleCopyLink}>
            <button className="mb-2 rounded border bg-white py-2 px-4 shadow transition hover:bg-gray-200">
              <span className="flex items-center">
                {showCopied ? (
                  <>
                    <FaCheck className="mr-2 text-lg text-green-500" />
                    コピーしました
                  </>
                ) : (
                  <>
                    <FaRegCopy className="mr-2 text-lg" />
                    リンクをコピー
                  </>
                )}
              </span>
            </button>
          </CopyToClipboard>
        </div>
      )}
      <div>
        <OgpPreview text={trimmedText} />
      </div>
    </Layout>
  );
};

export default Index;
