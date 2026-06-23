import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  created_at?: string;
  updated_at?: string;
}

export interface TransactionInput {
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_LOCAL_STORAGE = !SUPABASE_URL || !SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!USE_LOCAL_STORAGE) {
  supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

const STORAGE_KEY = "expense_transactions";

// LocalStorage utilities
function getFromStorage(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Methods
export const transactionService = {
  // Read operations
  async getAllTransactions(): Promise<Transaction[]> {
    if (USE_LOCAL_STORAGE) {
      return getFromStorage();
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Transaction[];
    } catch (err) {
      console.error("Error fetching transactions:", err);
      return [];
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    if (USE_LOCAL_STORAGE) {
      return getFromStorage().find((t) => t.id === id) || null;
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (err) {
      console.error("Error fetching transaction:", err);
      return null;
    }
  },

  // Create operation
  async createTransaction(input: TransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: generateId(),
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (USE_LOCAL_STORAGE) {
      const transactions = getFromStorage();
      transactions.unshift(transaction);
      saveToStorage(transactions);
      return transaction;
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (err) {
      console.error("Error creating transaction:", err);
      throw err;
    }
  },

  // Update operation
  async updateTransaction(id: string, input: TransactionInput): Promise<Transaction> {
    const updated: Transaction = {
      id,
      ...input,
      updated_at: new Date().toISOString(),
    };

    if (USE_LOCAL_STORAGE) {
      const transactions = getFromStorage();
      const index = transactions.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updated };
        saveToStorage(transactions);
        return transactions[index];
      }
      throw new Error("Transaction not found");
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(updated)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (err) {
      console.error("Error updating transaction:", err);
      throw err;
    }
  },

  // Delete operation
  async deleteTransaction(id: string): Promise<void> {
    if (USE_LOCAL_STORAGE) {
      const transactions = getFromStorage();
      const filtered = transactions.filter((t) => t.id !== id);
      saveToStorage(filtered);
      return;
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting transaction:", err);
      throw err;
    }
  },

  // Delete all transactions (for testing)
  async deleteAllTransactions(): Promise<void> {
    if (USE_LOCAL_STORAGE) {
      saveToStorage([]);
      return;
    }

    if (!supabase) throw new Error("Supabase not configured");

    try {
      const { error } = await supabase.from("transactions").delete().neq("id", "");
      if (error) throw error;
    } catch (err) {
      console.error("Error deleting all transactions:", err);
      throw err;
    }
  },
};

export default transactionService;
