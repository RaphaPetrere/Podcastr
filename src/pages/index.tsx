export default function Home(props) {
  console.log(props.episodes);
  return (
    <h1>Index</h1>
    )
}

export async function getStaticProps() { //getServerSideProps para SSR e getStaticProps para SSG
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, //de quantos em quantos segundos eu quero gerar uma nova versão dessa página
    //60seg * 60min * 8hrs
  }
}