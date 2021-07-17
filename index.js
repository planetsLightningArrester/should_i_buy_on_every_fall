require('console-super');
let request = require('request-promise');
let fs = require('fs')

let stocks = [
    {
        name: 'BIDI11', 
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/BIDI11.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'B3SA3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/B3SA3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'KLBN4',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/KLBN4.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'RLOG3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/RLOG3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'WEGE3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/WEGE3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'ABEV3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/ABEV3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'OIBR3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/OIBR3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'ITSA3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/ITSA3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'RADL3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/RADL3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'SAPR4',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/SAPR4.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'FLRY3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/FLRY3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'MDIA3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/MDIA3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }, {
        name: 'EGIE3',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/EGIE3.SA?region=US&lang=en-US&includePrePost=false&interval=1d&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance',
        prices: [],
        days: [],
        weight: 0
    }
];

main();

async function main() {
    console.timeTag('Getting records of the last 6 months.', {mod1: 'magenta'});
    
    if (fs.existsSync('data.json')) {
        stocks = JSON.parse(fs.readFileSync('data.json'));
    } else {
        console.log('');
        for await (stock of stocks) {
            // await checkProfits(stock);
            console.inlineTimeTag(stock.name);
            await getData(stock);
        }
        fs.writeFileSync('data.json', JSON.stringify(stocks));
    }

    console.inlineTimeTag('Calculating the profits if applying R$ 100 on falls.', {mod1: 'magenta'});
    calcFallsProfit(100);
    console.timeTag('Calculating the profits if applying R$ 1600 every month at once.', {mod1: 'magenta'});
    calcMonthlyAport(1600);
    console.log(stocks[0].days);
}

async function getData(stock) {

    try {
        let sixMonthInfo = JSON.parse(await request.get(stock.url));
        // let sixMonthInfo = JSON.parse(fs.readFileSync('bidi11.json'));
    
        for (let i = 0; i < sixMonthInfo.chart.result[0].timestamp.length; i++) {
            sixMonthInfo.chart.result[0].timestamp[i] = new Date(sixMonthInfo.chart.result[0].timestamp[i]*1000);
        }
    
        // console.log(sixMonthInfo.chart.result[0].indicators.quote[0].close);
    
        stock.prices = sixMonthInfo.chart.result[0].indicators.quote[0].close;
        stock.days = sixMonthInfo.chart.result[0].timestamp;
    } catch(err) {
        await setTimeout(async () => {
            await getData(stock);
        }, 1000);
    }
}

function calcFallsProfit(amountToInvestPerDay) {
    
    let wallet = [];
    stocks.forEach(stock => {
        wallet.push({
            name: stock.name,
            buys: [],
            quantity: [],
            profit: 0
        });
    });

    for (let day = 1; day < stocks[0].days.length; day++) {
    
        let date = (new Date(stocks[0].days[day])).getDay();

        if (date > 0 && date < 6) {
            for (let i = 0; i < stocks.length; i++) {
                const price = parseFloat(stocks[i].prices[day]);
                const previousPrice = parseFloat(stocks[i].prices[day - 1]);
                
                if (previousPrice > price) {
                    stocks[i].weight = previousPrice/(previousPrice - price);
                } else {
                    stocks[i].weight = 0;
                }
            }
    
            let totalWeight = 0;
            for (let i = 0; i < stocks.length; i++) {
                totalWeight += stocks[i].weight;
            }
            for (let i = 0; i < stocks.length; i++) {
                stocks[i].weight = amountToInvestPerDay*stocks[i].weight/totalWeight;
            }
    
            for (let i = 0; i < wallet.length; i++) {
                const price = parseFloat(stocks[i].prices[day]);
                const previousPrice = parseFloat(stocks[i].prices[day - 1]);
    
                if (previousPrice > price) {
                    let quantity = Math.round(stocks[i].weight/price);
                    if (quantity) {
                        wallet[i].buys.push(price);
                        wallet[i].quantity.push(quantity);
                    }
                }
            }
        }
    }
    
    let totalApplied = 0;
    let earnings = 0.
    for (let i = 0; i < wallet.length; i++) {
        let totalInvested = 0;
        for (let j = 0; j < wallet[i].buys.length; j++) {            
            wallet[i].profit += (stocks[i].prices[stocks[i].prices.length - 1] - wallet[i].buys[j])*wallet[i].quantity[j];
            earnings += (stocks[i].prices[stocks[i].prices.length - 1] - wallet[i].buys[j])*wallet[i].quantity[j];
            totalInvested += wallet[i].buys[j]*wallet[i].quantity[j];
        }
        console.timeTag('Profit on ' + wallet[i].name + ' of R$ ' + wallet[i].profit.toFixed(2) + ' with an investment of R$ ' + totalInvested.toFixed(2), {mod1: 'blue'});

        totalApplied += totalInvested;
    }

    console.timeTag('Total applied R$ ' + totalApplied.toFixed(2), {mod1: 'magenta'});
    console.timeTag('Total earned R$ ' + earnings.toFixed(2), {mod1: 'green'});
}

