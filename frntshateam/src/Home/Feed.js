import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import Axios from "axios";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";
import Post from "../Components/Post";
import { useUsuario } from "../Components/actions-user/usuario-context";


async function cargarPost(fechaDelUltimoPost) {
  const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : "";
  const { data: nuevosPosts } = await Axios.get(`/api/posts/feed${query}`);

  return nuevosPosts;
}

const NUMERO_DE_POST_POR_LLAMADA = 3;

export default function Feed({ mostrarError }) {
  const { usuario } = useUsuario();
  const [posts, setPosts] = useState([]);
  const [cargandoPostsIniciales, setCargandoPostsIniciales] = useState(true);
  const [cargandoMasPosts, setCargandoMasPosts] = useState(false);
  const [todosLosPostsCargados, setTodosLosPostCargados] = useState(false);

  useEffect(() => {
    async function cargarPostIniciales() {
      try {
        const nuevosPosts = await cargarPost();
        setPosts(nuevosPosts);
        setCargandoPostsIniciales(false);
        revisarSiHayMasPosts(nuevosPosts);
      } catch (error) {
        mostrarError("Hubo un problema al cargar los posts ");
        console.log("error", error);
      }
    }

    cargarPostIniciales();
  }, []);

  function actualizarPost(postOriginal, postActualizado) {
    setPosts((posts) => {
      const postsActulaizados = posts.map((post) => {
        if (post !== postOriginal) {
          return post;
        }
        return postActualizado;
      });
      return postsActulaizados;
    });
  }

  async function cargarMasPosts() {
    if(cargandoMasPosts) {
      return;
    }

    try {
      setCargandoMasPosts(true);
      const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
      const nuevosPosts = await cargarPost(fechaDelUltimoPost);
      setPosts( (viejosPosts) => [...viejosPosts, ...nuevosPosts]);
      setCargandoMasPosts(false);
      revisarSiHayMasPosts(nuevosPosts);
    } catch (error) {
      mostrarError('Hubo un problema al cargar nuevos posts');
      setCargandoMasPosts(false);
 
    }
  }

  function revisarSiHayMasPosts(nuevosPosts) {
    if ( nuevosPosts.length < NUMERO_DE_POST_POR_LLAMADA) {
      setTodosLosPostCargados(true);
    }
  }

  if (cargandoPostsIniciales) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!cargandoPostsIniciales && posts.length === 0) {
    return (
      <Main center>
        <NoSiguesANadie></NoSiguesANadie>
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            actualizarPost={actualizarPost}
            mostrarError={mostrarError}
            usuario={usuario}
          />
        ))}
        <CargarMasPosts onClick={cargarMasPosts}  todosLosPostsCargados={todosLosPostsCargados}/>
      </div>
    </Main>
  );
}

function NoSiguesANadie() {
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie__mensaje">
        Bienvenidos a ShaTeam, Publica tus Hobbys Favoritos 
      </p>
      <div className="text-center">
        {/* <Link to="/explore" className="NoSiguesANadie__boton">
          Explora ShaTeam
        </Link> */}
      </div>
    </div>
  );
}


function CargarMasPosts({onClick, todosLosPostsCargados}) {
  if(todosLosPostsCargados) {
    return <div className="Feed__no-hay-mas-posts">No hay mas posts</div>
  }

  return (
    <button className="Feed__cargar-mas" onClick={onClick}>Cargar mas</button>
  )
}