
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Customer } from '@/types/suggestions';
import ServiceUsageChart from '@/components/customer/ServiceUsageChart';
import CustomerTable from '@/components/customer/CustomerTable';
import CustomerFormDialog from '@/components/customer/CustomerFormDialog';

const initialCustomers: Customer[] = [
  {
    id: '1',
    brandName: 'Acme Corp',
    contactEmail: 'info@acmecorp.com',
    contactPhone: '+1-555-123-4567',
    acquiredServices: ['Basic Survey', 'Analytics Dashboard'],
    createdAt: '2023-05-15T10:30:00Z',
    growthMetrics: [
      { period: '2023-Q1', revenue: 5000, userCount: 120 },
      { period: '2023-Q2', revenue: 6200, userCount: 150 }
    ]
  },
  {
    id: '2',
    brandName: 'Globex Industries',
    contactEmail: 'contact@globex.com',
    contactPhone: '+1-555-987-6543',
    acquiredServices: ['Premium Survey', 'Analytics Dashboard', 'API Access'],
    createdAt: '2023-04-10T09:15:00Z',
    growthMetrics: [
      { period: '2023-Q1', revenue: 8500, userCount: 220 },
      { period: '2023-Q2', revenue: 9800, userCount: 275 }
    ]
  }
];

const availableServices = [
  'Basic Survey',
  'Premium Survey',
  'Analytics Dashboard',
  'API Access',
  'Custom Branding',
  'Advanced Reports',
  'Email Marketing',
  'Data Export'
];

export default function CustomerGrowth() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  // Calculate service usage for bar chart
  const serviceUsageData = availableServices.map(service => {
    const count = customers.filter(customer => 
      customer.acquiredServices.includes(service)
    ).length;
    
    return {
      name: service,
      count
    };
  }).sort((a, b) => b.count - a.count);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex justify-center">
        <div className="w-[900px] max-w-[900px] h-full bg-white p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Customer Growth Tracking</h1>
              <p className="text-muted-foreground">
                Track and manage your customers and their growth metrics
              </p>
            </div>
            
            <CustomerFormDialog 
              availableServices={availableServices}
              onAddCustomer={handleAddCustomer}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <ServiceUsageChart serviceUsageData={serviceUsageData} />
            <CustomerTable customers={customers} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
