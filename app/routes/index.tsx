import { json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import React, { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCheck, FaFacebook, FaRegCopy, FaTwitter } from "react-icons/fa";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

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

  return json({ currentUrl: url.href, text });
};

const Index = () => {
  const { currentUrl, text: defaultText } = useLoaderData<{
    currentUrl: string;
    text: string | null;
  }>();

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

      {/* メイン */}
      <div className="flex justify-center px-6">
        <div className="flex flex-col w-full sm:w-10/12">
          <div className="mb-2">
            <textarea
              rows={3}
              className="w-full resize-none shadow rounded border p-2 outline-none"
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
                  className="transition inline-block bg-twitter-main py-2 px-4 hover:bg-twitter-dark text-white font-semibold rounded shadow mr-2 mb-2 border border-twitter-main"
                >
                  <span className="flex items-center">
                    <FaTwitter className="text-lg mr-2" />
                    Twitter
                  </span>
                </a>
                <a
                  href={`https://www.facebook.com/share.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition inline-block bg-facebook-main py-2 px-4 hover:bg-facebook-dark text-white font-semibold rounded shadow mr-2 mb-2 border border-facebook-main"
                >
                  <span className="flex items-center">
                    <FaFacebook className="text-lg mr-2" />
                    Facebook
                  </span>
                </a>
                <CopyToClipboard text={currentUrl} onCopy={handleCopyLink}>
                  <button className="transition py-2 px-4 mb-2 shadow border rounded bg-white hover:bg-gray-200">
                    <span className="flex items-center">
                      {showCopied ? (
                        <>
                          <FaCheck className="text-lg text-green-500 mr-2" />
                          コピーしました
                        </>
                      ) : (
                        <>
                          <FaRegCopy className="text-lg mr-2" />
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
