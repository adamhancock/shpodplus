const inquirer = require("inquirer");
const exec = require("child_process").exec;
const axios = require("axios");
const spawn = require("child_process").spawn;
const namespacesJSON = exec("kubectl get namespaces -o json");
const fs = require("fs");
namespacesJSON.stdout.on("data", data => {
  const output = JSON.parse(data);

  const namespaces = output.items.map(namespace => {
    return namespace.metadata.name;
  });
  const askNamespace = {
    type: "list",
    name: "namespace",
    message: "Which namespace shall we create the shpod in?",
    choices: namespaces

    // do whatever you want here with data
  };
  inquirer.prompt(askNamespace).then(async answer => {
    const YAML = await fs
      .readFileSync("shpod.yaml", "utf8")
      .toString()
      .replace("{ namespace }", answer.namespace);
    const shell = spawn(`sh`, ["shpod.sh", answer.namespace, YAML], {
      stdio: "inherit"
    });
    shell.on("close", code => {
      console.log("Finished :)");
    });
    // console.log(answer.namespace)
    // const yaml = await axios
    //   .get("https://cdn.a9k.io/get/shpod.yaml")
    //   .then(data => {
    //     return data.data.replace("{ namespace }", answer.namespace);
    //   });
    // await axios.get("https://cdn.a9k.io/get/shpod.sh").then(data => {
    //   fs.writeFileSync(`shpod.sh`, data.data);
    // });
    // fs.writeFileSync(`shpod-${answer.namespace}.yaml`, yaml);
  });
});
