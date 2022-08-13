import React, { memo, useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCheck, FaRegCopy } from "react-icons/fa";

export type CopyButtonProps = {
  text: string;
};

const CopyButton: React.FC<CopyButtonProps> = memo((props) => {
  const { text } = props;

  const [showCopied, setShowCopied] = useState<boolean>(false);

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
    <CopyToClipboard text={text} onCopy={handleCopyLink}>
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
  );
});

CopyButton.displayName = "CopyButton";

export default CopyButton;
