import { json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import React, { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCheck, FaFacebook, FaRegCopy, FaTwitter } from "react-icons/fa";
import { buildOgpImageUrl } from "~/lib/ogp";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = ({ data }) => {
  const { url, text } = data;

  const siteName = "OGP Messenger";

  const description = "OGP 画像でメッセージを発信できるツール";

  const imageUrl = buildOgpImageUrl(text);

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
  const [imageUrl, setImageUrl] = useState<string | null>(
    buildOgpImageUrl(defaultText)
  );
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
    const trimmedText = text.trim();
    if (trimmedText === "") {
      setImageUrl(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setImageUrl(buildOgpImageUrl(trimmedText));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

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
    <div className="relative min-h-screen pb-24">
      {/* ヘッダー */}
      <div className="mb-4 flex justify-center border-b-2 border-gray-100 bg-white py-2 px-6">
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

      {/* メイン */}
      <div className="flex justify-center px-6">
        <div className="flex w-full flex-col sm:w-10/12">
          <div className="mb-2">
            <textarea
              rows={3}
              className="w-full resize-none rounded border p-2 shadow outline-none"
              placeholder="テキスト"
              value={text}
              onChange={handleChangeText}
            />
          </div>
          {imageUrl && (
            <>
              <div className="mb-2">
                <a
                  href={`https://twitter.com/share?url=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mr-2 mb-2 inline-block rounded border border-twitter-main bg-twitter-main py-2 px-4 font-semibold text-white shadow transition hover:bg-twitter-dark"
                >
                  <span className="flex items-center">
                    <FaTwitter className="mr-2 text-lg" />
                    Twitter
                  </span>
                </a>
                <a
                  href={`https://www.facebook.com/share.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mr-2 mb-2 inline-block rounded border border-facebook-main bg-facebook-main py-2 px-4 font-semibold text-white shadow transition hover:bg-facebook-dark"
                >
                  <span className="flex items-center">
                    <FaFacebook className="mr-2 text-lg" />
                    Facebook
                  </span>
                </a>
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
              <div>
                <img className="w-full" src={imageUrl} alt={text} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
