import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

export default function RequestRow({ id, request, address, approversCount }) {
  const { Row, Cell } = Table;

  const readyToFinalize = request.approvalCount > approversCount / 2;

  const initCampaign = async () => {
    const accounts = await web3.eth.getAccounts();
    const campaign = await Campaign(address);

    return { accounts, campaign };
  };

  const onApprove = async () => {
    const { accounts, campaign } = await initCampaign();
    await campaign.methods.approveRequest(id).send({ from: accounts[0] });
  };

  const onFinalize = async () => {
    const { accounts, campaign } = await initCampaign();
    await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      {!request.complete && (
        <Cell>
          <Button color="green" onClick={onApprove}>
            Approve
          </Button>
        </Cell>
      )}

      {!request.complete && (
        <Cell>
          <Button color="teal" onClick={onFinalize}>
            Finalize
          </Button>
        </Cell>
      )}
    </Row>
  );
}
