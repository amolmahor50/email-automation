import { useState, useEffect } from "react";

export function useApi(apiFunction, options = { immediate: false }) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (...params) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction(...params);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useMutation(apiFunction) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (params) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction(params);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    mutate,
    reset,
  };
}