function calcMonthlyAport(amountToInvestPerMonth) {
    
    let wallet = [];
    stocks.forEach(stock => {
        wallet.push({
            name: stock.name,
            buys: [],
            quantity: [],
            profit: 0
        });
    });

    let daySweep = 0;
    for (let day = 1; day < stocks[0].days.length; day++) {
    
        let date = (new Date(stocks[0].days[day])).getDay();

        if (date > 0 && date < 6 && daySweep == 0) {
            daySweep = 20;
            for (let i = 0; i < stocks.length; i++) {
                const price = parseFloat(stocks[i].prices[day]);
                const previousPrice = parseFloat(stocks[i].prices[day - 1]);
                
                if (previousPrice > price) {
                    stocks[i].weight = previousPrice/(previousPrice - price);
                } else {
                    stocks[i].weight = 0;
                }
            }
    
            let totalWeight = 0;
            for (let i = 0; i < stocks.length; i++) {
                totalWeight += stocks[i].weight;
            }
            for (let i = 0; i < stocks.length; i++) {
                stocks[i].weight = amountToInvestPerMonth*stocks[i].weight/totalWeight;
            }
    

            for (let i = 0; i < wallet.length; i++) {
                const price = parseFloat(stocks[i].prices[day]);
                const previousPrice = parseFloat(stocks[i].prices[day - 1]);

                if (previousPrice > price) {
                    let quantity = Math.round(stocks[i].weight/price);
                    if (quantity) {
                        wallet[i].buys.push(price);
                        wallet[i].quantity.push(quantity);
                    }
                }
            }
        }
        daySweep--;
    }
    
    let totalApplied = 0;
    let earnings = 0.
    for (let i = 0; i < wallet.length; i++) {
        let totalInvested = 0;
        for (let j = 0; j < wallet[i].buys.length; j++) {            
            wallet[i].profit += (stocks[i].prices[stocks[i].prices.length - 1] - wallet[i].buys[j])*wallet[i].quantity[j];
            earnings += (stocks[i].prices[stocks[i].prices.length - 1] - wallet[i].buys[j])*wallet[i].quantity[j];
            totalInvested += wallet[i].buys[j]*wallet[i].quantity[j];
        }
        console.timeTag('Profit on ' + wallet[i].name + ' of R$ ' + wallet[i].profit.toFixed(2) + ' with an investment of R$ ' + totalInvested.toFixed(2), {mod1: 'blue'});

        totalApplied += totalInvested;
    }

    console.timeTag('Total applied R$ ' + totalApplied.toFixed(2), {mod1: 'magenta'});
    console.timeTag('Total earned R$ ' + earnings.toFixed(2), {mod1: 'green'});
}

async function checkProfits(stock) {
    
    console.timeTag("Checking for " + stock.name, {mod1: 'magenta', mod2: 'bright'});

    let sixMonthInfo = JSON.parse(await Promise.resolve(request.get(stock.url)));
    // let sixMonthInfo = JSON.parse(fs.readFileSync('bidi11.json'));

    for (let i = 0; i < sixMonthInfo.chart.result[0].timestamp.length; i++) {
        sixMonthInfo.chart.result[0].timestamp[i] = new Date(sixMonthInfo.chart.result[0].timestamp[i]*1000);
    }

    // console.log(sixMonthInfo.chart.result[0].indicators.quote[0].close);

    let prices = sixMonthInfo.chart.result[0].indicators.quote[0].close;
    let days = sixMonthInfo.chart.result[0].timestamp;

    let walletMonthly = [];
    let walletFalls = [];

    // Daily
    let totalInvested = 0;

    for (let i = 1; i < prices.length; i++) {
        const price = parseFloat(prices[i]);
        const previousPrice = parseFloat(prices[i - 1]);

        // console.log("price: " + price.toFixed(2) + ' - previous: ' + previousPrice.toFixed(2));
        
        if (previousPrice > price && totalInvested < 500) {
            let quantity = 1;
            walletFalls.push({
                price: price,
                quantity: quantity,
                date: days[i],
                profit: 0
            });

            totalInvested += price*quantity;
        } 
    
    }

    for (let i = 0; i < walletFalls.length; i++) {
        walletFalls[i].profit = (prices[prices.length - 1] - walletFalls[i].price)*walletFalls[i].quantity;
    }

    let totalProfit = 0;
    walletFalls.forEach(el => {
        totalProfit += el.profit;
    });
    console.timeTag("Profit for falls aport R$ " + totalProfit.toFixed(2) + ' with R$ ' + totalInvested.toFixed(2) + ' invested.', {mod1: 'blue'});

    // Monthly
    let daySweep = 0;
    totalInvested = 500;

    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];

        if (daySweep == 0) {
            daySweep = 30;
            let quantity = Math.ceil(totalInvested/6/price);
            walletMonthly.push({
                price: price,
                quantity: quantity,
                date: days[i],
                profit: 0
            });
        } else {
            daySweep--;
        }
    }

    totalInvested = 0;
    for (let i = 0; i < walletMonthly.length; i++) {
        walletMonthly[i].profit = (prices[prices.length - 1] - walletMonthly[i].price)*walletMonthly[i].quantity;
        totalInvested += walletMonthly[i].price*walletMonthly[i].quantity;
    }

    // console.log(totalInvested)

    totalProfit = 0;
    walletMonthly.forEach(el => {
        totalProfit += el.profit;
    });
    console.timeTag("Profit for monthly aport R$ " + totalProfit.toFixed(2) + ' with R$ ' + totalInvested.toFixed(2) + ' invested.', {mod1: 'green'});

}
