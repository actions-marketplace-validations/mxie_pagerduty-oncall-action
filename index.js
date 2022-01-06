const pd = require("@pagerduty/pdjs");
const core = require("@actions/core");

async function run() {
  const pdToken = core.getInput("token");
  const scheduleId = core.getInput("schedule-id");
  const pdClient = pd.api({ token: pdToken });

  pdClient
    .get("/oncalls", { params: { "schedule_ids[]": [scheduleId], limit: 1 } })
    .then(({ resource }) => {
      if (resource.length > 0) {
        person = resource[0]["user"]["summary"];
        core.info(`🎉 On-call person found: ${person}`);
        core.setOutput("person", person);
      } else {
        core.setFailed("❓ No one is on the schedule");
      }
    })
    .catch((error) => {
      core.setFailed(`❌ Unable to fetch on-call data: ${error}`);
    });
}

run();
