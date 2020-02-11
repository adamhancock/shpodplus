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
    // console.log(answer.namespace)
    const yaml = await fs
      .readFileSync("./shpod.yaml", "utf8")
      .replace("{ namespace }", answer.namespace);
    fs.writeFileSync(`shpod-${answer.namespace}.yaml`, yaml);
    const shell = spawn(`sh`, ["shpod.sh", answer.namespace], {
      stdio: "inherit"
    });
    shell.on("close", code => {
      console.log("[shell] terminated :", code);
    });
  });
});
