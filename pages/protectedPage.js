import React from 'react'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import axios from 'axios'

const protectedPage = () => {
    const { data: session, status } = useSession()

    const [content, setContent] = useState("")



    useEffect(() => {
        axios.get('/api/protected').then((response) => {
            setContent(response.data.content)
        })
    }, [session])

    if (status === 'loading') {
        return <h1>Loading</h1>
    }
    if(session.user?.role === 'Admin'){
        return (
            <>
            <p>You are an admin! {content}</p>
            </>
        )
    }
    if (session) {
        return (
            <>
                <p>{content}</p>
            </>
        )
    } else {
        return (
            <>
                Not signed in. <br />
                {content} <br />
                <button type="button" onClick={() => signIn()}>Sign In</button>
            </>
        )
    }

}

export default protectedPage
