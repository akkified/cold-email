import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
            if (!user.email) {
                console.error('SignIn failed: No email found in user object');
                return false;
            }

            // Sync user to our profiles table
            console.log('Syncing profile for user:', user.email);
            const { error } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: user.id || account?.providerAccountId,
                    name: user.name,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (error) {
                console.error('Error syncing user profile to Supabase:', error);
                // For now, allow sign-in even if profile sync fails, or check if table exists
                return true;
            }

            return true;
        },
        async jwt({ token, account }: { token: any; account: any }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
