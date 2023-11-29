import cron from 'node-cron';
import dbservice from "./sqlitedbsvc.js";

//---------------------------------------------------------------
// cron server
//---------------------------------------------------------------
export default class CronServer {

    constructor() {
        this.task1();
    }

    task1() {
        cron.schedule('*/10 * * * *', () => {
          console.log("%s : Running Task-1", new Date().toTimeString());
          this.fetchCrypto();
		  this.fetchStocks();
		  this.fetchForex();
        }, {
           scheduled: true,
           timezone: "Australia/Melbourne"
         });
    }

    fetchCrypto() {
		const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
			  if (!!data.status && !!data.status.error_code) {
				  console.log(data.status.error_message);
			  } else {
	              data.forEach(async (c, idx) => {
	                  const coin = {
		                   symbol: c.symbol.toUpperCase(),
						   name: c.name,
						   price: c.current_price,
						   price_change: c.price_change_percentage_24h
	                  };
					  // if (idx == 0) {
					  	const resp = await dbservice.updateCrypto(coin);
					  // }
	              });
			  }
          })
          .catch(error => console.error('Error:', error));
    }

    fetchStocks() {
		const url = `https://financialmodelingprep.com/api/v3/quote/AAPL,MSFT,AMZN,NVDA,META,GOOG,IBM,TSLA,BRK-B,V?apikey=b764a94f84f86662b51e80b3461dc3fa`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
			  if (!!data.status && !!data.status.error_code) {
				  console.log(data.status.error_message);
			  } else {
	              data.forEach(async (s, idx) => {
	                  const stock = {
		                   symbol: s.symbol.toUpperCase(),
						   name: s.name,
						   price: s.price,
						   price_change: s.changesPercentage
	                  };
					  // if (idx == 0) {
					  	const resp = await dbservice.updateStock(stock);
					  // }
	              });
			  }
          })
          .catch(error => console.error('Error:', error));
    }

	fetchForex() {
		const url = `https://financialmodelingprep.com/api/v3/quote/EURUSD,AUDUSD,NZDUSD,GBPUSD,USDJPY,USDCHF,USDCAD,EURGBP,AUDJPY,EURJPY?apikey=b764a94f84f86662b51e80b3461dc3fa`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
			  if (!!data.status && !!data.status.error_code) {
				  console.log(data.status.error_message);
			  } else {
	              data.forEach(async (f, idx) => {
	                  const forex = {
		                   symbol: f.symbol.toUpperCase(),
						   name: f.name,
						   price: f.price,
						   price_change: f.changesPercentage
	                  };
					  // if (idx == 0) {
					  	const resp = await dbservice.updateForex(forex);
					  // }
	              });
			  }
          })
          .catch(error => console.error('Error:', error));
    }

}
