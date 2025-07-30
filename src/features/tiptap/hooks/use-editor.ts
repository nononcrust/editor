import { useState } from "react";
import { EditorValue, initialEditorValue } from "../components/editor";

export const useEditor = (initialValue = initialEditorValue) => {
  const [value, setValue] = useState<EditorValue>(initialValue);

  const onChange = (value: EditorValue) => {
    setValue(value);
  };

  return {
    value,
    onChange,
  };
};
