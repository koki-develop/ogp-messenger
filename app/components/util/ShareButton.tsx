import classNames from "classnames";
import React, { memo, useMemo } from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

export type ShareButtonProps = {
  sns: "twitter" | "facebook";
  url: string;
};

const ShareButton: React.FC<ShareButtonProps> = memo((props) => {
  const { sns, url } = props;

  const [icon, href] = useMemo(() => {
    const encoded = encodeURIComponent(url);

    switch (sns) {
      case "twitter":
        return [FaTwitter, `https://twitter.com/share?url=${encoded}`];
      case "facebook":
        return [FaFacebook, `https://www.facebook.com/share.php?u=${encoded}`];
    }
  }, [sns, url]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={classNames(
        "mr-2 mb-2 inline-block rounded border py-2 px-4 font-semibold text-white shadow transition",
        {
          "border-twitter-main bg-twitter-main hover:bg-twitter-dark":
            sns === "twitter",
        },
        {
          "border-facebook-main bg-facebook-main hover:bg-facebook-dark":
            sns === "facebook",
        }
      )}
    >
      <span className="flex items-center">
        {React.createElement(icon, { className: "mr-2 text-lg" })}
        Twitter
      </span>
    </a>
  );
});

ShareButton.displayName = "ShareButton";

export default ShareButton;
