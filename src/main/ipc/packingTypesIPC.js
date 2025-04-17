import { ipcMain } from "electron";
import * as packingTypes from "../models/packing_typesModel.js";

// Packing Types
ipcMain.handle("packing_types:get", () => packingTypes.getAllPackingTypes());
ipcMain.handle("packing_types:create", (_, data) =>
  packingTypes.createPackingType(data)
);
ipcMain.handle("packing_types:update", (_, id, data) =>
  packingTypes.updatePackingType(id, data)
);
ipcMain.handle("packing_types:delete", (_, id) =>
  packingTypes.deletePackingType(id)
);
