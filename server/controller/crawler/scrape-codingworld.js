const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  scrapeCodingWorld: async (compareDate = 86400000) => {
    const getArticlesFromURL = async url => {
      const articleKeywords = {
        Coding: '코딩',
        'Ai/Robot': 'AI/로봇',
        Mobile: '모바일',
        BlockChain: '블록체인',
        Game: '게임',
        Security: '보안',
      };

      let articles = [];
      const html = await axios.get(url);
      const $ = cheerio.load(html.data);
      const articleList = $('.type2');

      for (let i = 0; i < articleList.children().length; i++) {
        const article = articleList.children()[i];
        const url = $(article).find('a').attr('href');
        const title = $(article).find('.titles').text();
        const content = $(article).find('.lead').text().trim();
        const spanData = $(article).find('.byline');
        const keyword = $(spanData).find('em')[0].children[0].data;
        let date = $(spanData).find('em')[2].children[0].data;
        date = new Date(date);

        let curDate = new Date(Date.now());
        curDate.setHours(curDate.getHours() + 9); // 한국 시간으로 변환

        if (curDate - date > compareDate) {
          // 1일 이상 차이날 경우, skip
          continue;
        }

        if (!articleKeywords[keyword]) {
          // 지정된 키워드가 아닐 경우, skip
          continue;
        }

        let DATA = {
          article_title: title,
          article_content: content,
          article_date: date,
          article_url: `https://www.codingworldnews.com${url}`,
          article_keyword: articleKeywords[keyword],
          article_publisher: 'Coding World News',
        };

        articles.push(DATA);
      }

      return articles;
    };

    const codingWorldCodingURL =
      'https://www.codingworldnews.com/news/articleList.html?sc_section_code=S1N2&view_type=sm';
    const codingWorldTechURL =
      'https://www.codingworldnews.com/news/articleList.html?sc_section_code=S1N3&view_type=sm';

    const codingWorldCoding = await getArticlesFromURL(codingWorldCodingURL);
    const codingWorldTech = await getArticlesFromURL(codingWorldTechURL);
    return [...codingWorldCoding, ...codingWorldTech];
  },
};
