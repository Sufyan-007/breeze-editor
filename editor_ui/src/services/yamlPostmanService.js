export async function fetchYamlApis(formData, appName) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api-client-generator/convert-starndard-json/openapi/${appName}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch YAML APIs");
    }
  } catch (error) {
    throw new Error("Failed to fetch YAML APIs: " + error.message);
  }
}
export async function fetchPostmanApis(formData, appName) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api-client-generator/convert-starndard-json/postman/${appName}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch Postman APIs");
    }
  } catch (error) {
    throw new Error("Failed to fetch Postman APIs: " + error.message);
  }
}
