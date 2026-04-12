export type Profile = {
  id: string;
  name: string;
  slug: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: "player" | "backer" | "admin";
  country: string | null;
  hendon_url: string | null;
  twitter_url: string | null;
  created_at: string;
};

export type Package = {
  id: string;
  player_id: string;
  name: string;
  venue: string;
  tournament_url: string | null;
  date_start: string;
  date_end: string | null;
  buy_in: number;
  markup: number;
  total_percent: number;
  sold_percent: number;
  status: "open" | "closed" | "active" | "completed" | "cancelled";
  prize_won: number | null;
  description: string | null;
  closes_at: string | null;
  created_at: string;
};

export type Stake = {
  id: string;
  package_id: string;
  backer_id: string;
  percent: number;
  amount_paid: number;
  status: "pending" | "confirmed" | "paid_out" | "cancelled";
  payout_amount: number | null;
  notes: string | null;
  payment_method: "manual" | "mollie";
  mollie_payment_id: string | null;
  created_at: string;
};

export type PlayerStats = {
  player_id: string;
  total_earnings: number;
  total_invested: number;
  total_packages: number;
  total_cashes: number;
  avg_roi: number;
  updated_at: string;
};

export type PackageWithPlayer = Package & { profiles: Profile | null };
export type StakeWithPackage = Stake & { packages: Package | null };
