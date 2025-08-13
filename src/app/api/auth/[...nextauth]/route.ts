// Temporarily use AWS Amplify optimized auth config
import { handler } from "@/lib/auth-amplify";

export { handler as GET, handler as POST };