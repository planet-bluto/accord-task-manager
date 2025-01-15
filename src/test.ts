import { PlannerTasks } from "./persist";

function solveMyProblems() {
  PlannerTasks.ref.value = PlannerTasks.value.filter((task, idx) => {
    return (PlannerTasks.value.findIndex(this_task => this_task.id == task.id) == idx)
  })
  PlannerTasks.update()
}

// debugging
declare global {
  var solveMyProblems: () => void;
  interface Window { solveMyProblems: () => void; }
}

window.solveMyProblems = solveMyProblems

export {}