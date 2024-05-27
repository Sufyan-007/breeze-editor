export async function handleServiceData(data) {
  const response = await (
    await fetch(
      "http://127.0.0.1:8000/api-client-generator/modified-intermediate-json/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
  ).json();
  return response;
}
