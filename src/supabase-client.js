import { createClient } from '@supabase/supabase-js';

// Замените на ваши реальные URL и ANON KEY из Supabase dashboard
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Пример функции для fetching данных
export async function fetchWarehouses() {
  const { data, error } = await supabase.from('warehouses').select('*');
  if (error) console.error('Error fetching warehouses:', error);
  return data;
}
