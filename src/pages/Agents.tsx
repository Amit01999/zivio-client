import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin } from 'lucide-react';
import { AgentCard, AgentCardSkeleton } from '@/components/AgentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bangladeshCities, type Broker, type SafeUser } from '@/types/schema';
import { useState } from 'react';

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const { data: agents, isLoading } = useQuery<{
    data: (Broker & { user: SafeUser })[];
  }>({
    queryKey: ['/api/brokers', { city: selectedCity, q: searchQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCity) params.set('city', selectedCity);
      if (searchQuery) params.set('q', searchQuery);
      params.set('verified', 'true');

      const response = await fetch(`/api/brokers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
  });

  return (
    <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold md:text-4xl mb-3">
              Find Verified Agents
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced real estate professionals across
              Bangladesh. All our agents are verified and trusted.
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or agency..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-agents"
              />
            </div>
            <Select
              value={selectedCity}
              onValueChange={v => setSelectedCity(v === '__all' ? '' : v)}
            >
              <SelectTrigger
                className="w-full sm:w-48"
                data-testid="select-agent-city"
              >
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Cities</SelectItem>
                {bangladeshCities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>
          ) : agents?.data && agents.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.data.map(broker => (
                <AgentCard key={broker.id} broker={broker} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">
                No agents found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('');
                }}
                data-testid="button-clear-agent-filters"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
    </div>
  );
}
