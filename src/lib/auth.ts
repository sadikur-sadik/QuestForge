import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db("questforge");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "buyer",
                required: false,
                input: true,
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            role: user.role || "buyer"
                        }
                    };
                }
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }
    }
});