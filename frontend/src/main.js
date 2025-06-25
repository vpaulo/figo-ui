import "./style.css";
import "./app.css";

import { EventsOn, EventsEmit, LogInfo } from "../wailsjs/runtime/runtime";
import { Greet, LoadComponentsFromApi, GetTokens } from "../wailsjs/go/main/App";
import { tryCatch, assert } from "./try_catch";

function init() {
  const generate_btn = document.querySelector(".generate");
  generate_btn?.addEventListener("click", getComponents);
}

async function getComponents() {
  const page = document.querySelector('input[name="page"]');
  const token = document.querySelector('input[name="token"]');
  const prefix = document.querySelector('input[name="prefix"]');

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

  console.log(">>>> CALLING: ", e, components, tokens);
}

init();
