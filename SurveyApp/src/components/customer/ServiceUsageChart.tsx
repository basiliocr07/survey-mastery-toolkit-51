
import { BarChart2 } from 'lucide-react';
import { 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart as RechartsBarChart, 
  Bar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ServiceUsageData {
  name: string;
  count: number;
}

interface ServiceUsageChartProps {
  serviceUsageData: ServiceUsageData[];
}

export default function ServiceUsageChart({ serviceUsageData }: ServiceUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Service Usage Analytics
        </CardTitle>
        <CardDescription>
          Breakdown of services used by customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={serviceUsageData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Customers" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
