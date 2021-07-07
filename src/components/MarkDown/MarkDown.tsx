import React, { useEffect, useState } from "react";

import DOMPurify from "dompurify";
import marked from "marked";
import hljs from "highlight.js";

import styles from "./MarkDown.module.scss";

const renderer = new marked.Renderer();
renderer.codespan = code => {
  return `<code class="${styles.codeSpan}">${code}</code>`;
}

marked.setOptions({
  renderer,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-"
});

const MarkDown = ({ content }: { content: string }) => {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    const parsedContent = marked(content);
    const sanitizedContent = DOMPurify.sanitize(parsedContent);
    setSanitizedContent(sanitizedContent);
  }, [content]);

  return <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>;
}

export default MarkDown;
