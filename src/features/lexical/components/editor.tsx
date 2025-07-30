import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";

import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState, EditorThemeClasses } from "lexical";
import { Toolbar } from "./toolbar";

type EditorValue = string;

export const initialEditorValue: EditorValue = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
        textFormat: 0,
        textStyle: "",
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const theme: EditorThemeClasses = {
  root: "outline-none p-12",
};

const onError = (error: Error) => {
  console.error("Editor error:", error);
};

type EditorProps = {
  className?: string;
  value: EditorValue;
  onChange: (editorValue: EditorValue) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
  const initialConfig: InitialConfigType = {
    namespace: "Editor",
    theme,
    onError,
    editorState: value,
    nodes: [ListNode, ListItemNode, LinkNode],
  };

  const handleChange = (editorState: EditorState) => {
    onChange(JSON.stringify(editorState.toJSON()));
    console.log("Editor state changed:", editorState.toJSON());
  };

  return (
    <div>
      <Toolbar />
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder="텍스트를 입력해주세요."
              placeholder={
                <span className="text-placeholder pointer-events-none absolute top-24 left-12">
                  텍스트를 입력해주세요.
                </span>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={handleChange} />
        <LinkPlugin />
        <ListPlugin />
      </LexicalComposer>
    </div>
  );
};
