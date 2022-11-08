const scanner = require("sonarqube-scanner");

scanner(
  {
    serverUrl: "https://scanner.automatly.io",
    token: "sqp_a95c688d2e4a94fe36eb12cccf8678f9e3e5c442",
    options: {
      "sonar.projectKey": "NAC-Stylori-Backend",
      "sonar.sources": ".",
    },
  },
  () => process.exit()
);
