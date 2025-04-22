import { Button } from "../components/ui/button";

export default function ResetAppButton() {
  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will delete all data."
    );
    if (confirmed) {
      await window.electron.ipcRenderer.invoke("app:reset");
    }
  };

  return (
    <Button variant="destructive" onClick={handleReset}>
      Reset App
    </Button>
  );
}
