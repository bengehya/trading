import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          initial_capital: number;
          target_capital: number;
          daily_target_percent: number;
          duration_days: number;
          start_date: string;
          end_date: string;
          status: string;
          current_capital: number;
          current_day: number;
          created_at: string;
        };
      };
      trades: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          date: string;
          instrument: string;
          direction: string;
          lot_size: number;
          entry_price: number;
          stop_loss: number;
          take_profit: number;
          exit_price: number;
          result_amount: number;
          result_percent: number;
          setup_type: string;
          reason: string;
          emotional_state_before: string;
          emotional_state_after: string;
          created_at: string;
        };
      };
    };
  };
}
