const { Cotacao } = require("../models");
const { buscaCotacoesOnline } = require("../services");
const { logger } = require("../utils");

const cotacoesWorker = async (job, done) => {
  try {
    logger.info(
      `buscando cotacoes.. Tentativa ${job.attemptsMade + 1}/${
        job.opts.attempts
      }`
    );

    const cotacoes = await buscaCotacoesOnline();

    logger.info("cotacoes requisitadas com sucesso");

    await Cotacao.insertMany(cotacoes);

    logger.info("cotacoes inseridas no banco");

    done();
  } catch (err) {
    logger.error(`erro ao processar o job ${err.message}`);
    done(err);
  }
};

module.exports = cotacoesWorker;
