import app from './src/app.js'
import './src/config/database.js';

app.listen(3000, () => {
    console.log("listening to Port 3000");
});
