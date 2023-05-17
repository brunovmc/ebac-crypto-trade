const express = require("express");

const router = express.Router();
const { checaSaldo } = require("../../services");
const { logger } = require("../../utils");

router.get("/", (req, res) => {
  res.json({
    sucesso: true,
    depositos: req.user.depositos,
  });
});

router.post("/", async (req, res) => {
  const usuario = req.user;

  try {
    const valor = req.body.valor;
    usuario.depositos.push({ valor: valor, data: new Date() });
    await usuario.save();
    res.json({
      sucesso: true,
      saldo: await checaSaldo(usuario),
      depositos: usuario.depositos,
    });
  } catch (e) {
    logger.error(`erro no deposito ${e.message}`);
    res.status(422).json({
      sucesso: false,
      erro: e.message,
    });
  }
});

router.put("/:depositoId/cancelar", async (req, res) => {
  try {
    const depositoId = req.params.depositoId;
    const usuario = req.user;

    const deposito = usuario.depositos.id(depositoId);

    if (!deposito) {
      return res.status(404).json({ error: "Deposito nao encontrado" });
    }

    deposito.status = false;

    await usuario.save();

    res.json(deposito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
