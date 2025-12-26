export type AgencyDocuments = {
  gstDocUrl?: string | null;
  businessPhotoUrl?: string | null;
};

export type AgencyDetails = {
  id: string;
  agencyName?: string | null;
  businessType?: string | null;
  registrationNumber?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
  agencyPhone?: string | null;
  agencyEmail?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  documents?: AgencyDocuments;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AgencyStats = {
  listedVehicles?: number;
  lifetimeBookings?: number;
  lifetimeEarnings?: number;
};

export type AgencyStatus = {
  hasAgency: boolean;
  agencyId?: string | null;
  agencyName?: string | null;
  isVerified?: boolean;
  canManageFleet?: boolean;
  stats?: AgencyStats;
};

export type ProfileResponse = {
  profile: {
    id: string | null;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string | null;
    avatarLocked?: boolean;
    memberSince?: string | null;
  };
  metrics?: {
    vehiclesListed?: number;
    completedTrips?: number;
    loyaltyScore?: number;
    nextMilestoneTrips?: number;
  };
  agencyStatus?: AgencyStatus;
  agencyDetails?: AgencyDetails | null;
};
