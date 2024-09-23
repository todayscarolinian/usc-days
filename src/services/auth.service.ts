import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

class AuthService {

    static async isUserInDatabase({ email }: { email: string }) {
        try {
            // Check if the user's email exists in the `users` table using Prisma
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return false;
            }

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error('Database request failed');
            }

            throw new Error('An unexpected error occurred while fetching the user');
        }
    }
}

export default AuthService;

