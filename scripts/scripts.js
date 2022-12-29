import { insert, select } from "./db-config/db-functions.js";
import { db } from "./db-config/db-config.js";
import { ref, set, push, get, onValue, equalTo, orderByChild, query, child } from "./firebase/firebase-database.js";
import * as CommonServices from "./common-services.js";

class Cluster {
  constructor(_number, _superclusterNumber) {
    (this.number = _number), (this.superclusterNumber = _superclusterNumber);
  }
}

class Class {
  constructor(_clusterNumber, _timeSlot, _date, _type = "Other", _name = "") {
    (this.clusterNumber = _clusterNumber), (this.timeSlot = _timeSlot), (this.date = _date), (this.type = _type), (this.name = _name);
  }
}

class Type {
  constructor(_name, _codename) {
    (this.name = _name), (this.codename = _codename);
  }
}

let days = ["", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
let types = new Array(
  new Type("Лабораторная", "Laboratory"),
  new Type("Практика", "Practice"),
  new Type("Лекция", "Lecture"),
  new Type("Другое", "Other")
);

let Templates;

$(document).ready(async function () {
  Templates = $("#templates-container").clone();
  Templates.load("/templates.html", async () => {
    await managePage();
  });
});

async function managePage() {
  let lastCluster = localStorage.getItem("lastCluster");
  if (lastCluster !== null && lastCluster !== undefined) {
    $(".group-input").val(lastCluster);
  }
  assignListeners();
}

export function retrieveTemplateById(id) {
  let template = Templates.find("#" + id).clone();
  template.removeAttr("id");
  template.removeClass("template");
  return template;
}

async function assignListeners() {
  $("*").off();

  $("#main-button").on("click", loadSchedule);

  $("#add-class-button").on("click", tryAddClass);

  $(".group-text").on("click", doThings);

  $("#group-input").on("keyup", function (event) {
    if (event.keyCode === 13) {
      $("#main-button").click();
      $("#group-input").blur();
    }
  });

  $("body").on("keyup", function (event) {
    if ((event.keyCode === 107 || event.keyCode === 187) && event.altKey) {
      openDialog();
    }
  });

  $("body").on("keyup", function (event) {
    if ((event.keyCode === 109 || event.keyCode === 189) && event.altKey) {
      closeDialog();
    }
  });
}

async function doThings()
{
  await addClass(new Class("9721", 3, "2022-12-26", "Practice", "Кринж"));
}

async function tryAddClass() {
  let cluster = $("#dialog-cluster").val();
  let timeSlot = $("#dialog-time-slot").val();
  let date = CommonServices.purgeDate($("#dialog-date").val(), "-");
  console.log($("#dialog-type").val());
  let type;
  if (types.find((x) => x.name === $("#dialog-type").val()) !== undefined) {
    type = types.find((x) => x.name === $("#dialog-type").val()).codename;
  } else {
    type = undefined;
  }
  console.log(type);
  let name = $("#dialog-name").val();

  let newClass = new Class(cluster, timeSlot, date, type, name);

  localStorage.setItem("lastClass", JSON.stringify(newClass));

  let responce = await addClass(newClass);
  if (responce) {
    await closeDialog();
  } else {
  }
}

async function closeDialog() {
  $("#add-class-dialog").remove();
  $("#dialog-cover").remove();
}

async function openDialog() {
  if ($("#add-class-dialog").length !== 0) {
    return;
  }

  let cover = retrieveTemplateById("cover-template");
  cover.attr("id", "dialog-cover");
  $("body").append(cover);

  let dialog = retrieveTemplateById("dialog-anchor-template");
  dialog.attr("id", "add-class-dialog");

  let lastClass = JSON.parse(localStorage.getItem("lastClass"));
  if (lastClass !== null && lastClass !== undefined) {
    dialog.find("#dialog-cluster").val(lastClass.clusterNumber);
    dialog.find("#dialog-time-slot").val(lastClass.timeSlot);

    dialog.find("#dialog-date").val(CommonServices.purgeDate(lastClass.date, "-", "yyyy-mm-dd"));
    console.log(dialog.find("#dialog-date").val());

    if (types.find((x) => x.codename === lastClass.type) !== undefined) {
      dialog.find("#dialog-type").val(types.find((x) => x.codename === lastClass.type).name);
    } else {
      dialog.find("#dialog-type").val("Другое");
    }
    dialog.find("#dialog-name").val(lastClass.name);
  }

  $("body").append(dialog);

  await assignListeners();
}

function throwMessage(container, emoji, text) {
  container.empty();

  let _message = retrieveTemplateById("message-anchor-template");
  let _emoji = retrieveTemplateById(emoji);
  _message.find(".message-emoji").append(_emoji);
  _message.find(".message-text").html(text);
  container.append(_message);
}

async function loadSchedule() {
  let number = $(".group-input").val();
  localStorage.setItem("lastCluster", number);

  $(".content-container").empty();
  let q = await query(ref(db, "Cluster/"), orderByChild("number"), equalTo(number));
  let snapshot = await get(q);
  if (!snapshot.exists()) {
    throwMessage($(".content-container"), "shruggie", "Нет такой группы");
    return;
  }

  let output = retrieveTemplateById("output-anchor-template");
  $(".content-container").append(output);
  let table = output.find(".output");

  let week = getWeek(new Date());
  let timeSlots = await getTimeSlots();

  let _row = retrieveTemplateById("row-template");
  let _cell = retrieveTemplateById("cell-template");
  let _class = retrieveTemplateById("class-template");
  let _date = retrieveTemplateById("date-template");
  let _timeSlot = retrieveTemplateById("time-slot-template");

  for (let timeSlot = 0; timeSlot <= timeSlots.length; timeSlot++) {
    let row = _row.clone();
    row.attr("pos", `row-${timeSlot}`);
    table.append(row);

    for (let day = 0; day <= week.length; day++) {
      let cell = _cell.clone();
      cell.attr("pos", `cell-${day}`);
      row.append(cell);

      if (timeSlot === 0 && day === 0) {
        // let button = retrieveTemplateById("plus-text-button-template");
        // cell.find(".cell-content").append(button);
      }
      if (timeSlot === 0 && day !== 0) {
        let date = _date.clone();
        date.find(".date-day").html(days[new Date(week[day - 1]).getDay()]);
        date.find(".date-date").html(CommonServices.purgeDate(week[day - 1], ".", "dd-mm"));
        cell.find(".cell-content").append(date);
      }
      if (timeSlot !== 0 && day === 0) {
        let theTimeSlot = _timeSlot.clone();
        theTimeSlot.find(".start").html(timeSlots[timeSlot - 1].start);
        theTimeSlot.find(".end").html(timeSlots[timeSlot - 1].end);
        cell.find(".cell-content").append(theTimeSlot);
      }
    }
  }

  let clusters = await getAssociatedClusters(number);

  for (let day of week) {
    await processDateClasses(day, clusters);
  }
}

async function renderClass(theClass) {
  let _class = retrieveTemplateById("class-template");

  _class.find(".class-name").html(theClass.name);
  _class.find(".cluster-number").html(theClass.clusterNumber);
  _class.attr("type", types.find((x) => x.codename === theClass.type) !== undefined ? theClass.type : "Other");
  let day = new Date(theClass.date).getDay();

  $(`[pos=row-${theClass.timeSlot}]`).find(`[pos=cell-${day}]`).find(".cell-content").append(_class);
}

async function processDateClasses(date, clusters) {
  let result = new Array();
  let q = await query(ref(db, "Class/"), orderByChild("date"), equalTo(CommonServices.purgeDate(new Date(date).toDateString())));

  onValue(q, async (snapshot) => {
    let day = new Date(date).getDay();
    $(".row").not(`[pos=row-0]`).find(`[pos=cell-${day}]`).find(".cell-content").empty();
    await snapshot.forEach((aClass) => {
      let theClass = aClass.val();
      if (clusters.includes(theClass.clusterNumber)) {
        renderClass(theClass);
      }
    });
  });
}

async function getAssociatedClusters(number) {
  let result = new Array();
  let q = await query(ref(db, "Cluster/"), orderByChild("number"), equalTo(number));
  let snapshot = await get(q);
  if (snapshot.exists()) {
    result = result.concat(await getClusterSubclusters(number), number, await getClusterSuperclusters(number));
    return result;
  }
  return null;
}

async function getTimeSlots() {
  let result = new Array();
  let q = await query(ref(db, "TimeSlot/"));
  let snapshot = await get(q);
  if (snapshot.exists()) {
    await snapshot.forEach((timeSlot) => {
      result.push(timeSlot.val());
    });
  }
  return result;
}

function getWeek(date) {
  let result = new Array();
  let theDate = new Date(date);
  while (theDate.getDay() != 1) {
    theDate.setDate(theDate.getDate() - 1);
  }
  for (let day = 0; day <= 5; day++) {
    result.push(CommonServices.purgeDate(new Date().setDate(theDate.getDate() + day)));
  }
  return result;
}

async function getClusterSubclusters(number) {
  let clusters = new Array(number);
  let subclusters = new Array();
  let result = new Array();

  while (clusters.length > 0) {
    subclusters = new Array();

    for (let cluster of clusters) {
      let q = await query(ref(db, "Cluster/"), orderByChild("superclusterNumber"), equalTo(cluster));
      let snapshot = await get(q);
      if (snapshot.exists()) {
        await snapshot.forEach((subcluster) => {
          subclusters.push(subcluster.val().number);
        });
      }
    }
    result = result.concat(subclusters);
    clusters = subclusters;
  }

  return result;
}

async function getClusterSuperclusters(number) {
  let clusters = new Array(number);
  let superclusters = new Array();
  let result = new Array();

  while (clusters.length > 0) {
    superclusters = new Array();

    for (let cluster of clusters) {
      let q = await query(ref(db, "Cluster/"), orderByChild("number"), equalTo(cluster));
      let snapshot = await get(q);
      if (snapshot.exists()) {
        await snapshot.forEach((supercluster) => {
          if (supercluster.val().superclusterNumber !== null && supercluster.val().superclusterNumber !== undefined) {
            superclusters.push(supercluster.val().superclusterNumber);
          }
        });
      }
    }
    result = result.concat(superclusters);
    clusters = superclusters;
  }

  return result;
}

async function addClass(newClass) {
  console.log(newClass);
  let reference = ref(db, "Class/" + `${newClass.clusterNumber}&${newClass.timeSlot}&${newClass.date}`);
  try {
    await set(reference, newClass);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function addCluster(number, superclusterNumber) {
  let reference = ref(db, "Cluster/");
  push(reference, new Cluster(number, superclusterNumber));
}
