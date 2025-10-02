import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class AuthService {
    static async userInDatabase({
        email,
    }: {
        email: string;
    }): Promise<boolean> {
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
            if (error instanceof PrismaClientKnownRequestError) {
                throw new Error('Database request failed');
            }
            throw new Error(
                'An unexpected error occurred while fetching the user'
            );
        }
    }
    static async getUserId({ email }: { email: string }): Promise<number> {
        try {
            const userId = await prisma.user.findUnique({
                select: {
                    id: true,
                },
                where: { email },
            });

            return userId ? userId.id : -1;
        } catch (error) {
            console.log(error);
            throw new Error(
                'An unexpected error occurred while fetching the user'
            );
        }
    }
}

export default AuthService;
