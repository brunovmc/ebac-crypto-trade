const express = require("express");

const { logaUsuario } = require("../../services");
const logger = require("../../utils/logger");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const jwt = await logaUsuario(email, senha);
    res.status(200).json({
      sucesso: true,
      jwt: jwt,
    });
  } catch (e) {
    logger.error(`erro na authenticacao${e.message}`);
    res.status(401).json({
      sucesso: false,
      erro: "email ou senha invalidos",
    });
  }
});

module.exports = router;
