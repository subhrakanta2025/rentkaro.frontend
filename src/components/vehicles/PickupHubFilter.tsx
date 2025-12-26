import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface PickupHubFilterProps {
  selectedHubs: string[];
  onHubChange: (hubs: string[]) => void;
  city?: string;
}

const hubsByCity: Record<string, string[]> = {
  Hyderabad: [
    'Adarsh Nagar, Mettakanigudem',
    'APHB Colony, Gachibowli',
    'Banjara Hills',
    'Madhapur',
    'Kukatpally',
    'Secunderabad',
    'Ameerpet',
    'Hitec City',
  ],
  Mumbai: [
    'Andheri East',
    'Andheri West',
    'Bandra',
    'Powai',
    'Malad',
    'Borivali',
    'Thane',
    'Dadar',
  ],
  Delhi: [
    'Connaught Place',
    'Dwarka',
    'Rohini',
    'Vasant Kunj',
    'Saket',
    'Janakpuri',
    'Karol Bagh',
    'Lajpat Nagar',
  ],
  Bangalore: [
    'Koramangala',
    'Indiranagar',
    'Whitefield',
    'HSR Layout',
    'BTM Layout',
    'Jayanagar',
    'Electronic City',
    'Marathahalli',
  ],
  Chennai: [
    'T. Nagar',
    'Anna Nagar',
    'Velachery',
    'Adyar',
    'Guindy',
    'Nungambakkam',
    'Mylapore',
    'Tambaram',
  ],
  Pune: [
    'Koregaon Park',
    'Viman Nagar',
    'Hinjewadi',
    'Kothrud',
    'Shivaji Nagar',
    'Aundh',
    'Hadapsar',
    'Wakad',
  ],
};

export function PickupHubFilter({ selectedHubs, onHubChange, city }: PickupHubFilterProps) {
  const hubs = city ? hubsByCity[city] || [] : Object.values(hubsByCity).flat().slice(0, 8);

  const handleHubToggle = (hub: string) => {
    if (selectedHubs.includes(hub)) {
      onHubChange(selectedHubs.filter((h) => h !== hub));
    } else {
      onHubChange([...selectedHubs, hub]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">GO HUBS</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {hubs.map((hub) => (
          <label
            key={hub}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedHubs.includes(hub)}
              onCheckedChange={() => handleHubToggle(hub)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span
              className={cn(
                'text-sm transition-colors',
                selectedHubs.includes(hub)
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {hub}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
