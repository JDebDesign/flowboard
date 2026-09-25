import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Board } from '../components/Board';

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  return (
    <>
      <Navbar />
      {boardId && <Board boardId={boardId} />}
    </>
  );
}
