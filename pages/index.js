import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from 'next-auth/react'

export default function Home() {

  const {data: session, status} = useSession();

  if(status === 'loading'){
    return <h1>Loading</h1>
  }
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button type="button" onClick={() => signOut()}>Sign Out</button>
      </>
    )
  } else {
    return (
      <>
      Not signed in. <br />
      <button type="button" onClick={() => signIn()}>Sign In</button>
      </>
    )
  }
}
