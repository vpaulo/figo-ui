class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

export function assert(condition, message) {
  if (condition) throw new AssertionError(message);
}

function processError(rawError, operationName) {
  const error = rawError instanceof Error ? rawError : Error(String(rawError));

  if (operationName) {
    error.message = `Operation "${operationName}" failed: ${error.message}`;
  }
  return [error];
}

export async function tryCatch(promise, operationName) {
  try {
    const data = await promise;
    return [null, data];
  } catch (rawError) {
    return processError(rawError, operationName);
  }
}

export function tryCatchSync(fn, operationName) {
  if (typeof fn !== "function") {
    const msg = "First parameter is not a function";
    return [Error(operationName ? `Operation "${operationName}" failed: ${msg}` : msg)];
  }
  try {
    return [null, fn()];
  } catch (rawError) {
    return processError(rawError, operationName);
  }
}
