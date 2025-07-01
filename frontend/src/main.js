import "./style.css";
import "./app.css";

import "./components/content";
import "./components/list";

import { EventsOn, EventsEmit, LogInfo } from "../wailsjs/runtime/runtime";
import { LoadComponentsFromApi, GetTokens, GetComponentById } from "../wailsjs/go/main/App";
import { tryCatch, assert } from "./try_catch";

function init() {
  const generate_btn = document.querySelector(".generate");
  generate_btn?.addEventListener("click", getComponents);

  window.addEventListener("load-component", async (e) => {
    const content = document.querySelector("fg-content");
    const [_, code] = await tryCatch(await GetComponentById(e.detail));
    assert(!code, "Get component CSS and HTML failed");

    const [css, html] = code;
    content.cssCode = css.trim(); // TODO: run biome or prettier on code
    content.htmlCode = html.trim(); // TODO: run biome or prettier on code

    // Show css of component selected
    content.querySelector("#tab2")?.click();
  });
}

async function getComponents() {
  const page = document.querySelector('input[name="page"]');
  const token = document.querySelector('input[name="token"]');
  const prefix = document.querySelector('input[name="prefix"]');
  const tokensStyle = document.getElementById("tokens");
  const list = document.querySelector("fg-list");
  const content = document.querySelector("fg-content");

  const [e, components] = await tryCatch(
    await LoadComponentsFromApi({
      page: page?.value,
      token: token?.value,
      prefix: prefix?.value,
    }),
  );
  assert(e, "Get components API call failed");

  const [err, tokens] = await tryCatch(await GetTokens());
  assert(err, "Get Tokens failed");

  tokensStyle.innerHTML = tokens;
  content.tokensCode = tokens.trim();

  // Render sidebar list of components
  list.load(components);
}

init();
