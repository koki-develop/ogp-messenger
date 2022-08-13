import React, { memo, useMemo } from "react";
import { buildOgpImageUrl } from "~/lib/ogp";

export type OgpPreviewProps = {
  text: string;
};

const OgpPreview: React.FC<OgpPreviewProps> = memo((props) => {
  const { text } = props;

  const imageSrc = useMemo(() => {
    return buildOgpImageUrl(text);
  }, [text]);

  if (imageSrc == null) {
    return null;
  }

  return <img className="w-full" src={imageSrc} alt={text} />;
});

OgpPreview.displayName = "OgpPreview";

export default OgpPreview;
