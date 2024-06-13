export async function handleServiceData(data) {
  const response = await (
    await fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/api-client-generator/modified-intermediate-json/`,
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
