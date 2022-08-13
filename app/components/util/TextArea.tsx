import classNames from "classnames";
import React, { memo } from "react";

export type TextAreaProps = React.HTMLProps<HTMLTextAreaElement>;

const TextArea: React.FC<TextAreaProps> = memo((props) => {
  const { className, ...textAreaProps } = props;

  return (
    <textarea
      rows={3}
      placeholder="テキスト"
      className={classNames(
        "w-full resize-none rounded border p-2 shadow outline-none",
        className
      )}
      {...textAreaProps}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
