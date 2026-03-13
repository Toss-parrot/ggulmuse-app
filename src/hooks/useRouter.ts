import { useState, useCallback } from 'react';
import { Page, RouterState } from '../types';

export function useRouter() {
  const [state, setState] = useState<RouterState>({
    page: 'home',
    params: {},
  });

  const navigate = useCallback((page: Page, params: Record<string, string> = {}) => {
    setState({ page, params });
  }, []);

  const goHome = useCallback(() => {
    setState({ page: 'home', params: {} });
  }, []);

  return { ...state, navigate, goHome };
}
