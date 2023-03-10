export function getStringifiedDate() {
  let currentDate = new Date();
  let dd = String(currentDate.getDate()).padStart(2, "0");
  let mm = String(currentDate.getMonth() + 1).padStart(2, "0");
  let yyyy = currentDate.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function stringifyDate() {
  let currentDate = new Date();
  let dd = String(currentDate.getDate()).padStart(2, "0");
  let mm = String(currentDate.getMonth() + 1).padStart(2, "0");
  let yyyy = currentDate.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function getStringifiedTime(plusHH = 0, plusMM = 0) {
  let currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + plusHH * 60 + plusMM);
  let hh = String(currentDate.getHours()).padStart(2, "0");
  let mm = String(currentDate.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function purgeDate(date, del = "-", format = "yyyy-mm-dd") {
  let theDate = new Date(date);
  let dd = String(theDate.getDate()).padStart(2, "0");
  let mm = String(theDate.getMonth() + 1).padStart(2, "0");
  let yyyy = theDate.getFullYear();
  if (format === "dd-mm-yyyy")
  {
    return `${dd}${del}${mm}${del}${yyyy}`;
  }
  else if (format === "dd-mm"){
    return `${dd}${del}${mm}`;
  }
  else {
    return `${yyyy}${del}${mm}${del}${dd}`;
  }
}

export function purgeTime(date, del = ":") {
  let theDate = new Date(date);
  let hh = String(theDate.getHours()).padStart(2, "0");
  let mm = String(theDate.getMinutes()).padStart(2, "0");
  return `${hh}${del}${mm}`;
}