import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";

import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

import Layout from "../../../components/Layout";
import EtherInput from "../../../components/EtherInput";

export default function CreateRequest({ address }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMEssage, setErrorMessage] = useState("");
  const [coin, setCoin] = useState("ether");

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(address);
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, coin), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMEssage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value</label>
          <EtherInput
            amount={value}
            onChangeAmount={setValue}
            coin={coin}
            onSetCoin={setCoin}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMEssage} />
        <Button content="Create!" icon="add circle" loading={loading} primary />
        <Link route={`/campaigns/${address}/requests`}>
          <a>
            <Button content="Cancel" icon="cancel" secondary />
          </a>
        </Link>
      </Form>
    </Layout>
  );
}

CreateRequest.getInitialProps = ({ query }) => {
  return { address: query.address };
};
