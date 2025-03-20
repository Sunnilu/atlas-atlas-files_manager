// main.js

import dbClient from './utils/db';

// Function to wait until MongoDB connection is established
const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject('Connection timed out');
                } else if (!dbClient.isAlive()) {
                    repeatFct(); // Retry
                } else {
                    resolve();
                }
            }, 1000);
        };
        repeatFct();
    });
};

(async () => {
    console.log(dbClient.isAlive());  // Initially check if the connection is alive (should be false)
    await waitConnection();  // Wait for the connection to be established
    console.log(dbClient.isAlive());  // Check again after connection (should be true)
    console.log(await dbClient.nbUsers());  // Get the number of users
    console.log(await dbClient.nbFiles());  // Get the number of files
})();
