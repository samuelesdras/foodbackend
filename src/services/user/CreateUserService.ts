import prismaClient from "../../prisma";
// import { hash } from "bcryptjs";
const bcrypt = require("bcrypt");
interface UserResquest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: UserResquest) {
    if (!email) {
      throw new Error("Email incorreto.");
    }

    const userAlredyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlredyExists) {
      throw new Error("Este usuário/email já está cadastrado.");
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }
}

export { CreateUserService };
