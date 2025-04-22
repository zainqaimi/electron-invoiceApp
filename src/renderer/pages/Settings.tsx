import ExportBackup from "../components/ExportBackup";
import ImportBackup from "../components/ImportBackup";
import ResetAppButton from "../components/ResetAppButton";
import PackingTypes from "./PackingTypes";
import SalesMen from "./SalesMen";
import Units from "./Units";

function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <ExportBackup />
      <ImportBackup />
      <ResetAppButton />
      <SalesMen />
      <Units />
      <PackingTypes />
    </>
  );
}

export default Settings;
