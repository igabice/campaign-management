import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { teamsApi } from "../services/teams";
import { Team } from "../types/commons";

interface TeamContextType {
  activeTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  setActiveTeam: (team: Team) => void;
  refreshTeams: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const memberships = await teamsApi.getMyTeams();
      const teamList = memberships.map((m: any) => m.team);
      setTeams(teamList);
      if (teamList.length > 0 && !activeTeam) {
        setActiveTeam(teamList[0]);
      }
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTeam]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const refreshTeams = () => {
    fetchTeams();
  };

  return (
    <TeamContext.Provider
      value={{ activeTeam, teams, isLoading, setActiveTeam, refreshTeams }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
