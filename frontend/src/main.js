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
    assert(!content, "fg-content element not found");
    const [_, code] = await tryCatch(await GetComponentById(e.detail));
    assert(!code && !Array.isArray(code), "Get component CSS and HTML failed");
    assert(code.length !== 2, "Code returned is not valid");

    const [css, html] = code;
    content.cssCode = css.trim(); // TODO: run biome or prettier on code
    content.htmlCode = html.trim(); // TODO: run biome or prettier on code
    content.preview = code;

    // Show css of component selected
    const tab = content.querySelector("#tab2");
    assert(!tab, "tab element not found");
    content.querySelector("#tab2").click();
  });
}

async function getComponents() {
  const page = document.querySelector('input[name="page"]');
  const token = document.querySelector('input[name="token"]');
  const prefix = document.querySelector('input[name="prefix"]');
  const tokensStyle = document.getElementById("tokens");
  const list = document.querySelector("fg-list");
  const content = document.querySelector("fg-content");
  assert(!page, "page input not found");
  assert(!token, "token input not found");
  assert(!prefix, "prefix input not found");
  assert(!tokensStyle, "tokens style element not found");
  assert(!list, "fg-list element not found");
  assert(!content, "fg-content element not found");

  // TODO: verify if errors returned from BE are verified
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
