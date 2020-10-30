export const makeId = length => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getParsedJSON = json => {
  return JSON.parse(json);
};

export const generateTreeData = element => {
  let data = "";
  const keys = Object.keys(element);
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    data += `{ "title": "${key}",`;
    if (element[key].text) {
      data += `"value": "${element[key].text}" }${
        i !== keys.length - 1 ? "," : ""
      }`;
    } else {
      data += `"disabled": true, "children" : [${generateTreeData(
        element[key]
      )}] }${i !== keys.length - 1 ? "," : ""}`;
    }
  }
  return data;
};

export const getTreeData = json => {
  const parsedJSON = getParsedJSON(json);
  const treeDataString = generateTreeData(parsedJSON);
  return JSON.parse("[" + treeDataString + "]");
};

export const splitTextByFields = string =>
  string.split(/({{.*?}}|_.*?_|\*.*?\*)/);

export const getFieldsFromString = string => {
  return string.match(/\{{.*?\}}/g).map(x => x.replace(/[{{}}]/g, ""));
};

export const getOptionsBetweenBrackets = (string, references) => {
  const matchedString = string.match(/\[.*?\]/g);
  if (matchedString.length) {
    const referencesString = (matchedString[0] || "").match(/\{.*?\}/g);
    if (referencesString && referencesString.length) {
      const key = (referencesString[0] || "").replace(/[{}]/g, "");
      const optionsArr = references[key]
        ? Object.entries(references["xplan-products"]).map(reference => ({
            key: reference[0],
            value: reference[1],
          }))
        : [];
      return { optionsArr, key };
    }
  }
  const key = string.split(".")[1].split(":")[0];
  // const optionsArr = matchedString.map(x => x.replace(/[[\]]/g, ""))[0].split(',').map(x => x.replace(/[_]/g, " "));
  const options = matchedString
    .map(x => x.replace(/[[\]]/g, ""))[0]
    .split(",")
    .map(s => s.split(":"));
  const optionsArr = options.map(o => ({ key: o[0], value: o[1] }));
  return { optionsArr, key };
};

export const getPathFromString = string => {
  return string.match(/%.*?%/g).map(x => x.replace(/[%]/g, ""))[0];
};

export const getPlaceholderFromText = string => {
  return string
    .match(/\{{.*?\}}/g)
    .map(x => x.replace(/[{{}}]/g, ""))[0]
    .split(":")[1];
};

export const getKeyFromText = string => {
  return string
    .match(/\{{.*?\}}/g)
    .map(x => x.replace(/[{{}}]/g, ""))[0]
    .split(".")[1]
    .split(":")[0];
};

export const doesPartnerExist = partner => {
  return partner.firstName !== "";
};

// Same as above (Just made another to avoid confusing names and future extension)
export const doesClientExist = client => {
  return client.firstName !== "";
};

export const formatMoney = number => {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

export const formatCurrencyIfCurrency = text => {
  console.log("TEXT", text);
  if (text && text.trim() !== "") {
    let stripped = text.replace(/\s/g, "").replace(/[,$]/g, "");
    let isNum = /^-?\d*(\.\d+)?$/.test(stripped);
    console.log("TEXT", stripped, isNum);

    if (isNum && stripped !== "") {
      return formatMoney(parseFloat(stripped));
    } else {
      return text;
    }
  }
  return text;
};
