import DailyBlueprint from "@/components/DailyBlueprint";
import PhaseGoals from "@/components/PhaseGoals";
import DailyTasks from "@/components/DailyTasks";
import ConsistencyChart from "@/components/ConsistencyChart";

export default function Home() {
  return (
    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out py-6 flex flex-col gap-6">
      
      <div className="w-full">
        <ConsistencyChart />
      </div>
      
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20 lg:pb-0">
        <div className="h-[500px] lg:h-[700px]">
          <DailyBlueprint />
        </div>
        
        <div className="h-[500px] lg:h-[700px]">
          <PhaseGoals />
        </div>
        
        <div className="h-[500px] lg:h-[700px]">
          <DailyTasks />
        </div>
      </div>
      
    </div>
  );
}
