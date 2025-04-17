import { ipcMain } from "electron";
import * as units from "../models/unitsModel.js";

// Units
ipcMain.handle("units:get", () => units.getAllUnits());
ipcMain.handle("units:create", (_, data) => units.createUnit(data));
ipcMain.handle("units:update", (_, id, data) => units.updateUnit(id, data));
ipcMain.handle("units:delete", (_, id) => units.deleteUnit(id));
