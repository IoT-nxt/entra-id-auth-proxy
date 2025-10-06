const AUTHORIZE_ENDPOINT = "https://login.microsoftonline.com/6db74f68-14c6-4b49-b3cc-a23ad983b6dd/oauth2/v2.0/authorize";
const TOKEN_ENDPOINT = "https://login.microsoftonline.com/6db74f68-14c6-4b49-b3cc-a23ad983b6dd/oauth2/v2.0/token";

const REDIRECT_STATUS = 302;
const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

export default {
  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/authorize":
        return handleAuthorize(url);
      case "/token":
        return handleToken(request, url);
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
};

function handleAuthorize(requestUrl) {
  const targetUrl = new URL(AUTHORIZE_ENDPOINT);
  if (requestUrl.search) {
    targetUrl.search = requestUrl.search;
  }

  return Response.redirect(targetUrl.toString(), REDIRECT_STATUS);
}

async function handleToken(request, requestUrl) {
  const targetUrl = new URL(TOKEN_ENDPOINT);
  if (requestUrl.search) {
    targetUrl.search = requestUrl.search;
  }

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (!BODYLESS_METHODS.has(request.method.toUpperCase())) {
    init.body = request.body;
  }

  return fetch(targetUrl.toString(), init);
}
