const fs = require('fs');
const readline = require('readline');

async function main() {
    try {
        if(fs.existsSync("./Dockerfile")) {
            const fileStream = fs.createReadStream('./Dockerfile');
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                if(line.includes("FROM")) {
                    const imageNameWithVersion = line.split(" ")[1];
                    const nameAndVersion = imageNameWithVersion.split(":");
                    const imageName = nameAndVersion[0];
                    const imageVersion = nameAndVersion[1] ? nameAndVersion[1] : "latest";
                    console.log("IMAGE_NAME: ", imageName);
                    console.log("IMAGE_VERSION: ", imageVersion);
                }
            }
        }
        
    } catch (error) {
    }
}

main();
