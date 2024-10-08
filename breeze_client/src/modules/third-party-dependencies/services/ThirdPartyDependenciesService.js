export const fetchDependencySuggestions = async (query) => {
  const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}&size=10`);
  const data = await response.json();
  return data.objects.map((obj) => ({
    name: obj.package.name,
    version: obj.package.version,
  }));
};

export const fetchDependencyVersions = async (packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = await response.json();
  return Object.keys(data.versions);
};
