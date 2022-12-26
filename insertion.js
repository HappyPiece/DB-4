import { insert } from "./db_implementations/db-functions.js";
import { db } from "./db-config.js";
import { Bank } from "./models/Bank.js";
import { ref } from "./firebase-database.js";

insert(
    ref(db, "banks/"), 
    (new Bank("Sbebrank", "1111", null, "aboba.ru")).getData()
);

insert(
    ref(db, "banks/"), 
    (new Bank("Alpha", "1122", "+79095483131", "testsite.com")).getData()
);