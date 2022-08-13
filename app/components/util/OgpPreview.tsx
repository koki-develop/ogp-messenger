import React, { memo, useEffect, useMemo, useState } from "react";
import { buildOgpImageUrl } from "~/lib/ogp";

export type OgpPreviewProps = {
  text: string;
};

const OgpPreview: React.FC<OgpPreviewProps> = memo((props) => {
  const { text } = props;

  const trimmedText = useMemo(() => {
    return text.trim();
  }, [text]);

  const [imageSrc, setImageSrc] = useState<string | null>(
    buildOgpImageUrl(trimmedText)
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImageSrc(buildOgpImageUrl(trimmedText));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [trimmedText]);

  if (trimmedText === "") {
    return null;
  }

  if (imageSrc == null) {
    return null;
  }

  return <img className="w-full" src={imageSrc} alt={trimmedText} />;
});

OgpPreview.displayName = "OgpPreview";

export default OgpPreview;
