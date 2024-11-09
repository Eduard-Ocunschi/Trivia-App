const formatQueryParams = (paramsObj) =>
  `? ${Object.keys(paramsObj)
    .map((key) => `${key}=${paramsObj[key]}`)
    .join("&")}`;

export const getQueryParams = (paramsStr) => {
  const p = new URLSearchParams(paramsStr);
  const params = {};
  p.forEach((value, key) => {
    if (value === "Any" || key === "name") return;
    params[key] = value;
  });
  return formatQueryParams(params);
};

// Fisher Yates Shuffle Algorithm
export const fisherYatesShuffle = (array) => {
  const newArray = Array.from(array);
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = k;
  }

  return newArray;
};
