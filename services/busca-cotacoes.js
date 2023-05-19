const axios = require("axios");
const { Cotacao } = require("../models");

const buscaCotacoesOnline = async () => {
  const url = `${process.env.COIN_MARKET_CAP_URL}/v2/cryptocurrency/quotes/latest`;
  const dataDaCotacao = new Date();

  const { data } = await axios.get(url, {
    params: {
      symbol: "BTC,ETH,BNB,XRP,ADA,SOL",
      convert: "BRL",
    },
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_KEY,
    },
  });

  const info = Object.values(data.data);

  return info.map(([cotacao]) => ({
    moeda: cotacao.symbol,
    valor: cotacao.quote.BRL.price,
    data: dataDaCotacao,
  }));
};

const buscaCotacoesNoBanco = async () => {
  return await Cotacao.aggregate([
    { $sort: { data: -1 } },
    {
      $group: {
        _id: { moeda: "$moeda" },
        data: { $first: "$data" },
        moeda: { $first: "$moeda" },
        valor: { $first: "$valor" },
        id: { $first: "$_id" },
      },
    },
    { $unset: "_id" },
  ]);
};

module.exports = {
  buscaCotacoesOnline,
  buscaCotacoesNoBanco,
};
