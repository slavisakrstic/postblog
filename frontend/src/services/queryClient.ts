import { QueryClient } from "react-query";

const defaultConfiguration = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
};

export const createQueryClient = (config = defaultConfiguration) =>
  new QueryClient(config);
const defaultQueryClient = createQueryClient();

export { defaultQueryClient as queryClient };