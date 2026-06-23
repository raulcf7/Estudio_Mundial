import { GoalDashboard } from "@/components/dashboard/GoalDashboard";
import type { GoalRecord } from "@/lib/types";
import goalsDataset from "../../public/data/goals.json";

export default function Home() {
  return <GoalDashboard goals={goalsDataset.goals as GoalRecord[]} />;
}
