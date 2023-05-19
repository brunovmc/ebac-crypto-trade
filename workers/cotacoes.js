const { Cotacao } = require("../models");
const { buscaCotacoesOnline } = require("../services");
const { logger } = require("../utils");

const cotacoesWorker = async (_job, done) => {
  logger.info("buscando cotacoes");

  const cotacoes = await buscaCotacoesOnline();

  logger.info("cotacoes requisitadas com sucesso");

  await Cotacao.insertMany(cotacoes);

  logger.info("cotacoes inseridas no banco");

  done();
};

module.exports = cotacoesWorker;
