const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

const logaUsuario = async (email, senha) => {
  if (!senha || !email) {
    throw new Error("Campo senha e/ou email sao obrigatorios");
  }
  const usuario = await Usuario.findOne({ email: email }).select("senha");
  if (!usuario) {
    throw new Error("usuario nao encontrado");
  }
  if (!(await bcrypt.compare(senha, usuario.senha))) {
    throw new Error("senha invalida");
  }

  return jwt.sign({ id: usuario._id }, process.env.JWT_SECRET_KEY);
};

module.exports = logaUsuario;
