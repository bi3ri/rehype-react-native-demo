import { StyleSheet, Text, View } from "react-native";
import React, { Fragment, createElement } from "react";
import * as dev from "react/jsx-dev-runtime";
import * as prod from "react/jsx-runtime";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeReact from "rehype-react";

/** @type {{Fragment: Fragment, jsxDEV: JsxDev}} */
// @ts-expect-error: the react types are missing.
const development = { Fragment: dev.Fragment, jsxDEV: dev.jsxDEV };

const production = {
  createElement: React.createElement,
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
};

const components = {
  // this works
  h1: "h2",
  // this does not work
  h2: (props) => {
    const { node } = props;
    return <Text>{node.value}</Text>;
  },
};

export const useRemarkSync = (source = {}) =>
  unified()
    .use(remarkParse)
    .use(remarkToRehype)
    .use(rehypeReact, { ...production, components })
    .processSync(source);

export default function App() {
  const content = useRemarkSync("# Hello World");
  console.log(content);

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
