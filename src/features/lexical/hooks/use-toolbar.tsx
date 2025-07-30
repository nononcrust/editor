import { createContextFactory } from "@/lib/context";

export const useToolbar = () => {
  useToolbarContext();
};

const [ToolbarContext, useToolbarContext] = createContextFactory("Toolbar");

type ToolbarContextProviderProps = {
  children: React.ReactNode;
};

export const ToolbarContextProvider = ({ children }: ToolbarContextProviderProps) => {
  return <ToolbarContext value={{}}>{children}</ToolbarContext>;
};
