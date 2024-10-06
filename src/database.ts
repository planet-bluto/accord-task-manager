import localforage from "localforage";
import sqlJsAsSqlite3 from '@bluaxolotl/sql.js-as-sqlite3'
import Sequelize from 'sequelize-browser'
import initSqlJs from 'sql.js'

import initSchemas from "./database/schemas"
import {PlannerTask} from "./models/task"

sqlJsAsSqlite3.configure({
  // `sql.js` package default export.
  initSqlJs,
  // Base URL for `sql.js` to get the `*.wasm` files like `sql-wasm-debug.wasm`.
  // The version of the `*.wasm` files must match the version of the `sql.js` package.
  // Must end with a "/".
  wasmFileBaseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/'
})

var sequelize;


function bufferToBase64(buf: Uint8Array) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

function base64ToBuffer(base64: string) {
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

function randi(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

async function main() {
    // console.log("Database Init... ", gapi_access_token)

	let opts: any = { dialectModule: sqlJsAsSqlite3 }

    let base64: string
    base64 = ((await localforage.getItem('main')) || "")
    // if (gapi_access_token == null) {
    //     base64 = await localforage.getItem('main')
    // } else {
    //     base64 = await getGDriveDatabase()
    // }

	if (base64 != "") {
    console.log("Loading from localDB?...", base64)
		opts = { dialectModule: sqlJsAsSqlite3, args: [base64ToBuffer(base64)] }
	}

  console.log("Opts: ", opts)

	sequelize = new Sequelize('sqlite://:memory:', opts)

	sequelize.addHook("afterSave", (doc: any) => {
    if (window["SQL_DATABASES" as keyof Object] instanceof Object) {
      let data = Object.values(window["SQL_DATABASES" as keyof Object])[0].export()
      localforage.setItem("main", bufferToBase64(data))
    }

        // if (database_file_id && gapi_access_token) {
        //     uploadDatabase(database_folder_id)
        // }
	})
	// console.log(sequelize)

  await initSchemas(sequelize)

  console.log(PlannerTask)

	let tasks = await PlannerTask?.findAll();

	console.log(tasks.map((task: any) => task.get({plain:true})))}

main()