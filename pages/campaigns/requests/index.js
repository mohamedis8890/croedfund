import React from "react";
import { Button, Table } from "semantic-ui-react";

import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";

export default function RequestIndex({
  address,
  requests,
  requestsCount,
  approversCount,
}) {
  const { Header, Body, HeaderCell, Row } = Table;

  const renderRows = () => {
    return requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        approversCount={approversCount}
        address={address}
      />
    ));
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button content="Create Request" icon="add circle" primary></Button>
        </a>
      </Link>
      <Link route={`/campaigns/${address}`}>
        <a>
          <Button content="Back" icon="arrow left" secondary />
        </a>
      </Link>

      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>

        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestsCount} request(s).</div>
    </Layout>
  );
}

RequestIndex.getInitialProps = async ({ query }) => {
  const address = query.address;
  const campaign = Campaign(address);

  const approversCount = await campaign.methods.approversCount().call();
  const requestsCount = await campaign.methods.getRequestsCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((item, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return {
    address,
    requestsCount,
    requests,
    approversCount,
  };
};
