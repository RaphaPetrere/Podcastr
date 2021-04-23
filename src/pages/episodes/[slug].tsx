import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

interface EpisodeProps {
    episode: Episode;
}

export default function Episode ({ episode }: EpisodeProps) {
    /* const router = useRouter();

    if(router.isFallback) //Verificação necessária para caso use o fallback como true e deixe gerar páginas novas.
        return <p>Carregando...</p> */
    
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit='cover' />
                <button type="button">
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description}} 
                //Pra evitar o inject de script, ce precisa setar que conscientemente ta setando o html da div pra ler o sem formatar.
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
      })

      const paths = data.map(episode => {
          return {
              params: {
                  slug: episode.id
              }
          }
      })

    //   Com o código acima, ele já deixa gerado os ultimos 2 podcasts, que supostamente serão os mais visitados

    return {
        // paths: [], //passando um array vazio, na hora do build ele não gera nenhuma página de forma estática
        paths, //passando os ultimos 2 podcasts para já deixar gerado
        fallback: 'blocking'
        /*  
            fallback: blocking -> A pessoa só é redirecionada para a tela quando estiver carregada a página.
            
            fallback: false -> Da 404 se a página não estiver gerada.
            
            fallback: true -> Ele tenta buscar os dados que estão sendo passados para criar uma página, 
                      mas a requisição da API fica pelo lado do client, não do server.
                      Pra evitar que dê crash, precisamos fazer uma validação com o useRouter.
        */
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`episodes/${slug}`)
    
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24 hours
    }
}