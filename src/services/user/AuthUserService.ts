import prismaClient from "../../prisma";

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Verifique seu usuário/senha");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Verifique seu usuário/senha");
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        // credential: "adm",
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    };
  }
}

export { AuthUserService };
