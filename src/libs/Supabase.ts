import { createClient } from '@supabase/supabase-js';
import { Env } from './Env';

// Server-side Supabase client using service role key for admin operations
export const getSupabaseAdmin = () => {
  if (!Env.SUPABASE_URL || !Env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase URL and Service Role Key must be configured in environment variables',
    );
  }

  return createClient(Env.SUPABASE_URL, Env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// User operations
export const userOperations = {
  /**
   * Get user by email from the users table
   */
  async getUserByEmail(email: string) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected when user doesn't exist
      throw new Error(`Failed to get user by email: ${error.message}`);
    }

    return data;
  },

  /**
   * Create a new user in the users table
   */
  async createUser(email: string) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate email error
      if (error.code === '23505') {
        // Unique constraint violation - user already exists
        return this.getUserByEmail(email);
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  },

  /**
   * Update an existing user in the users table
   */
  async updateUser(email: string, updates: {
    email?: string;
    stripe_customer_id?: string | null;
    subscription_status?: string | null;
    subscription_end_date?: string | null;
  }) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data;
  },

  /**
   * Create or update user (upsert) based on email
   */
  async upsertUser(email: string, updates?: {
    stripe_customer_id?: string | null;
    subscription_status?: string | null;
    subscription_end_date?: string | null;
  }) {
    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      // Update existing user
      return this.updateUser(email, updates || {});
    } else {
      // Create new user
      const newUser = await this.createUser(email);
      // If there are updates, apply them
      if (updates && Object.keys(updates).length > 0) {
        return this.updateUser(email, updates);
      }
      return newUser;
    }
  },
};
