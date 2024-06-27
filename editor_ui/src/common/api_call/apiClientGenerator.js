import Blocker from "../../services/LoaderService";
export async function callApiClientGenerator(
  url,
  method,
  payload,
  isFormData,
  options = {}
) {
  const { headers = {}, ...otherOptions } = options;
  const loader = new Blocker("Loading...");

  try {
    const requestOptions = {
      method: method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }), // Set for JSON only
        ...headers,
      },
      ...(isFormData
        ? { body: payload }
        : payload && { body: JSON.stringify(payload) }),
      ...otherOptions,
    };
    loader.show();

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
  } finally {
    loader.hide();
  }
}
