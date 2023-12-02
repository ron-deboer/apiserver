import cron from 'node-cron';
import dbservice from "./sqlitedbsvc.js";

//---------------------------------------------------------------
// cron server
//---------------------------------------------------------------
export default class CronServer {

	symbols = {
		'crypto': 'BTCUSD,ETHUSD,XRPUSD,ADAUSD,BNBUSD,DOGEUSD,SOLUSD,USDCUSD,USDTUSD,STETHUSD',
		'forex': 'AUDUSD,EURUSD,GBPUSD,USDJPY,NZDUSD,USDCAD,AUDJPY,EURGBP,EURJPY,USDCHF,USDJPY',
		'stock': 'AAPL,MSFT,AMZN,NVDA,META,GOOG,IBM,TSLA,BRK-B,V',
		'future': 'KEUSX,GCUSD,PLUSD,ZCUSX,ALIUSD,SIUSD,NGUSD,CLUSD,KCUSX,OJUSX,HGUSD,PAUSD,CCUSD',
	}

    constructor() {
        this.task1();
    }

    task1() {
        cron.schedule('* * * * *', () => {
          console.log("%s : Running Task-1", new Date().toTimeString());
		  // this.fetch('forex');
          // this.fetch('crypto');
		  // this.fetch('stock');
		  // this.fetch('future');
		  fetch('http://localhost:3000/api/ev_update?key=ATspzCU03GCamCx39U5aK89CfciuHllK');
        }, {
           scheduled: true,
           timezone: "Australia/Melbourne"
         });
    }

	fetch(table) {
		const url = `https://financialmodelingprep.com/api/v3/quote/${this.symbols[table]}?apikey=b764a94f84f86662b51e80b3461dc3fa`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
			  // console.log(data)
			  if (!Array.isArray(data)) {
				  console.log(`No ${table} data returned`);
			  } else {
	              data.forEach(async (c, idx) => {
	                  const coin = {
						  symbol: c.symbol.toUpperCase(),
						  name: c.name,
						  price: c.price,
						  price_change: c.changesPercentage
					  };
					  const resp = await dbservice.update(table, coin);
	              });
			  }
          })
          .catch(error => console.error('Error:', error));
    }
}
