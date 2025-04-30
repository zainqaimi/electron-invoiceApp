import { SaleDetails } from "../sales/SaleDetails";
import { SaleForm } from "../sales/SaleForm";
import { SaleList } from "../sales/SaleList";

function CreateOrder() {
  return (
    <div>
      <SaleForm />
      <SaleList />
    </div>
  );
}

export default CreateOrder;
