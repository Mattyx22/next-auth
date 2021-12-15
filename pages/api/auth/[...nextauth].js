import NextAuth from "next-auth"
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();


// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username,
          }
        })

        
          if (!user.password) {
            throw new Error("Account have to login with social account.")
          }

          
            const isMatch = await bcrypt.compare(credentials.password, user.password)
            
            if (!isMatch) {
              throw new Error("Password Incorrect.");
            }
          
          

          // if (!user.emailVerified) {
          //   throw new Error("Success! Check your email.");
          // }
          console.log(user)
        if (user) {
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          return null
        }





        // const res = await prisma.user.findUnique({
        //   where: {
        //     email: credentials.username,
        //   }
        // })

        // const user = await res.json()
        // console.log(user)

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return {status: 'success', data: user}
        // }
        // // Return null if user data could not be retrieved
        // return null

        // if (
        //   credentials.username === "john" &&
        //   credentials.password === "test"
        // ) {
        //   return {
        //     id: 2,
        //     name: "John",
        //     email: "johndoe@test.com",
        //   };
        // }

        // // login failed
        // return null;
      }
    })
  ],
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { 
    //   session.token = token
    //   session.role = user.role
    //   return session 
    // },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
  
      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
      return session
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: {
    colorScheme: "light",
  },

  // Enable debug messages in the console if you are having problems
  debug: true,
})