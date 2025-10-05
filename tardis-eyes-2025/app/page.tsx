import { MapViewer } from '@/components/map-viewer';
import { Header } from '@/components/header';

// ALTERADO: A função Home agora recebe 'searchParams'
export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Pega o parâmetro 'annotation' da URL
  const annotationId = searchParams?.annotation;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="relative flex-1">
        {/* Passa o ID da anotação para o MapViewer */}
        <MapViewer
          highlightedAnnotationId={
            typeof annotationId === 'string' ? annotationId : null
          }
        />
      </main>
    </div>
  );
}
