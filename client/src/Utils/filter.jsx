export function filterData(data, criteria) {
  return data.filter(item => {
    return Object.keys(criteria).every(key => {
      if (!criteria[key]) return true; // Skip empty criteria
      if (Array.isArray(criteria[key])) {
        return criteria[key].includes(item[key]);
      }
      return item[key] === criteria[key];
    });
  });
}