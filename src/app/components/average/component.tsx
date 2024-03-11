import { GasFee } from "@/services/gas";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  fees: GasFee[];
  lastUpdate: number;
}

export function Averages(props: Props) {
  const hourLabels = new Array(24).fill(0).map((_, i) => `${i}:00`)
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
        autoScaleYaxis: false,
      },
    },
    colors: ['#4a00ff'], 
    xaxis: {
      categories: dayLabels,
    },
  };

  const series = hourLabels
    .map((i) => {
      return {
        name: `${i}:00`,
        data: dayLabels.map((day) => {
          const fee = props.fees.find((fee: GasFee) => {
            return dayjs(fee.period).hour() === parseInt(i) && dayjs(fee.period).format('ddd') === day
          })
          return fee ? Math.round(fee.median) : 0
        }),
      }
    })
    .reverse()

  return (
    <div className="flex flex-col bg-white rounded-xl w-full max-w-[1200px] min-h-[420px] aspect-[1.91/1] p-4 md:p-12">
      <div className="flex justify-between">
        <h2 className="text-3xl">Weekly Heatmap <span className='text-xs'>Updated {dayjs(props.lastUpdate).format("HH:mm:ss")} UTC</span></h2>
      </div>

      <div className="relative grow ">
        <DynamicChart options={options} series={series} type="heatmap" height="100%" />
      </div>
    </div>
  );
}
