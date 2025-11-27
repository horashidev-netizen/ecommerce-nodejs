'use strict'

const { log } = require('console');
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 10000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(">>> Number of connections: ", numConnection);
}
const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        //Ex maximum of connections based on number of cores
        const maxConnection = numCore*5;
        console.log("=========================================\n");
        
        if(numCore > maxConnection){
            console.log("Overloaded connection!");
        }
        console.log(">>> Active Connection: ", numConnections);
        
        console.log(`>>> Memory usage: ${memoryUsage/1024**2}MB`);

        console.log(`>>>Num of cores: ${numCore}`);
        
        console.log("\n=========================================");
        
    }, _SECONDS); //Memory count after every 10 seconds
}
module.exports = {countConnect, checkOverLoad}
