"use client";

import InfoCard from "@/app/components/infoCard";
import {
  IconAlertTriangle,
  IconBox,
  IconCurrencyDollar,
  IconUsers,
} from "@tabler/icons-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import React from "react";

const data = [
  { month: "Jan", auctions: 10 },
  { month: "Feb", auctions: 15 },
  { month: "Mar", auctions: 8 },
  { month: "Apr", auctions: 12 },
  { month: "May", auctions: 20 },
  { month: "Jun", auctions: 18 },
  { month: "Jul", auctions: 22 },
  { month: "Aug", auctions: 25 },
];

const AdminDashboard = () => {
  return (
    <section id="admin-home" className="p-6 space-y-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <InfoCard
          title="subastas Activas"
          Icon={IconBox}
          value={24}
          message="+2 desde ultima fecha"
          className="w-full md:w-1/4"
        />
        <InfoCard
          title="Usuarios Totales"
          Icon={IconUsers}
          value={24}
          message="+15% desde ultima fecha"
          className="w-full md:w-1/4"
        />
        <InfoCard
          title="Ingresos"
          Icon={IconCurrencyDollar}
          value={24}
          message="+12.4% desde ultima fecha"
          className="w-full md:w-1/4"
        />
        <InfoCard
          title="Alertas Pendientes"
          Icon={IconAlertTriangle}
          value={24}
          message="+1 requiere atencion"
          className="w-full md:w-1/4"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full h-full rounded-lg p-8 py-4 gap-4 justify-start items-start shadow-md">
        <div className="w-full md:w-3/4 flex flex-col justify-start items-start gap-4">
          <span className="capitalize font-bold text-lg text-blue-700">
            Resumen
          </span>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="auctions" fill="#1d4ed8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full h-full md:w-1/3 flex flex-col justify-start items-start gap-4 min-h-[400px]">
          <span className="capitalize font-bold text-lg text-blue-700">
            Actividad Reciente
          </span>
          <div className="w-full h-full p-4 border-l-2"></div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard