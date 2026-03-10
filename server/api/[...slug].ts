export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const targetPath = event.path.replace(/^\/api/, "");

  // if (targetPath.includes("user-details")) {
  //   return cachedEventHandler(event);
  // }

  const query = getQuery(event);
  const headers: Record<string, string> = {};

  const authHeader =
    event.headers.get("authorization") || event.headers.get("Authorization");
  if (authHeader) {
    headers.Authorization = authHeader.startsWith("Bearer ")
      ? authHeader
      : `Bearer ${authHeader}`;
  }

  const forwardHeaders = ["user-agent", "accept-language"];
  for (const headerName of forwardHeaders) {
    const value = event.headers.get(headerName);
    if (value) {
      headers[headerName] = value;
    }
  }

  try {
    // 1. Get the content type from the incoming request
    const contentType = event.headers.get("content-type") || "";

    // 2. Determine if we should pass the body through raw (for images/formdata)
    const isMultipart = contentType.includes("multipart/form-data");

    const response = await $fetch(targetPath, {
      baseURL: config.public.apiBase,
      method: event.method,
      query: query,
      // FIX: If it's multipart, use readRawBody to keep the binary/boundary intact
      body:
        event.method !== "GET" && event.method !== "HEAD"
          ? isMultipart
            ? await readRawBody(event, false)
            : await readBody(event)
          : undefined,
      headers: {
        ...headers,
        // 3. Crucial: Forward the original Content-Type including the boundary
        "content-type": contentType,
      },
    });

    return response;
  } catch (error: any) {
    console.error("Proxy error:", {
      status: error.response?.status,
      data: error.response?._data,
      path: targetPath,
    });

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?._data?.message || "External API Error",
      data: error.response?._data,
    });
  }
});

const cachedEventHandler = defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const targetPath = event.path.replace(/^\/api/, "");
  const query = getQuery(event);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const authHeader =
    event.headers.get("authorization") || event.headers.get("Authorization");

  if (authHeader) {
    headers.Authorization = authHeader.startsWith("Bearer ")
      ? authHeader
      : `Bearer ${authHeader}`;
  }

  const forwardHeaders = ["user-agent", "accept-language"];
  for (const headerName of forwardHeaders) {
    const value = event.headers.get(headerName);
    if (value) headers[headerName] = value;
  }

  try {
    const response = await $fetch(targetPath, {
      baseURL: config.public.apiBase,
      method: event.method,
      query,
      body:
        event.method !== "GET" && event.method !== "HEAD"
          ? await readBody(event).catch(() => ({}))
          : undefined,
      headers,
    });

    return response;
  } catch (error: any) {
    // throw createError({
    //   statusCode: error.response?.status || 500,
    //   statusMessage: error.response?._data?.message || "External API Error",
    //   data: error.response?._data,
    // });
    console.error(error);
  }
});
