import { useQuery } from '@tanstack/react-query';
import { useCastagneProgram } from './useCastagneProgram';

export default function usePlayers() {
  const { cluster, program } = useCastagneProgram();

  const players = useQuery({
    queryKey: ['player', 'all', { cluster }],
    queryFn: () => program.account.player.all(),
  });

  return players;
}
