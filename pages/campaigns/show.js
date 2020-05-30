import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";

import web3 from "../../ethereum/web3";
import Campaign from "../../ethereum/campaign";
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

export default function ShowCampaign({
  minimumContribution,
  balance,
  approversCount,
  requestsCount,
  manager,
  address,
}) {
  const renderCampaign = () => {
    const items = [
      {
        header: manager,
        meta: "Manager Address",
        description:
          "The address of the creator of the campaign who can submit requeststo withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Current Balance (ether)",
        description: "Current Balance available to withdraw in ether",
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description: "A request tries to withdraw money from the campaign",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to the campaign",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Campaign Overview</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCampaign()}</Grid.Column>

          <Grid.Column width={6}>
            <h3>Contribut to this campaign</h3>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

ShowCampaign.getInitialProps = async ({ query }) => {
  const campaign = Campaign(query.address);
  const result = await campaign.methods.getSummary().call();

  return {
    address: query.address,
    minimumContribution: result[0],
    balance: result[1],
    approversCount: result[2],
    requestsCount: result[3],
    manager: result[4],
  };
};
