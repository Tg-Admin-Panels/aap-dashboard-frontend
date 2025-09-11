import { useEffect, useState } from "react";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

import axiosInstance from "../../utils/axiosInstance";
import Chart from "react-apexcharts";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get("/dashboard/stats").then((res) => {
      console.log("res.data.data", res.data.data);
      setData(res.data.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <SpinnerOverlay loading={!data} />
      </div>
    );
  }

  const {
    growth,
    stateDistribution,
    genderDistribution,
    joinSources,
    topVolunteers,
  } = data;



  return (
    <>
      <PageMeta
        title="AAP Bihar|Dashboard"
        description="Admin Panel Dashboard"
      />

      <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900 text-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        <div className="mb-6">
          <StatisticsChart
            months={growth.months}
            memberData={growth.members}
            volunteerData={growth.volunteers}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* State Distribution */}

          <StateDistribution stateDistribution={stateDistribution} />

          {/* Gender Distribution */}
          <GenderChartDistribution genderDistribution={genderDistribution} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Join Sources */}
          <JoinSourceChart joinSources={joinSources} />

          {/* Top Volunteers */}
          <TopVolunteers topVolunteers={topVolunteers} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

function StateDistribution({ stateDistribution }: any) {

  const stateChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
        distributed: true,
      },
    },
    xaxis: {
      categories: stateDistribution.map((d: any) => d._id),
      labels: {
        style: { fontSize: "12px" },
      },
    },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
  };

  const stateChartSeries = [
    {
      name: "Members",
      data: stateDistribution.map((d: any) => d.count),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Members by State</h2>
      <Chart
        options={stateChartOptions as any}
        series={stateChartSeries}
        type="bar"
        height={250}
      />
    </div>
  );
}

function GenderChartDistribution({ genderDistribution }: any) {
  const genderChartOptions = {
    labels: genderDistribution.map((g: any) => g._id),
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      labels: {
        colors: "#ffffff",
        useSeriesColors: false,
      },
    },
    colors: ["#6366f1", "#f472b6", "#facc15"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.6,
      },
    },
    tooltip: {
      style: {
        fontSize: "13px",
        fontFamily: "Outfit",
      },
    },
    chart: {
      fontFamily: "Outfit, sans-serif",
    },
  };

  const genderChartSeries = genderDistribution.map((g: any) => g.count);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Volunteer Gender Distribution
      </h2>
      <Chart
        options={genderChartOptions as any}
        series={genderChartSeries}
        type="pie"
        height={250}
      />
    </div>
  );
}


function JoinSourceChart({ joinSources }: any) {
  const joinChartOptions = {
    labels: joinSources.map((j: any) => j._id),
    legend: { position: "bottom" },
    colors: ["#34d399", "#3b82f6"],
    dataLabels: { enabled: true },
  };

  const joinChartSeries = joinSources.map((j: any) => j.count);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Member Join Sources</h2>
      <Chart
        options={joinChartOptions as any}
        series={joinChartSeries}
        type="donut"
        height={250}
      />
    </div>
  );
}

function TopVolunteers({ topVolunteers }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Top Volunteers</h2>
      <ul className="space-y-3">
        {topVolunteers.map((v: any, index: number) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p className="font-medium">{v.fullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {v.mobileNumber}
              </p>
            </div>
            <span className="font-bold text-brand-600">
              {v.membersCount} members
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
