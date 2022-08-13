import React, { memo, useEffect, useState } from "react";
import { buildOgpImageUrl } from "~/lib/ogp";

export type OgpPreviewProps = {
  text: string;
};

const OgpPreview: React.FC<OgpPreviewProps> = memo((props) => {
  const { text } = props;

  const [imageSrc, setImageSrc] = useState<string | null>(
    buildOgpImageUrl(text)
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImageSrc(buildOgpImageUrl(text));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  if (imageSrc == null) {
    return null;
  }

  return <img className="w-full" src={imageSrc} alt={text} />;
});

OgpPreview.displayName = "OgpPreview";

export default OgpPreview;
