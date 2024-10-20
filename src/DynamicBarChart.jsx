import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const features = ["A", "B", "C", "D", "E", "F"]; // Array of feature names

const data = [
  {
    name: "Item 1",
    A: 4000,
    B: 2400,
    C: 2400,
    D: 1200,
    E: 1100,
    F: 900,
  },
  {
    name: "Item 2",
    A: 3000,
    B: 1398,
    C: 2210,
    D: 980,
    E: 500,
    F: 400,
  },
  // more data...
];

function DynamicBarChart() {
  // Calculate the sum of each feature
  const summedData = features.map((feature) => {
    const sum = data.reduce((total, row) => {
      return total + (row[feature] || 0); // Sum up all values for the current feature
    }, 0);

    return {
      name: feature, // Feature name (for Y axis)
      sum, // Total sum (for X axis)
    };
  });

  return (
    <BarChart width={1000} height={500} layout="vertical" data={summedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      <Tooltip />

      {/* Render a single bar that shows the sum for each feature */}
      <Bar dataKey="sum" fill="#8884d8" barSize={40} />
    </BarChart>
  );
}

export default DynamicBarChart;
