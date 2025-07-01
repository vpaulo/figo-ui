import { EditorView, basicSetup } from "codemirror";

class ListComponent extends HTMLElement {
  load(components = {}) {
    let items = "";
    for (const [id, cmp] of Object.entries(components)) {
      items += `<div class="item" data-id="${id}">${cmp.Name}</div>`;
    }

    this.insertAdjacentHTML("beforeend", items);
  }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      if (e.target.dataset.id) {
        const event = new CustomEvent("load-component", { bubbles: true, detail: e.target.dataset.id });
        this.dispatchEvent(event);
      }
    });
  }
}
customElements.define("fg-list", ListComponent);
