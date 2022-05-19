const fs = require('fs');
const readline = require('readline');

async function main() {
    try {
        let dockerDependencies = {
            dependencies: []
        };

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
                    dockerDependencies.dependencies.push({
                        imageName,
                        imageVersion
                    });
                }
            }
        }

        console.log("DOCKER_DEPENDENCIES: ", dockerDependencies.dependencies);

        let pythonDependencies = {
            dependencies: []
        };

        if(fs.existsSync("./requirements.txt")) {
            const fileStream = fs.createReadStream('./requirements.txt');
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                if(line.includes("==")) {
                    const dependency = line.split("==");
                    pythonDependencies.dependencies.push({
                        name: dependency[0].trim(),
                        version: dependency[1].trim(),
                        operator: "=="
                    });
                } else if(line.includes(">=")) {
                    const dependency = line.split(">=");
                    pythonDependencies.dependencies.push({
                        name: dependency[0].trim(),
                        version: dependency[1].trim(),
                        operator: ">="
                    });
                } else if(line.includes("<=")) {
                    const dependency = line.split("<=");
                    pythonDependencies.dependencies.push({
                        name: dependency[0].trim(),
                        version: dependency[1].trim(),
                        operator: "<="
                    });
                } else if(line.includes("!=")) {
                    const dependency = line.split("!=");
                    pythonDependencies.dependencies.push({
                        name: dependency[0].trim(),
                        version: dependency[1].trim(),
                        operator: "!="
                    });
                } else if(line.includes("~=")) {
                    const dependency = line.split("~=");
                    pythonDependencies.dependencies.push({
                        name: dependency[0].trim(),
                        version: dependency[1].trim(),
                        operator: "~="
                    });
                } else if(!line.startsWith("#")) {
                    if(line) {
                        pythonDependencies.dependencies.push({
                            name: line.trim(),
                            version: "latest",
                            operator: ""
                        });
                    }
                }
            }
        }
        console.log("PYTHON_DEPENDENCIES: ", pythonDependencies.dependencies);
        
    } catch (error) {
        console.log("error: ", error);
    }
}

main();
