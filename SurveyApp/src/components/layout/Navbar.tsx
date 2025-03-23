
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">SurveyMaster</Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/surveys" className="text-sm font-medium hover:text-primary">Surveys</Link>
          <Link to="/results" className="text-sm font-medium hover:text-primary">Results</Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
          <Link to="/settings" className="text-sm font-medium hover:text-primary">Settings</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/create">Create Survey</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
