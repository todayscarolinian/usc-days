import { prisma } from "@/src/lib/prisma";
import { PrismaClientKnownRequestError } from "@/src/lib/prisma/generated/internal/prismaNamespace";

class UserService {
  static async getOrCreateUserId({ email }: { email: string }): Promise<number> {
    try {
      const user = await prisma.user.upsert({
        where: { email },
        create: { email },
        update: {},
      });

      return user.id;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error("Database request failed");
      }
      throw new Error("An unexpected error occurred while resolving the user");
    }
  }
}

export default UserService;
