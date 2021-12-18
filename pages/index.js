import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from 'next-auth/react'
import protectedPage from './protectedPage'
import Link from 'next/link'

export default function Home() {

  const {data: session, status} = useSession();

  if(status === 'loading'){
    return <h1>Loading</h1>
  }
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        User permissions: {session.user?.role}
        <button type="button" onClick={() => signOut()}>Sign Out</button>
        <Link href="/protectedPage"><a>Go to protected page.</a></Link>
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
