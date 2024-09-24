import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';

class AuthService {

    static async userInDatabase({ email }: { email: string }): Promise<User | null> {
        try {
            // Check if the user's email exists in the `users` table using Prisma
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error('Database request failed');
            }

            throw new Error('An unexpected error occurred while fetching the user');
        }
    }
}

export default AuthService;

