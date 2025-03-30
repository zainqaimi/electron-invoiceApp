import { DataTable } from "../../components/DataTable"
import data from './data.json'
function Inventory() {
  return (
    <>
    <DataTable data={data} />
    </>
  )
}

export default Inventory