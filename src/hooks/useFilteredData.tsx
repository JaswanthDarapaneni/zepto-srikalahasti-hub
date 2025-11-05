import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FilterOptions {
  filterByUserId?: boolean;
  filterByShopId?: boolean;
  filterByDeliveryAgent?: boolean;
}

export function useFilteredData<T extends { user_id?: string; shop_id?: string; delivery_agent_id?: string }>(
  data: T[] | null,
  options: FilterOptions = {}
): T[] {
  const { user } = useAuth();
  
  return useMemo(() => {
    if (!data || !user) return [];
    
    const role = user.role;
    
    // Admin and Manager have full access
    if (role === 'admin' || role === 'manager') {
      return data;
    }
    
    // Customer: only their own data
    if (role === 'customer' && options.filterByUserId) {
      return data.filter(item => item.user_id === user.id);
    }
    
    // Shop Owner: only their shop's data
    if (role === 'shop_owner' && options.filterByShopId) {
      return data.filter(item => item.shop_id === user.id);
    }
    
    // Delivery Agent: only assigned orders
    if (role === 'delivery_agent' && options.filterByDeliveryAgent) {
      return data.filter(item => item.delivery_agent_id === user.id);
    }
    
    return data;
  }, [data, user, options.filterByUserId, options.filterByShopId, options.filterByDeliveryAgent]);
}
