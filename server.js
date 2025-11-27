require('dotenv').config({path: './custom/path/.env'})
const app = require('./src/app');
const {appInfo} = require('./src/config/config.mongodb')

app.listen(appInfo.port, () => {
    console.log(`this page is listening on port ${appInfo.port}`);
})

process.on('SIGINT', ()=>{
    server.close(()=> {
        console.log('\nWSV eCommerce server đã dừng lại.');
        process.exit();
    });
})