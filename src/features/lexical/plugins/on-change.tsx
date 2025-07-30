import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useSyncExternalStore } from "react";

type OnChangePluginProps = {
  onChange: (editorState: EditorState) => void;
};

export const OnChangePlugin = ({ onChange }: OnChangePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useSyncExternalStore(
    (onStoreChange) => {
      return editor.registerUpdateListener(({ editorState }) => {
        onStoreChange();
        onChange(editorState);
      });
    },
    () => editor.getEditorState(),
    () => editor.getEditorState(),
  );

  return null;
};
