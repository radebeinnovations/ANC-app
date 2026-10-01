import { isSupabaseConfigured, supabase } from './supabase';

/**
 * ANC Member Wallet Service
 * Handles live balance updates, transaction history logging,
 * and Value-Added Services (Airtime/Data/Electricity/Donations)
 */

export const WalletService = {
  /**
   * Fetch current wallet balance for a member
   */
  async getBalance(memberId = 'ANC-1234567') {
    if (!isSupabaseConfigured()) {
      return 1500; // Local state fallback
    }

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('member_id', memberId)
        .single();

      if (error || !data) return 1500;
      return data.balance;
    } catch (err) {
      console.warn('Error fetching wallet balance:', err);
      return 1500;
    }
  },

  /**
   * Client-side balance mutation is deliberately disabled. A real top-up must
   * be created by the ASP.NET API and credited only after a verified PayFast
   * ITN. See yamiWalletApi.js for the client integration boundary.
   */
  async depositFunds(memberId = 'ANC-1234567', amount = 0) {
    const num = parseFloat(amount) || 0;
    if (num <= 0) return { success: false, message: 'Invalid deposit amount' };
    return { success: false, message: 'Wallet top-ups must be initiated through the secure PayFast checkout.' };
  },

  /**
   * Process Airtime / Data / Electricity / Donation / Membership Payment
   */
  async purchaseService({ memberId = 'ANC-1234567', type = 'airtime', title = 'Airtime Top Up', amount = 0, recipient = '', network = '' }) {
    const num = parseFloat(amount) || 0;
    if (num <= 0) return { success: false, message: 'Invalid payment amount' };

    return { success: false, message: 'Airtime, data, electricity and supplier payments are not available until their verified backend provider integrations are complete.' };
  },

  /**
   * Fetch Recent Transaction Activity Feed
   */
  async getRecentActivity(memberId = 'ANC-1234567') {
    if (!isSupabaseConfigured()) {
      return null; // Uses local default activity feed
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.warn('Error fetching transactions:', err);
      return null;
    }
  },
};
