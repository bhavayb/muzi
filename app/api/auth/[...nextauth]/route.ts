
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { prismaClient } from "@/app/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn(params) {
      console.log("SignIn callback", params);
      if(!params.user.email) return false;
      try {
        await prismaClient.user.create({
          data: {
            email: params.user.email ?? "",
            provider: "Google",
          },
        })
      } catch (error) {
        console.log("User already exists or other error:", error);
      }
      return true;
    }
  }

})

export { handler as GET, handler as POST }