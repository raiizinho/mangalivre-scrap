const cheerio = require("cheerio");
const axios = require("axios");
const readline = require("readline-sync");
const chalk = require("chalk");

async function start (urllink) {
    var dados = [{resultados: 0}]
    const res = await axios.get(urllink);

    const $ = cheerio.load(res.data)

    $("div.manga__item").each((i, e) => {
        const url = $(e).find(".manga__thumb > div > a").attr("href")
        const title = $(e).find(".manga__content > div > div > h2 > a").text().replace(/[\t\n]/g, '')
        const sinopse = $(e).find(".manga__content > div > div > div > p").text()
        const chapters = Number($(e).find(".manga__content > div > div > div > span").text().slice(0, 2))
        const genres = $(e).find(".manga__content > div > div > span > span > a").text().match(/([A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ][a-záàâãéèíïóôõöúçñ]+(?:\s[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ][a-záàâãéèíïóôõöúçñ]+)*)/g); //match desgraçado pois os gêneros estavam vindo tudo junto 
        dados.push({ res: {title, url, sinopse, chapters, genres} })
    })
    // apenas para pegar a quantidade de resultados encontrados
    $("div.manga__item").each((i, e) => {
        dados[0].resultados++
    })
    console.log(dados)
}

var question = readline.question(`Qual o nome da obra que você procura? \x1b[92m`)
start(`https://mangalivre.tv/?s=${question.replace(" ", "+")}&post_type=wp-manga`)