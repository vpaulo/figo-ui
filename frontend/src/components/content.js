import { EditorView, basicSetup } from "codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { assert } from "../try_catch";

class ContentComponent extends HTMLElement {
  tokensView;
  cssView;
  htmlView;
  #preview;

  set tokensCode(value) {
    this.tokensView.dispatch({
      changes: { from: 0, to: this.tokensView.state.doc.length, insert: value },
    });
  }
  set cssCode(value) {
    this.cssView.dispatch({
      changes: { from: 0, to: this.cssView.state.doc.length, insert: value },
    });
  }
  set htmlCode(value) {
    this.htmlView.dispatch({
      changes: { from: 0, to: this.htmlView.state.doc.length, insert: value },
    });
  }

  set preview(value) {
    this.#preview.innerHTML = `<style>${value[0]}</style>${value[1]}`;
  }

  connectedCallback() {
    this.#preview = document.getElementById("preview");
    assert(!this.#preview, "preview element not found");

    this.tokensView = new EditorView({
      parent: document.getElementById("tokens-source"),
      extensions: [basicSetup, css()],
    });

    this.cssView = new EditorView({
      parent: document.getElementById("css-source"),
      extensions: [basicSetup, css()],
    });

    this.htmlView = new EditorView({
      parent: document.getElementById("html-source"),
      extensions: [basicSetup, html()],
    });
  }
}
customElements.define("fg-content", ContentComponent);
