import EditorTheme from "../../themes/editorTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "../../components/editorPlugins/ToolbarPlugin";
import AutoLinkPlugin from "../../components/editorPlugins/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "../../components/editorPlugins/ListMaxIndentLevelPlugin";
import EditorPlaceholder from "../../components/editorPlugins/EditorPlaceHolder";
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface Props {
  restaurant: string;
}

export const editorConfig = {
  namespace: "namespace",
  theme: EditorTheme,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
  onError(error: Error) {
    console.log(error);
  },
};

export default function EditorContainer({ restaurant }: Props) {
  return (
    <div className="editor-container">
      <ToolbarPlugin />
      <div className="editor-inner">
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className="markdown-body" />}
          placeholder={<EditorPlaceholder restaurant={restaurant} />}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListMaxIndentLevelPlugin maxDepth={1} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
      <Temp />
    </div>
  );
}

function Temp() {
  const [editor] = useLexicalComposerContext();

  const handleClick = () => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor, null);
      console.log(html);
    });
  };

  return (
    <div>
      <button onClick={handleClick}>logger</button>
    </div>
  );
}
