import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import './page.css';
export default ({showHeader, showFooter , title, children})=>{
  const myHeader = (showHeader)? (<Header title={title}></Header>) : null;
  const myFooter = (showFooter) ? (<Footer></Footer>) : null;
  return (
    <section>
      {myHeader}
      <main>
        {children}
      </main>
      {myFooter}
    </section>
  );
}
