
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

// Mock data for sales overview chart
const salesData = [
  { name: "Jan", sales: 45000 },
  { name: "Feb", sales: 52000 },
  { name: "Mar", sales: 49000 },
  { name: "Apr", sales: 62000 },
  { name: "May", sales: 58000 },
  { name: "Jun", sales: 75000 },
  { name: "Jul", sales: 82000 },
  { name: "Aug", sales: 79000 },
  { name: "Sep", sales: 92000 },
  { name: "Oct", sales: 105000 },
  { name: "Nov", sales: 120000 },
  { name: "Dec", sales: 135000 },
];

// Mock data for product categories
const categoryData = [
  { name: "T-Shirts", value: 35 },
  { name: "Hoodies", value: 25 },
  { name: "Jackets", value: 15 },
  { name: "Shorts", value: 20 },
  { name: "Others", value: 5 },
];

// Mock data for order status
const orderStatusData = [
  { name: "Processing", count: 12 },
  { name: "Shipped", count: 18 },
  { name: "Delivered", count: 45 },
  { name: "Cancelled", count: 5 },
];

// Colors for pie chart
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

// Colors for bar chart
const ORDER_COLORS = {
  Processing: "#3b82f6",
  Shipped: "#f97316",
  Delivered: "#22c55e",
  Cancelled: "#ef4444"
};

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Sales Overview Chart */}
      <Card className="col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`₹${value}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Product Categories Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Product Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}%`, "Percentage"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ORDER_COLORS[entry.name as keyof typeof ORDER_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
